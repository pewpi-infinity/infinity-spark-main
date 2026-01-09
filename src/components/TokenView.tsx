import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Sparkle, CheckCircle, Link as LinkIcon, Rocket } from '@phosphor-icons/react'
import type { Token, BuildPage } from '@/types'
import { formatTimestamp } from '@/lib/search'
import { toast } from 'sonner'

interface TokenViewProps {
  token: Token
  pages: BuildPage[]
  onBack: () => void
  onViewPage?: (page: BuildPage) => void
}

export function TokenView({ token, pages, onBack, onViewPage }: TokenViewProps) {
  const associatedPage = token.pageId 
    ? pages.find(p => p.id === token.pageId) 
    : undefined

  const handleViewLive = () => {
    if (associatedPage?.url) {
      window.open(associatedPage.url, '_blank')
    }
  }

  const handleCopyUrl = () => {
    if (associatedPage?.url) {
      navigator.clipboard.writeText(associatedPage.url)
      toast.success('URL copied to clipboard')
    }
  }

  const handleViewPageDetails = () => {
    if (associatedPage && onViewPage) {
      onViewPage(associatedPage)
    }
  }

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
                  {associatedPage?.published && (
                    <Badge variant="outline" className="mb-2 ml-2 bg-accent/20 text-accent border-accent/30">
                      <Rocket size={14} className="mr-1" weight="fill" />
                      Published
                    </Badge>
                  )}
                  <CardTitle className="text-3xl mt-2">{token.query}</CardTitle>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="font-mono">{token.id}</div>
              <Separator orientation="vertical" className="h-4" />
              <div>{formatTimestamp(token.timestamp)}</div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Content</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {token.content}
                </p>
              </div>
            </div>

            {token.promoted && token.pageId && associatedPage && (
              <>
                {associatedPage.published && associatedPage.url ? (
                  <Card className="bg-accent/10 border-accent/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-accent">
                          <Rocket size={24} weight="fill" />
                          <h3 className="text-lg font-semibold">Live Page Available</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This token has been published as a live page with a permanent URL.
                        </p>
                        <div className="bg-card/50 rounded-lg p-3 font-mono text-sm break-all border border-accent/20">
                          {associatedPage.url}
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <Button
                            onClick={handleViewLive}
                            className="flex-1 min-w-[140px] bg-accent hover:bg-accent/90 text-accent-foreground"
                          >
                            <LinkIcon className="mr-2" size={18} />
                            View Live Page
                          </Button>
                          <Button
                            onClick={handleCopyUrl}
                            variant="outline"
                            className="flex-1 min-w-[140px]"
                          >
                            Copy URL
                          </Button>
                          {onViewPage && (
                            <Button
                              onClick={handleViewPageDetails}
                              variant="secondary"
                              className="flex-1 min-w-[140px]"
                            >
                              View Page Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="p-4 bg-muted/20 border border-muted rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-accent mt-0.5" weight="fill" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Promoted to Page</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Page ID: <span className="font-mono">{token.pageId}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Page is in draft mode. Publish it to get a live URL.
                        </p>
                        {onViewPage && (
                          <Button
                            onClick={handleViewPageDetails}
                            variant="outline"
                            size="sm"
                            className="mt-3"
                          >
                            View Page Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
