import { NextResponse } from 'next/server';
import { InferenceSession, Tensor } from 'onnxruntime-node';
import path from 'path';
import fs from 'fs/promises';

// Define models directory
const modelsDir = path.join(process.cwd(), 'public', 'models');

const VOICE_MODELS = {
  male: {
    modelPath: path.join(modelsDir, 'norman.onnx'),
    configPath: path.join(modelsDir, 'norman.json'),
  },
  female: {
    modelPath: path.join(modelsDir, 'ljspeech-high.onnx'),
    configPath: path.join(modelsDir, 'ljspeech-high.json'),
  },
} as const;

type VoiceType = keyof typeof VOICE_MODELS;

export async function POST(request: Request) {
  const { text, isMale } = await request.json();

  try {
    const voiceType: VoiceType = isMale ? 'male' : 'female';
    const { modelPath } = VOICE_MODELS[voiceType];

    // Read model file from the public/models folder
    const modelBuffer = await fs.readFile(modelPath);

    // Create InferenceSession with the loaded model
    const session = await InferenceSession.create(modelBuffer);

    // Preprocess input text (adjust based on your model if needed)
    const inputTensor = new Tensor('string', [text]);

    // Run inference
    const results = await session.run({ input: inputTensor });

    if (!results.output?.data) {
      throw new Error('No output data from model');
    }

    const audioData = results.output.data;

    let float32AudioData: Float32Array;
    if (audioData instanceof Float32Array) {
      float32AudioData = audioData;
    } else if (Array.isArray(audioData)) {
      float32AudioData = new Float32Array(audioData.map(value => parseFloat(value)));
    } else {
      throw new Error('Unsupported audio data format');
    }

    const wavBuffer = generateWavFile(float32AudioData);

    return new NextResponse(wavBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate audio',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined 
      },
      { status: 500 }
    );
  }
}

// Helper function to generate a WAV file from raw audio data
function generateWavFile(audioData: Float32Array): Buffer {
  const sampleRate = 22050; // Adjust based on your model's output
  const numChannels = 1; // Mono audio
  const bitDepth = 16; // 16-bit audio

  // WAV file header
  const header = createWavHeader(audioData.length * 2, numChannels, sampleRate, bitDepth);

  // Convert Float32Array to Int16Array
  const int16Data = floatToInt16(audioData, bitDepth);

  // Combine header and audio data
  const wavBuffer = Buffer.concat([header, Buffer.from(int16Data.buffer)]);

  return wavBuffer;
}

// Helper function to create a WAV file header
function createWavHeader(
  dataLength: number,
  numChannels: number,
  sampleRate: number,
  bitDepth: number
): Buffer {
  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;

  const header = Buffer.alloc(44);
  header.write('RIFF', 0); // Chunk ID
  header.writeUInt32LE(36 + dataLength, 4); // Chunk Size
  header.write('WAVE', 8); // Format
  header.write('fmt ', 12); // Subchunk1 ID
  header.writeUInt32LE(16, 16); // Subchunk1 Size
  header.writeUInt16LE(1, 20); // Audio Format (1 = PCM)
  header.writeUInt16LE(numChannels, 22); // Num Channels
  header.writeUInt32LE(sampleRate, 24); // Sample Rate
  header.writeUInt32LE(byteRate, 28); // Byte Rate
  header.writeUInt16LE(blockAlign, 32); // Block Align
  header.writeUInt16LE(bitDepth, 34); // Bits Per Sample
  header.write('data', 36); // Subchunk2 ID
  header.writeUInt32LE(dataLength, 40); // Subchunk2 Size

  return header;
}

// Helper function to convert Float32Array to Int16Array
function floatToInt16(floatArray: Float32Array, bitDepth: number): Int16Array {
  const int16Array = new Int16Array(floatArray.length);
  
   for (let i = 0; i < floatArray.length; i++) {
     const sample = Math.max(-1, Math.min(1, floatArray[i])); // Clamp to [-1,1]
     int16Array[i] = Math.round(sample * (2 ** (bitDepth -1) -1)); // Scale to the correct range for Int16
   }
   return int16Array;
}
