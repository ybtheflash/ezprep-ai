// lib/actions/adminActions.ts
'use server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { authOptions } from '../auth';
import { RedemptionCode } from '@/models/RedemptionCodes';

export const getRedemptionCodes = async () => {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const codes = await RedemptionCode.find({});
  return { success: true, data: JSON.parse(JSON.stringify(codes)) };
};

export const createRedemptionCode = async (data: {
  code: string;
  coins: number;
  maxUses: number;
  expiresAt: string;
}) => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await RedemptionCode.create({
      code: data.code.toUpperCase(),
      coins: data.coins,
      maxUses: data.maxUses,
      expiresAt: data.expiresAt || undefined
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create code" };
  }
};

export const deleteRedemptionCode = async (id: string) => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await RedemptionCode.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete code" };
  }
};