// src/mongoose/llm.ts
// Direct-import mongoose adapter (GitHub Pages safe)

import { runMongoose } from '@/mongoose-os/runMongoose'

export interface MongooseLLMInput {
  query: string
  context?: {
    summary?: string
    sources?: Array<{ title: string; url: string; snippet: string }>
  }
}

export interface MongooseLLMOutput {
  content: string
  analysis?: string
  tags?: string[]
}

export async function mongooseLLM(
  input: MongooseLLMInput
): Promise<MongooseLLMOutput> {
  try {
    const result = await runMongoose({
      prompt: input.query,
      context: input.context,
      mode: 'page_generation',
      format: 'json'
    })

    if (!result || !result.content) {
      throw new Error('mongoose returned invalid result')
    }

    return {
      content: result.content,
      analysis: result.analysis ?? '',
      tags: Array.isArray(result.tags) ? result.tags : []
    }
  } catch (err) {
    console.error('[mongooseLLM error]', err)
    throw new Error('Failed to process query with mongoose')
  }
}

