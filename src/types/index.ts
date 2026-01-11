export interface TokenAnalytics {
  views: number
  lastViewed?: number
  searches: number
  promotions: number
  shares: number
}

export interface Token {
  id: string
  query: string
  timestamp: number
  content: string
  promoted: boolean
  pageId?: string
  pageIds?: string[]
  analytics?: TokenAnalytics
}

export type PageStructure = 'blank' | 'knowledge' | 'business' | 'tool' | 'multipage'

export interface PageFeatures {
  charts: boolean
  images: boolean
  audio: boolean
  video: boolean
  files: boolean
  widgets: boolean
  navigation: boolean
  monetization: boolean
}

export interface PageAnalytics {
  views: number
  lastViewed?: number
  edits: number
  shares: number
  uniqueVisitors: number
}

export interface BuildPage {
  id: string
  tokenId: string
  title: string
  content: string
  structure?: PageStructure
  features: PageFeatures
  timestamp: number
  tags: string[]
  published: boolean
  url?: string
  slug?: string
  publishedAt?: number
  analytics?: PageAnalytics
  publishStatus?: 'draft' | 'published' | 'awaiting-build'
}

export interface SearchResult {
  query: string
  content: string
  analysis: string
  tags: string[]
}
