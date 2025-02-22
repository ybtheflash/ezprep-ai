from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pyttsx3
import base64
import tempfile
import os
from typing import Optional

app = FastAPI()

# Required system dependencies: sudo apt-get install espeak libespeak1

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://*.app.github.dev",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_engine():
    """Initialize TTS engine with proper error handling"""
    try:
        engine = pyttsx3.init(driverName='espeak')
        # Configure default settings
        engine.setProperty('rate', 150)
        engine.setProperty('volume', 0.9)
        return engine
    except Exception as e:
        raise RuntimeError(f"Failed to initialize TTS engine: {str(e)}")

def generate_audio(text: str, speaker: str) -> bytes:
    """Generate audio bytes with voice customization"""
    try:
        engine = get_engine()
        
        # Voice configuration
        voices = engine.getProperty('voices')
        if speaker == "assistant" and len(voices) > 1:
            engine.setProperty('voice', voices[1].id)
            engine.setProperty('pitch', 0.9)
            engine.setProperty('rate', 140)
        else:
            engine.setProperty('voice', voices[0].id)
            engine.setProperty('pitch', 1.0)
            engine.setProperty('rate', 150)

        # Use temporary file for audio generation
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
            temp_path = f.name
            
        engine.save_to_file(text, temp_path)
        engine.runAndWait()
        
        with open(temp_path, 'rb') as audio_file:
            audio_data = audio_file.read()
            
        os.unlink(temp_path)
        return audio_data
        
    except Exception as e:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.unlink(temp_path)
        raise

@app.post("/api/tts")
async def text_to_speech(text: str, speaker: str = "user"):
    try:
        audio_bytes = generate_audio(text, speaker)
        return {"audio": base64.b64encode(audio_bytes).decode()}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"TTS generation failed: {str(e)}. " +
                   "Make sure espeak is installed (sudo apt-get install espeak libespeak1)"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)