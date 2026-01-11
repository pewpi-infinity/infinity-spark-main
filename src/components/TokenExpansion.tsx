import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Sparkle, TrendUp } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { processSearch } from '@/lib/search'
import type { Token, SearchResult } from '@/types'

interface TokenExpansionProps {
  token: Token
  open: boolean
  onClose: () => void
  onPageCreated: (result: SearchResult) => void
}

export function TokenExpansion({ token, open, onClose, onPageCreated }: TokenExpansionProps) {
  const [expandQuery, setExpandQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleExpand = async () => {
    if (!expandQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setIsProcessing(true)
    const toastId = toast.loading('Generating new page from token...')

    try {
      const result = await processSearch(expandQuery)
      
      toast.dismiss(toastId)
      toast.success('New page content generated!', {
        description: 'Now configure structure and features'
      })

      onPageCreated(result)
      onClose()
      setExpandQuery('')
    } catch (error) {
      toast.dismiss(toastId)
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate page content'
      )
      console.error('[TokenExpansion Error]', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const suggestedExpansions = [
    `${token.query} - detailed guide`,
    `${token.query} - case studies`,
    `${token.query} - best practices`,
    `Advanced ${token.query}`,
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkle className="text-accent" size={28} />
            Expand Token into New Page
          </DialogTitle>
          <DialogDescription className="text-base">
            Create additional pages tied to token <span className="font-mono text-accent">{token.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <p className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
              <TrendUp size={18} />
              Increase Token Value
            </p>
            <p className="text-sm text-foreground/90">
              Each page you create from this token increases its value and creates a network of related content.
              All pages remain permanently tied to token <span className="font-mono">{token.id}</span>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expand-query">
                What content do you want to generate from this token?
              </Label>
              <Input
                id="expand-query"
                placeholder="Enter search query for new page..."
                value={expandQuery}
                onChange={(e) => setExpandQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isProcessing) {
                    handleExpand()
                  }
                }}
                disabled={isProcessing}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Suggested expansions:
              </Label>
              <div className="grid gap-2">
                {suggestedExpansions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4"
                    onClick={() => setExpandQuery(suggestion)}
                    disabled={isProcessing}
                  >
                    <Plus className="mr-2 flex-shrink-0" size={16} />
                    <span className="text-sm">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card/70 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Original Token Query:</strong> {token.query}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExpand}
              disabled={isProcessing || !expandQuery.trim()}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Sparkle className="mr-2" size={18} />
              {isProcessing ? 'Generating...' : 'Generate Page Content'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
