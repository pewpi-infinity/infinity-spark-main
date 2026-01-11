import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, ArrowLeft, MagnifyingGlassPlus, Link as LinkIcon, CheckCircle } from '@phosphor-icons/react'
import { formatAnalyticNumber } from '@/lib/analytics'
import type { BuildPage } from '@/types'

interface PageIndexProps {
  pages: BuildPage[]
  onViewPage: (page: BuildPage) => void
  onBack: () => void
  onSearchArchives?: () => void
}

export function PageIndex({ pages, onViewPage, onBack, onSearchArchives }: PageIndexProps) {
  const publishedCount = pages.filter(p => p.published).length

  if (pages.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">No Pages Yet</h2>
          <p className="text-muted-foreground">
            Start by searching and promoting results to pages
          </p>
          <Button onClick={onBack} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <ArrowLeft className="mr-2" size={20} />
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Pages</h1>
            <p className="text-muted-foreground">
              {pages.length} {pages.length === 1 ? 'page' : 'pages'} total
              {publishedCount > 0 && ` • ${publishedCount} published`}
            </p>
          </div>
          <div className="flex gap-2">
            {onSearchArchives && (
              <Button
                variant="outline"
                onClick={onSearchArchives}
              >
                <MagnifyingGlassPlus className="mr-2" size={20} />
                Search All
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2" size={20} />
              New Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl line-clamp-2 flex-1">{page.title}</CardTitle>
                  {page.published && (
                    <Badge 
                      variant="outline"
                      className="bg-accent/20 text-accent border-accent/30 ml-2 shrink-0"
                    >
                      <CheckCircle className="mr-1" size={12} />
                      Live
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {page.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {page.content}
                </p>
                
                {page.analytics && page.analytics.views > 0 && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{formatAnalyticNumber(page.analytics.views)} views</span>
                    </div>
                    {page.analytics.uniqueVisitors > 0 && (
                      <div>
                        {formatAnalyticNumber(page.analytics.uniqueVisitors)} visitors
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground font-mono">
                  {new Date(page.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      console.log('[INFINITY] PageIndex: Viewing page', page.id, page.title)
                      if (page && page.id) {
                        onViewPage(page)
                      }
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="mr-2" size={18} />
                    View
                  </Button>
                  {page.published && page.url && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(page.url, '_blank')
                      }}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <LinkIcon className="mr-2" size={18} />
                      Live
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
