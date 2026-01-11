import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, Books } from '@phosphor-icons/react'

interface SearchIndexProps {
  onSearch: (query: string) => void
  isProcessing?: boolean
  onViewPages?: () => void
  hasPages?: boolean
}

export function SearchIndex({ onSearch, isProcessing, onViewPages, hasPages }: SearchIndexProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isProcessing) {
      onSearch(query.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {hasPages && onViewPages && (
          <div className="absolute top-6 right-6">
            <Button
              variant="outline"
              onClick={onViewPages}
              className="text-accent border-accent/30 hover:bg-accent/10"
            >
              <Books className="mr-2" size={20} />
              View Pages
            </Button>
          </div>
        )}
        
        <h1 className="text-7xl font-bold text-center mb-16 tracking-tight">
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
              className="h-16 text-xl px-6 pr-16 cosmic-glow bg-card/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all"
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
      </div>
    </div>
  )
}
