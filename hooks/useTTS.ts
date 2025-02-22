import { useState, useCallback } from 'react';

interface TTSConfig {
    text: string;
    speaker: 'user' | 'assistant';
}

interface TTSResponse {
    audio: string;
}

export const useTTS = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const speak = useCallback(async ({ text, speaker }: TTSConfig): Promise<string> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL 
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tts`
                : '/api/tts';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ text, speaker }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || response.statusText);
            }

            const data: TTSResponse = await response.json();
            return `data:audio/wav;base64,${data.audio}`;
        } catch (err) {
            let errorMessage = 'TTS conversion failed';
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { speak, isLoading, error };
};