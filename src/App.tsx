import { useState } from 'react'
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
import { useSiteConfig } from '@/lib/siteConfig'
import { Toaster, toast } from 'sonner'
import { processSearch, createToken } from '@/lib/search'
import { initializeTokenAnalytics, trackTokenPromotion } from '@/lib/analytics'
import type { Token, SearchResult, PageFeatures, BuildPage } from '@/types'

type AppView = 'search' | 'result' | 'building' | 'page' | 'index' | 'localSearch' | 'tokenView'

function App() {
  const [view, setView] = useState<AppView>('search')
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null)
  const [currentToken, setCurrentToken] = useState<Token | null>(null)
  const [currentPage, setCurrentPage] = useState<BuildPage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showStructureSelection, setShowStructureSelection] = useState(false)
  const [showFeatureSelection, setShowFeatureSelection] = useState(false)
  const [selectedStructure, setSelectedStructure] = useState<PageStructure | null>(null)
  const [customPageTitle, setCustomPageTitle] = useState<string>('')
  const [showSiteConfig, setShowSiteConfig] = useState(false)

  const [tokens, setTokens] = useKV<Token[]>('infinity-tokens', [])
  const [pages, setPages] = useKV<BuildPage[]>('infinity-pages', [])
  const [siteConfig, updateSiteConfig] = useSiteConfig()

  const handleSearch = async (query: string) => {
    setIsProcessing(true)
    toast.loading('Processing your search...')

    try {
      const result = await processSearch(query)
      const token = createToken(query, result.content)
      
      token.analytics = initializeTokenAnalytics()

      setTokens((current) => [token, ...(current || [])])

      setCurrentResult(result)
      setCurrentToken(token)
      setView('result')

      toast.dismiss()
      toast.success('Token minted successfully!')
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to process search')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePromote = () => {
    setShowStructureSelection(true)
  }

  const handleStructureSelection = (structure: PageStructure, customTitle: string) => {
    setSelectedStructure(structure)
    setCustomPageTitle(customTitle)
    setShowStructureSelection(false)
    setShowFeatureSelection(true)
  }

  const handleStructureCancel = () => {
    setShowStructureSelection(false)
    setSelectedStructure(null)
    setCustomPageTitle('')
  }

  const handleFeatureSelection = (features: PageFeatures) => {
    if (!currentResult || !currentToken || !selectedStructure) return

    const pageTitle = customPageTitle || currentResult.query

    const page: BuildPage = {
      id: `PAGE-${Date.now().toString(36).toUpperCase()}`,
      tokenId: currentToken.id,
      title: pageTitle,
      content: currentResult.content,
      structure: selectedStructure,
      features,
      timestamp: Date.now(),
      tags: currentResult.tags,
      published: false,
      publishStatus: 'draft',
    }

    const updatedToken = trackTokenPromotion(currentToken)

    setTokens((current) =>
      (current || []).map((t) =>
        t.id === currentToken.id ? { ...updatedToken, promoted: true, pageId: page.id } : t
      )
    )

    setPages((current) => [page, ...(current || [])])

    setCurrentPage(page)
    setShowFeatureSelection(false)
    setSelectedStructure(null)
    setCustomPageTitle('')
    setView('page')

    toast.success('Page built successfully!')
  }

  const handleFeatureCancel = () => {
    setShowFeatureSelection(false)
    setSelectedStructure(null)
    setCustomPageTitle('')
  }

  const handleBackToSearch = () => {
    setView('search')
    setCurrentResult(null)
    setCurrentToken(null)
    setCurrentPage(null)
  }

  const handleViewPage = (page: BuildPage) => {
    setCurrentPage(page)
    setView('page')
  }

  const handlePageUpdate = (updatedPage: BuildPage) => {
    setPages((current) =>
      (current || []).map((p) => (p.id === updatedPage.id ? updatedPage : p))
    )
    setCurrentPage(updatedPage)
  }

  const handleViewIndex = () => {
    setView('index')
  }

  const handleViewLocalSearch = () => {
    setView('localSearch')
  }

  const handleViewToken = (token: Token) => {
    setCurrentToken(token)
    setView('tokenView')
  }

  const handleTokenUpdate = (updatedToken: Token) => {
    setTokens((current) =>
      (current || []).map((t) => (t.id === updatedToken.id ? updatedToken : t))
    )
    setCurrentToken(updatedToken)
  }

  const pageCount = pages?.length || 0
  const tokenCount = tokens?.length || 0

  return (
    <>
      <Toaster position="top-center" theme="dark" />

      {view === 'search' && (
        <SearchIndex
          onSearch={handleSearch}
          onViewArchives={handleViewLocalSearch}
          onViewPages={handleViewIndex}
          onOpenSettings={() => setShowSiteConfig(true)}
          hasTokens={tokenCount > 0}
          hasPages={pageCount > 0}
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
          onBack={handleBackToSearch}
          onPageUpdate={handlePageUpdate}
        />
      )}

      {view === 'index' && (
        <PageIndex
          pages={pages || []}
          onViewPage={handleViewPage}
          onBack={handleBackToSearch}
          onSearchArchives={handleViewLocalSearch}
        />
      )}

      {view === 'localSearch' && (
        <LocalSearch
          tokens={tokens || []}
          pages={pages || []}
          onViewToken={handleViewToken}
          onViewPage={handleViewPage}
          onBack={handleBackToSearch}
        />
      )}

      {view === 'tokenView' && currentToken && (
        <TokenView
          token={currentToken}
          pages={pages || []}
          onBack={() => setView('localSearch')}
          onViewPage={handleViewPage}
          onTokenUpdate={handleTokenUpdate}
        />
      )}

      <StructureSelection
        open={showStructureSelection}
        defaultTitle={currentResult?.query}
        onComplete={handleStructureSelection}
        onCancel={handleStructureCancel}
      />

      <FeatureSelection
        open={showFeatureSelection}
        structure={selectedStructure || undefined}
        onComplete={handleFeatureSelection}
        onCancel={handleFeatureCancel}
      />

      {siteConfig && (
        <SiteConfigDialog
          open={showSiteConfig}
          config={siteConfig}
          onClose={() => setShowSiteConfig(false)}
          onSave={updateSiteConfig}
        />
      )}
    </>
  )
}

export default App