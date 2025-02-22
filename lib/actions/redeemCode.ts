'use server';
import { RedemptionCode } from '@/models/RedemptionCodes';
import connectDB from '../db';
import { getUser } from './getUser';
import mongoose from 'mongoose';
import User from '@/models/user';


export async function redeemCode(code: string) {
  await connectDB();
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const formattedCode = code.toUpperCase().trim();
    const redemptionCode = await RedemptionCode.findOne({ code: formattedCode }).session(session);

    if (!redemptionCode) throw new Error('Invalid redemption code');
    if (redemptionCode.expiresAt && new Date() > redemptionCode.expiresAt) throw new Error('Expired code');
    if (redemptionCode.uses >= redemptionCode.maxUses) throw new Error('Code max uses reached');

    const authUser = await getUser();
    if (!authUser) throw new Error('User not authenticated');
    
    // Get fresh user document in the transaction
    const user = await User.findById(authUser.id).session(session);
    if (!user) throw new Error('User not found');

    // Update redemption code
    redemptionCode.uses += 1;
    await redemptionCode.save({ session });

    // Update user coins
    user.coins += redemptionCode.coins;
    await user.save({ session });

    await session.commitTransaction();
    
    return {
      success: true,
      coins: user.coins,
      message: `Redeemed ${redemptionCode.coins} EzCoins!`
    };
  } catch (error) {
    await session.abortTransaction();
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Redemption failed'
    };
  } finally {
    session.endSession();
  }
}

export async function createCode(code: string) {
  await RedemptionCode.create({
    code: code,
    coins: 500,
    maxUses: 100,
    expiresAt: new Date('2025-03-03')
  });
}