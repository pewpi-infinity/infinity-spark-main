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
import { getSiteConfig } from '@/lib/siteConfig'
import { trackPageView, trackPageShare, initializePageAnalytics } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { PageFilesView } from '@/components/PageFilesView'
import type { BuildPage } from '@/types'

interface BuiltPageViewProps {
  page: BuildPage
  onBack: () => void
  onPageUpdate: (updatedPage: BuildPage) => void
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function BuiltPageView({ page, onBack, onPageUpdate }: BuiltPageViewProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [previewPath, setPreviewPath] = useState('')

  useEffect(() => {
    async function loadPreviewPath() {
      const config = await getSiteConfig()
      const slug = generateSlug(page.title)
      setPreviewPath(`/${config.siteName}/pages/${slug}/index.html`)
    }
    loadPreviewPath()
  }, [page.title])

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

  const handleRetryVerification = async () => {
    if (!page.url) return
    
    setIsVerifying(true)
    toast.loading('Checking page status...')
    
    try {
      const response = await fetch(page.url, { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      
      toast.dismiss()
      
      if (response.ok) {
        const updatedPage: BuildPage = {
          ...page,
          published: true,
          publishStatus: 'published'
        }
        onPageUpdate(updatedPage)
        toast.success('Page is now live!')
      } else {
        toast.info('Page is still building', {
          description: 'Please wait a bit longer and try again'
        })
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Unable to verify page status')
    } finally {
      setIsVerifying(false)
    }
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

          <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/30">
            <CardContent className="pt-6">
              {!page.published && page.publishStatus !== 'awaiting-build' && (
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                      <Rocket size={32} className="text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold">Ready to Publish</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Transform this page into a permanent, shareable website with its own URL
                    </p>
                  </div>
                  
                  <div className="bg-card/70 backdrop-blur-sm rounded-xl p-5 border border-accent/20 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        1
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">File Structure Created</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{previewPath || 'Loading...'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        2
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">GitHub Pages Hosting</p>
                        <p className="text-xs text-muted-foreground">Live URL generated and verified</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        3
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Search Engine Ready</p>
                        <p className="text-xs text-muted-foreground">Metadata and tags optimized</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg h-auto font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Rocket className="mr-3" size={24} />
                    {isPublishing ? 'Publishing...' : 'Publish Live Now'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    Publishing may take 2-3 minutes for GitHub Pages to build
                  </p>
                </div>
              )}

              {page.publishStatus === 'awaiting-build' && page.url && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/20 mb-4">
                      <div className="animate-spin h-10 w-10 border-4 border-accent border-t-transparent rounded-full"></div>
                    </div>
                    <h3 className="text-2xl font-bold">Publishing in Progress</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your page is being built on GitHub Pages. This typically completes in 90 seconds to 3 minutes.
                    </p>
                  </div>

                  <div className="bg-card/70 backdrop-blur-sm rounded-xl p-5 border border-muted space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold text-accent">Building...</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Page URL:</span>
                        </div>
                        <div className="bg-card/50 rounded-lg p-3 font-mono text-xs break-all">
                          {page.url}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleRetryVerification}
                        disabled={isVerifying}
                        variant="outline"
                        className="flex-1"
                      >
                        {isVerifying ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                            Checking...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2" size={16} />
                            Check if Live
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCopyUrl}
                        variant="ghost"
                        size="icon"
                      >
                        <LinkIcon size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <p className="text-sm text-center text-muted-foreground">
                      💡 <strong>Tip:</strong> You can leave this page. The verification happens automatically in the background.
                    </p>
                  </div>
                </div>
              )}

              {page.published && page.url && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                      <CheckCircle size={36} className="text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-accent">Live & Published!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your page is now live on the web. Share it with the world!
                    </p>
                  </div>

                  <div className="bg-card/70 backdrop-blur-sm rounded-xl p-5 border border-accent/30 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold text-accent flex items-center gap-1">
                          <CheckCircle size={16} />
                          Verified Live
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Live URL:</span>
                        </div>
                        <div className="bg-card/50 rounded-lg p-3 font-mono text-xs break-all border border-accent/20">
                          {page.url}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleViewLive}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                      >
                        <LinkIcon className="mr-2" size={18} />
                        View Live
                      </Button>
                      <Button
                        onClick={handleCopyUrl}
                        variant="outline"
                        className="font-semibold"
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="flex-1"
                    >
                      <ShareNetwork className="mr-2" size={18} />
                      Share Page
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
