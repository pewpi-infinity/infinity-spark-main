// src/mongoose/web.ts
// Zero-network web context to prevent fetch/localhost failures.
// Stable on GitHub Pages.

export type WebSource = { title: string; url: string; snippet: string }

export async function fetchWebContext(query: string): Promise<{
  summary: string
  sources: WebSource[]
}> {
  const q = (query || '').trim()
  return {
    summary: q ? `Context disabled (offline-safe). Query: ${q}` : 'Context disabled.',
    sources: []
  }
}
