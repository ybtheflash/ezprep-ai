"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface TranscriptionResult {
  summary: string;
  transcription: string;
}

export default function TranscribePage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState('');

  const validateYouTubeUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to process video');
      }

      const data = await response.json();
      setResult(data);
      toast({
        title: "Success",
        description: "Video processed successfully!",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process video. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;

    try {
      const doc = new jsPDF();
      const splitTitle = doc.splitTextToSize('Video Summary', 180);
      const splitSummary = doc.splitTextToSize(result.summary, 180);
      
      // Add title
      doc.setFontSize(20);
      doc.text(splitTitle, 15, 20);
      
      // Add summary
      doc.setFontSize(12);
      doc.text(splitSummary, 15, 40);
      
      doc.save('video-summary.pdf');
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const downloadTXT = () => {
    if (!result) return;
    
    try {
      const element = document.createElement('a');
      const file = new Blob([result.transcription], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = 'transcription.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Success",
        description: "Transcript downloaded successfully!",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download transcript';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fcf3e4]">
      <div className="w-full min-h-screen flex flex-col items-center">
        <div className={`w-full max-w-4xl px-4 transition-all duration-500 ease-in-out transform ${result ? 'pt-8' : 'pt-32'}`}>
          <div className="text-center mb-12 relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#8b5e34]/20 rounded-full" />
            <div className="relative inline-block">
              <h1 className="text-4xl font-gloock text-[#8b5e34] mb-4 relative z-10">
                Video Transcription
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-[#8b5e34]/10 transform -skew-x-12" />
              </h1>
            </div>
            <p className="text-[#8b5e34] opacity-80 font-medium">
              Transform YouTube videos into text with AI assistance
            </p>
          </div>

          <Card className="p-8 bg-[#fcf3e4] border-[#8b5e34] mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8b5e34]/0 via-[#8b5e34]/20 to-[#8b5e34]/0" />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="Paste YouTube video URL here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/90 border-[#8b5e34] text-[#8b5e34] placeholder:text-[#8b5e34]/50 text-center text-lg h-14 rounded-xl shadow-inner"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !url}
                className="w-full bg-[#8b5e34] hover:bg-[#6d4a29] text-white h-14 text-lg rounded-xl shadow-md transform transition-transform hover:scale-[1.02] disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process Video'
                )}
              </Button>
            </form>
          </Card>

          {result && (
            <Card className="p-8 bg-[#fcf3e4] border-[#8b5e34] shadow-lg relative mb-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8b5e34]/0 via-[#8b5e34]/20 to-[#8b5e34]/0" />
              
              <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-gloock text-[#8b5e34] relative">
                    Summary
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#8b5e34]/10 transform -skew-x-12" />
                  </h2>
                  <div className="flex gap-3">
                    <Button
                      onClick={downloadPDF}
                      variant="outline"
                      className="border-[#8b5e34] text-[#8b5e34] hover:bg-[#8b5e34] hover:text-white rounded-xl transform transition-transform hover:scale-[1.02]"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Summary PDF
                    </Button>
                    <Button
                      onClick={downloadTXT}
                      variant="outline"
                      className="border-[#8b5e34] text-[#8b5e34] hover:bg-[#8b5e34] hover:text-white rounded-xl transform transition-transform hover:scale-[1.02]"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Full Transcript
                    </Button>
                  </div>
                </div>
                
                <div className="prose prose-stone max-w-none">
                  <p className="text-[#8b5e34] whitespace-pre-wrap text-lg leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
