
import mongoose from 'mongoose';
// Add error handling for undefined environment variable
const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URL environment variable inside .env');
}

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: { conn: mongoose.Connection | null, promise: Promise<mongoose.Mongoose> | null };
    }
  }
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;