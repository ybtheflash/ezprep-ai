import { chatWorkflow } from "@/lib/langchainSetup";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();

    // Ensure valid inputs
    if (!message?.trim() || !userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Start Chat Workflow
    const response = await chatWorkflow({
      message,
      userId
    });

    return NextResponse.json({ response: response.response });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
