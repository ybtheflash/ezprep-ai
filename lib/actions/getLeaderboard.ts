"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from "next/navigation";
import connectDB from "../db";
import User from "@/models/user";


export async function getLeaderboard() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/login");
    }
    await connectDB();
    const users = await User.find({})
      .sort({ aura: -1 }) 
    // Convert Mongoose documents to plain JavaScript objects
    const serializedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      longestStreak: user.longestStreak,
      currentStreak: user.currentStreak,
      aura: user.aura,
      coins: user.coins
    }));

    return serializedUsers;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}