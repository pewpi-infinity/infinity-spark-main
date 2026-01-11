import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MagnifyingGlass,
  Sparkle,
  FileText,
  Rocket,
  ArrowRight,
  CheckCircle,
} from '@phosphor-icons/react'

interface QuickStartGuideProps {
  open: boolean
  onClose: () => void
  onStartDemo?: () => void
}

export function QuickStartGuide({ open, onClose, onStartDemo }: QuickStartGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: <MagnifyingGlass size={48} className="text-accent" />,
      title: 'Search Anything',
      description: 'Enter a query, topic, or idea into the search bar. INFINITY will process it and generate knowledge.',
      example: 'Try: "Explain quantum computing" or "History of jazz music"',
    },
    {
      icon: <Sparkle size={48} className="text-accent" />,
      title: 'Token Minted',
      description: 'Every search creates a unique token - your proof of knowledge. View the generated content and decide what to do next.',
      example: 'Token ID: INF-ABC123-XYZ789',
    },
    {
      icon: <FileText size={48} className="text-accent" />,
      title: 'Promote to Page',
      description: 'Love the result? Click "Promote to Page" to transform it into a published website. Choose structure and features.',
      example: 'Select: Knowledge Page → Add Charts + Images',
    },
    {
      icon: <Rocket size={48} className="text-accent" />,
      title: 'Publish Live',
      description: 'Click "Publish Page" to create a real HTML file with a live URL. Your page goes live on GitHub Pages in 2-3 minutes.',
      example: 'https://your-site.github.io/MySite/pages/quantum-computing/',
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
      if (onStartDemo) {
        onStartDemo()
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = steps[currentStep]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl">Quick Start Guide</DialogTitle>
          <DialogDescription>
            Learn how to create and publish your first page in 4 simple steps
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-accent'
                    : index < currentStep
                    ? 'w-2 bg-accent/50'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-accent/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-accent/10">
                  {step.icon}
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-lg mb-4">
                    {step.description}
                  </p>
                  <Badge variant="secondary" className="font-mono text-sm px-4 py-2">
                    {step.example}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground mt-4">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
            >
              Skip Tutorial
            </Button>

            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <CheckCircle size={20} />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
