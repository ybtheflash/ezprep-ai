// types/audio.ts
export interface AudioState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  }
  
  export interface TTSResponse {
    success: boolean;
    error?: string;
    audioUrl?: string;
  }
  