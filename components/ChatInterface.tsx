"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Mic,
  StopCircle,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      chatContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/aichat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "An error occurred.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const res = await fetch("/api/ai/wispher", {
            method: "POST",
            body: formData,
          });
          const { text } = await res.json();
          setInput(text);
        } catch {
          console.error("Error during transcription.");
        } finally {
          setIsRecording(false);
        }
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div
      className={`flex flex-col ${
        isFullscreen ? "h-screen" : "h-[calc(100vh-4rem)]"
      } max-w-4xl mx-auto border shadow-lg`}
    >
      <header className="flex justify-between items-center p-4 bg-gray-100 border-b">
        <h1 className="text-lg font-bold">AI Chat</h1>
        <div className="flex gap-2">
          <button onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </button>
          <button onClick={() => setIsDarkMode((prev) => !prev)}>
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <main
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-4 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <p className="inline-block p-2 rounded-md bg-gray-200">
              {msg.content}
            </p>
          </div>
        ))}
      </main>

      <footer className="flex items-center p-4 bg-gray-100 border-t">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="mr-4"
        >
          {isRecording ? <StopCircle /> : <Mic />}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
        </button>
      </footer>
    </div>
  );
}
