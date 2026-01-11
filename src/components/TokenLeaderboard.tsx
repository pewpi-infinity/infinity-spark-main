import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Sparkle, TrendUp, Eye, ShareNetwork } from '@phosphor-icons/react'
import type { Token, BuildPage } from '@/types'

interface TokenLeaderboardProps {
  tokens: Token[]
  pages: BuildPage[]
  onTokenClick?: (token: Token) => void
}

interface LeaderboardEntry {
  token: Token
  value: number
  pageCount: number
  totalViews: number
  rank: number
}

export function TokenLeaderboard({ tokens, pages, onTokenClick }: TokenLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const leaderboardEntries: LeaderboardEntry[] = tokens
      .map(token => {
        const associatedPages = pages.filter(p => 
          p.tokenId === token.id || (token.pageIds && token.pageIds.includes(p.id))
        )
        
        const totalViews = (token.analytics?.views || 0) + 
          associatedPages.reduce((sum, p) => sum + (p.analytics?.views || 0), 0)
        
        return {
          token,
          value: associatedPages.length * 100,
          pageCount: associatedPages.length,
          totalViews,
          rank: 0
        }
      })
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value
        if (b.totalViews !== a.totalViews) return b.totalViews - a.totalViews
        return b.token.timestamp - a.token.timestamp
      })
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    setEntries(leaderboardEntries)
  }, [tokens, pages])

  const displayedEntries = showAll ? entries : entries.slice(0, 10)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={24} weight="fill" className="text-yellow-400" />
    if (rank === 2) return <Trophy size={24} weight="fill" className="text-gray-400" />
    if (rank === 3) return <Trophy size={24} weight="fill" className="text-amber-600" />
    return <span className="text-muted-foreground font-bold">#{rank}</span>
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy size={24} className="text-accent" weight="bold" />
          Token Leaderboard
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Top tokens ranked by value and engagement
        </p>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkle size={48} className="mx-auto mb-4 opacity-30" />
            <p>No tokens yet. Create your first search to begin!</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayedEntries.map((entry) => (
                <div
                  key={entry.token.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:border-accent/50 hover:bg-accent/5 ${
                    entry.rank <= 3 
                      ? 'bg-gradient-to-r from-accent/10 to-primary/5 border-accent/30' 
                      : 'bg-card/30 border-border/50'
                  }`}
                  onClick={() => {
                    if (entry.token && entry.token.id && onTokenClick) {
                      onTokenClick(entry.token)
                    }
                  }}
                >
                  <div className="flex-shrink-0 w-12 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold truncate">{entry.token.query}</h4>
                      {entry.token.promoted && (
                        <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 flex-shrink-0">
                          Promoted
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <TrendUp size={14} />
                        <span>{entry.value} pts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkle size={14} />
                        <span>{entry.pageCount} {entry.pageCount === 1 ? 'page' : 'pages'}</span>
                      </div>
                      {entry.totalViews > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{entry.totalViews} {entry.totalViews === 1 ? 'view' : 'views'}</span>
                        </div>
                      )}
                      {entry.token.analytics?.shares && entry.token.analytics.shares > 0 && (
                        <div className="flex items-center gap-1">
                          <ShareNetwork size={14} />
                          <span>{entry.token.analytics.shares} {entry.token.analytics.shares === 1 ? 'share' : 'shares'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-accent">{entry.value}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>

            {entries.length > 10 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="border-accent/30"
                >
                  {showAll ? 'Show Less' : `Show All (${entries.length})`}
                </Button>
              </div>
            )}

            <div className="mt-6 p-4 bg-primary/10 border border-accent/30 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">How Token Value Works</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Each page connected to a token adds 100 points</li>
                <li>• Views and engagement boost your ranking</li>
                <li>• Expand tokens into multiple pages to increase value</li>
                <li>• Published pages contribute more than drafts</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
