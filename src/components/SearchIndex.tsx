import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, MagnifyingGlassPlus, Files, Gear, Sparkle } from '@phosphor-icons/react'

interface SearchIndexProps {
  onSearch: (query: string) => void
  onViewArchives?: () => void
  onViewPages?: () => void
  onOpenSettings?: () => void
  hasTokens?: boolean
  hasPages?: boolean
  isProcessing?: boolean
}

export function SearchIndex({ onSearch, onViewArchives, onViewPages, onOpenSettings, hasTokens, hasPages, isProcessing }: SearchIndexProps) {
  const [query, setQuery] = useState('')

  console.log('[SearchIndex] Component mounted and rendering')
  console.log('[SearchIndex] Props:', { hasTokens, hasPages, isProcessing })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isProcessing) {
      onSearch(query.trim())
    }
  }

  const exampleSearches = [
    'The history of artificial intelligence',
    'How does photosynthesis work',
    'Guide to space exploration',
    'Understanding blockchain technology',
  ]

  const handleExampleClick = (example: string) => {
    setQuery(example)
  }

  const showArchiveButtons = (hasTokens || hasPages) && (onViewArchives || onViewPages)
  const showExamples = !hasTokens && !hasPages

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      {onOpenSettings && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
        >
          <Gear size={24} />
        </Button>
      )}
      
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center mb-12 sm:mb-16 tracking-tight">
          INFINITY
        </h1>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything..."
              className="h-14 sm:h-16 text-lg sm:text-2xl px-4 sm:px-6 pr-14 sm:pr-16 cosmic-glow bg-card/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-2 h-10 w-10 sm:h-12 sm:w-12 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isProcessing || !query.trim()}
            >
              <MagnifyingGlass size={20} className="sm:hidden" weight="bold" />
              <MagnifyingGlass size={24} className="hidden sm:block" weight="bold" />
            </Button>
          </div>
        </form>

        {showExamples && (
          <div className="mt-6 sm:mt-8 text-center space-y-4">
            <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-2">
              <Sparkle size={16} className="text-accent" />
              Try searching for something to create your first token
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {exampleSearches.map((example, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent/10 hover:border-accent transition-colors px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {showArchiveButtons && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            {onViewArchives && (hasTokens || hasPages) && (
              <Button
                variant="outline"
                onClick={onViewArchives}
                className="gap-2 w-full sm:w-auto"
              >
                <MagnifyingGlassPlus size={20} />
                Search Archives
              </Button>
            )}
            {onViewPages && hasPages && (
              <Button
                variant="outline"
                onClick={onViewPages}
                className="gap-2 w-full sm:w-auto"
              >
                <Files size={20} />
                View Pages
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
