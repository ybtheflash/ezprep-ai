"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import connectDB from "../db";
import User from "@/models/user";

export async function updateAura(aura: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  await connectDB();
  const response = await User.findOneAndUpdate(
    { _id: session.user.id },
    { $inc: { aura: aura } }
  );
}