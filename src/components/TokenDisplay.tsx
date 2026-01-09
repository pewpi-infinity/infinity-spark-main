import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sparkle, Eye } from '@phosphor-icons/react'
import { formatTimestamp } from '@/lib/search'
import { formatAnalyticNumber } from '@/lib/analytics'
import type { Token } from '@/types'

interface TokenDisplayProps {
  token: Token
  animate?: boolean
}

export function TokenDisplay({ token, animate = false }: TokenDisplayProps) {
  return (
    <Card 
      className={`p-4 bg-primary/40 border-accent/30 ${animate ? 'token-mint' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 p-2 rounded-lg bg-accent/20">
          <Sparkle className="text-accent" size={24} weight="fill" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant="outline" 
              className="font-mono text-xs bg-accent/10 text-accent border-accent/30"
            >
              {token.id}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(token.timestamp)}
            </span>
          </div>
          
          <p className="text-sm text-foreground/80 line-clamp-2">
            {token.query}
          </p>
          
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {token.promoted && (
              <Badge className="bg-accent/20 text-accent border-accent/30" variant="outline">
                Promoted to Page
              </Badge>
            )}
            {token.analytics && token.analytics.views > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye size={14} />
                <span>{formatAnalyticNumber(token.analytics.views)} views</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
