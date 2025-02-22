import { GoogleGenerativeAI } from "@google/generative-ai";

interface QueryInput {
  message: string;
  userId: string;
}

interface ResponseResult {
  response: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Simple in-memory store for chat history
const chatHistory = new Map<string, ChatMessage[]>();

function getUserHistory(userId: string): ChatMessage[] {
  if (!chatHistory.has(userId)) {
    chatHistory.set(userId, []);
  }
  return chatHistory.get(userId)!;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateResponse(message: string, history: ChatMessage[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format chat history for context
    const historyText = history
      .map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a friendly and patient tutor named Athena. Your goal is to help students learn and understand concepts deeply.

Role: Educational Tutor
Style: Conversational, encouraging, and empathetic
Approach: Break down complex topics, use analogies, and provide clear explanations

Previous Conversation:
${historyText}

Student: ${message}

Respond as Athena the tutor. Keep your response natural and conversational, like you're speaking to the student. Avoid bullet points or overly formal language. If explaining a concept, break it down into simple terms and use real-world examples when possible.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean up the response
    return response
      .replace(/^(Tutor|Athena):\s*/i, '')  // Remove any "Tutor:" or "Athena:" prefix
      .trim();

  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

async function chatWorkflow(input: QueryInput): Promise<ResponseResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const history = getUserHistory(input.userId);

    // Generate response
    const response = await generateResponse(input.message, history);

    // Add to history
    history.push(
      { role: "user", content: input.message },
      { role: "assistant", content: response }
    );

    // Keep only last 10 exchanges
    if (history.length > 20) {
      chatHistory.set(input.userId, history.slice(-20));
    }

    return { response };
  } catch (err) {
    console.error("Chat error:", err);
    return {
      response: "I'm sorry, but I'm having trouble processing your question right now. Could you please try asking again?"
    };
  }
}

export { chatWorkflow };
