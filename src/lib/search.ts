import type { SearchResult, Token } from '@/types'

export function generateTokenId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `INF-${timestamp}-${random}`.toUpperCase()
}

export async function processSearch(query: string): Promise<SearchResult> {
  try {
    const promptText = `You are analyzing a search query to generate meaningful content.

Query: ${query}

Generate a comprehensive response that includes:
1. Main content addressing the query (2-3 paragraphs)
2. Key insights or analysis
3. 3-5 relevant tags

Return ONLY valid JSON in this exact format:
{
  "content": "detailed content here",
  "analysis": "key insights here",
  "tags": ["tag1", "tag2", "tag3"]
}`

    const response = await spark.llm(promptText, 'gpt-4o', true)
    const parsed = JSON.parse(response)
    
    if (!parsed.content || !parsed.analysis || !parsed.tags) {
      throw new Error('Invalid response format from LLM')
    }
    
    return {
      query,
      content: parsed.content,
      analysis: parsed.analysis,
      tags: Array.isArray(parsed.tags) ? parsed.tags : []
    }
  } catch (error) {
    console.error('Search processing error:', error)
    throw new Error(`Failed to process search: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function createToken(query: string, content: string): Token {
  return {
    id: generateTokenId(),
    query,
    timestamp: Date.now(),
    content,
    promoted: false
  }
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
