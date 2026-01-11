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
  GithubLogo,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { publishPageToGitHub, hasGitHubToken } from '@/lib/githubPublisher'
import { trackPageView, trackPageShare, initializePageAnalytics } from '@/lib/analytics'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { GitHubTokenDialog } from '@/components/GitHubTokenDialog'
import type { BuildPage } from '@/types'

interface BuiltPageViewProps {
  page: BuildPage
  allPages?: BuildPage[]
  onBack: () => void
  onPageUpdate: (updatedPage: BuildPage) => void
  onExpandToken?: (tokenId: string) => void
  onNavigateToPage?: (page: BuildPage) => void
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function BuiltPageView({ page, allPages = [], onBack, onPageUpdate, onExpandToken, onNavigateToPage }: BuiltPageViewProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  const isValidPage = page && page.id

  const relatedPages = isValidPage ? allPages.filter(p => 
    p && p.id && p.tokenId === page.tokenId && p.id !== page.id
  ) : []

  useEffect(() => {
    if (!isValidPage) return

    if (!page.analytics) {
      const updatedPage = {
        ...page,
        analytics: initializePageAnalytics()
      }
      onPageUpdate(trackPageView(updatedPage))
    } else {
      onPageUpdate(trackPageView(page))
    }

    hasGitHubToken().then(setHasToken)
  }, [page.id])

  if (!isValidPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Page Not Found</h2>
          <p className="text-muted-foreground">
            The requested page could not be loaded
          </p>
          <Button onClick={onBack} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <ArrowLeft className="mr-2" size={20} />
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

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
    const tokenExists = await hasGitHubToken()
    
    if (!tokenExists) {
      setShowTokenDialog(true)
      return
    }

    setIsPublishing(true)
    const toastId = toast.loading('Publishing to infinity-spark...')

    try {
      const result = await publishPageToGitHub(page)

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
        toast.success('Page published to GitHub!', {
          description: 'GitHub Pages will build in 1-3 minutes'
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

  const handleTokenSuccess = () => {
    setHasToken(true)
    toast.success('GitHub authentication configured!')
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

          {relatedPages.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NavigationArrow size={24} className="text-accent" />
                  Related Pages from Same Token
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {relatedPages.length} {relatedPages.length === 1 ? 'page' : 'pages'} connected to this token
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {relatedPages.map((relatedPage) => (
                    <Card
                      key={relatedPage.id}
                      className="bg-card/30 border-border/50 hover:border-accent/30 transition-all cursor-pointer"
                      onClick={() => {
                        console.log('[INFINITY] BuiltPageView: Navigating to related page', relatedPage.id, relatedPage.title)
                        if (onNavigateToPage && relatedPage && relatedPage.id) {
                          onNavigateToPage(relatedPage)
                        }
                      }}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold truncate">{relatedPage.title}</h4>
                              {relatedPage.published ? (
                                <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 flex-shrink-0">
                                  <CheckCircle size={12} className="mr-1" weight="fill" />
                                  Live
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="flex-shrink-0">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {relatedPage.content.substring(0, 120)}...
                            </p>
                            {relatedPage.url && relatedPage.published && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(relatedPage.url, '_blank')
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7 text-accent hover:text-accent"
                              >
                                <LinkIcon className="mr-1" size={12} />
                                Open Live Page
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      <strong className="text-foreground">GitHub Publishing:</strong> Your page will be committed directly to the infinity-spark repository using the GitHub API. 
                      You'll need to provide a GitHub token once for secure authentication.
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
                        <p className="font-semibold">Authenticate with GitHub</p>
                        <p className="text-xs text-muted-foreground">Provide token once (stored securely)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        2
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Commit to Repository</p>
                        <p className="text-xs text-muted-foreground">Files pushed to c13b0/infinity-spark</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        3
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Live on GitHub Pages</p>
                        <p className="text-xs text-muted-foreground">Automatically deployed in 1-3 minutes</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg h-auto font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <GithubLogo className="mr-3" size={24} weight="fill" />
                    {isPublishing ? 'Publishing...' : hasToken ? 'Publish to GitHub' : 'Setup & Publish'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    {hasToken ? 'Commit directly to infinity-spark repository' : 'First-time setup required'}
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
                    <p className="text-sm font-semibold text-accent mb-2">✨ GitHub Pages Building</p>
                    <p className="text-sm text-foreground/90">
                      Your page was committed to the repository. GitHub Pages is building and will deploy in 1-3 minutes.
                    </p>
                  </div>

                  <div className="bg-card/70 backdrop-blur-sm rounded-xl p-5 border border-muted space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold text-muted-foreground">Building on GitHub Pages</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Page will be live at:</span>
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
              How GitHub Publishing Works
            </DialogTitle>
            <DialogDescription className="text-base">
              Direct publishing to infinity-spark using GitHub API
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <p className="font-semibold text-accent mb-2">✨ Direct GitHub Integration</p>
              <p className="text-foreground/90">
                Your pages are <strong>committed directly to the infinity-spark repository</strong> using the GitHub API. 
                No manual work required - just authenticate once and publish!
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
                    <p className="font-semibold">Authenticate with GitHub (Once)</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Provide a GitHub token with repository write access (stored securely)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Click Publish</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Your page HTML is generated and committed to the repo via GitHub API
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">GitHub Pages Builds</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Automatic deployment happens in 1-3 minutes after commit
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
                      Page is hosted free at c13b0.github.io/infinity-spark/pages/[slug]/
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-bold text-lg mb-3">🎯 Key Benefits</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Direct API integration - no manual commits</li>
                <li>Instant publishing - live in 1-3 minutes</li>
                <li>Free hosting on GitHub Pages</li>
                <li>Your own permanent URL</li>
                <li>Token stored securely in Spark KV</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-bold text-lg mb-3">🔐 GitHub Token Setup</h3>
              <p className="text-muted-foreground mb-2">
                You'll need a GitHub Personal Access Token with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Repository: <strong>c13b0/infinity-spark</strong></li>
                <li>Permission: <strong>Contents (Read and Write)</strong></li>
                <li>Token is stored securely in your Spark KV storage</li>
                <li>Never hardcoded or exposed in code</li>
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-xs text-center">
                🚀 GitHub API publishing gives you instant, automated deployment!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <GitHubTokenDialog
        open={showTokenDialog}
        onClose={() => setShowTokenDialog(false)}
        onSuccess={handleTokenSuccess}
      />
    </div>
  )
}
