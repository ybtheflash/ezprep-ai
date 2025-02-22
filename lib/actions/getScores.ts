"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from "next/navigation";
import connectDB from "../db";

export async function getScores() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    // Redirect to login if no session exists
    if (!session) {
      redirect("/login");
    }

    // Connect to MongoDB
    const { db } = await connectDB();

    // Fetch flashcard history for the specific user
    const scores = await db
      .collection("flashcardhistories")
      .find({
        userId: session.user?.email, // Using email as userId since it's unique
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(10) // Limit to last 10 entries
      .toArray();

    interface RawScore {
      _id: any;
      createdAt: Date | string;
      userId?: string;
      keyword: string;
      score: number;
      questions: any;
    }

    interface SerializedScore {
      _id: string;
      createdAt: string;
      userId: string;
      keyword: string;
      score: number;
      questions: any;
    }

    const serializedScores = scores.map((score: RawScore): SerializedScore => ({
      _id: score._id.toString(),
      createdAt:
        score.createdAt instanceof Date
          ? score.createdAt.toISOString()
          : String(score.createdAt),
      userId: score.userId || session.user?.email || "",
      keyword: score.keyword,
      score: score.score,
      questions: score.questions,
    }));

    return serializedScores;
  } catch (error) {
    console.error("Error fetching scores:", error);
    // Return empty array instead of throwing error
    return [];
  }
}