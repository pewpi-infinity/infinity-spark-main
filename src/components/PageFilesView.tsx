import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Download, FileHtml, FileJs } from '@phosphor-icons/react'
import { downloadPageFiles } from '@/lib/publisher'
import { toast } from 'sonner'
import type { BuildPage } from '@/types'

interface PageFilesViewProps {
  page: BuildPage
}

export function PageFilesView({ page }: PageFilesViewProps) {
  const handleDownloadFiles = async () => {
    try {
      const files = await downloadPageFiles(page.id)
      
      for (const file of files) {
        const blob = new Blob([file.content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      toast.success('Files downloaded!', {
        description: 'Now commit them to your repo to publish'
      })
    } catch (error) {
      toast.error('Failed to download files')
      console.error(error)
    }
  }

  const slug = page.slug || page.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

  return (
    <Card className="bg-muted/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Code size={24} />
          Page File Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
          <p className="text-sm font-semibold text-accent mb-1">⚠️ Manual Commit Required</p>
          <p className="text-xs text-muted-foreground">
            Files are generated in browser storage. Download them and commit to your repo for the page to go live.
          </p>
        </div>

        <div className="space-y-2 font-mono text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-accent">📁</span> /pages
          </div>
          <div className="flex items-center gap-2 pl-6 text-muted-foreground">
            <span className="text-accent">📁</span> {slug}
          </div>
          <div className="flex items-center gap-2 pl-12">
            <FileHtml size={16} className="text-accent" />
            <span>index.html</span>
          </div>
          <div className="flex items-center gap-2 pl-12">
            <FileJs size={16} className="text-accent" />
            <span>page.json</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Required file path for GitHub Pages:
          </p>
          <div className="bg-card/50 rounded-lg p-3 font-mono text-xs break-all border border-accent/20">
            /pages/{slug}/index.html
          </div>
        </div>

        {(page.published || page.publishStatus === 'awaiting-build') && (
          <Button
            onClick={handleDownloadFiles}
            variant="default"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            size="lg"
          >
            <Download className="mr-2" size={20} />
            Download Page Files
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
