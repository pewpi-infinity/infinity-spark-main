import type { Token, BuildPage } from '@/types'

export function searchTokens(tokens: Token[], query: string): Token[] {
  if (!query.trim()) {
    return tokens
  }

  const lowerQuery = query.toLowerCase()

  return tokens.filter((token) => {
    return (
      token.query.toLowerCase().includes(lowerQuery) ||
      token.content.toLowerCase().includes(lowerQuery) ||
      token.id.toLowerCase().includes(lowerQuery)
    )
  }).sort((a, b) => b.timestamp - a.timestamp)
}

export function searchPages(pages: BuildPage[], query: string): BuildPage[] {
  if (!query.trim()) {
    return pages
  }

  const lowerQuery = query.toLowerCase()

  return pages.filter((page) => {
    return (
      page.title.toLowerCase().includes(lowerQuery) ||
      page.content.toLowerCase().includes(lowerQuery) ||
      page.id.toLowerCase().includes(lowerQuery) ||
      page.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }).sort((a, b) => b.timestamp - a.timestamp)
}
