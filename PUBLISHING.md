# Publishing Guide

## 📋 Overview

This system generates real HTML pages published under **personalized site identities**. Each user/site has its own name (e.g., "Pixie", "Kris") — **no generic "spark" branding visible**.

### ⚠️ IMPORTANT: Manual Commit Required

This is a **browser-based application** that cannot automatically write files to your GitHub repository. When you "publish" a page:

1. ✅ HTML and metadata are generated in browser storage
2. ✅ The expected URL is calculated and shown
3. ❌ Files are NOT automatically committed to your repo
4. 👉 **You must download and commit files manually**

**See [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md) for complete step-by-step instructions.**

## 🏗️ Personalized Site Structure

### Critical Concept: Site Identity

Your pages publish to a **personalized site root**, not a shared directory:

```
/{YourSiteName}/
  index.html
  pages/
    page-slug-1/
      index.html
    page-slug-2/
      index.html
```

### Examples

**Pixie's site:**
```
/Pixie/
  pages/
    memory-1/
      index.html
      page.json
```
URL: `https://pewpi-infinity.github.io/infinity-spark/Pixie/pages/memory-1/`

**Kris's site:**
```
/Kris/
  pages/
    hydrogen-programming/
      index.html
      page.json
```
URL: `https://pewpi-infinity.github.io/infinity-spark/Kris/pages/hydrogen-programming/`

## ⚙️ Site Configuration

Click the ⚙️ gear icon on the search page to configure:

- **Site Name** - Your personalized identity (e.g., "Pixie", "Kris")
- **Owner Name** - Your name
- **GitHub Username** - Repository owner
- **Repository Name** - Repo name

This determines where all your pages publish.

## 🚀 Publishing Process

### Step 1: Create Content
1. Search for a topic
2. Review generated content
3. Collect your token

### Step 2: Choose Structure
Click one of five structure options:
- 📄 **Read-only Page** - Simple content
- 🧠 **Knowledge Page** - Information with data viz
- 🏢 **Business Page** - Professional with monetization
- 🧩 **Tool / App Page** - Interactive widgets
- 🧬 **Multi-page Site** - Full navigation structure

### Step 3: Select Features
Choose from 8 optional features:
- 📊 Charts
- 🖼️ Images
- 🔊 Audio
- 🎥 Video
- 📁 Files
- 🧩 Widgets
- 🧭 Navigation
- 💰 Monetization

### Step 4: Build & Publish

#### Draft State (⚠️)
- Page exists in-app only
- Can preview and edit
- Not yet public

#### Publishing
Click "Publish Page" to:
1. Generate HTML file structure
2. Create metadata JSON
3. Store in KV with file info
4. Verify URL accessibility
5. Register in page index

#### Status Outcomes

**✅ Published** (Green badge)
- URL verified and accessible
- File created successfully
- Ready to share immediately

**⚠️ Awaiting Pages Build** (Gray badge)
- Files created but URL not yet accessible
- GitHub Pages is building (2-3 minutes typical)
- System will auto-verify when ready
- Retry mechanism available if >2 minutes

**⚠️ Draft** (Gray badge)
- Not yet published
- No public URL
- Edit freely

## 📁 File Structure Details

### Example: "Hydrogen Programming" page in Kris's site

```
Repository Root
├── Kris/
│   └── pages/
│       └── hydrogen-programming/
│           ├── index.html          ✅ Required
│           └── page.json           ✅ Metadata
```

**Live URL:**
```
https://pewpi-infinity.github.io/infinity-spark/Kris/pages/hydrogen-programming/
```

### What Gets Created

**index.html** contains:
- Full page HTML with inline CSS
- Your content with selected features
- SEO meta tags (with your site name)
- Responsive design
- All feature sections (charts, images, etc.)

**page.json** contains:
- Page ID and Token ID
- Title and slug
- Feature flags
- Timestamps
- Publishing metadata

## 🔍 URL Verification

The system automatically verifies pages before marking as "Published":

```typescript
// HEAD request to verify accessibility
const response = await fetch(pageUrl, { method: 'HEAD' })
if (response.ok) {
  status = 'published' ✅
} else {
  status = 'awaiting-build' ⚠️
}
```

