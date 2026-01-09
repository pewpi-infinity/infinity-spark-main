import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ChartBar,
  Image,
  SpeakerHigh,
  VideoCamera,
  Files,
  GridFour,
  NavigationArrow,
  CurrencyDollar,
  Check,
  X,
} from '@phosphor-icons/react'
import type { PageFeatures, PageStructure } from '@/types'

interface FeatureOption {
  key: keyof PageFeatures
  icon: React.ReactNode
  title: string
  description: string
}

const featureOptions: FeatureOption[] = [
  {
    key: 'charts',
    icon: <ChartBar size={32} />,
    title: 'Add Charts',
    description: 'Include data visualizations and analytics',
  },
  {
    key: 'images',
    icon: <Image size={32} />,
    title: 'Add Images',
    description: 'Enhance with visual media and graphics',
  },
  {
    key: 'audio',
    icon: <SpeakerHigh size={32} />,
    title: 'Add Audio',
    description: 'Include audio clips or podcasts',
  },
  {
    key: 'video',
    icon: <VideoCamera size={32} />,
    title: 'Add Video',
    description: 'Embed video content',
  },
  {
    key: 'files',
    icon: <Files size={32} />,
    title: 'Add Files',
    description: 'Attach downloadable documents',
  },
  {
    key: 'widgets',
    icon: <GridFour size={32} />,
    title: 'Add Widgets',
    description: 'Include interactive components',
  },
  {
    key: 'navigation',
    icon: <NavigationArrow size={32} />,
    title: 'Add Navigation',
    description: 'Build multi-section structure',
  },
  {
    key: 'monetization',
    icon: <CurrencyDollar size={32} />,
    title: 'Add Monetization',
    description: 'Enable contextual advertising',
  },
]

function getStructurePresets(structure?: PageStructure): Partial<PageFeatures> {
  switch (structure) {
    case 'blank':
      return {}
    case 'knowledge':
      return { charts: true, images: true }
    case 'business':
      return { images: true, navigation: true, monetization: true }
    case 'tool':
      return { widgets: true, files: true }
    case 'multipage':
      return { navigation: true, images: true, files: true }
    default:
      return {}
  }
}

interface FeatureSelectionProps {
  open: boolean
  structure?: PageStructure
  onComplete: (features: PageFeatures) => void
  onCancel: () => void
}

export function FeatureSelection({ open, structure, onComplete, onCancel }: FeatureSelectionProps) {
  const presets = getStructurePresets(structure)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [features, setFeatures] = useState<PageFeatures>({
    charts: presets.charts || false,
    images: presets.images || false,
    audio: presets.audio || false,
    video: presets.video || false,
    files: presets.files || false,
    widgets: presets.widgets || false,
    navigation: presets.navigation || false,
    monetization: presets.monetization || false,
  })

  const currentFeature = featureOptions[currentIndex]
  const progress = ((currentIndex + 1) / featureOptions.length) * 100

  const resetState = () => {
    setCurrentIndex(0)
    setFeatures({
      charts: presets.charts || false,
      images: presets.images || false,
      audio: presets.audio || false,
      video: presets.video || false,
      files: presets.files || false,
      widgets: presets.widgets || false,
      navigation: presets.navigation || false,
      monetization: presets.monetization || false,
    })
  }

  const handleChoice = (include: boolean) => {
    const updatedFeatures = {
      ...features,
      [currentFeature.key]: include,
    }
    setFeatures(updatedFeatures)

    if (currentIndex < featureOptions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete(updatedFeatures)
      resetState()
    }
  }

  const handleCancel = () => {
    resetState()
    onCancel()
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Customize Your Page</DialogTitle>
          <DialogDescription>
            Choose features to include in your page
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Progress value={progress} className="h-2" />

          <div className="text-center space-y-4 py-6">
            <div className="inline-flex p-4 rounded-2xl bg-accent/10 text-accent">
              {currentFeature.icon}
            </div>
            <h3 className="text-xl font-semibold">{currentFeature.title}</h3>
            <p className="text-muted-foreground">{currentFeature.description}</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleChoice(false)}
              className="flex-1 h-12"
            >
              <X className="mr-2" size={20} />
              Skip
            </Button>
            <Button
              onClick={() => handleChoice(true)}
              className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Check className="mr-2" size={20} />
              Include
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {currentIndex + 1} of {featureOptions.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
