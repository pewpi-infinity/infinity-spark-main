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

  const [tokens, setTokens] = useKV<Token[]>('infinity-tokens', [])
  const [pages, setPages] = useKV<BuildPage[]>('infinity-pages', [])
  const [siteConfig, updateSiteConfig] = useSiteConfig()

  useEffect(() => {
    if (siteConfig && siteConfig.siteName === 'Untitled') {
      const timer = setTimeout(() => setShowSiteConfig(true), 500)
      return () => clearTimeout(timer)
    }
  }, [siteConfig])

  /* ---- handlers unchanged ---- */

  const pageCount = pages?.length || 0
  const tokenCount = tokens?.length || 0

  return (
    <>
      <Toaster position="top-center" theme="dark" />

      {/* 🧠 MONGOOSE / BRAIN OUTPUT */}
      <BrainResult /> {/* ← ADDED */}

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
  
