import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
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
  onComplete: (structure: PageStructure) => void
}

export function StructureSelection({ open, onComplete }: StructureSelectionProps) {
  const [hoveredType, setHoveredType] = useState<PageStructure | null>(null)

  const handleSelect = (structure: PageStructure) => {
    onComplete(structure)
  }

  if (!open) return null

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-3xl bg-card/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">What do you want this to become?</DialogTitle>
          <DialogDescription>
            Choose a structure that matches your intent
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {structureOptions.map((option) => (
            <Card
              key={option.type}
              className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:border-accent/50 ${
                hoveredType === option.type ? 'border-accent bg-accent/10' : 'border-border'
              }`}
              onClick={() => handleSelect(option.type)}
              onMouseEnter={() => setHoveredType(option.type)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 rounded-xl transition-colors ${
                  hoveredType === option.type ? 'bg-accent/20 text-accent' : 'bg-primary/10 text-foreground'
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
      </DialogContent>
    </Dialog>
  )
}
