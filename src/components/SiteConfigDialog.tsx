import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Gear, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { SiteConfig } from '@/lib/siteConfig'

interface SiteConfigDialogProps {
  open: boolean
  config: SiteConfig
  onClose: () => void
  onSave: (config: Partial<SiteConfig>) => Promise<void>
}

export function SiteConfigDialog({ open, config, onClose, onSave }: SiteConfigDialogProps) {
  const [siteName, setSiteName] = useState(config.siteName)
  const [ownerName, setOwnerName] = useState(config.ownerName)
  const [githubUser, setGithubUser] = useState(config.githubUser)
  const [repoName, setRepoName] = useState(config.repoName)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setSiteName(config.siteName)
      setOwnerName(config.ownerName)
      setGithubUser(config.githubUser)
      setRepoName(config.repoName)
    }
  }, [open, config])

  const handleSave = async () => {
    if (!siteName.trim() || !ownerName.trim() || !githubUser.trim() || !repoName.trim()) {
      toast.error('All fields are required')
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        siteName: siteName.trim(),
        ownerName: ownerName.trim(),
        githubUser: githubUser.trim(),
        repoName: repoName.trim(),
      })
      toast.success('Site configuration saved!')
      onClose()
    } catch (error) {
      toast.error('Failed to save configuration')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-accent/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Gear size={28} />
            Site Configuration
          </DialogTitle>
          <DialogDescription className="text-base">
            Configure your personalized site identity. This determines where your pages will be published.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              placeholder="e.g., Pixie, Kris"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              Your site's personalized identity (no "spark" branding)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              placeholder="Your name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUser">GitHub Username</Label>
            <Input
              id="githubUser"
              placeholder="e.g., pewpi-infinity"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repoName">Repository Name</Label>
            <Input
              id="repoName"
              placeholder="e.g., infinity-spark"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <p className="text-sm font-mono break-all">
              Pages will publish to:
              <br />
              <span className="text-accent">
                https://{githubUser}.github.io/{repoName}/{siteName}/pages/
              </span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Check className="mr-2" size={20} />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
