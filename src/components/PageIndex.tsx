import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, ArrowLeft } from '@phosphor-icons/react'
import type { BuildPage } from '@/types'

interface PageIndexProps {
  pages: BuildPage[]
  onViewPage: (page: BuildPage) => void
  onBack: () => void
}

export function PageIndex({ pages, onViewPage, onBack }: PageIndexProps) {
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
              {pages.length} {pages.length === 1 ? 'page' : 'pages'} published
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2" size={20} />
            New Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">{page.title}</CardTitle>
                <div className="flex gap-2 flex-wrap mt-2">
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
                <div className="text-xs text-muted-foreground font-mono">
                  {new Date(page.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <Button
                  onClick={() => onViewPage(page)}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Eye className="mr-2" size={18} />
                  View Page
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
