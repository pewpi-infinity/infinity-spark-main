// src/mongoose/llm.ts
// LLM adapter for mongoose.os
// This file is the ONLY place Spark-side code ever touches intelligence
// No GitHub AI, no Spark tools, no UI injection

export interface MongooseLLMInput {
  mode: 'page_generation' | 'analysis' | 'summary'
  query: string
  context?: {
    summary?: string
    sources?: Array<{ title: string; url: string; snippet: string }>
  }
  instructions?: string
}

export interface MongooseLLMOutput {
  content: string
  analysis?: string
  tags?: string[]
}

// --------------------------------------------------
// MAIN LLM ADAPTER
// --------------------------------------------------
export async function mongooseLLM(
  input: MongooseLLMInput
): Promise<MongooseLLMOutput> {

  const prompt = buildPrompt(input)

  /**
   * IMPORTANT:
   * This is the ONLY place where an LLM is called.
   * Replace `callMongooseEngine` with:
   *  - local model
   *  - mongoose.os service
   *  - remote endpoint
   *
   * Spark never knows or cares.
   */
  const rawResponse = await callMongooseEngine(prompt)

  let parsed: any
  try {
    parsed = JSON.parse(rawResponse)
  } catch (err) {
    console.error('[mongoose llm] invalid JSON', rawResponse)
    throw new Error('Mongoose LLM returned invalid JSON')
  }

  if (!parsed.content) {
    throw new Error('Mongoose LLM response missing content')
  }

  return {
    content: parsed.content,
    analysis: parsed.analysis,
    tags: Array.isArray(parsed.tags) ? parsed.tags : []
  }
}

// --------------------------------------------------
// PROMPT BUILDER (STRICT, TOOL-FREE)
// --------------------------------------------------
function buildPrompt(input: MongooseLLMInput): string {
  const { query, context, instructions } = input

  return `
You are mongoose.os — an autonomous intelligence engine.

RULES (ABSOLUTE):
- NO tools
- NO UI controls
- NO personalization prompts
- NO questions
- NO markdown fences
- NO explanations outside JSON
- Output MUST be valid JSON only

QUERY:
${query}

WEB CONTEXT:
${context?.summary ?? 'No external context provided.'}

SOURCES:
${(context?.sources ?? [])
  .map(s => `- ${s.title}: ${s.snippet}`)
  .join('\n')}

${instructions ?? ''}

OUTPUT FORMAT (JSON ONLY):
{
  "content": "2–3 high-quality paragraphs suitable for a permanent website",
  "analysis": "concise reasoning and insights",
  "tags": ["semantic", "relevant", "keywords"]
}
`.trim()
}

// --------------------------------------------------
// ENGINE CALL (REPLACE INTERNALLY AS NEEDED)
// --------------------------------------------------
async function callMongooseEngine(prompt: string): Promise<string> {
  const MONGOOSE_ENDPOINT =
    process.env.MONGOOSE_OS_URL || 'http://localhost:3333/query'

  const response = await fetch(MONGOOSE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      mode: 'page_generation',
      format: 'json'
    })
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`mongoose.os error: ${errText}`)
  }

  return await response.text()
    }

