"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from "next/navigation";
import connectDB from "../db"; // Import Mongoose connection
import FlashcardHistory from "@/models/flashCardHistory";
import User from "@/models/user";

export async function createFlashcardHistory(
  keyword: string,
  score: number,
  questions: number
) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    // Redirect to login if no session exists
    if (!session) {
      redirect("/login");
    }

    // Connect to MongoDB
    await connectDB();

    // Create a new flashcard history entry
    const newFlashcardHistory = new FlashcardHistory({
      keyword,
      score,
      questions,
      user: session.user.id, // Use `user` instead of `userId` (Mongoose references use `user`)
    });

    // Save the flashcard history entry
    await newFlashcardHistory.save();

    // Update the user's streak
    await updateUserStreak(session.user.id);
  } catch (error) {
    console.error("Error creating flashcard history:", error);
    throw new Error("Failed to create flashcard history");
  }
}

async function updateUserStreak(userId: string) {
  try {
    // Find the user
    const user = await User.findById(userId).select(
      "lastActiveDate currentStreak longestStreak"
    );

    if (!user) return;

    const now = new Date();
    const today = stripTime(now);
    const lastActive = user.lastActiveDate ? stripTime(user.lastActiveDate) : null;

    let newStreak = user.currentStreak;

    if (!lastActive) {
      // First activity: start streak at 1
      newStreak = 1;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive.getTime() === yesterday.getTime()) {
        // Consecutive day: increment streak
        newStreak++;
      } else if (lastActive.getTime() < yesterday.getTime()) {
        // Broken streak: reset to 1
        newStreak = 1;
      }
      // Else: same day, no change
    }

    // Update longest streak if needed
    const longestStreak = Math.max(user.longestStreak, newStreak);

    // Update the user's streak data
    user.currentStreak = newStreak;
    user.longestStreak = longestStreak;
    user.lastActiveDate = now; // Updates to current timestamp

    // Save the updated user
    await user.save();
  } catch (error) {
    console.error("Error updating user streak:", error);
    throw new Error("Failed to update user streak");
  }
}

// Helper to strip time from a Date (compare only dates)
function stripTime(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}