import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  MagnifyingGlass,
  ArrowLeft,
  Sparkle,
  File,
  Eye,
  X
} from '@phosphor-icons/react'
import type { Token, BuildPage } from '@/types'
import { searchWithRelevance, type SearchFilters, type SearchableItem } from '@/lib/localSearch'
import { formatTimestamp } from '@/lib/search'

interface LocalSearchProps {
  tokens: Token[]
  pages: BuildPage[]
  onViewToken: (token: Token) => void
  onViewPage: (page: BuildPage) => void
  onBack: () => void
}

export function LocalSearch({
  tokens,
  pages,
  onViewToken,
  onViewPage,
  onBack
}: LocalSearchProps) {
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'tokens' | 'pages'>('all')
  const [promotedFilter, setPromotedFilter] = useState<boolean | undefined>(undefined)

  const filters: SearchFilters = {
    type: filterType,
    promoted: promotedFilter
  }

  const results = useMemo(
    () => searchWithRelevance(tokens, pages, query, filters),
    [tokens, pages, query, filterType, promotedFilter]
  )

  const tokenResults = results.filter(r => r.type === 'token')
  const pageResults = results.filter(r => r.type === 'page')

  const clearFilters = () => {
    setFilterType('all')
    setPromotedFilter(undefined)
  }

  const hasActiveFilters = filterType !== 'all' || promotedFilter !== undefined

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Search Archives</h1>
            <p className="text-muted-foreground mt-1">
              {tokens.length} tokens • {pages.length} pages
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Input
              id="local-search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tokens, pages, tags, content..."
              className="h-14 text-lg px-6 pr-14 bg-card/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <MagnifyingGlass size={24} className="text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <TabsList>
                <TabsTrigger value="all">
                  All ({results.length})
                </TabsTrigger>
                <TabsTrigger value="tokens">
                  Tokens ({tokenResults.length})
                </TabsTrigger>
                <TabsTrigger value="pages">
                  Pages ({pageResults.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator orientation="vertical" className="h-8" />

            <div className="flex gap-2">
              <Button
                variant={promotedFilter === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPromotedFilter(promotedFilter === false ? undefined : false)}
              >
                Unpromoted
              </Button>
              <Button
                variant={promotedFilter === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPromotedFilter(promotedFilter === true ? undefined : true)}
              >
                Promoted
              </Button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X size={16} className="mr-1" />
                Clear
              </Button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {query ? 'No results found' : 'No items to display'}
              </p>
              {query && (
                <p className="text-sm text-muted-foreground mt-2">
                  Try a different search term or adjust your filters
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {results.map((item) => (
                <SearchResultCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  query={query}
                  onViewToken={onViewToken}
                  onViewPage={onViewPage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface SearchResultCardProps {
  item: SearchableItem
  query: string
  onViewToken: (token: Token) => void
  onViewPage: (page: BuildPage) => void
}

function SearchResultCard({ item, query, onViewToken, onViewPage }: SearchResultCardProps) {
  const isToken = item.type === 'token'

  const handleView = () => {
    if (isToken) {
      onViewToken(item as Token)
    } else {
      onViewPage(item as BuildPage)
    }
  }

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-accent/30 text-foreground px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {isToken ? (
                <Sparkle size={20} className="text-accent shrink-0" weight="fill" />
              ) : (
                <File size={20} className="text-accent shrink-0" weight="fill" />
              )}
              <Badge variant={isToken ? 'secondary' : 'default'} className="shrink-0">
                {isToken ? 'Token' : 'Page'}
              </Badge>
              {isToken && (item as Token).promoted && (
                <Badge variant="outline" className="shrink-0">Promoted</Badge>
              )}
            </div>
            <CardTitle className="text-xl">
              {highlightText(
                isToken ? (item as Token).query : (item as BuildPage).title,
                query
              )}
            </CardTitle>
          </div>
          <Button
            size="sm"
            onClick={handleView}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
          >
            <Eye size={18} className="mr-1" />
            View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {highlightText(item.content.substring(0, 200), query)}
          {item.content.length > 200 && '...'}
        </p>

        {!isToken && (item as BuildPage).tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {(item as BuildPage).tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {highlightText(tag, query)}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">{item.id}</span>
          <span>{formatTimestamp(item.timestamp)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
