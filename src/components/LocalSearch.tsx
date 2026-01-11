import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TokenDisplay } from '@/components/TokenDisplay'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { ArrowLeft, MagnifyingGlass, Sparkle, File } from '@phosphor-icons/react'
import type { Token, BuildPage } from '@/types'
import { searchTokens, searchPages } from '@/lib/localSearch'

interface LocalSearchProps {
  tokens: Token[]
  pages: BuildPage[]
  onViewToken: (token: Token) => void
  onViewPage: (page: BuildPage) => void
  onBack: () => void
}

type FilterType = 'all' | 'tokens' | 'pages'

export function LocalSearch({ tokens, pages, onViewToken, onViewPage, onBack }: LocalSearchProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredTokens = searchTokens(tokens, query)
  const filteredPages = searchPages(pages, query)

  const showTokens = filter === 'all' || filter === 'tokens'
  const showPages = filter === 'all' || filter === 'pages'

  const hasResults = filteredTokens.length > 0 || filteredPages.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Search
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Archive Search</h1>
            <p className="text-muted-foreground">
              Search through your tokens and pages
            </p>
          </div>

          <div className="relative">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              id="archive-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search archives..."
              className="h-12 pl-12 text-lg bg-card/50 backdrop-blur-sm"
            />
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <TabsList>
              <TabsTrigger value="all">
                All ({tokens.length + pages.length})
              </TabsTrigger>
              <TabsTrigger value="tokens">
                Tokens ({tokens.length})
              </TabsTrigger>
              <TabsTrigger value="pages">
                Pages ({pages.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6 mt-6">
              {showTokens && filteredTokens.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkle size={24} />
                    Tokens ({filteredTokens.length})
                  </h2>
                  <div className="grid gap-4">
                    {filteredTokens.map((token) => (
                      <Card
                        key={token.id}
                        className="cursor-pointer hover:bg-accent/5 transition-colors"
                        onClick={() => onViewToken(token)}
                      >
                        <CardContent className="p-4">
                          <TokenDisplay token={token} />
                          {token.analytics && (
                            <div className="mt-3">
                              <AnalyticsDashboard analytics={token.analytics} type="token" compact />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {showPages && filteredPages.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <File size={24} />
                    Pages ({filteredPages.length})
                  </h2>
                  <div className="grid gap-4">
                    {filteredPages.map((page) => (
                      <Card
                        key={page.id}
                        className="cursor-pointer hover:bg-accent/5 transition-colors"
                        onClick={() => onViewPage(page)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-xl">{page.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(page.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={page.published ? 'default' : 'secondary'}>
                              {page.published ? '✅ Published' : '⚠️ Draft'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {page.content}
                          </p>
                          {page.analytics && (
                            <div className="mt-3">
                              <AnalyticsDashboard analytics={page.analytics} type="page" compact />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {!hasResults && (
                <Card className="bg-muted/30">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {query
                        ? 'No results found. Try adjusting your search.'
                        : 'No tokens or pages yet. Start by searching!'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tokens" className="mt-6">
              {filteredTokens.length > 0 ? (
                <div className="grid gap-4">
                  {filteredTokens.map((token) => (
                    <Card
                      key={token.id}
                      className="cursor-pointer hover:bg-accent/5 transition-colors"
                      onClick={() => onViewToken(token)}
                    >
                      <CardContent className="p-4">
                        <TokenDisplay token={token} />
                        {token.analytics && (
                          <div className="mt-3">
                            <AnalyticsDashboard analytics={token.analytics} type="token" compact />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {query ? 'No tokens match your search.' : 'No tokens yet.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pages" className="mt-6">
              {filteredPages.length > 0 ? (
                <div className="grid gap-4">
                  {filteredPages.map((page) => (
                    <Card
                      key={page.id}
                      className="cursor-pointer hover:bg-accent/5 transition-colors"
                      onClick={() => onViewPage(page)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{page.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(page.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={page.published ? 'default' : 'secondary'}>
                            {page.published ? '✅ Published' : '⚠️ Draft'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {page.content}
                        </p>
                        {page.analytics && (
                          <div className="mt-3">
                            <AnalyticsDashboard analytics={page.analytics} type="page" compact />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {query ? 'No pages match your search.' : 'No pages yet.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
