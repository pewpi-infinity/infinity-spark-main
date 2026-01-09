import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, ShareNetwork, PencilSimple, TrendUp, Clock, Users } from '@phosphor-icons/react'
import type { TokenAnalytics, PageAnalytics } from '@/types'
import { formatAnalyticNumber, calculateEngagementScore } from '@/lib/analytics'

interface AnalyticsDashboardProps {
  analytics: TokenAnalytics | PageAnalytics | undefined
  type: 'token' | 'page'
  compact?: boolean
}

export function AnalyticsDashboard({ analytics, type, compact = false }: AnalyticsDashboardProps) {
  if (!analytics) return null

  const isTokenAnalytics = (a: TokenAnalytics | PageAnalytics): a is TokenAnalytics => {
    return 'searches' in a
  }

  const isPageAnalytics = (a: TokenAnalytics | PageAnalytics): a is PageAnalytics => {
    return 'edits' in a
  }

  const tokenAnalytics = isTokenAnalytics(analytics) ? analytics : undefined
  const pageAnalytics = isPageAnalytics(analytics) ? analytics : undefined

  const engagementScore = calculateEngagementScore(
    analytics.views,
    analytics.shares,
    tokenAnalytics?.promotions || pageAnalytics?.edits || 0
  )

  const lastViewedText = analytics.lastViewed
    ? new Date(analytics.lastViewed).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Never'

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Eye size={16} className="text-muted-foreground" />
          <span className="font-semibold">{formatAnalyticNumber(analytics.views)}</span>
          <span className="text-muted-foreground">views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShareNetwork size={16} className="text-muted-foreground" />
          <span className="font-semibold">{formatAnalyticNumber(analytics.shares)}</span>
          <span className="text-muted-foreground">shares</span>
        </div>
        {tokenAnalytics && (
          <div className="flex items-center gap-1.5">
            <TrendUp size={16} className="text-muted-foreground" />
            <span className="font-semibold">{formatAnalyticNumber(tokenAnalytics.promotions)}</span>
            <span className="text-muted-foreground">promotions</span>
          </div>
        )}
        {pageAnalytics && (
          <>
            <div className="flex items-center gap-1.5">
              <PencilSimple size={16} className="text-muted-foreground" />
              <span className="font-semibold">{formatAnalyticNumber(pageAnalytics.edits)}</span>
              <span className="text-muted-foreground">edits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-muted-foreground" />
              <span className="font-semibold">{formatAnalyticNumber(pageAnalytics.uniqueVisitors)}</span>
              <span className="text-muted-foreground">visitors</span>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendUp size={20} className="text-accent" weight="fill" />
          Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard
            icon={<Eye size={24} weight="fill" />}
            label="Total Views"
            value={formatAnalyticNumber(analytics.views)}
            color="text-blue-400"
          />
          
          <MetricCard
            icon={<ShareNetwork size={24} weight="fill" />}
            label="Shares"
            value={formatAnalyticNumber(analytics.shares)}
            color="text-green-400"
          />

          {tokenAnalytics && (
            <>
              <MetricCard
                icon={<TrendUp size={24} weight="fill" />}
                label="Promotions"
                value={formatAnalyticNumber(tokenAnalytics.promotions)}
                color="text-purple-400"
              />
            </>
          )}

          {pageAnalytics && (
            <>
              <MetricCard
                icon={<PencilSimple size={24} weight="fill" />}
                label="Edits"
                value={formatAnalyticNumber(pageAnalytics.edits)}
                color="text-orange-400"
              />
              
              <MetricCard
                icon={<Users size={24} weight="fill" />}
                label="Unique Visitors"
                value={formatAnalyticNumber(pageAnalytics.uniqueVisitors)}
                color="text-pink-400"
              />
            </>
          )}

          <MetricCard
            icon={<Clock size={24} weight="fill" />}
            label="Last Viewed"
            value={lastViewedText}
            color="text-cyan-400"
            valueClass="text-xs"
          />
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Engagement Score</p>
              <p className="text-3xl font-bold text-accent">{formatAnalyticNumber(engagementScore)}</p>
            </div>
            <Badge className="bg-accent/20 text-accent border-accent/30" variant="outline">
              {type === 'token' ? 'Token' : 'Page'} Metrics
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Calculated from views, shares, and {type === 'token' ? 'promotions' : 'edits'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
  valueClass?: string
}

function MetricCard({ icon, label, value, color, valueClass = '' }: MetricCardProps) {
  return (
    <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
      <div className={`mb-2 ${color}`}>
        {icon}
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueClass || ''}`}>{value}</p>
    </div>
  )
}
