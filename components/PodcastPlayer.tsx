'use client'

import { useState, useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import WaveLoading from './WaveLoading';
import { DialogueTurn, PodcastPlayerProps } from '@/types/podcast';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTTS } from '@/hooks/useTTS';

// Import your Lottie JSON files
import SpeakerOneAnimation from '../public/lottie/speaker-one.json';
import SpeakerTwoAnimation from '../public/lottie/speaker-two.json';

export default function PodcastPlayer({ conversation, isGenerating, children }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'assistant' | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [audioQueue, setAudioQueue] = useState<HTMLAudioElement[]>([]);
  const conversationRef = useRef<HTMLDivElement>(null);
  const playerOneRef = useRef<any>(null);
  const playerTwoRef = useRef<any>(null);
  const { speak, isLoading: isTTSLoading, error: ttsError } = useTTS();

  useEffect(() => {
    playerOneRef.current = document.querySelector('#speakerOne');
    playerTwoRef.current = document.querySelector('#speakerTwo');

    return () => {
      audioQueue.forEach(audio => audio.pause());
    };
  }, []);

  const scrollToMessage = (index: number) => {
    const messages = conversationRef.current?.children;
    if (messages && messages[index]) {
      messages[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  const toggleAnimation = (speaker: 'user' | 'assistant' | null) => {
    if (speaker === 'user') {
      playerOneRef.current?.play();
      playerTwoRef.current?.stop();
    } else if (speaker === 'assistant') {
      playerTwoRef.current?.play();
      playerOneRef.current?.stop();
    } else {
      playerOneRef.current?.stop();
      playerTwoRef.current?.stop();
    }
  };

  const playFromPosition = async (startIndex: number) => {
    setIsPlaying(true);
    setCurrentIndex(startIndex);

    try {
      for (let i = startIndex; i < conversation.length; i++) {
        if (!isPlaying) break;
        
        const message = conversation[i];
        setCurrentSpeaker(message.role);
        setCurrentIndex(i);
        scrollToMessage(i);
        toggleAnimation(message.role);

        const audioSrc = await speak({
          text: message.content,
          speaker: message.role
        });

        const audio = new Audio(audioSrc);
        setAudioQueue(prev => [...prev, audio]);

        await new Promise<void>((resolve) => {
          audio.play();
          audio.onended = () => {
            URL.revokeObjectURL(audioSrc);
            resolve();
          };
          audio.onerror = () => {
            console.error('Audio playback failed');
            resolve();
          };
        });
      }
    } catch (error) {
      console.error('Playback error:', error);
    } finally {
      setIsPlaying(false);
      setCurrentSpeaker(null);
      setCurrentIndex(-1);
      toggleAnimation(null);
      setAudioQueue([]);
    }
  };

  const pausePlayback = () => {
    audioQueue.forEach(audio => audio.pause());
    setIsPlaying(false);
    toggleAnimation(null);
  };

  const resumePlayback = () => {
    audioQueue.forEach(audio => audio.play());
    setIsPlaying(true);
    toggleAnimation(currentSpeaker);
  };

  const downloadAudio = async () => {
    // Implementation for audio download
    console.log('Download functionality to be implemented');
  };

  const regenerateConversation = () => {
    window.location.reload();
  };

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
              <Player
                ref={playerOneRef}
                autoplay={false}
                loop
                speed={1}
                src={SpeakerOneAnimation}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p className="font-gloock text-xl text-[#292828]">
              {conversation[0]?.speaker || 'Marcus'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-40 h-40 mb-4">
              <Player
                ref={playerTwoRef}
                autoplay={false}
                loop
                speed={1}
                src={SpeakerTwoAnimation}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p className="font-gloock text-xl text-[#292828]">
              {conversation[1]?.speaker || 'James'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 justify-center items-center">
          <button
            onClick={isPlaying ? pausePlayback : () => playFromPosition(0)}
            className="px-8 py-4 bg-[#292828] text-white rounded-full hover:opacity-90 transition-opacity font-medium text-lg"
            disabled={isTTSLoading}
          >
            {isTTSLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : isPlaying ? (
              'Pause'
            ) : (
              'Play Conversation'
            )}
          </button>
          <button
            onClick={downloadAudio}
            className="p-3 border-2 border-[#292828] rounded-full hover:bg-[#292828] hover:text-white transition-all"
          >
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
        </div>

        {ttsError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Error: {ttsError}
          </div>
        )}

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
                <p className="font-gloock text-xl mb-3">
                  {message.speaker}
                </p>
                <p className="leading-relaxed text-lg">
                  {message.content}
                </p>
                {currentIndex === index && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <span className="text-sm opacity-75">Speaking...</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Regenerate Button at the end */}
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