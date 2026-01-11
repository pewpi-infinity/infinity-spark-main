import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Sparkle, CheckCircle, Link as LinkIcon, Rocket, ShareNetwork, Plus, TrendUp } from '@phosphor-icons/react'
import type { Token, BuildPage, SearchResult } from '@/types'
import { formatTimestamp } from '@/lib/search'
import { trackTokenView, trackTokenShare } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { TokenExpansion } from '@/components/TokenExpansion'
import { toast } from 'sonner'

interface TokenViewProps {
  token: Token
  pages: BuildPage[]
  onBack: () => void
  onViewPage?: (page: BuildPage) => void
  onTokenUpdate?: (token: Token) => void
  onExpandToken?: (result: SearchResult) => void
}

export function TokenView({ token, pages, onBack, onViewPage, onTokenUpdate, onExpandToken }: TokenViewProps) {
  const [showExpansion, setShowExpansion] = useState(false)
  
  const isValidToken = token && token.id
  
  const associatedPages = isValidToken ? pages.filter(p => 
    p && p.id && (p.tokenId === token.id || (token.pageIds && token.pageIds.includes(p.id)))
  ) : []
  
  const primaryPage = isValidToken && token.pageId 
    ? pages.find(p => p.id === token.pageId) 
    : associatedPages[0]

  useEffect(() => {
    if (isValidToken && onTokenUpdate) {
      const updatedToken = trackTokenView(token)
      onTokenUpdate(updatedToken)
    }
  }, [isValidToken])

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Token Not Found</h2>
          <p className="text-muted-foreground">
            The requested token could not be loaded
          </p>
          <Button onClick={onBack} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <ArrowLeft className="mr-2" size={20} />
            Back
          </Button>
        </div>
      </div>
    )
  }

  const handleViewLive = () => {
    if (primaryPage?.url) {
      window.open(primaryPage.url, '_blank')
    }
  }

  const handleCopyUrl = () => {
    if (primaryPage?.url) {
      navigator.clipboard.writeText(primaryPage.url)
      toast.success('URL copied to clipboard')
    }
  }

  const handleShare = async () => {
    const shareText = `${token.query}\n\nToken: ${token.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: token.query,
          text: shareText
        })
        if (onTokenUpdate) {
          const updatedToken = trackTokenShare(token)
          onTokenUpdate(updatedToken)
        }
        toast.success('Token shared!')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyShare()
        }
      }
    } else {
      handleCopyShare()
    }
  }

  const handleCopyShare = () => {
    const shareText = `${token.query}\n\nToken: ${token.id}`
    navigator.clipboard.writeText(shareText)
    if (onTokenUpdate) {
      const updatedToken = trackTokenShare(token)
      onTokenUpdate(updatedToken)
    }
    toast.success('Token info copied to clipboard')
  }

  const handleViewPageDetails = () => {
    if (primaryPage && onViewPage) {
      onViewPage(primaryPage)
    }
  }

  const tokenValue = associatedPages.length * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="outline" size="sm" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <Sparkle size={32} className="text-accent" weight="fill" />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-2">Token</Badge>
                  {token.promoted && (
                    <Badge variant="outline" className="mb-2 ml-2">
                      <CheckCircle size={14} className="mr-1" weight="fill" />
                      Promoted
                    </Badge>
                  )}
                  {primaryPage?.published && (
                    <Badge variant="outline" className="mb-2 ml-2 bg-accent/20 text-accent border-accent/30">
                      <Rocket size={14} className="mr-1" weight="fill" />
                      Published
                    </Badge>
                  )}
                  <CardTitle className="text-3xl mt-2">{token.query}</CardTitle>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="font-mono">{token.id}</div>
              <Separator orientation="vertical" className="h-4" />
              <div>{formatTimestamp(token.timestamp)}</div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
              >
                <ShareNetwork className="mr-2" size={18} />
                Share Token
              </Button>
            </div>

            {token.analytics && (
              <AnalyticsDashboard analytics={token.analytics} type="token" />
            )}

            <div className="bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendUp className="text-accent" size={24} />
                    Token Value
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {associatedPages.length} {associatedPages.length === 1 ? 'page' : 'pages'} tied to this token
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent">{tokenValue}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Each page you create from this token increases its value. Build a network of related content!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Content</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {token.content}
                </p>
              </div>
            </div>

            {associatedPages.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Associated Pages ({associatedPages.length})
                  </h3>
                  <Button
                    onClick={() => setShowExpansion(true)}
                    variant="outline"
                    size="sm"
                    className="border-accent/30 hover:bg-accent/10"
                  >
                    <Plus className="mr-2" size={16} />
                    Expand Token
                  </Button>
                </div>
                <div className="space-y-3">
                  {associatedPages.map((page) => (
                    <Card key={page.id} className="bg-card/30 border-border/50 hover:border-accent/30 transition-colors">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold truncate">{page.title}</h4>
                              {page.published ? (
                                <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 flex-shrink-0">
                                  <Rocket size={12} className="mr-1" weight="fill" />
                                  Live
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="flex-shrink-0">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {page.content.substring(0, 120)}...
                            </p>
                            {page.url && (
                              <div className="bg-card/50 rounded p-2 font-mono text-xs break-all mb-3 border border-border/50">
                                {page.url}
                              </div>
                            )}
                            <div className="flex gap-2 flex-wrap">
                              {page.published && page.url && (
                                <Button
                                  onClick={() => window.open(page.url, '_blank')}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-7"
                                >
                                  <LinkIcon className="mr-1" size={14} />
                                  View Live
                                </Button>
                              )}
                              {onViewPage && (
                                <Button
                                  onClick={() => {
                                    if (page && page.id) {
                                      onViewPage(page)
                                    }
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-7"
                                >
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!token.promoted && associatedPages.length === 0 && (
              <Card className="bg-primary/10 border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This token hasn't been expanded into any pages yet.
                    </p>
                    <Button
                      onClick={() => setShowExpansion(true)}
                      variant="outline"
                      size="sm"
                      className="border-accent/30 hover:bg-accent/10"
                    >
                      <Plus className="mr-2" size={16} />
                      Create First Page
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      <TokenExpansion
        token={token}
        open={showExpansion}
        onClose={() => setShowExpansion(false)}
        onPageCreated={(result) => {
          if (onExpandToken) {
            onExpandToken(result)
          }
          setShowExpansion(false)
        }}
      />
    </div>
  )
}
