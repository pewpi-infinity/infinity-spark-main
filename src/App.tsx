import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { SearchIndex } from '@/components/SearchIndex'
import { ResultPage } from '@/components/ResultPage'
import { FeatureSelection } from '@/components/FeatureSelection'
import { BuiltPageView } from '@/components/BuiltPageView'
import { PageIndex } from '@/components/PageIndex'
import { LocalSearch } from '@/components/LocalSearch'
import { TokenView } from '@/components/TokenView'
import { Toaster, toast } from 'sonner'
import { processSearch, createToken } from '@/lib/search'
import type { Token, SearchResult, PageFeatures, BuildPage } from '@/types'

type AppView = 'search' | 'result' | 'building' | 'page' | 'index' | 'localSearch' | 'tokenView'

function App() {
  const [view, setView] = useState<AppView>('search')
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null)
  const [currentToken, setCurrentToken] = useState<Token | null>(null)
  const [currentPage, setCurrentPage] = useState<BuildPage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFeatureSelection, setShowFeatureSelection] = useState(false)

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
    setShowFeatureSelection(true)
  }

  const handleFeatureSelection = (features: PageFeatures) => {
    if (!currentResult || !currentToken) return

    const page: BuildPage = {
      id: `PAGE-${Date.now().toString(36).toUpperCase()}`,
      tokenId: currentToken.id,
      title: currentResult.query,
      content: currentResult.content,
      features,
      timestamp: Date.now(),
      tags: currentResult.tags,
      published: false,
    }

    setTokens((current) =>
      (current || []).map((t) =>
        t.id === currentToken.id ? { ...t, promoted: true, pageId: page.id } : t
      )
    )

    setPages((current) => [page, ...(current || [])])

    setCurrentPage(page)
    setShowFeatureSelection(false)
    setView('page')

    toast.success('Page built successfully!')
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
          onBack={() => setView('localSearch')}
        />
      )}

      <FeatureSelection
        open={showFeatureSelection}
        onComplete={handleFeatureSelection}
      />
    </>
  )
}

export default App