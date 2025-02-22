import * as cheerio from 'cheerio';
import axios from 'axios';

interface ScrapedContent {
  title?: string;
  content: string;
  url: string;
}

interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

interface PerplexitySearchResponse {
  results: SearchResult[];
}

export async function scrapeWebpage(url: string): Promise<ScrapedContent> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script').remove();
    $('style').remove();

    const title = $('title').text().trim();
    const content = $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2000); // Limit content length

    return {
      title,
      content,
      url
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {
      content: "Failed to scrape webpage content",
      url
    };
  }
}

export async function searchAndScrape(query: string): Promise<ScrapedContent[]> {
  try {
    // Use Perplexity Search API
    const searchResponse = await axios.post<PerplexitySearchResponse>(
      'https://api.perplexity.ai/search',
      {
        query,
        max_results: 3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const urls = searchResponse.data.results.map(result => result.url);
    
    // Scrape each URL
    const scrapePromises = urls.map(scrapeWebpage);
    const results = await Promise.all(scrapePromises);

    return results.filter(result => result.content !== "Failed to scrape webpage content");
  } catch (error) {
    console.error('Search and scrape error:', error);
    return [];
  }
}
