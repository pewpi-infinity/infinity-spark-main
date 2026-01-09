import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FileText, Brain, Briefcase, Wrench, Globe } from '@phosphor-icons/react'

export type PageStructure = 'blank' | 'knowledge' | 'business' | 'tool' | 'multipage'

interface StructureOption {
  type: PageStructure
  icon: React.ReactNode
  title: string
  description: string
}

const structureOptions: StructureOption[] = [
  {
    type: 'blank',
    icon: <FileText size={48} />,
    title: 'Read-only Page',
    description: 'Simple content page without extra features',
  },
  {
    type: 'knowledge',
    icon: <Brain size={48} />,
    title: 'Knowledge Page',
    description: 'Information-rich page with data visualization',
  },
  {
    type: 'business',
    icon: <Briefcase size={48} />,
    title: 'Business Page',
    description: 'Professional page with monetization options',
  },
  {
    type: 'tool',
    icon: <Wrench size={48} />,
    title: 'Tool / App Page',
    description: 'Interactive page with widgets and features',
  },
  {
    type: 'multipage',
    icon: <Globe size={48} />,
    title: 'Multi-page Site',
    description: 'Complete site with navigation structure',
  },
]

interface StructureSelectionProps {
  open: boolean
  defaultTitle?: string
  onComplete: (structure: PageStructure, customTitle: string) => void
  onCancel: () => void
}

export function StructureSelection({ open, defaultTitle = '', onComplete, onCancel }: StructureSelectionProps) {
  const [hoveredType, setHoveredType] = useState<PageStructure | null>(null)
  const [selectedStructure, setSelectedStructure] = useState<PageStructure | null>(null)
  const [customTitle, setCustomTitle] = useState(defaultTitle)

  const handleSelect = (structure: PageStructure) => {
    setSelectedStructure(structure)
  }

  const handleContinue = () => {
    if (selectedStructure && customTitle.trim()) {
      onComplete(selectedStructure, customTitle.trim())
      setSelectedStructure(null)
      setCustomTitle(defaultTitle)
    }
  }

  const handleCancel = () => {
    setSelectedStructure(null)
    setCustomTitle(defaultTitle)
    onCancel()
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] bg-card/95 backdrop-blur-lg overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">What do you want this to become?</DialogTitle>
          <DialogDescription>
            Choose a structure and give your page a name
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          <div className="space-y-2">
            <Label htmlFor="page-title" className="text-base">Page Name</Label>
            <Input
              id="page-title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter a custom name for your page..."
              className="h-12 text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {structureOptions.map((option) => (
              <Card
                key={option.type}
                className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:border-accent/50 ${
                  selectedStructure === option.type ? 'border-accent bg-accent/10 ring-2 ring-accent/30' : 
                  hoveredType === option.type ? 'border-accent bg-accent/10' : 'border-border'
                }`}
                onClick={() => handleSelect(option.type)}
                onMouseEnter={() => setHoveredType(option.type)}
                onMouseLeave={() => setHoveredType(null)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 rounded-xl transition-colors ${
                    selectedStructure === option.type || hoveredType === option.type ? 'bg-accent/20 text-accent' : 'bg-primary/10 text-foreground'
                  }`}>
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{option.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 flex-shrink-0 border-t border-border mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedStructure || !customTitle.trim()}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
