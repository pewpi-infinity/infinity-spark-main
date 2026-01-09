import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  ChartBar,
  Image,
  SpeakerHigh,
  VideoCamera,
  Files,
  GridFour,
  NavigationArrow,
  CurrencyDollar,
  Rocket,
  Link as LinkIcon,
  CheckCircle,
  ShareNetwork,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { publishPage } from '@/lib/publisher'
import { trackPageView, trackPageShare, initializePageAnalytics } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { PageFilesView } from '@/components/PageFilesView'
import type { BuildPage } from '@/types'

interface BuiltPageViewProps {
  page: BuildPage
  onBack: () => void
  onPageUpdate: (updatedPage: BuildPage) => void
}

export function BuiltPageView({ page, onBack, onPageUpdate }: BuiltPageViewProps) {
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (!page.analytics) {
      const updatedPage = {
        ...page,
        analytics: initializePageAnalytics()
      }
      onPageUpdate(trackPageView(updatedPage))
    } else {
      onPageUpdate(trackPageView(page))
    }
  }, [])

  const featureIcons = {
    charts: <ChartBar size={20} />,
    images: <Image size={20} />,
    audio: <SpeakerHigh size={20} />,
    video: <VideoCamera size={20} />,
    files: <Files size={20} />,
    widgets: <GridFour size={20} />,
    navigation: <NavigationArrow size={20} />,
    monetization: <CurrencyDollar size={20} />,
  }

  const enabledFeatures = Object.entries(page.features)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key as keyof typeof featureIcons)

  const handlePublish = async () => {
    setIsPublishing(true)
    toast.loading('Publishing page...')

    try {
      const result = await publishPage(page)

      if (result.success && result.url) {
        const publishStatus = result.status === 'published' ? 'published' : 'awaiting-build'
        
        const updatedPage: BuildPage = {
          ...page,
          published: result.status === 'published',
          publishStatus,
          url: result.url,
          publishedAt: Date.now(),
        }

        onPageUpdate(updatedPage)

        toast.dismiss()
        
        if (result.status === 'published') {
          toast.success('Page published successfully!')
        } else {
          toast.success('Page submitted for publishing', {
            description: 'Awaiting GitHub Pages build (may take 2-3 minutes)'
          })
        }
      } else {
        toast.dismiss()
        toast.error(result.error || 'Failed to publish page')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to publish page')
      console.error(error)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleViewLive = () => {
    if (page.url) {
      window.open(page.url, '_blank')
    }
  }

  const handleCopyUrl = () => {
    if (page.url) {
      navigator.clipboard.writeText(page.url)
      toast.success('URL copied to clipboard')
    }
  }

  const handleShare = async () => {
    const shareText = page.url 
      ? `${page.title}\n\n${page.url}`
      : `${page.title}\n\nPage ID: ${page.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: page.title,
          text: shareText,
          url: page.url
        })
        onPageUpdate(trackPageShare(page))
        toast.success('Page shared!')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyShare()
        }
      }
    } else {
      handleCopyShare()
    }
  }

  const handleCopyShare = () => {
    const shareText = page.url 
      ? `${page.title}\n\n${page.url}`
      : `${page.title}\n\nPage ID: ${page.id}`
    navigator.clipboard.writeText(shareText)
    onPageUpdate(trackPageShare(page))
    toast.success('Page info copied to clipboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Search
        </Button>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-accent/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-4xl">{page.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {page.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="icon"
                  >
                    <ShareNetwork size={20} />
                  </Button>
                  {page.publishStatus === 'awaiting-build' ? (
                    <Badge 
                      className="bg-muted/20 text-muted-foreground border-muted"
                      variant="outline"
                    >
                      ⚠️ Awaiting Pages Build
                    </Badge>
                  ) : page.published ? (
                    <Badge 
                      className="bg-accent/20 text-accent border-accent/30"
                      variant="outline"
                    >
                      <CheckCircle className="mr-1" size={16} />
                      Published
                    </Badge>
                  ) : (
                    <Badge 
                      className="bg-muted/20 text-muted-foreground border-muted"
                      variant="outline"
                    >
                      ⚠️ Draft
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {enabledFeatures.length > 0 && (
                <>
                  <div className="flex gap-2 flex-wrap mb-6">
                    {enabledFeatures.map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="bg-primary/20 border-primary/30"
                      >
                        <span className="mr-1">{featureIcons[feature]}</span>
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </Badge>
                    ))}
                  </div>
                  <Separator className="mb-6" />
                </>
              )}

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {page.content}
                </p>
              </div>

              {page.features.monetization && (
                <>
                  <Separator className="my-8" />
                  <div className="bg-muted/20 rounded-lg p-6 border border-muted">
                    <div className="text-center text-sm text-muted-foreground">
                      <CurrencyDollar className="inline mb-1" size={16} />
                      {' '}Contextual advertising enabled
                    </div>
                  </div>
                </>
              )}

              {page.features.charts && (
                <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <ChartBar size={24} />
                    Data Visualization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Chart components would be rendered here based on page content
                  </p>
                </div>
              )}

              {page.features.images && (
                <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Image size={24} />
                    Image Gallery
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Image components would be rendered here based on page content
                  </p>
                </div>
              )}

              {page.features.navigation && (
                <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <NavigationArrow size={24} />
                    Navigation Structure
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Multi-section navigation would be available here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {page.analytics && (
            <AnalyticsDashboard analytics={page.analytics} type="page" />
          )}

          {page.published && (
            <PageFilesView page={page} />
          )}

          {!page.published && page.publishStatus !== 'awaiting-build' && (
            <Card className="bg-accent/10 border-accent/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Ready to Publish?</h3>
                  <p className="text-muted-foreground">
                    Publishing will create a permanent HTML file at /pages/{page.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}/index.html with a live URL that you can share.
                  </p>
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Rocket className="mr-2" size={20} />
                    {isPublishing ? 'Publishing...' : 'Publish Page'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {page.publishStatus === 'awaiting-build' && page.url && (
            <Card className="bg-muted/20 border-muted">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin h-5 w-5 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
                    <h3 className="text-xl font-semibold">Awaiting GitHub Pages Build</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your page has been submitted for publishing. GitHub Pages is currently building your site. This typically takes 2-3 minutes.
                  </p>
                  <div className="bg-card/50 rounded-lg p-4 font-mono text-sm break-all">
                    {page.url}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The page will be automatically marked as published once the build completes and the URL is verified.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {page.published && page.url && (
            <Card className="bg-accent/10 border-accent/30">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-accent">
                    <CheckCircle size={24} />
                    <h3 className="text-xl font-semibold">Live Page Published</h3>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4 font-mono text-sm break-all">
                    {page.url}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleViewLive}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <LinkIcon className="mr-2" size={20} />
                      View Live Page
                    </Button>
                    <Button
                      onClick={handleCopyUrl}
                      variant="outline"
                      className="flex-1"
                    >
                      Copy URL
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/20">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-mono">Page ID: {page.id}</p>
                <p className="font-mono">Token: {page.tokenId}</p>
                <p>
                  Created: {new Date(page.timestamp).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {page.publishedAt && (
                  <p>
                    Published: {new Date(page.publishedAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
