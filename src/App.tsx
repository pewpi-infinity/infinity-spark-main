import { useState } from 'react'
import { SearchIndex } from '@/components/SearchIndex'
import { Toaster, toast } from 'sonner'

function App() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSearch = async (query: string) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    toast.loading('Processing your search...')

    setTimeout(() => {
      setIsProcessing(false)
      toast.success('Search feature coming soon!')
    }, 1000)
  }

  return (
    <div className="relative min-h-screen">
      <Toaster position="top-center" />
      <SearchIndex
        onSearch={handleSearch}
        isProcessing={isProcessing}
      />
    </div>
  )
}

export default App
