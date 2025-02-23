'use client';

import { useState, useRef, useEffect } from 'react';
import LottiePlayer from 'react-lottie-player';
import WaveLoading from './WaveLoading';
import { DialogueTurn, PodcastPlayerProps } from '@/types/podcast';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import speakerOneAnimation from '@/lottie/speaker-one.json';
import speakerTwoAnimation from '@/lottie/speaker-two.json';

export default function PodcastPlayer({ conversation, isGenerating, children }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'assistant' | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      cleanupAudio();
    };
  }, []);

  // Scroll to a specific message in the transcript
  const scrollToMessage = (index: number) => {
    const messages = conversationRef.current?.children;
    if (messages && messages[index]) {
      messages[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  // Toggle Lottie animations based on the current speaker
  const [isUserAnimating, setIsUserAnimating] = useState(false);
  const [isAssistantAnimating, setIsAssistantAnimating] = useState(false);
  const toggleAnimation = (speaker: 'user' | 'assistant' | null) => {
    setIsUserAnimating(speaker === 'user');
    setIsAssistantAnimating(speaker === 'assistant');
  };

  // Cleanup audio resources
  const cleanupAudio = () => {
    if (audioElement) {
      audioElement.pause();
      if (audioElement.src) {
        URL.revokeObjectURL(audioElement.src);
      }
      setAudioElement(null);
    }
  };

  // Speak text using the TTS API
  const speakText = async (text: string, isMale: boolean) => {
    try {
      cleanupAudio(); // Clear previous audio before creating new

      console.log('Fetching TTS for:', text); // Debug log
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), isMale }),
      });

      console.log('TTS response:', response); // Debug log
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Audio URL created:', audioUrl); // Debug log

      const audio = new Audio(audioUrl);
      console.log('Audio element created:', audio); // Debug log

      audio.onended = () => {
        console.log('Audio ended'); // Debug log
        if (isMounted.current) {
          URL.revokeObjectURL(audioUrl);
          setAudioElement(null);
        }
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e); // Debug log
        URL.revokeObjectURL(audioUrl);
        setAudioElement(null);
      };

      setAudioElement(audio);
      console.log('Audio element set in state:', audio); // Debug log

      await audio.play();
      console.log('Audio playback started'); // Debug log
      return audio;
    } catch (error) {
      console.error('TTS or playback error:', error); // Debug log
      return null;
    }
  };

  // Play conversation from a specific position
  const playFromPosition = async (startIndex: number) => {
    if (!isMounted.current) return;

    setIsPlaying(true);
    cleanupAudio();

    for (let i = startIndex; i < conversation.length; i++) {
      if (!isPlaying || !isMounted.current) break;

      const message = conversation[i];
      console.log('Processing message:', message); // Debug log
      setCurrentSpeaker(message.role);
      setCurrentIndex(i);
      scrollToMessage(i);
      toggleAnimation(message.role);

      const audio = await speakText(message.content, message.role === 'user');
      if (!audio) continue;

      // Wait for current audio to complete
      await new Promise<void>((resolve) => {
        audio.onended = () => {
          console.log('Audio ended for message:', message); // Debug log
          resolve();
          if (i === conversation.length - 1) {
            setIsPlaying(false);
            toggleAnimation(null);
          }
        };

        audio.onerror = () => {
          console.error('Audio playback error for message:', message); // Debug log
          resolve();
          setIsPlaying(false);
          toggleAnimation(null);
        };
      });
    }

    if (isMounted.current) {
      setIsPlaying(false);
      setCurrentSpeaker(null);
      setCurrentIndex(-1);
      toggleAnimation(null);
    }
  };

  // Pause playback
  const pausePlayback = () => {
    cleanupAudio();
    setIsPlaying(false);
    toggleAnimation(null);
  };

  // Regenerate conversation
  const regenerateConversation = () => {
    window.location.reload();
  };

  // Loading state
  if (isGenerating) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FCF3E4]">
        <WaveLoading />
        <p className="text-[#292828] mt-4 font-gloock text-xl">
          Generating conversation...
        </p>
      </div>
    );
  }

  // Empty state
  if (!conversation.length) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FCF3E4] p-4">
        <h1 className="text-4xl font-gloock text-[#292828] mb-2">ezPodcast</h1>
        <p className="text-[#292828]/70 mb-8">powered by Google Gemini</p>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF3E4] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Speakers Section with Names */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <div className="w-40 h-40 mb-4">
              <LottiePlayer
                animationData={speakerOneAnimation}
                loop
                play={isUserAnimating}
                speed={1}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p className="font-gloock text-xl text-[#292828]">
              {conversation[0]?.speaker || 'Marcus'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-40 h-40 mb-4">
              <LottiePlayer
                animationData={speakerTwoAnimation}
                loop
                play={isAssistantAnimating}
                speed={1}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p className="font-gloock text-xl text-[#292828]">
              {conversation[1]?.speaker || 'Sarah'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 justify-center items-center">
          <button
            onClick={isPlaying ? pausePlayback : () => playFromPosition(0)}
            className="px-8 py-4 bg-[#292828] text-white rounded-full hover:opacity-90 transition-opacity font-medium text-lg"
          >
            {isPlaying ? 'Pause' : 'Play Conversation'}
          </button>
          <button
            onClick={() => console.log('Download functionality')}
            className="p-3 border-2 border-[#292828] rounded-full hover:bg-[#292828] hover:text-white transition-all"
          >
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Transcript */}
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar rounded-xl bg-white/50 p-4">
          <div ref={conversationRef} className="space-y-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                onClick={() => !isPlaying && playFromPosition(index)}
                className={`p-6 rounded-xl cursor-pointer transition-all ${
                  currentIndex === index
                    ? 'bg-[#292828] text-white scale-[1.02]'
                    : 'bg-white hover:scale-[1.02]'
                } ${
                  message.role === 'user' ? 'ml-12' : 'mr-12'
                } shadow-sm`}
              >
                <p className="font-gloock text-xl mb-3">{message.speaker}</p>
                <p className="leading-relaxed text-lg">{message.content}</p>
                {currentIndex === index && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <span className="text-sm opacity-75">Speaking...</span>
                  </div>
                )}
              </div>
            ))}

            {/* Regenerate Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={regenerateConversation}
                className="flex items-center gap-2 px-6 py-3 bg-[#292828] text-white rounded-full hover:opacity-90 transition-opacity"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Generate New Conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}