import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2 || "");

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare prompt for the AI
    const prompt = `
    Please watch this YouTube video: ${url}
    
    Provide:
    1. A professional and detailed summary of the main points (300-500 words). Do not use any asterisks or special characters for censoring.
    2. A complete word-for-word transcription of the video content. Do not use any asterisks or special characters for censoring.
    
    Format the response as:
    Summary:
    [summary text]
    
    Transcription:
    [transcription text]`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract summary and transcription
    const [summary, transcription] = text.split("Transcription:");
    
    return NextResponse.json({
      summary: summary.replace("Summary:", "").trim(),
      transcription: transcription.trim()
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Transcription error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}