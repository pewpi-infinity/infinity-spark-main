import type { BuildPage } from '@/types'
import { getSiteConfig } from '@/lib/siteConfig'

interface GitHubPublishResult {
  success: boolean
  url?: string
  error?: string
  message?: string
  commitSha?: string
}

interface GitHubFileContent {
  path: string
  content: string
  message: string
  sha?: string
}

const REPO_OWNER = 'c13b0'
const REPO_NAME = 'infinity-spark'
const GITHUB_API_BASE = 'https://api.github.com'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function generatePageHTML(page: BuildPage, siteName: string): Promise<string> {
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
    <title>${page.title} | ${siteName}</title>
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
            text-align: center;
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
            <p>Published with ${siteName} powered by INFINITY</p>
            <p style="margin-top: 0.5rem;">Generated: ${new Date(page.timestamp).toLocaleDateString()}</p>
        </footer>
    </div>
</body>
</html>`
}

async function getGitHubToken(): Promise<string | null> {
  const token = await spark.kv.get<string>('github-publish-token')
  return token || null
}

export async function setGitHubToken(token: string): Promise<void> {
  await spark.kv.set('github-publish-token', token)
}

export async function hasGitHubToken(): Promise<boolean> {
  const token = await getGitHubToken()
  return token !== null && token.length > 0
}

async function getFileSha(path: string, token: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      return data.sha
    }
    return null
  } catch (error) {
    console.error('[getFileSha] Error:', error)
    return null
  }
}

async function commitFileToGitHub(
  path: string,
  content: string,
  message: string,
  token: string
): Promise<{ success: boolean; sha?: string; error?: string }> {
  try {
    const base64Content = btoa(unescape(encodeURIComponent(content)))
    
    const existingSha = await getFileSha(path, token)

    const body: any = {
      message,
      content: base64Content,
      branch: 'main'
    }

    if (existingSha) {
      body.sha = existingSha
    }

    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.message || `GitHub API error: ${response.status}`
      }
    }

    const data = await response.json()
    return {
      success: true,
      sha: data.commit.sha
    }
  } catch (error) {
    console.error('[commitFileToGitHub] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function publishPageToGitHub(page: BuildPage): Promise<GitHubPublishResult> {
  try {
    const token = await getGitHubToken()
    if (!token) {
      return {
        success: false,
        error: 'GitHub token not configured. Please set up authentication first.'
      }
    }

    const siteConfig = await getSiteConfig()
    const user = await spark.user()
    
    if (!user || !user.login) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    const slug = generateSlug(page.title)
    const html = await generatePageHTML(page, siteConfig.siteName)
    
    const filePath = `pages/${slug}/index.html`
    const commitMessage = `Publish page: ${page.title} (${page.id})`

    const result = await commitFileToGitHub(filePath, html, commitMessage, token)

    if (!result.success) {
      return {
        success: false,
        error: result.error
      }
    }

    const pageUrl = `https://${REPO_OWNER}.github.io/${REPO_NAME}/pages/${slug}/`

    const pageData = {
      id: page.id,
      tokenId: page.tokenId,
      title: page.title,
      slug,
      url: pageUrl,
      commitSha: result.sha,
      timestamp: Date.now(),
      features: page.features,
      tags: page.tags
    }

    await spark.kv.set(`github-published-${page.id}`, pageData)
    
    const registry = await spark.kv.get<any[]>('github-page-registry') || []
    const existingIndex = registry.findIndex((p: any) => p.id === page.id)
    
    const registryEntry = {
      id: page.id,
      tokenId: page.tokenId,
      title: page.title,
      url: pageUrl,
      slug,
      timestamp: Date.now(),
      commitSha: result.sha
    }

    if (existingIndex >= 0) {
      registry[existingIndex] = registryEntry
    } else {
      registry.unshift(registryEntry)
    }

    await spark.kv.set('github-page-registry', registry)

    return {
      success: true,
      url: pageUrl,
      commitSha: result.sha,
      message: `Page published successfully! GitHub Pages will build in 1-3 minutes.`
    }
  } catch (error) {
    console.error('[publishPageToGitHub] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown publishing error'
    }
  }
}

export async function verifyGitHubToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    return response.ok
  } catch (error) {
    console.error('[verifyGitHubToken] Error:', error)
    return false
  }
}

export async function getGitHubRepoInfo(token: string): Promise<any> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )

    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('[getGitHubRepoInfo] Error:', error)
    return null
  }
}
