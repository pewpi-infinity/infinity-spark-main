import type { Token, BuildPage, PageFeatures } from '@/types'

export function createSampleTokens(): Token[] {
  const now = Date.now()
  return [
    {
      id: 'INF-SAMPLE-001',
      query: 'What is quantum computing?',
      timestamp: now - 86400000 * 5,
      content: 'Quantum computing harnesses the unique behavior of quantum physics to process information in fundamentally new ways. Unlike classical computers that use bits (0 or 1), quantum computers use qubits that can exist in multiple states simultaneously through superposition. This enables them to solve certain problems exponentially faster than classical computers.',
      promoted: true,
      pageId: 'PAGE-SAMPLE-001'
    },
    {
      id: 'INF-SAMPLE-002',
      query: 'Best practices for React hooks',
      timestamp: now - 86400000 * 3,
      content: 'React hooks provide a way to use state and lifecycle features in functional components. Key best practices include: always call hooks at the top level, use the dependency array correctly in useEffect, create custom hooks for reusable logic, and use useCallback/useMemo for performance optimization when needed.',
      promoted: false
    },
    {
      id: 'INF-SAMPLE-003',
      query: 'History of artificial intelligence',
      timestamp: now - 86400000 * 2,
      content: 'Artificial intelligence has evolved from symbolic AI in the 1950s to modern deep learning. Key milestones include the Dartmouth Conference (1956), expert systems in the 1980s, IBM Deep Blue defeating Kasparov (1997), and the deep learning revolution starting in 2012 with AlexNet.',
      promoted: true,
      pageId: 'PAGE-SAMPLE-002'
    },
    {
      id: 'INF-SAMPLE-004',
      query: 'Climate change solutions',
      timestamp: now - 86400000,
      content: 'Addressing climate change requires multiple approaches: transitioning to renewable energy, improving energy efficiency, protecting and restoring forests, advancing carbon capture technology, and implementing sustainable agriculture practices. Both technological innovation and policy changes are essential.',
      promoted: false
    }
  ]
}

export function createSamplePages(): BuildPage[] {
  const now = Date.now()
  const defaultFeatures: PageFeatures = {
    charts: false,
    images: false,
    audio: false,
    video: false,
    files: false,
    widgets: false,
    navigation: false,
    monetization: false
  }

  return [
    {
      id: 'PAGE-SAMPLE-001',
      tokenId: 'INF-SAMPLE-001',
      title: 'What is quantum computing?',
      content: 'Quantum computing harnesses the unique behavior of quantum physics to process information in fundamentally new ways. Unlike classical computers that use bits (0 or 1), quantum computers use qubits that can exist in multiple states simultaneously through superposition. This enables them to solve certain problems exponentially faster than classical computers.',
      features: { ...defaultFeatures, charts: true, images: true },
      timestamp: now - 86400000 * 5,
      tags: ['quantum', 'computing', 'technology', 'physics'],
      published: false,
    },
    {
      id: 'PAGE-SAMPLE-002',
      tokenId: 'INF-SAMPLE-003',
      title: 'History of artificial intelligence',
      content: 'Artificial intelligence has evolved from symbolic AI in the 1950s to modern deep learning. Key milestones include the Dartmouth Conference (1956), expert systems in the 1980s, IBM Deep Blue defeating Kasparov (1997), and the deep learning revolution starting in 2012 with AlexNet.',
      features: { ...defaultFeatures, navigation: true },
      timestamp: now - 86400000 * 2,
      tags: ['AI', 'history', 'technology', 'machine-learning'],
      published: false,
    }
  ]
}
