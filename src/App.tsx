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
import { useSiteConfig } from '@/lib/siteConfig'
import { Toaster, toast } from 'sonner'
import { processSearch, createToken } from '@/lib/search'
import { initializeTokenAnalytics, trackTokenPromotion } from '@/lib/analytics'
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

  const [tokens, setTokens] = useKV<Token[]>('infinity-tokens', [])
  const [pages, setPages] = useKV<BuildPage[]>('infinity-pages', [])
  const [hasSeenQuickStart, setHasSeenQuickStart] = useKV<boolean>('has-seen-quickstart', false)
  const [siteConfig, updateSiteConfig] = useSiteConfig()

  console.log('[INFINITY] App initialized and rendering')
  console.log('[INFINITY] View:', view, '| Tokens:', tokens?.length ?? 0, '| Pages:', pages?.length ?? 0)
  console.log('[INFINITY] siteConfig loaded:', siteConfig ? 'yes' : 'loading...')

  useEffect(() => {
    if (!hasSeenQuickStart && (tokens || []).length === 0 && (pages || []).length === 0) {
      const timer = setTimeout(() => setShowQuickStart(true), 800)
      return () => clearTimeout(timer)
    }
  }, [hasSeenQuickStart, tokens, pages])

  useEffect(() => {
    if (siteConfig && siteConfig.siteName === 'Untitled' && !showQuickStart && (tokens || []).length === 0) {
      const timer = setTimeout(() => setShowSiteConfig(true), 500)
      return () => clearTimeout(timer)
    }
  }, [siteConfig, showQuickStart, tokens])

  const handleSearch = async (query: string) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    const toastId = toast.loading('Processing your search...')

    try {
      const result = await processSearch(query)
      const token = createToken(query, result.content)
      token.analytics = initializeTokenAnalytics()

      setTokens((current) => [token, ...(current || [])])
      setCurrentResult(result)
      setCurrentToken(token)
      setView('result')

      toast.dismiss(toastId)
      toast.success('Token minted successfully!')
    } catch (error) {
      toast.dismiss(toastId)
      toast.error(
        error instanceof Error ? error.message : 'Failed to process search'
      )
      console.error('[Search Error]', error)
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
      const updated = (current || []).map((t) => {
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
  console.log('[INFINITY] siteConfig:', siteConfig)

  if (!siteConfig) {
    return (
      <div className="min-h-screen text-foreground relative flex items-center justify-center">
        <Toaster position="top-center" theme="dark" />
        <div className="text-center">
          <div className="text-7xl font-bold mb-4">INFINITY</div>
          <div className="text-muted-foreground animate-pulse">Initializing...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-foreground relative">
      <Toaster position="top-center" theme="dark" />

      <BrainResult />

      {view === 'search' && (
        <SearchIndex
          onSearch={handleSearch}
          isProcessing={isProcessing}
        />
      )}

      {view === 'result' && currentResult && currentToken && (
        <ResultPage
          result={currentResult}
          token={currentToken}
          onBack={handleBackToSearch}
          onPromote={handlePromote}
        />
      )}

      {view === 'page' && currentPage && (
        <BuiltPageView
          page={currentPage}
          allPages={pages || []}
          onBack={handleBackToSearch}
          onPageUpdate={(p) =>
            setPages((current) =>
              (current || []).map((x) => (x.id === p.id ? p : x))
            )
          }
          onExpandToken={(tokenId) => {
            const token = (tokens || []).find(t => t.id === tokenId)
            if (token) {
              setCurrentToken(token)
              setView('tokenView')
            }
          }}
          onNavigateToPage={(p) => {
            setCurrentPage(p)
          }}
        />
      )}

      {view === 'index' && (
        <PageIndex
          pages={pages || []}
          onViewPage={(p) => {
            setCurrentPage(p)
            setView('page')
          }}
          onBack={handleBackToSearch}
          onSearchArchives={() => setView('localSearch')}
        />
      )}

      {view === 'localSearch' && (
        <LocalSearch
          tokens={tokens || []}
          pages={pages || []}
          onViewToken={(t) => {
            setCurrentToken(t)
            setView('tokenView')
          }}
          onViewPage={(p) => {
            setCurrentPage(p)
            setView('page')
          }}
          onBack={handleBackToSearch}
        />
      )}

      {view === 'tokenView' && currentToken && (
        <TokenView
          token={currentToken}
          pages={pages || []}
          onBack={() => setView('localSearch')}
          onViewPage={(p) => {
            setCurrentPage(p)
            setView('page')
          }}
          onTokenUpdate={(t) =>
            setTokens((current) =>
              (current || []).map((x) => (x.id === t.id ? t : x))
            )
          }
          onExpandToken={(result) => {
            setCurrentResult(result)
            setIsExpanding(true)
            setShowStructureSelection(true)
          }}
        />
      )}

      <StructureSelection
        open={showStructureSelection}
        defaultTitle={currentResult?.query}
        onComplete={handleStructureSelection}
        onCancel={() => setShowStructureSelection(false)}
      />

      <FeatureSelection
        open={showFeatureSelection}
        structure={selectedStructure || undefined}
        onComplete={handleFeatureSelection}
        onCancel={() => setShowFeatureSelection(false)}
      />

      {siteConfig && (
        <SiteConfigDialog
          open={showSiteConfig}
          config={siteConfig}
          onClose={() => setShowSiteConfig(false)}
          onSave={updateSiteConfig}
        />
      )}

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
  
