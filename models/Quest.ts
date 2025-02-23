// models/Quest.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IQuest extends Document {
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  reward: number;
  completionGoal: number;
  resetTime: Date;
}

const questSchema = new Schema<IQuest>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly'], required: true },
  reward: { type: Number, required: true },
  completionGoal: { type: Number, required: true },
  resetTime: { type: Date, default: () => {
    const now = new Date();
    now.setHours(24, 0, 0, 0); // Default to next midnight
    return now;
  }}
});

export default mongoose.models.Quest || mongoose.model<IQuest>('Quest', questSchema);