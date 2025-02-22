// lib/actions/redeemCode.ts
'use server';

import { RedemptionCode } from '@/models/RedemptionCodes';
import connectDB from '../db';
import { getUser } from './getUser';
import mongoose from 'mongoose';

export async function redeemCode(code: string) {
  await connectDB();
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Validate code
    const formattedCode = code.toUpperCase().trim();
    const redemptionCode = await RedemptionCode.findOne({ code: formattedCode }).session(session);

    if (!redemptionCode) {
      throw new Error('Invalid redemption code');
    }

    // Check expiration
    if (redemptionCode.expiresAt && new Date() > redemptionCode.expiresAt) {
      throw new Error('This code has expired');
    }

    // Check usage limits
    if (redemptionCode.uses >= redemptionCode.maxUses) {
      throw new Error('This code has reached its maximum uses');
    }

    // Get current user
    const user = await getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update redemption code uses
    redemptionCode.uses += 1;
    await redemptionCode.save({ session });

    // Update user coins
    user.coins += redemptionCode.coins;
    await (user as any).save({ session });

    await session.commitTransaction();
    
    return {
      success: true,
      coins: user.coins,
      message: `Successfully redeemed ${redemptionCode.coins} EzCoins!`
    };
  } catch (error) {
    await session.abortTransaction();
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to redeem code'
    };
  } finally {
    session.endSession();
  }
}