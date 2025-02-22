import { NextResponse } from 'next/server';

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "The best preparation for tomorrow is doing your best today.",
    author: "H. Jackson Brown Jr."
  }
];

export async function GET() {
  // Get a quote based on the day of the year
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const quoteIndex = dayOfYear % quotes.length;
  
  return NextResponse.json(quotes[quoteIndex]);
}