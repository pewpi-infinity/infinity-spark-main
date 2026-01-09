// src/mongoose/llm.ts
// Inline LLM substitute: no fetch, no localhost, no imports.
// Guarantees search returns something and never fails from infra.

export async function mongooseLLM(input: {
  query: string
  context?: { summary?: string; sources?: any[] }
  instructions?: string
  mode?: string
}): Promise<{ content: string; analysis: string; tags: string[] }> {
  const q = (input?.query || '').trim()
  const words = q.split(/\s+/).filter(Boolean)

  const tags = Array.from(new Set(words.map(w => w.toLowerCase()))).slice(0, 6)

  return {
    content:
      `Infinity Result\n\n` +
      `Query: ${q || '(empty)'}\n\n` +
      `This is the stable inline engine. It proves your UI → logic → page pipeline works on GitHub Pages with zero dependencies.\n\n` +
      `Next step after stability: swap this function body with real mongoose.os logic (still no network on Pages unless you host a service).`,
    analysis:
      `Inline engine active. No localhost, no fetch, no external model calls. ` +
      `If you still get white pages after this, the issue is build/UI, not the query engine.`,
    tags
  }
}
