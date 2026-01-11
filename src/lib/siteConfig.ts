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

const defaultSiteConfig: SiteConfig = {
  siteName: 'Untitled',
  ownerName: 'User',
  githubUser: 'pewpi-infinity',
  repoName: 'infinity-spark',
  baseUrl: 'https://pewpi-infinity.github.io/infinity-spark',
  pagesRoot: '/'
}

export function useSiteConfig(): [SiteConfig, (config: Partial<SiteConfig>) => Promise<void>] {
  const [config, setConfig, _deleteConfig] = useKV<SiteConfig>('site-config', defaultSiteConfig)

  const safeConfig = config || defaultSiteConfig

  const updateConfig = async (updates: Partial<SiteConfig>) => {
    try {
      setConfig((current) => {
        const base = current || defaultSiteConfig
        const updated = { ...base, ...updates }
        updated.baseUrl = `https://${updated.githubUser}.github.io/${updated.repoName}`
        return updated
      })
    } catch (error) {
      console.error('[useSiteConfig] Error updating config:', error)
      throw error
    }
  }

  return [safeConfig, updateConfig]
}
