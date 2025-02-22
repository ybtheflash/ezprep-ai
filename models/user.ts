import mongoose, { Schema, Document } from 'mongoose';

interface IDailyProgress {
  date: Date;
  aura: number;
  coins: number;
}

interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  createdAt: Date;
  aura: number;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  isAdmin: boolean;
  dailyProgress: IDailyProgress[];
}

const dailyProgressSchema = new Schema({
  date: { type: Date, required: true },
  aura: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  aura: { type: Number, default: 0 },
  coins: { type: Number, default: 50, min: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: Date,
  isAdmin: { type: Boolean, default: false },
  dailyProgress: [dailyProgressSchema],
});

// Check if model already exists
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;