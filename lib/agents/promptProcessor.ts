export function processPrompt(message: string) {
  // Check for educational resource requests
  if (/dsa|data structure|algorithm|playlist|course|tutorial/i.test(message)) {
    return "educational_resource";
  }
  
  // Check for explanation requests
  if (/explain|how|why|detail|expand|elaborate/i.test(message)) {
    return "explanation";
  }

  // Check for search queries
  if (/search|find|lookup|get me|show me/i.test(message)) {
    return "search";
  }

  // Check for practice questions
  if (/practice|exercise|problem|question|quiz/i.test(message)) {
    return "practice";
  }

  // Check for summary requests
  if (/summarize|summary|brief|overview/i.test(message)) {
    return "summary";
  }

  return "general";
}