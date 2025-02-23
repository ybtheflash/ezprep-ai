// app/api/tts/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text, isMale } = await request.json();

  try {
    console.log('TTS request received:', { text, isMale }); // Debug log

    // Simulate TTS by returning a pre-recorded audio file
    const audioUrl = isMale
      ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Male voice
      : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'; // Female voice

    // Fetch the audio file
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error('Failed to fetch audio file');

    const audioBlob = await response.blob();

    // Return the audio file as a response
    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': 'audio/mpeg', // Adjust based on your audio format
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}