import mongoose, { Schema, Document, Types } from 'mongoose';

interface IFlashcardHistory extends Document {
  user: Types.ObjectId;
  keyword: string;
  score: number;
  questions: number;
  createdAt: Date;
}

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

// Check if model already exists
const FlashcardHistory =
  mongoose.models.FlashcardHistory ||
  mongoose.model<IFlashcardHistory>('FlashcardHistory', flashcardHistorySchema);

export default FlashcardHistory;