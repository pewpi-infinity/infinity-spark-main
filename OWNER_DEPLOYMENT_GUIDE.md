# INFINITY Publishing System - Owner Guide

## Overview

The INFINITY app uses a **one-click publishing system** that stores user pages in Spark KV storage. As the owner of the infinity-spark repository, you periodically deploy these pages to GitHub Pages.

## How It Works

1. **Users submit pages**: When users click "Publish to INFINITY", their page data is stored in Spark KV storage
2. **You extract the data**: Use browser console commands to export page data
3. **You deploy to infinity-spark**: Create files in the infinity-spark repo and push to GitHub
4. **GitHub Pages hosts it**: The page becomes live at `c13b0.github.io/infinity-spark/[username]/[slug]/`

## Deployment Process

### Step 1: Open the Spark App

Visit your running INFINITY Spark app and open the browser developer console (F12).

### Step 2: Export the Page Registry

```javascript
const registry = await spark.kv.get('infinity-page-registry') || []
console.log('Total pages:', registry.length)
console.log(JSON.stringify(registry, null, 2))
```

This shows all pages that have been submitted. You'll see:
```json
[
  {
    "id": "PAGE-ABC123",
    "tokenId": "INF-XYZ",
    "title": "My Awesome Page",
    "url": "https://c13b0.github.io/infinity-spark/username/my-awesome-page/",
    "slug": "my-awesome-page",
    "user": "username",
    "timestamp": 1234567890
  }
]
```

### Step 3: Export Each Page's HTML

For each page in the registry, fetch its data:

```javascript
const pageId = 'PAGE-ABC123'  // From registry
const pageData = await spark.kv.get(`infinity-published-${pageId}`)
console.log('HTML length:', pageData.html.length)

// Copy HTML to clipboard
copy(pageData.html)

// Or download as file
const blob = new Blob([pageData.html], { type: 'text/html' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `${pageData.user}-${pageData.slug}.html`
a.click()
```

### Step 4: Create Directory Structure in infinity-spark Repo

```bash
cd /path/to/infinity-spark
mkdir -p username/my-awesome-page
```

### Step 5: Write the HTML File

```bash
# Create index.html with the HTML content from pageData
cat > username/my-awesome-page/index.html << 'EOF'
<!DOCTYPE html>
<!-- Paste the HTML here -->
EOF
```

Or simply:
```bash
echo "$PAGE_HTML" > username/my-awesome-page/index.html
```

### Step 6: Commit and Push

```bash
git add username/
git commit -m "Deploy page: username/my-awesome-page"
git push origin main
```

### Step 7: Wait for GitHub Pages Build

GitHub Pages will build and deploy within 2-3 minutes. The page will be live at the URL from the registry.

### Step 8: Mark Page as Deployed (Optional)

Back in the browser console, you can update the page status:

```javascript
// Mark as deployed
const pageId = 'PAGE-ABC123'
const pageData = await spark.kv.get(`infinity-published-${pageId}`)
pageData.deployed = true
pageData.deployedAt = Date.now()
await spark.kv.set(`infinity-published-${pageId}`, pageData)
```

## Batch Deployment Script

For deploying multiple pages at once, use this console script:

```javascript
async function deployAllPages() {
  const registry = await spark.kv.get('infinity-page-registry') || []
  const pages = []
  
  for (const entry of registry) {
    const pageData = await spark.kv.get(`infinity-published-${entry.id}`)
    if (pageData && !pageData.deployed) {
      pages.push({
        id: entry.id,
        path: `${pageData.user}/${pageData.slug}/index.html`,
        html: pageData.html,
        user: pageData.user,
        slug: pageData.slug
      })
    }
  }
  
  console.log('Pages ready for deployment:', pages.length)
  console.log(JSON.stringify(pages, null, 2))
  
  return pages
}

const pendingPages = await deployAllPages()
```

Then create a shell script or manually deploy each one.

## Automated Deployment (Future)

To fully automate this, you could:

1. **Create a Node.js script** that:
   - Connects to Spark KV storage (via API or export)
   - Reads all pending pages
   - Creates directory structure
   - Writes HTML files
   - Commits and pushes to GitHub

2. **Set up a GitHub Action** that:
   - Runs on a schedule (e.g., daily)
   - Executes the deployment script
   - Automatically publishes all pending pages

3. **Build an admin panel** in the Spark app that:
   - Shows all pending pages
   - Allows one-click "Deploy All" button
   - Uses GitHub API to commit files directly

## Monitoring Deployed Pages

Keep track of deployments in a separate registry:

```javascript
const deployLog = await spark.kv.get('infinity-deploy-log') || []
deployLog.push({
  pageId: 'PAGE-ABC123',
  user: 'username',
  slug: 'my-awesome-page',
  deployedAt: Date.now(),
  deployedBy: 'c13b0'
})
await spark.kv.set('infinity-deploy-log', deployLog)
```

## Troubleshooting

### Page not showing up in GitHub Pages
- Check that the file exists in the repo: `username/slug/index.html`
- Verify GitHub Actions ran successfully (repo Settings → Actions)
- Ensure GitHub Pages is enabled (Settings → Pages → Source: GitHub Actions)

### HTML is broken or malformed
- Check the HTML was copied completely
- Verify no special characters were escaped incorrectly
- Test the HTML locally first: `python -m http.server`

### User reports page not live
- Check if you've deployed it yet (search the registry)
- Verify the GitHub Pages build completed
- Try accessing the URL directly to see the error

## Support

Users will submit pages through the app. You'll see them in the KV storage registry. Deploy them as needed, and they'll have their free hosted pages!
