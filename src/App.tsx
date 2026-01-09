import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { SearchIndex } from '@/components/SearchIndex'
import { ResultPage } from '@/components/ResultPage'
import { FeatureSelection } from '@/components/FeatureSelection'
import { BuiltPageView } from '@/components/BuiltPageView'
import { PageIndex } from '@/components/PageIndex'
import { Toaster, toast } from 'sonner'
import { processSearch, createToken } from '@/lib/search'
import type { Token, SearchResult, PageFeatures, BuildPage } from '@/types'

type AppView = 'search' | 'result' | 'building' | 'page' | 'index'

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

  const handleViewIndex = () => {
    setView('index')
  }

  const pageCount = pages?.length || 0

  return (
    <>
      <Toaster position="top-center" theme="dark" />

      {view === 'search' && (
        <div className="relative">
          <SearchIndex onSearch={handleSearch} />
          {pageCount > 0 && (
            <button
              onClick={handleViewIndex}
              className="fixed bottom-8 right-8 px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full font-medium shadow-lg transition-all hover:scale-105"
            >
              View Pages ({pageCount})
            </button>
          )}
        </div>
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
        <BuiltPageView page={currentPage} onBack={handleBackToSearch} />
      )}

      {view === 'index' && (
        <PageIndex
          pages={pages || []}
          onViewPage={handleViewPage}
          onBack={handleBackToSearch}
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