import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass } from '@phosphor-icons/react'

interface SearchIndexProps {
  onSearch: (query: string) => void
}

export function SearchIndex({ onSearch }: SearchIndexProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
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
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-2 h-12 w-12 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <MagnifyingGlass size={24} weight="bold" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
