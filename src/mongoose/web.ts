// src/mongoose/web.ts
// Web context fetcher for mongoose-powered search
// No Spark, no GitHub AI, no UI logic

export interface WebSource {
  title: string
  url: string
  snippet: string
}

export interface WebContext {
  summary: string
  sources: WebSource[]
}

// --------------------------------------------------
// MAIN WEB FETCH FUNCTION
// --------------------------------------------------
export async function fetchWebContext(query: string): Promise<WebContext> {
  if (!query || !query.trim()) {
    throw new Error('Web fetch requires a valid query')
  }

  // NOTE:
  // This function is intentionally generic.
  // You can swap the internals later (DuckDuckGo, SerpAPI, custom crawler, etc.)
  // without changing any other code.

  const sources: WebSource[] = []

  try {
    // Basic DuckDuckGo HTML scrape (no API key required)
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    const response = await fetch(searchUrl)
    const html = await response.text()

    // Very lightweight extraction (safe, non-fragile)
    const linkRegex = /<a rel="nofollow" class="result__a" href="([^"]+)">([^<]+)<\/a>/g
    const snippetRegex = /<a[^>]+class="result__snippet"[^>]*>(.*?)<\/a>/g

    let linkMatch
    let snippetMatch
    let count = 0

    while (
      (linkMatch = linkRegex.exec(html)) !== null &&
      (snippetMatch = snippetRegex.exec(html)) !== null &&
      count < 5
    ) {
      sources.push({
        title: decodeHtml(linkMatch[2]),
        url: linkMatch[1],
        snippet: decodeHtml(stripTags(snippetMatch[1]))
      })
      count++
    }

  } catch (err) {
    console.warn('[mongoose web] fallback context used', err)
  }

  // Create a compact summary for LLM context
  const summary = sources.length
    ? sources.map(s => `• ${s.title}: ${s.snippet}`).join('\n')
    : `No direct sources found. Use general knowledge for query: "${query}".`

  return {
    summary,
    sources
  }
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------
function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

function decodeHtml(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  }
    
