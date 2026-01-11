import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  Question,
  Info,
  Plus,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { publishToInfinitySpark, getPublishedPageData } from '@/lib/infinityPublisher'
import { trackPageView, trackPageShare, initializePageAnalytics } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import type { BuildPage } from '@/types'

interface BuiltPageViewProps {
  page: BuildPage
  onBack: () => void
  onPageUpdate: (updatedPage: BuildPage) => void
  onExpandToken?: (tokenId: string) => void
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function BuiltPageView({ page, onBack, onPageUpdate, onExpandToken }: BuiltPageViewProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)

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
    const toastId = toast.loading('Publishing to INFINITY...')

    try {
      const result = await publishToInfinitySpark(page)

      if (result.success && result.url) {
        const updatedPage: BuildPage = {
          ...page,
          published: false,
          publishStatus: 'awaiting-build',
          url: result.url,
          publishedAt: Date.now(),
        }

        onPageUpdate(updatedPage)

        toast.dismiss(toastId)
        toast.success('Page submitted successfully!', {
          description: 'Owner will deploy it to infinity-spark repo shortly'
        })
      } else {
        toast.dismiss(toastId)
        toast.error(result.error || 'Failed to publish page')
      }
    } catch (error) {
      toast.dismiss(toastId)
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
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Search
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelpDialog(true)}
            className="text-muted-foreground"
          >
            <Question className="mr-2" size={16} />
            Publishing Help
          </Button>
        </div>

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
                      Generate page files and prepare for GitHub Pages deployment
                    </p>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong className="text-foreground">One-Click Publishing:</strong> Your page data will be sent to INFINITY. 
                      The owner will deploy it to the infinity-spark repository where it will be hosted for free.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowHelpDialog(true)}
                      className="text-accent h-auto p-0"
                    >
                      Learn how this works →
                    </Button>
                  </div>
                  
                  <div className="bg-card/70 backdrop-blur-sm rounded-xl p-5 border border-accent/20 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        1
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Submit to INFINITY</p>
                        <p className="text-xs text-muted-foreground">One click sends your page data</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        2
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Owner Deploys</p>
                        <p className="text-xs text-muted-foreground">Pushed to infinity-spark repo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        3
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Live on Web</p>
                        <p className="text-xs text-muted-foreground">Hosted free at c13b0.github.io/infinity-spark</p>
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
                    {isPublishing ? 'Submitting...' : 'Publish to INFINITY'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    One-click submission - owner deploys to infinity-spark
                  </p>
                </div>
              )}

              {page.publishStatus === 'awaiting-build' && page.url && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/20 mb-4">
                      <div className="animate-spin h-10 w-10 border-4 border-accent border-t-transparent rounded-full"></div>
                    </div>
                    <h3 className="text-2xl font-bold">Submitted to INFINITY</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your page has been submitted. The owner will deploy it to the infinity-spark repository shortly.
                    </p>
                  </div>

                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <p className="text-sm font-semibold text-accent mb-2">✨ Awaiting Deployment</p>
                    <p className="text-sm text-foreground/90">
                      Your page data is stored and ready. The repository owner will push it to infinity-spark when they next deploy updates.
                    </p>
                  </div>

                  <div className="bg-card/70 backdrop-blur-sm rounded-xl p-5 border border-muted space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold text-muted-foreground">Pending Owner Deployment</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Expected URL after deployment:</span>
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
                      💡 <strong>Tip:</strong> Check back later or click "Check if Live" to see if it's been deployed.
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
                <p className="font-mono flex items-center gap-2">
                  Token: {page.tokenId}
                  {onExpandToken && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onExpandToken(page.tokenId)}
                      className="text-accent h-auto p-0 text-xs"
                    >
                      <Plus className="mr-1" size={12} />
                      Expand
                    </Button>
                  )}
                </p>
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

      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Info className="text-accent" size={28} />
              How INFINITY Publishing Works
            </DialogTitle>
            <DialogDescription className="text-base">
              Simple one-click publishing to infinity-spark
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <p className="font-semibold text-accent mb-2">✨ No GitHub Knowledge Required</p>
              <p className="text-foreground/90">
                This is a <strong>one-click publishing system</strong>. You don't need to know about commits, repos, or GitHub Pages. 
                Just click "Publish to INFINITY" and your page will be deployed by the owner.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">📋 How It Works</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">You Click Publish</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Your page content is saved securely in the app's storage
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Owner Gets Notification</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      The infinity-spark repo owner sees your submission
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Automatic Deployment</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Owner runs a script that deploys all pending pages to c13b0.github.io/infinity-spark
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Your Page Goes Live</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Page is hosted free on GitHub Pages at your personal URL
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-bold text-lg mb-3">🎯 Key Benefits</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>No GitHub account or technical knowledge needed</li>
                <li>No manual file downloads or commits</li>
                <li>Free hosting on GitHub Pages</li>
                <li>Your own permanent URL</li>
                <li>Owner handles all the technical deployment</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-bold text-lg mb-3">⏱️ Timeline</h3>
              <p className="text-muted-foreground mb-2">
                After you click publish:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Your page data is saved instantly</li>
                <li>Owner typically deploys within 24-48 hours</li>
                <li>You'll receive your live URL at: <code className="bg-card px-1 rounded text-[10px]">c13b0.github.io/infinity-spark/[username]/[page-slug]</code></li>
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-xs text-center">
                🚀 This system removes all complexity from web publishing - just create and click!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