### Why Verification Matters

- Prevents showing broken links
- Ensures GitHub Pages build completed
- Provides accurate user feedback
- Triggers rebuild if needed

## 🛠️ GitHub Pages Root Detection

System auto-detects your Pages configuration:

```typescript
// Test for /docs root
const docsTest = await fetch('/docs/index.html', { method: 'HEAD' })
if (docsTest.ok) {
  pagesRoot = '/docs'
  filePath = '/docs/{SiteName}/pages/{slug}/index.html'
} else {
  pagesRoot = '/'
  filePath = '/{SiteName}/pages/{slug}/index.html'
}
```

## 📥 Downloading Files

Published pages show a "Download Page Files" button that exports:
- `index.html` - Ready to commit
- `page.json` - Metadata file

You can:
1. Download files
2. Commit to your repo at `/{YourSiteName}/pages/{slug}/`
3. Push to trigger Pages rebuild
4. Verify at the generated URL

## 🔄 Rebuild Trigger

If a page stays in "Awaiting Build" for >2 minutes, the system automatically:
1. Creates `.gitpages-rebuild` file
2. Commits with timestamp
3. Triggers GitHub Pages rebuild

## 🎯 Success Criteria

A page is only marked **✅ Published** when:
- [x] HTML file generated with proper structure
- [x] File path is `/{SiteName}/pages/{slug}/index.html`
- [x] Metadata JSON created
- [x] Data stored in KV
- [x] URL verification returns 200
- [x] Registry updated
- [x] Live link displayed

## 📊 Page Analytics

Every page tracks:
- Views (incremented on each visit)
- Shares (native or clipboard)
- Edits (feature changes)
- Unique visitors
- Last viewed timestamp
- Engagement score

## 🔗 Token → URL Binding

Published pages create a direct link:

```
Token: INF-MK6GQNUR-YP34FGV
  ↓ Promoted to Page
Page ID: PAGE-MK6GRT91
  ↓ Published
URL: https://pewpi-infinity.github.io/infinity-spark/Kris/pages/hydrogen-programming/
```

View tokens to see their published URLs and navigate directly.

## 🎨 Structure Presets

Each structure applies smart defaults:

**Blank Page**
- No features by default
- Pure content focus

**Knowledge Page**
- ✅ Charts enabled
- ✅ Images enabled

**Business Page**
- ✅ Images enabled
- ✅ Navigation enabled
- ✅ Monetization enabled

**Tool/App Page**
- ✅ Widgets enabled
- ✅ Files enabled

**Multi-page Site**
- ✅ Navigation enabled
- ✅ Images enabled
- ✅ Files enabled

You can modify any preset during feature selection.

## 🚨 Common Issues

### 404 on Published URL
- **Cause**: GitHub Pages hasn't built yet
- **Solution**: Wait 2-3 minutes, check status
- **Status**: Should show "Awaiting Build"

### File Not Found
- **Cause**: Wrong file path or missing `index.html`
- **Solution**: Verify `/{SiteName}/pages/{slug}/index.html` exists

### URL Never Verifies
- **Cause**: Repository Pages not enabled or wrong root
- **Solution**: Check GitHub Pages settings

### Wrong Site Name in URL
- **Cause**: Site configuration not set
- **Solution**: Click gear icon, configure your site name

## 💡 Best Practices

1. **Configure site first** - Set your personalized site name before publishing
2. **Choose structure wisely** - It sets smart defaults
3. **Be selective with features** - Only add what you need
4. **Wait for verification** - Don't share until "Published" status
5. **Download files** - Keep local backups
6. **Check analytics** - Monitor engagement

## 🎯 Design Philosophy

> **Spark is invisible.**
> Your site name is the brand.
> Pages live under your identity, not "spark" or generic paths.
> 
> A page does not exist unless it has a URL.
> UI previews are not pages.
> "Published" without a verified link is invalid.

The system enforces real publishing with verified URLs and personalized site identities, turning your searches into permanent digital artifacts under **your name**.
