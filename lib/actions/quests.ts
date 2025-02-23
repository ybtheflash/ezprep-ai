// lib/actions/quests.ts
'use server'

import Quest from '@/models/Quest'

import { getServerSession } from 'next-auth'
import { addCoins } from '@/lib/actions/addCoins'
import connectDB from '../db'
import User from '@/models/user'

export const getAvailableQuests = async () => {
  await connectDB();
  // Using lean() already returns plain objects, but if they have nested special types convert them too.
  const quests = await Quest.find({
    resetTime: { $gte: new Date() }
  }).lean();

  return quests.map(q => sanitizeDoc(q));
}

export const updateQuestProgress = async (questId: string, progress: number = 1) => {
  try {
    await connectDB();
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return { success: false, error: 'User not authenticated' };
    }

    const user = await User.findOne({ email: session.user.email })
      .populate('quests.quest');
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    interface IQuest {
      _id: string; // assuming the ID is stored as a string
    }

    interface IQuestEntry {
      quest: IQuest;
      completed: boolean;
      progress: number;
      lastUpdated: Date;
    }

    const questEntry: IQuestEntry | undefined = user.quests.find((entry: IQuestEntry) =>
      entry.quest._id.toString() === questId &&
      !entry.completed
    );

    if (!questEntry) {
      return { success: false, error: 'Quest not found or already completed' };
    }

    // Update progress
    questEntry.progress += progress;
    questEntry.lastUpdated = new Date();

    // Check if quest is completed
    const quest = await Quest.findById(questId);
    if (quest && questEntry.progress >= quest.completionGoal) {
      questEntry.completed = true;
      // Add coins reward
      await addCoins(quest.reward);
    }

    await user.save();

    // Convert questEntry to a plain object
    const plainQuestEntry = sanitizeDoc(questEntry);
    return { success: true, quest: plainQuestEntry };

  } catch (error) {
    console.error('Error updating quest:', error);
    return { success: false, error: 'Failed to update quest' };
  }
}

/**
 * Recursively converts a document to a plain object.
 * Explicitly converts _id fields to string and Date fields to ISO strings.
 */
function sanitizeDoc(doc: any): any {
  if (doc && typeof doc.toObject === 'function') {
    doc = doc.toObject();
  }
  
  if (doc instanceof Date) {
    return doc.toISOString();
  }
  
  if (doc && typeof doc === 'object') {
    // If _id exists, convert it to string.
    if (doc._id && typeof doc._id.toString === 'function') {
      doc._id = doc._id.toString();
    }
    // Iterate over all keys and recursively sanitize their value.
    for (const key in doc) {
      doc[key] = sanitizeDoc(doc[key]);
    }
    return doc;
  }
  
  return doc;
}