"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from "next/navigation";
import connectDB from "../db";
import FlashcardHistory from "@/models/flashCardHistory";

// Define interfaces at the top for clarity
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

export async function getScores() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    // Redirect or return empty array if no session/users found
    if (!session || !session.user) {
      redirect("/login");
      return [];
    }

    // Use email as the unique identifier for the query
    const userIdentifier = session.user.email;
    console.log("User identifier:", userIdentifier);

    // Establish DB connection
    await connectDB();

    // Fetch flashcard histories using the Mongoose model
    const scores = await FlashcardHistory.find({ userId: userIdentifier })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    console.log("Fetched scores:", scores);

    // Iterate over each flashcard history and serialize the result
    const serializedScores: SerializedScore[] = (scores as unknown as RawScore[]).map((score) => ({
      _id: score._id.toString(),
      createdAt:
        score.createdAt instanceof Date
          ? score.createdAt.toISOString()
          : String(score.createdAt),
      userId: score.userId || userIdentifier,
      keyword: score.keyword,
      score: score.score,
      questions: score.questions,
    }));

    return serializedScores;
  } catch (error) {
    console.error("Error fetching scores:", error);
    return [];
  }
}