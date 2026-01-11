import BrainResult from './components/BrainResult'
import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { SearchIndex } from '@/components/SearchIndex'
import { ResultPage } from '@/components/ResultPage'
import { StructureSelection, PageStructure } from '@/components/StructureSelection'
import { FeatureSelection } from '@/components/FeatureSelection'
import { BuiltPageView } from '@/components/BuiltPageView'
import { PageIndex } from '@/components/PageIndex'
import { LocalSearch } from '@/components/LocalSearch'
import { TokenView } from '@/components/TokenView'
import { SiteConfigDialog } from '@/components/SiteConfigDialog'
import { QuickStartGuide } from '@/components/QuickStartGuide'
import { DebugInfo } from '@/components/DebugInfo'
import { useSiteConfig } from '@/lib/siteConfig'
import { Toaster, toast } from 'sonner'
import { processSearch, createToken } from '@/lib/search'
import { initializeTokenAnalytics, trackTokenPromotion } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import type { Token, SearchResult, PageFeatures, BuildPage } from '@/types'

type AppView =
  | 'search'
  | 'result'
  | 'building'
  | 'page'
  | 'index'
  | 'localSearch'
  | 'tokenView'

function App() {
  const [view, setView] = useState<AppView>('search')
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null)
  const [currentToken, setCurrentToken] = useState<Token | null>(null)
  const [currentPage, setCurrentPage] = useState<BuildPage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showStructureSelection, setShowStructureSelection] = useState(false)
  const [showFeatureSelection, setShowFeatureSelection] = useState(false)
  const [selectedStructure, setSelectedStructure] = useState<PageStructure | null>(null)
  const [customPageTitle, setCustomPageTitle] = useState('')
  const [showSiteConfig, setShowSiteConfig] = useState(false)
  const [showQuickStart, setShowQuickStart] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [tokens, setTokens] = useKV<Token[]>('infinity-tokens', [])
  const [pages, setPages] = useKV<BuildPage[]>('infinity-pages', [])
  const [hasSeenQuickStart, setHasSeenQuickStart] = useKV<boolean>('has-seen-quickstart', false)
  const [siteConfig, updateSiteConfig] = useSiteConfig()

  const safeTokens = tokens || []
  const safePages = pages ? pages.filter(p => p && p.id) : []
  const safeHasSeenQuickStart = hasSeenQuickStart || false

  console.log('[INFINITY] App initialized and rendering')
  console.log('[INFINITY] View:', view, '| Tokens:', safeTokens.length, '| Pages:', safePages.length)
  console.log('[INFINITY] siteConfig loaded:', siteConfig ? 'yes' : 'loading...')

  useEffect(() => {
    try {
      if (!safeHasSeenQuickStart && safeTokens.length === 0 && safePages.length === 0) {
        const timer = setTimeout(() => setShowQuickStart(true), 800)
        return () => clearTimeout(timer)
      }
    } catch (error) {
      console.error('[INFINITY] Error in quickstart effect:', error)
      setHasError(true)
    }
  }, [safeHasSeenQuickStart, safeTokens, safePages])

  useEffect(() => {
    try {
      if (siteConfig.siteName === 'Untitled' && !showQuickStart && safeTokens.length === 0) {
        const timer = setTimeout(() => setShowSiteConfig(true), 500)
        return () => clearTimeout(timer)
      }
    } catch (error) {
      console.error('[INFINITY] Error in siteConfig effect:', error)
      setHasError(true)
    }
  }, [siteConfig, showQuickStart, safeTokens])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-destructive">Initialization Error</h1>
          <p className="text-muted-foreground mb-6">
            The application encountered an error during startup. Please refresh the page.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  const handleSearch = async (query: string) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    const toastId = toast.loading('Processing your search...')

    try {
      console.log('[INFINITY] Starting search for:', query)
      const result = await processSearch(query)
      console.log('[INFINITY] Search result received:', result)
      
      const token = createToken(query, result.content)
      token.analytics = initializeTokenAnalytics()
      console.log('[INFINITY] Token created:', token.id)

      setTokens((current) => [token, ...(current || [])])
      setCurrentResult(result)
      setCurrentToken(token)
      setView('result')

      toast.dismiss(toastId)
      toast.success('Token minted successfully!')
    } catch (error) {
      console.error('[INFINITY] Search error details:', error)
      toast.dismiss(toastId)
      toast.error(
        error instanceof Error ? error.message : 'Failed to process search'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePromote = () => setShowStructureSelection(true)
  const handleBackToSearch = () => {
    setView('search')
    setCurrentResult(null)
    setCurrentToken(null)
    setCurrentPage(null)
  }

  const handleStructureSelection = (structure: PageStructure, title: string) => {
    setSelectedStructure(structure)
    setCustomPageTitle(title)
    setShowStructureSelection(false)
    setShowFeatureSelection(true)
  }

  const handleFeatureSelection = (features: PageFeatures) => {
    if (!currentResult || !currentToken || !selectedStructure) return

    const page: BuildPage = {
      id: `PAGE-${Date.now().toString(36).toUpperCase()}`,
      tokenId: currentToken.id,
      title: customPageTitle || currentResult.query,
      content: currentResult.content,
      structure: selectedStructure,
      features,
      timestamp: Date.now(),
      tags: currentResult.tags,
      published: false,
      publishStatus: 'draft',
    }

    const updatedToken = trackTokenPromotion(currentToken)

    setTokens((current) => {
      const safe = current || []
      const updated = safe.map((t) => {
        if (t.id === currentToken.id) {
          const pageIds = t.pageIds || []
          if (!pageIds.includes(page.id)) {
            pageIds.push(page.id)
          }
          return { 
            ...updatedToken, 
            promoted: true, 
            pageId: t.pageId || page.id,
            pageIds 
          }
        }
        return t
      })
      return updated
    })

    setPages((current) => [page, ...(current || [])])
    setCurrentPage(page)
    setShowFeatureSelection(false)
    
    if (isExpanding) {
      toast.success('Page created from token expansion!', {
        description: 'Your token value has increased'
      })
      setIsExpanding(false)
      setView('tokenView')
    } else {
      setView('page')
    }
  }

  console.log('[INFINITY] Rendering view:', view)
  console.log('[INFINITY] currentPage:', currentPage ? currentPage.id : 'none')
  console.log('[INFINITY] currentToken:', currentToken ? currentToken.id : 'none')
  console.log('[INFINITY] siteConfig:', siteConfig)

  const shouldShowSearch = view === 'search' || 
    (view === 'page' && (!currentPage || !currentPage.id)) ||
    (view === 'result' && (!currentResult || !currentToken)) ||
    (view === 'tokenView' && !currentToken) ||
    !['search', 'result', 'page', 'index', 'localSearch', 'tokenView'].includes(view)

          onSearch={handleSearch}
          isProcessing={isProcessing}
        />
      )}

      {view === 'result' && currentResult && currentToken && (
        <ResultPage
      {shouldShowSearch && (
          token={currentToken}
          onBack={handleBackToSearch}
          onPromote={handlePromote}
        />
      )}

      {view === 'result' && currentResult && currentToken && (
        <ResultPage
          result={currentResult}
          token={currentToken}
          onBack={handleBackToSearch}
          onPromote={handlePromote}
        />={(p) => {
      )}es((current) =>
              (current || []).map((x) => (x.id === p.id ? p : x))
      {view === 'page' && currentPage && currentPage.id && (
        <BuiltPageView=== p.id) {
          key={currentPage.id}
          page={currentPage}
          allPages={safePages}
          onBack={handleBackToSearch}
          onPageUpdate={(p) => {
            setPages((current) =>
              (current || []).map((x) => (x.id === p.id ? p : x))
            )View')
            if (currentPage && currentPage.id === p.id) {
              setCurrentPage(p)
            }(p) => {
          }} {
          onExpandToken={(tokenId) => {
            const token = safeTokens.find(t => t.id === tokenId)
            if (token) {
              setCurrentToken(token)
              setView('tokenView')
            }
          }}
          onNavigateToPage={(p) => {
            if (p && p.id) {
              console.log('[INFINITY] Navigating to page:', p.id, p.title)
              setCurrentPage(p)
            })
          }})
        />
      )}handleBackToSearch}
          onSearchArchives={() => setView('localSearch')}
      {view === 'index' && (
        <PageIndex
          pages={safePages}
          onViewPage={(p) => {
            setCurrentPage(p)
            setView('page')
          }}}
          onBack={handleBackToSearch}
          onSearchArchives={() => setView('localSearch')}
        />okenView')
      )}
          onViewPage={(p) => {
      {view === 'localSearch' && (
        <LocalSearch
          tokens={safeTokens}
          pages={safePages}
          onViewToken={(t) => {
            setCurrentToken(t)
            setView('tokenView')
          }}' && currentToken && (
          onViewPage={(p) => {
            setCurrentPage(p)
            setView('page')
          }}tView('localSearch')}
          onBack={handleBackToSearch}
        />Page(p)
      )}w('page')
          }}
      {view === 'tokenView' && currentToken && (
        <TokenView
          token={currentToken}x))
          pages={safePages}
          onBack={() => setView('localSearch')}
          onViewPage={(p) => {
            setCurrentPage(p)
            setView('page')
          }}reSelection(true)
          onTokenUpdate={(t) =>
            setTokens((current) =>
              (current || []).map((x) => (x.id === t.id ? t : x))
            )
          }ion
          onExpandToken={(result) => {
            setCurrentResult(result)
            setIsExpanding(true)
            setShowStructureSelection(true)
          }}
        />
      )}lection
          open={showFeatureSelection}
          config={siteConfig}
          onClose={() => setShowSiteConfig(false)}
          onSave={updateSiteConfig}
        />

        <QuickStartGuide
          open={showQuickStart}
          onClose={() => {
            setShowQuickStart(false)
            setHasSeenQuickStart(true)
          }}
          onStartDemo={() => {
            setShowSiteConfig(true)
          }}
        />
      </div>
    )
}

export default App
