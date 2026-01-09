import type { SearchResult, Token } from '@/types'
import { mongooseLLM } from '@/mongoose/llm'
import { fetchWebContext } from '@/mongoose/web'

// ----------------------------
// Token generation (keep this)
// ----------------------------
export function generateTokenId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `INF-${timestamp}-${random}`.toUpperCase()
}

// ------------------------------------
// MAIN QUERY HANDLER (mongoose-powered)
// ------------------------------------
export async function processSearch(query: string): Promise<SearchResult> {
  if (!query || !query.trim()) {
    throw new Error('Query cannot be empty')
  }

  try {
    // 1. Pull live web context (search, scrape, summaries)
    const webContext = await fetchWebContext(query)

    // 2. Ask mongoose LLM to reason + design content
    const result = await mongooseLLM({
      mode: 'page_generation',
      query,
      context: webContext,
      instructions: `
You are generating permanent web content.

Rules:
- No UI tools
- No personalization controls
- No questions to the user
- No markdown fences
- Output structured JSON only

Return:
{
  "content": "2–3 paragraphs of high-quality content",
  "analysis": "key insights and reasoning",
  "tags": ["relevant", "semantic", "tags"]
}
`
    })

    if (!result?.content || !result?.analysis) {
      throw new Error('Invalid mongoose LLM response')
    }

    return {
      query,
      content: result.content,
      analysis: result.analysis,
      tags: Array.isArray(result.tags) ? result.tags : []
    }

  } catch (err) {
    console.error('[mongoose search error]', err)
    throw new Error('Failed to process search with mongoose.os')
  }
}

// ----------------------------
// Token creation (keep simple)
// ----------------------------
export function createToken(query: string, content: string): Token {
  return {
    id: generateTokenId(),
    query,
    timestamp: Date.now(),
    content,
    promoted: false
  }
}

// ----------------------------
// Timestamp formatting (safe)
// ----------------------------
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
      }
    
