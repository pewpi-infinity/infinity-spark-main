import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  GithubLogo, 
  Info, 
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  setGitHubToken, 
  verifyGitHubToken,
  getGitHubRepoInfo 
} from '@/lib/githubPublisher'

interface GitHubTokenDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function GitHubTokenDialog({ open, onClose, onSuccess }: GitHubTokenDialogProps) {
  const [token, setToken] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleVerifyAndSave = async () => {
    if (!token.trim()) {
      toast.error('Please enter a GitHub token')
      return
    }

    setIsVerifying(true)
    setVerificationStatus('idle')

    try {
      const isValid = await verifyGitHubToken(token)
      
      if (!isValid) {
        setVerificationStatus('error')
        toast.error('Invalid token or insufficient permissions')
        setIsVerifying(false)
        return
      }

      const repoInfo = await getGitHubRepoInfo(token)
      
      if (!repoInfo) {
        setVerificationStatus('error')
        toast.error('Cannot access infinity-spark repository')
        setIsVerifying(false)
        return
      }

      await setGitHubToken(token)
      setVerificationStatus('success')
      toast.success('GitHub token verified and saved!')
      
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1000)
    } catch (error) {
      setVerificationStatus('error')
      toast.error('Failed to verify token')
      console.error('[GitHubTokenDialog] Error:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClose = () => {
    if (!isVerifying) {
      setToken('')
      setVerificationStatus('idle')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GithubLogo size={24} weight="fill" />
            GitHub Publishing Setup
          </DialogTitle>
          <DialogDescription>
            Configure GitHub access to publish pages directly to the infinity-spark repository
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="bg-accent/10 border-accent/30">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              This token will be stored securely in your Spark KV storage and never exposed in code.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="github-token" className="text-sm font-medium">
                GitHub Personal Access Token (Fine-grained PAT)
              </Label>
              <Input
                id="github-token"
                type="password"
                placeholder="github_pat_..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isVerifying}
                className="font-mono text-sm"
              />
            </div>

            {verificationStatus === 'success' && (
              <Alert className="bg-green-500/10 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-sm text-green-500">
                  Token verified successfully!
                </AlertDescription>
              </Alert>
            )}

            {verificationStatus === 'error' && (
              <Alert className="bg-destructive/10 border-destructive/30">
                <WarningCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-sm text-destructive">
                  Token verification failed. Check your token and try again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="font-semibold text-foreground">How to create a token:</div>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens</li>
              <li>Click "Generate new token"</li>
              <li>Name: "INFINITY Publishing"</li>
              <li>Repository access: Select "Only select repositories" → Choose "c13b0/infinity-spark"</li>
              <li>Permissions → Repository permissions:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li><strong>Contents:</strong> Read and write</li>
                </ul>
              </li>
              <li>Generate token and copy it here</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerifyAndSave}
            disabled={isVerifying || !token.trim()}
          >
            {isVerifying ? 'Verifying...' : 'Verify & Save Token'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
