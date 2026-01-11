import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Toaster, toast } from 'sonner'

function App() {
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isProcessing) return
    
    setIsProcessing(true)
    toast.loading('Processing your search...')

    setTimeout(() => {
      setIsProcessing(false)
      toast.success('Search feature coming soon!')
    }, 1000)
  }

  return (
    <div className="relative min-h-screen z-10">
      <Toaster position="top-center" />
      
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-7xl font-bold text-center mb-16 tracking-tight text-foreground">
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
    </div>
  )
}

export default App
