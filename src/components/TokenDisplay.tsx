import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sparkle } from '@phosphor-icons/react'
import { formatTimestamp } from '@/lib/search'
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
          
          {token.promoted && (
            <Badge className="mt-2 bg-accent/20 text-accent border-accent/30" variant="outline">
              Promoted to Page
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}
