import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for User document
interface IUser extends Document {
  email: string;
  phone: string;
  username: string;
  password: string;
  name: string;
  createdAt: Date;
  aura: number;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  flashcards: Types.ObjectId[];
}

// User Schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  aura: {
    type: Number,
    default: 0,
  },
  coins: {
    type: Number,
    default: 50,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: Date,
  },
  flashcards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'FlashcardHistory',
    },
  ],
});

// Interface for FlashcardHistory document
interface IFlashcardHistory extends Document {
  user: Types.ObjectId | IUser;
  keyword: string;
  score: number;
  questions: number;
  createdAt: Date;
}

// FlashcardHistory Schema
const flashcardHistorySchema = new Schema<IFlashcardHistory>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  questions: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Mongoose Models
const User = mongoose.model<IUser>('User', userSchema);
const FlashcardHistory = mongoose.model<IFlashcardHistory>('FlashcardHistory', flashcardHistorySchema);

export { User, FlashcardHistory };
export type { IUser, IFlashcardHistory };