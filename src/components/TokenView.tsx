import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Sparkle, CheckCircle } from '@phosphor-icons/react'
import type { Token } from '@/types'
import { formatTimestamp } from '@/lib/search'

interface TokenViewProps {
  token: Token
  onBack: () => void
}

export function TokenView({ token, onBack }: TokenViewProps) {
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

            {token.promoted && token.pageId && (
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This token has been promoted to a page
                </p>
                <p className="text-xs font-mono text-accent mt-1">
                  Page ID: {token.pageId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
