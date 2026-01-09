import type { Token, BuildPage } from '@/types'

export interface SearchableToken extends Token {
  type: 'token'
}

export interface SearchablePage extends BuildPage {
  type: 'page'
}

export type SearchableItem = SearchableToken | SearchablePage

export interface SearchFilters {
  type?: 'all' | 'tokens' | 'pages'
  promoted?: boolean
  dateRange?: {
    start?: number
    end?: number
  }
}

export function searchTokens(tokens: Token[], query: string): SearchableToken[] {
  const lowerQuery = query.toLowerCase().trim()
  
  if (!lowerQuery) return tokens.map(t => ({ ...t, type: 'token' as const }))
  
  return tokens
    .filter(token => {
      const searchableText = [
        token.query,
        token.content,
        token.id
      ].join(' ').toLowerCase()
      
      return searchableText.includes(lowerQuery)
    })
    .map(t => ({ ...t, type: 'token' as const }))
}

export function searchPages(pages: BuildPage[], query: string): SearchablePage[] {
  const lowerQuery = query.toLowerCase().trim()
  
  if (!lowerQuery) return pages.map(p => ({ ...p, type: 'page' as const }))
  
  return pages
    .filter(page => {
      const searchableText = [
        page.title,
        page.content,
        page.id,
        page.tokenId,
        ...page.tags
      ].join(' ').toLowerCase()
      
      return searchableText.includes(lowerQuery)
    })
    .map(p => ({ ...p, type: 'page' as const }))
}

export function searchAll(
  tokens: Token[],
  pages: BuildPage[],
  query: string,
  filters?: SearchFilters
): SearchableItem[] {
  const lowerQuery = query.toLowerCase().trim()
  
  let results: SearchableItem[] = []
  
  if (!filters?.type || filters.type === 'all' || filters.type === 'tokens') {
    let filteredTokens = tokens
    
    if (filters?.promoted !== undefined) {
      filteredTokens = filteredTokens.filter(t => t.promoted === filters.promoted)
    }
    
    if (filters?.dateRange) {
      filteredTokens = filteredTokens.filter(t => {
        if (filters.dateRange?.start && t.timestamp < filters.dateRange.start) return false
        if (filters.dateRange?.end && t.timestamp > filters.dateRange.end) return false
        return true
      })
    }
    
    results.push(...searchTokens(filteredTokens, query))
  }
  
  if (!filters?.type || filters.type === 'all' || filters.type === 'pages') {
    let filteredPages = pages
    
    if (filters?.dateRange) {
      filteredPages = filteredPages.filter(p => {
        if (filters.dateRange?.start && p.timestamp < filters.dateRange.start) return false
        if (filters.dateRange?.end && p.timestamp > filters.dateRange.end) return false
        return true
      })
    }
    
    results.push(...searchPages(filteredPages, query))
  }
  
  return results.sort((a, b) => b.timestamp - a.timestamp)
}

export function getRelevanceScore(item: SearchableItem, query: string): number {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return 0
  
  let score = 0
  
  if (item.type === 'token') {
    if (item.query.toLowerCase().includes(lowerQuery)) score += 10
    if (item.id.toLowerCase().includes(lowerQuery)) score += 5
    if (item.content.toLowerCase().includes(lowerQuery)) score += 3
  } else {
    if (item.title.toLowerCase().includes(lowerQuery)) score += 10
    if (item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) score += 7
    if (item.id.toLowerCase().includes(lowerQuery)) score += 5
    if (item.content.toLowerCase().includes(lowerQuery)) score += 3
  }
  
  return score
}

export function searchWithRelevance(
  tokens: Token[],
  pages: BuildPage[],
  query: string,
  filters?: SearchFilters
): SearchableItem[] {
  const results = searchAll(tokens, pages, query, filters)
  
  if (!query.trim()) return results
  
  return results.sort((a, b) => {
    const scoreA = getRelevanceScore(a, query)
    const scoreB = getRelevanceScore(b, query)
    
    if (scoreA !== scoreB) return scoreB - scoreA
    
    return b.timestamp - a.timestamp
  })
}
