export async function mongooseLLM(input: {
  query: string
  context?: { summary?: string; sources?: any[] }
  instructions?: string
  mode?: string
}): Promise<{ content: string; analysis: string; tags: string[] }> {
  const q = (input?.query || '').trim()
  
  if (!q) {
    throw new Error('Query is required')
  }

  try {
    const contextPart = input.context?.summary || ''
    const instructionsPart = input.instructions || 'Generate 2-3 paragraphs of informative, engaging content about this topic. Focus on accuracy and clarity.'
    
    const contextSection = contextPart ? `\n\nContext: ${contextPart}` : ''
    
    // @ts-ignore - TypeScript incorrectly infers template tag return type
    const prompt: string = spark.llmPrompt`You are an AI research engine generating high-quality web content.

Query: ${q}${contextSection}

${instructionsPart}

Return a JSON object with:
- content: 2-3 well-written paragraphs
- analysis: Key insights and reasoning (1-2 sentences)
- tags: Array of 4-6 relevant topic tags

Format as valid JSON.`

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const result = JSON.parse(response)

    if (!result.content || !result.analysis) {
      throw new Error('Invalid AI response format')
    }

    return {
      content: result.content,
      analysis: result.analysis,
      tags: Array.isArray(result.tags) ? result.tags : []
    }
  } catch (error) {
    console.error('[mongooseLLM error]', error)
    
    const words = q.split(/\s+/).filter(Boolean)
    const tags = Array.from(new Set(words.map(w => w.toLowerCase()))).slice(0, 6)

    return {
      content: `Research content for: ${q}\n\nThis topic explores ${words.slice(0, 3).join(', ')} and their interconnections. The subject matter encompasses fundamental concepts and practical applications that contribute to a deeper understanding of the field.\n\nKey areas of focus include theoretical frameworks, methodological approaches, and real-world implementations. These elements combine to form a comprehensive perspective on ${q.toLowerCase()}.`,
      analysis: `Generated content exploring ${q} with focus on conceptual understanding and practical relevance.`,
      tags
    }
  }
}
