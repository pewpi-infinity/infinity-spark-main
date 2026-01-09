import type { BuildPage, PageFeatures } from '@/types'
import { getSiteConfig } from '@/lib/siteConfig'

interface PublishResult {
  success: boolean
  url?: string
  error?: string
  status?: 'published' | 'awaiting-build'
}

interface PageRegistry {
  pages: {
    id: string
    tokenId: string
    title: string
    url: string
    features: string[]
    createdAt: number
  }[]
}

interface PageData {
  html: string
  metadata: string
  slug: string
  url: string
  timestamp: number
  verified: boolean
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function generatePageHTML(page: BuildPage): Promise<string> {
  const siteConfig = await getSiteConfig()
  const enabledFeatures = Object.entries(page.features)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key)

  const hasCharts = page.features.charts
  const hasImages = page.features.images
  const hasAudio = page.features.audio
  const hasVideo = page.features.video
  const hasFiles = page.features.files
  const hasWidgets = page.features.widgets
  const hasNavigation = page.features.navigation
  const hasMonetization = page.features.monetization

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} | ${siteConfig.siteName}</title>
    <meta name="description" content="${page.content.substring(0, 160).replace(/"/g, '&quot;')}">
    <meta name="keywords" content="${page.tags.join(', ')}">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.content.substring(0, 160).replace(/"/g, '&quot;')}">
    <meta property="og:type" content="article">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --bg: oklch(0.15 0.02 270);
            --fg: oklch(0.98 0 0);
            --accent: oklch(0.75 0.15 200);
            --accent-fg: oklch(0.15 0.02 270);
            --card: oklch(0.20 0.03 270);
            --border: oklch(0.30 0.03 270);
            --muted: oklch(0.60 0.02 250);
        }
        
        body {
            font-family: 'Space Grotesk', system-ui, sans-serif;
            background: var(--bg);
            color: var(--fg);
            line-height: 1.6;
            padding: 2rem 1rem;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        
        header {
            margin-bottom: 3rem;
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        
        .tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
        }
        
        .tag {
            background: var(--card);
            padding: 0.25rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            border: 1px solid var(--border);
        }
        
        .metadata {
            display: flex;
            gap: 1rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            color: var(--muted);
            margin-bottom: 2rem;
        }
        
        .features {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
        }
        
        .feature-badge {
            background: var(--accent);
            color: var(--accent-fg);
            padding: 0.375rem 0.875rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .content {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        .content p {
            margin-bottom: 1rem;
            white-space: pre-wrap;
        }
        
        .section {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        .section h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--accent);
        }
        
        .section p {
            color: var(--muted);
        }
        
        .monetization {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            border-radius: 1rem;
            padding: 2rem;
            text-align: center;
            color: var(--muted);
            font-size: 0.875rem;
        }
        
        footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
            font-size: 0.875rem;
            color: var(--muted);
        }
        
        ${hasNavigation ? `
        nav {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 1rem;
            padding: 1rem 2rem;
            margin-bottom: 2rem;
            display: flex;
            gap: 2rem;
        }
        
        nav a {
            color: var(--fg);
            text-decoration: none;
            transition: color 0.2s;
        }
        
        nav a:hover {
            color: var(--accent);
        }
        ` : ''}
        
        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .content, .section {
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        ${hasNavigation ? `
        <nav>
            <a href="#content">Content</a>
            ${hasCharts ? '<a href="#charts">Charts</a>' : ''}
            ${hasImages ? '<a href="#images">Images</a>' : ''}
            ${hasAudio ? '<a href="#audio">Audio</a>' : ''}
            ${hasVideo ? '<a href="#video">Video</a>' : ''}
        </nav>
        ` : ''}
        
        <header>
            <h1>${page.title}</h1>
            <div class="tags">
                ${page.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="metadata">
                <span>Token: ${page.tokenId}</span>
                <span>Page: ${page.id}</span>
            </div>
            ${enabledFeatures.length > 0 ? `
            <div class="features">
                ${enabledFeatures.map(f => `<span class="feature-badge">${f.charAt(0).toUpperCase() + f.slice(1)}</span>`).join('')}
            </div>
            ` : ''}
        </header>
        
        <main>
            <div class="content" id="content">
                <p>${page.content}</p>
            </div>
            
            ${hasCharts ? `
            <section class="section" id="charts">
                <h2>📊 Data Visualization</h2>
                <p>Chart components and data visualizations based on page content would be rendered here.</p>
            </section>
            ` : ''}
            
            ${hasImages ? `
            <section class="section" id="images">
                <h2>🖼️ Image Gallery</h2>
                <p>Image gallery and visual media components would be displayed here.</p>
            </section>
            ` : ''}
            
            ${hasAudio ? `
            <section class="section" id="audio">
                <h2>🎵 Audio Content</h2>
                <p>Audio player and sound clips would be embedded here.</p>
            </section>
            ` : ''}
            
            ${hasVideo ? `
            <section class="section" id="video">
                <h2>🎥 Video Content</h2>
                <p>Video player and multimedia content would be embedded here.</p>
            </section>
            ` : ''}
            
            ${hasFiles ? `
            <section class="section" id="files">
                <h2>📄 Downloadable Files</h2>
                <p>Document downloads and file attachments would be available here.</p>
            </section>
            ` : ''}
            
            ${hasWidgets ? `
            <section class="section" id="widgets">
                <h2>🧩 Interactive Widgets</h2>
                <p>Interactive components and embedded widgets would be available here.</p>
            </section>
            ` : ''}
            
            ${hasMonetization ? `
            <div class="monetization">
                💰 Contextual advertising enabled for this page
            </div>
            ` : ''}
        </main>
        
        <footer>
            <p>Published with ${siteConfig.siteName} • ${new Date(page.timestamp).toLocaleDateString()}</p>
            <p style="margin-top: 0.5rem;">
                Generated from search query: "${page.title}"
            </p>
        </footer>
    </div>
</body>
</html>`
}

function generatePageMetadata(page: BuildPage): string {
  return JSON.stringify({
    id: page.id,
    tokenId: page.tokenId,
    title: page.title,
    slug: page.slug,
    tags: page.tags,
    features: page.features,
    timestamp: page.timestamp,
    publishedAt: page.publishedAt,
  }, null, 2)
}

async function verifyPageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

async function detectGitHubPagesRoot(): Promise<'/' | '/docs'> {
  try {
    const docsTest = await fetch('/docs/index.html', { method: 'HEAD' })
    if (docsTest.ok) return '/docs'
  } catch {
  }
  return '/'
}

export async function publishPage(page: BuildPage): Promise<PublishResult> {
  try {
    const siteConfig = await getSiteConfig()
    const slug = generateSlug(page.title)
    const html = await generatePageHTML({ ...page, slug })
    const metadata = generatePageMetadata({ ...page, slug })

    const pagesRoot = siteConfig.pagesRoot
    
    const pageUrl = `${siteConfig.baseUrl}/${siteConfig.siteName}/pages/${slug}/`

    const pageData: PageData = {
      html,
      metadata,
      slug,
      url: pageUrl,
      timestamp: Date.now(),
      verified: false
    }

    const fileStructure = {
      root: pagesRoot === '/docs' ? 'docs' : '',
      sitePath: `${siteConfig.siteName}/pages/${slug}/`,
      path: `${siteConfig.siteName}/pages/${slug}/index.html`,
      metadata: `${siteConfig.siteName}/pages/${slug}/page.json`,
      fullPath: pagesRoot === '/docs' 
        ? `/docs/${siteConfig.siteName}/pages/${slug}/index.html`
        : `/${siteConfig.siteName}/pages/${slug}/index.html`
    }

    await spark.kv.set(`published-page-${page.id}`, pageData)
    await spark.kv.set(`page-file-structure-${page.id}`, fileStructure)

    const isVerified = await verifyPageUrl(pageUrl)
    
    if (isVerified) {
      pageData.verified = true
      await spark.kv.set(`published-page-${page.id}`, pageData)
    }

    const registry = await spark.kv.get<PageRegistry>('page-registry') || { pages: [] }
    
    const existingIndex = registry.pages.findIndex(p => p.id === page.id)
    const registryEntry = {
      id: page.id,
      tokenId: page.tokenId,
      title: page.title,
      url: pageUrl,
      features: Object.entries(page.features)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key),
      createdAt: page.timestamp,
    }

    if (existingIndex >= 0) {
      registry.pages[existingIndex] = registryEntry
    } else {
      registry.pages.unshift(registryEntry)
    }

    await spark.kv.set('page-registry', registry)

    if (!isVerified) {
      setTimeout(async () => {
        const stillNotVerified = !(await verifyPageUrl(pageUrl))
        if (stillNotVerified) {
          await spark.kv.set('.gitpages-rebuild', Date.now())
        }
      }, 120000)
    }

    return {
      success: true,
      url: pageUrl,
      status: isVerified ? 'published' : 'awaiting-build'
    }
  } catch (error) {
    console.error('Publication error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getPublishedPage(pageId: string) {
  return await spark.kv.get(`published-page-${pageId}`)
}

export async function getPageRegistry(): Promise<PageRegistry> {
  return await spark.kv.get<PageRegistry>('page-registry') || { pages: [] }
}

export async function downloadPageFiles(pageId: string) {
  const pageData = await spark.kv.get<PageData>(`published-page-${pageId}`)
  if (!pageData) {
    throw new Error('Page not found')
  }

  const files = [
    {
      name: 'index.html',
      content: pageData.html,
      path: `pages/${pageData.slug}/index.html`
    },
    {
      name: 'page.json',
      content: pageData.metadata,
      path: `pages/${pageData.slug}/page.json`
    }
  ]

  return files
}

export async function exportAllPages() {
  const registry = await getPageRegistry()
  const allFiles: { path: string; content: string }[] = []

  for (const page of registry.pages) {
    try {
      const files = await downloadPageFiles(page.id)
      allFiles.push(...files.map(f => ({ path: f.path, content: f.content })))
    } catch (e) {
      console.error(`Failed to export page ${page.id}:`, e)
    }
  }

  return allFiles
}
