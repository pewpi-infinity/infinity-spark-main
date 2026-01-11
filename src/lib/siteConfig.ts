import { useKV } from '@github/spark/hooks'

export interface SiteConfig {
  siteName: string
  ownerName: string
  githubUser: string
  repoName: string
  baseUrl: string
  pagesRoot: '/' | '/docs'
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const stored = await spark.kv.get<SiteConfig>('site-config')
  
  if (stored) {
    return stored
  }

  const defaultConfig: SiteConfig = {
    siteName: 'Untitled',
    ownerName: 'User',
    githubUser: 'pewpi-infinity',
    repoName: 'infinity-spark',
    baseUrl: 'https://pewpi-infinity.github.io/infinity-spark',
    pagesRoot: '/'
  }

  await spark.kv.set('site-config', defaultConfig)
  return defaultConfig
}

export async function setSiteConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await getSiteConfig()
  const updated = { ...current, ...config }
  
  updated.baseUrl = `https://${updated.githubUser}.github.io/${updated.repoName}`
  
  await spark.kv.set('site-config', updated)
  return updated
}

export function useSiteConfig(): [SiteConfig | null, (config: Partial<SiteConfig>) => Promise<void>] {
  const [config, setConfig, _deleteConfig] = useKV<SiteConfig>('site-config', {
    siteName: 'Untitled',
    ownerName: 'User',
    githubUser: 'pewpi-infinity',
    repoName: 'infinity-spark',
    baseUrl: 'https://pewpi-infinity.github.io/infinity-spark',
    pagesRoot: '/'
  })

  const updateConfig = async (updates: Partial<SiteConfig>) => {
    setConfig((current) => {
      const defaultConfig: SiteConfig = {
        siteName: 'Untitled',
        ownerName: 'User',
        githubUser: 'pewpi-infinity',
        repoName: 'infinity-spark',
        baseUrl: 'https://pewpi-infinity.github.io/infinity-spark',
        pagesRoot: '/'
      }
      const updated = { ...(current || defaultConfig), ...updates }
      updated.baseUrl = `https://${updated.githubUser}.github.io/${updated.repoName}`
      return updated
    })
  }

  return [config ?? null, updateConfig]
}
