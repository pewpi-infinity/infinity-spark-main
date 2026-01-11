import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, MagnifyingGlassPlus, Files, Gear } from '@phosphor-icons/react'

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

  console.log('[SearchIndex] Rendering with hasTokens:', hasTokens, 'hasPages:', hasPages, 'isProcessing:', isProcessing)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isProcessing) {
      onSearch(query.trim())
    }
  }

  const showArchiveButtons = (hasTokens || hasPages) && (onViewArchives || onViewPages)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {onOpenSettings && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <Gear size={24} />
        </Button>
      )}
      
      <div className="w-full max-w-2xl">
        <h1 className="text-6xl md:text-7xl font-bold text-center mb-16 tracking-tight">
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
              className="h-16 text-2xl px-6 pr-16 cosmic-glow bg-card/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-2 h-12 w-12 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isProcessing || !query.trim()}
            >
              <MagnifyingGlass size={24} weight="bold" />
            </Button>
          </div>
        </form>

        {showArchiveButtons && (
          <div className="flex gap-3 justify-center mt-6">
            {onViewArchives && (hasTokens || hasPages) && (
              <Button
                variant="outline"
                onClick={onViewArchives}
                className="gap-2"
              >
                <MagnifyingGlassPlus size={20} />
                Search Archives
              </Button>
            )}
            {onViewPages && hasPages && (
              <Button
                variant="outline"
                onClick={onViewPages}
                className="gap-2"
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
