import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LinkIcon, Check, Copy, Sparkle, X } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ShareURLDialogProps {
  open: boolean
  pageTitle: string
  pageId: string
  currentSlug?: string
  currentShareableUrl?: string
  onSave: (customSlug: string, shareableUrl: string) => void
  onCancel: () => void
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function generateShareableUrl(customSlug: string): string {
  return `https://c13b0.github.io/infinity-spark/pages/${customSlug}/`
}

export function ShareURLDialog({
  open,
  pageTitle,
  pageId,
  currentSlug,
  currentShareableUrl,
  onSave,
  onCancel,
}: ShareURLDialogProps) {
  const [customSlug, setCustomSlug] = useState(currentSlug || generateSlug(pageTitle))
  const [shareableUrl, setShareableUrl] = useState(
    currentShareableUrl || generateShareableUrl(currentSlug || generateSlug(pageTitle))
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) {
      setCustomSlug(currentSlug || generateSlug(pageTitle))
      setShareableUrl(
        currentShareableUrl || generateShareableUrl(currentSlug || generateSlug(pageTitle))
      )
      setCopied(false)
    }
  }, [open, pageTitle, currentSlug, currentShareableUrl])

  const handleSlugChange = (value: string) => {
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '')
    
    setCustomSlug(sanitized)
    setShareableUrl(generateShareableUrl(sanitized))
  }

  const handleAutoGenerate = () => {
    const newSlug = generateSlug(pageTitle)
    setCustomSlug(newSlug)
    setShareableUrl(generateShareableUrl(newSlug))
    toast.success('Slug generated from title')
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareableUrl)
    setCopied(true)
    toast.success('URL copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    if (!customSlug.trim()) {
      toast.error('Please enter a valid slug')
      return
    }

    if (customSlug.length < 3) {
      toast.error('Slug must be at least 3 characters')
      return
    }

    onSave(customSlug, shareableUrl)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <LinkIcon size={28} className="text-accent" />
            Create Custom Share URL
          </DialogTitle>
          <DialogDescription className="text-base">
            Customize your page's shareable URL for easy sharing and publishing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="custom-slug" className="text-base font-medium">
              Custom URL Slug
            </Label>
            <div className="flex gap-2">
              <Input
                id="custom-slug"
                value={customSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="my-awesome-page"
                className="font-mono text-base bg-background border-input"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAutoGenerate}
                title="Auto-generate from title"
              >
                <Sparkle size={20} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Use lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Shareable URL Preview</Label>
            <div className="relative">
              <div className="bg-muted border border-border rounded-md p-4 pr-12 font-mono text-sm break-all">
                {shareableUrl}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopyUrl}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                title="Copy URL"
              >
                {copied ? (
                  <Check size={20} className="text-accent" />
                ) : (
                  <Copy size={20} />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This is where your page will be published
            </p>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <div className="flex gap-3">
              <LinkIcon size={24} className="text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-sm">Why customize your URL?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Make your page easy to remember and share</li>
                  <li>• Create professional-looking links</li>
                  <li>• Improve SEO with descriptive URLs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <X className="mr-2" size={20} />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Check className="mr-2" size={20} />
            Save Custom URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
