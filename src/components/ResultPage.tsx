import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TokenDisplay } from '@/components/TokenDisplay'
import { ArrowLeft, PlusCircle } from '@phosphor-icons/react'
import type { Token, SearchResult } from '@/types'

interface ResultPageProps {
  result: SearchResult
  token: Token
  onBack: () => void
  onPromote: () => void
}

export function ResultPage({ result, token, onBack, onPromote }: ResultPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Search
        </Button>

        <div className="space-y-6">
          <TokenDisplay token={token} animate={true} />

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl">{result.query}</CardTitle>
              <div className="flex gap-2 mt-3">
                {result.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {result.content}
                </p>
              </div>

              <Separator className="my-6" />

              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  ANALYSIS
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {result.analysis}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/20 border-accent/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">
                  Do you want to build this into a page?
                </h3>
                <p className="text-muted-foreground">
                  Convert this result into a permanent, customizable page with additional features
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={onBack}
                  >
                    Leave as is
                  </Button>
                  <Button
                    onClick={onPromote}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <PlusCircle className="mr-2" size={20} />
                    Promote to Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
