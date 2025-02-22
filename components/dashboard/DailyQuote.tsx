'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';

interface QuoteData {
  text: string;
  author: string;
}

export function DailyQuote() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/quotes');
        const data = await response.json();
        setQuote(data);
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (isLoading) {
    return <p className="text-[#6d4a29] text-lg animate-pulse">Loading daily inspiration...</p>;
  }

  return (
    <div className="flex items-start gap-3 text-[#6d4a29]">
      <Quote className="h-6 w-6 mt-1 text-[#8b5e34]" />
      <div>
        <p className="text-lg italic">{quote?.text}</p>
        <p className="text-sm mt-1 font-medium text-[#8b5e34]">― {quote?.author}</p>
      </div>
    </div>
  );
}