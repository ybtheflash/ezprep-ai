import axios from "axios";

export async function searchPerplexity(query: string): Promise<string> {
  const API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!API_KEY) {
    console.error("Missing PERPLEXITY_API_KEY in .env");
    return "Search service unavailable.";
  }

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/search",
      { query },
      { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
    );

    const data = response.data;
    return data?.results?.[0]?.snippet || "No relevant results found.";
  } catch (error) {
    console.error("Perplexity search error:", error);
    return "Error fetching search results.";
  }
}
