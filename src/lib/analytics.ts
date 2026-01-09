import type { Token, BuildPage, TokenAnalytics, PageAnalytics } from '@/types'

export function initializeTokenAnalytics(): TokenAnalytics {
  return {
    views: 0,
    searches: 0,
    promotions: 0,
    shares: 0
  }
}

export function initializePageAnalytics(): PageAnalytics {
  return {
    views: 0,
    edits: 0,
    shares: 0,
    uniqueVisitors: 0
  }
}

export function trackTokenView(token: Token): Token {
  const analytics = token.analytics || initializeTokenAnalytics()
  
  return {
    ...token,
    analytics: {
      ...analytics,
      views: analytics.views + 1,
      lastViewed: Date.now()
    }
  }
}

export function trackPageView(page: BuildPage): BuildPage {
  const analytics = page.analytics || initializePageAnalytics()
  
  return {
    ...page,
    analytics: {
      ...analytics,
      views: analytics.views + 1,
      lastViewed: Date.now()
    }
  }
}

export function trackTokenPromotion(token: Token): Token {
  const analytics = token.analytics || initializeTokenAnalytics()
  
  return {
    ...token,
    analytics: {
      ...analytics,
      promotions: analytics.promotions + 1
    }
  }
}

export function trackTokenShare(token: Token): Token {
  const analytics = token.analytics || initializeTokenAnalytics()
  
  return {
    ...token,
    analytics: {
      ...analytics,
      shares: analytics.shares + 1
    }
  }
}

export function trackPageShare(page: BuildPage): BuildPage {
  const analytics = page.analytics || initializePageAnalytics()
  
  return {
    ...page,
    analytics: {
      ...analytics,
      shares: analytics.shares + 1
    }
  }
}

export function trackPageEdit(page: BuildPage): BuildPage {
  const analytics = page.analytics || initializePageAnalytics()
  
  return {
    ...page,
    analytics: {
      ...analytics,
      edits: analytics.edits + 1
    }
  }
}

export function trackTokenSearch(token: Token): Token {
  const analytics = token.analytics || initializeTokenAnalytics()
  
  return {
    ...token,
    analytics: {
      ...analytics,
      searches: analytics.searches + 1
    }
  }
}

export function calculateEngagementScore(views: number, shares: number, otherMetric: number = 0): number {
  return views + (shares * 5) + (otherMetric * 2)
}

export function formatAnalyticNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}
