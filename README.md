# INFINITY - Search → Token → Page Engine

A browser-based publishing system that transforms searches into knowledge tokens and publishable web pages.

> **📖 New to publishing?** Read [WORKFLOW_SUMMARY.md](./WORKFLOW_SUMMARY.md) for a quick explanation of how publishing works with this app.

## 🎯 What is INFINITY?

INFINITY is a self-contained application where:
- **Every search generates knowledge** and mints a token
- **Tokens can be promoted** to full web pages
- **Pages publish under personalized site names** (not generic "spark" branding)
- **Structure emerges from user choices**, not forced templates

## 🚀 Quick Start

1. **Configure your site** (⚙️ icon on search page)
   - Set your site name (e.g., "Pixie", "Kris")
   - Enter GitHub username and repo name
   
2. **Search for anything** to generate content and mint tokens

3. **Build pages** from search results by choosing:
   - Page structure (Read-only, Knowledge, Business, Tool, Multi-page)
   - Optional features (Charts, Images, Audio, Video, Navigation, etc.)

4. **Publish pages** - but read below about the manual process!

## ⚠️ Important: How Publishing Actually Works

**This is a browser-based SPA with NO backend server.** It cannot automatically commit files to GitHub.

### When you click "Publish":
- ✅ HTML and metadata are generated in browser storage
- ✅ Expected URL is calculated and shown
- ❌ Files are **NOT** written to your repository
- 👉 **You must download and commit them manually**

### Publishing Workflow:
1. Click "Publish Live Now" (generates files)
2. Click "Download Page Files" (saves `index.html` and `page.json`)
3. Create folder structure: `<site-name>/pages/<slug>/`
4. Add files to that location in your repo
5. Commit and push to trigger GitHub Pages rebuild
6. Wait 2-3 minutes for Pages to build
7. Click "Check if Live" to verify

**See [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md) for detailed step-by-step instructions.**

## 📂 Repository Structure

```
your-repo/
├── .github/workflows/
│   └── pages.yml          # Deploys the Spark app (NOT individual pages)
├── src/                   # Spark app source code
├── dist/                  # Built Spark app (deployed to Pages)
│
├── YourSiteName/          # Your personalized site (you create this)
│   └── pages/
│       └── page-slug/
│           ├── index.html  # You add these files manually
│           └── page.json
│
└── index.html             # Spark app entry point
```

## 🔄 The Workflow Confusion

The workflow in `.github/workflows/pages.yml` **only deploys the Spark application itself**, not individual published pages.

It builds the React SPA and deploys it to GitHub Pages. This gives you the INFINITY interface at your GitHub Pages URL.

**It does NOT:**
- Collect page artifacts
- Auto-commit generated pages
- Publish pages from browser storage

Those workflows are incompatible with this browser-based architecture.

## 🎨 Features

- **Search-driven content generation** using LLM
- **Token minting** for every search
- **Progressive page building** with optional features
- **Personalized site identities** (your name, not "spark")
- **Analytics tracking** (views, shares, engagement)
- **Token archives** with search and filtering
- **Page index** for all published pages

## 🛠️ Development

```bash
npm install
npm run dev
```

The app uses:
- React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Spark KV storage for persistence
- Spark LLM API for content generation

## 📖 Documentation

Full documentation suite available:

- **[DOCS_INDEX.md](./DOCS_INDEX.md)** - Complete documentation index
- **[YOUR_WORKFLOW.md](./YOUR_WORKFLOW.md)** - Quick start publishing guide  
- **[WORKFLOW_SUMMARY.md](./WORKFLOW_SUMMARY.md)** - Publishing workflow explanation
- **[PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md)** - Comprehensive publishing guide
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual architecture diagrams
- **[WORKFLOW_EXPLANATION.md](./WORKFLOW_EXPLANATION.md)** - Technical workflow details
- **[PRD.md](./PRD.md)** - Product requirements and design philosophy
- **[PUBLISHING.md](./PUBLISHING.md)** - Technical publishing details
- **[FIXES_APPLIED.md](./FIXES_APPLIED.md)** - Development history

## 🎯 Design Philosophy

> **Spark is invisible. Your site name is the brand.**
> 
> Pages live under your identity, not "spark" or generic paths.
> A page does not exist unless it has a URL.
> Structure emerges from choices, not templates.

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
