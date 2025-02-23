'use client';

import { useState } from 'react';

export default function PodcastPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Hardcoded conversation
  const conversation = [
    { role: 'user', content: 'Hey Sarah, did you hear about the latest AI trends?', isMale: true }, // Male voice
    { role: 'assistant', content: 'Yes, I did! It’s fascinating how AI is evolving so quickly.', isMale: false }, // Female voice
  ];

  // Function to play the entire conversation
  const playConversation = async () => {
    if (isPlaying) return; // Prevent multiple plays
    setIsPlaying(true);

    for (let i = 0; i < conversation.length; i++) {
      const message = conversation[i];
      console.log('Processing message:', message); // Debug log

      try {
        // Send a request to the /api/tts endpoint for each message
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: message.content, isMale: message.isMale }), // Use isMale to determine voice
        });

        console.log('TTS response:', response); // Debug log
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // Get the audio blob from the response
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Audio URL created:', audioUrl); // Debug log

        // Create a new Audio object
        const audio = new Audio(audioUrl);
        console.log('Audio element created:', audio); // Debug log

        // Handle audio playback events
        audio.onended = () => {
          console.log('Audio ended for message:', message); // Debug log
          URL.revokeObjectURL(audioUrl);
          setAudioElement(null);
        };

        audio.onerror = (e) => {
          console.error('Audio playback error:', e); // Debug log
          URL.revokeObjectURL(audioUrl);
          setAudioElement(null);
        };

        // Play the audio
        setAudioElement(audio);
        await audio.play();
        console.log('Audio playback started for message:', message); // Debug log

        // Wait for the current audio to finish before proceeding to the next message
        await new Promise<void>((resolve) => {
          audio.onended = () => {
            resolve();
          };
        });
      } catch (error) {
        console.error('TTS or playback error:', error); // Debug log
      }
    }

    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#FCF3E4] flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-gloock text-[#292828] mb-8">ezPodcast</h1>

        {/* Button to play the hardcoded conversation */}
        <button
          onClick={playConversation}
          disabled={isPlaying}
          className="px-8 py-4 bg-[#292828] text-white rounded-full hover:opacity-90 transition-opacity font-medium text-lg"
        >
          {isPlaying ? 'Playing...' : 'Play Conversation'}
        </button>
      </div>
    </div>
  );
}