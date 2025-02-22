"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import connectDB from "../db";
import User from "@/models/user";

export async function getUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return null;
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select("name email username longestStreak currentStreak aura coins")
      .lean<{
        _id: any,
        name: string,
        email: string,
        username: string,
        longestStreak?: number,
        currentStreak?: number,
        aura?: number,
        coins?: number
      }>(); // Convert Mongoose document to plain JavaScript object

    if (!user) {
      return null;
    }

    // Convert _id to string and create a clean object
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      longestStreak: user.longestStreak || 0,
      currentStreak: user.currentStreak || 0,
      aura: user.aura || 0,
      coins: user.coins || 0
    };

  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}