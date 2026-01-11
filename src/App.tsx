import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { SearchIndex } from '@/components/SearchIndex'
import { ResultPage } from '@/components/ResultPage'
import { StructureSelection, type PageStructure } from '@/components/StructureSelection'
import { FeatureSelection } from '@/components/FeatureSelection'
import { PageIndex } from '@/components/PageIndex'
import { BuiltPageView } from '@/components/BuiltPageView'
import { processSearch, createToken, generateTokenId } from '@/lib/search'
import type { SearchResult, Token, PageFeatures, BuildPage } from '@/types'

type AppView = 'search' | 'result' | 'pageIndex' | 'pageView'

function App() {
  const [view, setView] = useState<AppView>('search')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null)
  const [currentToken, setCurrentToken] = useState<Token | null>(null)
  const [currentPage, setCurrentPage] = useState<BuildPage | null>(null)
  const [showStructureDialog, setShowStructureDialog] = useState(false)
  const [showFeatureDialog, setShowFeatureDialog] = useState(false)
  const [selectedStructure, setSelectedStructure] = useState<PageStructure | null>(null)
  const [selectedPageName, setSelectedPageName] = useState<string>('')
  
  const [tokens, setTokens] = useKV<Token[]>('infinity-tokens', [])
  const [pages, setPages] = useKV<BuildPage[]>('infinity-pages', [])

  const handleSearch = async (query: string) => {
    setIsProcessing(true)
    toast.loading('Processing your search...')

    try {
      const result = await processSearch(query)
      const token = createToken(query, result.content)
      
      setTokens((current) => [token, ...(current || [])])
      
      setCurrentResult(result)
      setCurrentToken(token)
      setView('result')
      
      toast.success('Search complete!')
    } catch (error) {
      console.error('Search error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process search')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackToSearch = () => {
    setView('search')
    setCurrentResult(null)
    setCurrentToken(null)
    setCurrentPage(null)
  }

  const handlePromoteToPage = () => {
    setShowStructureDialog(true)
  }

  const handleStructureSelected = (structure: PageStructure, pageName: string) => {
    setSelectedStructure(structure)
    setSelectedPageName(pageName)
    setShowStructureDialog(false)
    setShowFeatureDialog(true)
  }

  const handleFeaturesSelected = (features: PageFeatures) => {
    if (!currentToken || !currentResult || !selectedStructure) return

    const newPage: BuildPage = {
      id: generateTokenId(),
      tokenId: currentToken.id,
      title: selectedPageName || currentResult.query,
      content: currentResult.content,
      structure: selectedStructure,
      features,
      timestamp: Date.now(),
      tags: currentResult.tags,
      published: false,
      publishStatus: 'draft',
      analytics: {
        views: 0,
        edits: 0,
        shares: 0,
        uniqueVisitors: 0
      }
    }

    setPages((current) => [newPage, ...(current || [])])
    
    setTokens((current) =>
      (current || []).map((t) =>
        t.id === currentToken.id
          ? { ...t, promoted: true, pageIds: [...(t.pageIds || []), newPage.id] }
          : t
      )
    )

    toast.success('Page created successfully!')
    setShowFeatureDialog(false)
    setView('pageIndex')
  }

  const handleViewPages = () => {
    setView('pageIndex')
  }

  const handleViewPage = (page: BuildPage) => {
    setCurrentPage(page)
    setView('pageView')
  }

  const handleBackToIndex = () => {
    setView('pageIndex')
    setCurrentPage(null)
  }

  const handleUpdatePage = (updatedPage: BuildPage) => {
    setPages((current) =>
      (current || []).map((p) => (p.id === updatedPage.id ? updatedPage : p))
    )
    setCurrentPage(updatedPage)
  }

  const handleExpandToken = (tokenId: string) => {
    toast.info('Token expansion feature coming soon!')
  }

  const handleNavigateToPage = (page: BuildPage) => {
    setCurrentPage(page)
    setView('pageView')
  }

  return (
    <div className="relative min-h-screen">
      <Toaster position="top-center" />
      
      {view === 'search' && (
        <SearchIndex 
          onSearch={handleSearch} 
          isProcessing={isProcessing}
          onViewPages={handleViewPages}
          hasPages={(pages || []).length > 0}
        />
      )}

      {view === 'result' && currentResult && currentToken && (
        <ResultPage
          result={currentResult}
          token={currentToken}
          onBack={handleBackToSearch}
          onPromote={handlePromoteToPage}
        />
      )}

      {view === 'pageIndex' && (
        <PageIndex
          pages={pages || []}
          onViewPage={handleViewPage}
          onBack={handleBackToSearch}
        />
      )}

      {view === 'pageView' && currentPage && (
        <BuiltPageView
          page={currentPage}
          allPages={pages || []}
          onBack={handleBackToIndex}
          onPageUpdate={handleUpdatePage}
          onExpandToken={handleExpandToken}
          onNavigateToPage={handleNavigateToPage}
        />
      )}

      <StructureSelection
        open={showStructureDialog}
        defaultTitle={currentResult?.query}
        onComplete={handleStructureSelected}
        onCancel={() => setShowStructureDialog(false)}
      />

      <FeatureSelection
        open={showFeatureDialog}
        structure={selectedStructure || 'blank'}
        onComplete={handleFeaturesSelected}
        onCancel={() => setShowFeatureDialog(false)}
      />
    </div>
  )
}

export default App
