export type WebSource = { title: string; url: string; snippet: string }

export async function fetchWebContext(query: string): Promise<{
  summary: string
  sources: WebSource[]
}> {
  const q = (query || '').trim()
  
  if (!q) {
    return {
      summary: 'No query provided',
      sources: []
    }
  }

  try {
    const promptText = `Provide a brief contextual summary (2-3 sentences) about: ${q}
    
Focus on what would be most useful for someone researching this topic.`

    const summary = await spark.llm(promptText, 'gpt-4o-mini', false)
    
    return {
      summary: summary.trim(),
      sources: []
    }
  } catch (error) {
    console.error('[fetchWebContext error]', error)
    return {
      summary: `Research context for: ${q}`,
      sources: []
    }
  }
}
