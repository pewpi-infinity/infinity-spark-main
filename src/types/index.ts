export interface Token {
  id: string
  query: string
  timestamp: number
  content: string
  promoted: boolean
  pageId?: string
}

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

export interface BuildPage {
  id: string
  tokenId: string
  title: string
  content: string
  features: PageFeatures
  timestamp: number
  tags: string[]
}

export interface SearchResult {
  query: string
  content: string
  analysis: string
  tags: string[]
}
