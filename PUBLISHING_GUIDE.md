# 📘 INFINITY Publishing Guide

## Overview

INFINITY is a browser-based publishing system that generates static HTML pages from your searches. Pages are **stored in your browser** until you manually add them to your repository for GitHub Pages hosting.

---

## 🎯 How Publishing Works

### Current Architecture

1. **Search → Token → Page** (all stored in browser KV storage)
2. **"Publish" button** generates HTML files and shows expected URL
3. **Download Files** button lets you save the HTML/JSON locally
4. **You manually commit** the files to your repo
5. **GitHub Pages** builds and hosts your site

---

## 🚀 Step-by-Step Publishing Process

### Step 1: Configure Your Site

1. Click the ⚙️ icon on the search page
2. Enter your site information:
   - **Site Name**: Your personalized site identifier (e.g., "Pixie", "Kris")  
   - **Owner Name**: Your name
   - **GitHub Username**: Your GitHub username
   - **Repository Name**: Your repository name (e.g., "infinity-spark")
   - **Pages Root**: Choose `/` (most common) or `/docs`

3. Click **Save Configuration**

This sets up URLs like:
```
https://<github-user>.github.io/<repo-name>/<site-name>/pages/<page-slug>/
```

Example:
```
https://pewpi-infinity.github.io/infinity-spark/Pixie/pages/memory-1/
```

---

### Step 2: Create Content

1. Enter a search query on the main page
2. Review the generated content and minted token
3. Click **"Build This Into a Page"**

---

### Step 3: Choose Structure

1. Select page type:
   - **Read/Research Page**: Clean article layout
   - **Knowledge Index**: Sectioned documentation
   - **Personal/Family Site**: Timeline and memories
   - **Business Page**: Landing page with CTA
   - **Content Hub**: Media-focused page
   - **Tool/App Page**: Interactive functionality

2. Add optional features by clicking:
   - 📊 Charts
   - 🖼️ Images
   - 🎵 Audio
   - 🎥 Video
   - 📄 Files
   - 🧩 Widgets
   - 🧭 Navigation
   - 💰 Monetization

---

### Step 4: Publish the Page

1. Review your page preview
2. Click **"Publish Live Now"**
3. The system will:
   - Generate `index.html` with your content
   - Generate `page.json` with metadata
   - Show you the expected live URL
   - Mark status as **"Awaiting Pages Build"**

---

### Step 5: Download & Commit Files

**IMPORTANT**: The files are NOT automatically added to your repo. You must do this manually.

#### Option A: Download Files

1. Click **"Download Page Files"** button
2. You'll get two files:
   - `index.html` - The page itself
   - `page.json` - Metadata

3. Create the folder structure in your repo:
```
<site-name>/
  pages/
    <page-slug>/
      index.html
      page.json
```

4. Add, commit, and push:
```bash
git add <site-name>/pages/<page-slug>/
git commit -m "Add page: <page-title>"
git push origin main
```

#### Option B: Manual File Creation

1. Copy the file path shown on the page
2. Create the directory structure in your repo
3. Create `index.html` and paste the generated HTML
4. Create `page.json` and paste the metadata
5. Commit and push as above

---

### Step 6: Verify Publication

1. Wait 2-3 minutes for GitHub Pages to rebuild
2. Click **"Check if Live"** button
3. Once verified, status changes to **"Published"**
4. Click **"View Live"** to see your page on the web

---

## 🔧 GitHub Pages Setup

### Required Repository Settings

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **"GitHub Actions"**
3. The existing `.github/workflows/pages.yml` will handle deployment

### Workflow File

Your repo should have `.github/workflows/pages.yml`:

```yaml
name: Deploy Spark App to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install --no-audit --no-fund
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

This workflow:
1. Builds your Spark app (the SPA that runs the generator)
2. Deploys it to GitHub Pages
3. Any committed page files in `<site-name>/pages/` will also be deployed

---

## 📂 Repository Structure

After publishing pages, your repo will look like:

```
infinity-spark/
├── .github/
│   └── workflows/
│       └── pages.yml          # GitHub Pages deployment
├── src/                       # Spark app source code
├── dist/                      # Built Spark app (auto-generated)
├── Pixie/                     # Example site name
│   └── pages/
│       ├── memory-1/
│       │   ├── index.html
│       │   └── page.json
│       └── memory-2/
│           ├── index.html
│           └── page.json
├── index.html                 # Spark app entry point
└── package.json
```

---

## ⚠️ Important Notes

### Why Manual Commit?

This is a **browser-based application** with no backend server. It cannot:
- Write files directly to your GitHub repository
- Create commits on your behalf
- Push changes automatically

The "Publish" button generates files in browser storage and provides download functionality.

### Workflow Confusion

The workflow you mentioned (`Spark Preview` → `Collect Spark Pages`) is **NOT compatible** with this app. That workflow expects artifacts from a non-existent "Spark Preview" workflow.

The correct workflow is already in your repo: `.github/workflows/pages.yml`

### Pages Not Building?

If pages show "Awaiting Build" indefinitely:

1. **Check if files were committed**: Look in your repo for the `<site-name>/pages/<slug>/` folder
2. **Check Actions tab**: Verify the workflow ran successfully
3. **Check Pages settings**: Ensure GitHub Pages is enabled and source is "GitHub Actions"
4. **Try the rebuild trigger**: The app can't do this automatically, but you can commit an empty file:
   ```bash
   touch .pages-rebuild
   git add .pages-rebuild
   git commit -m "Trigger Pages rebuild"
   git push
   ```

---

## 🎨 Personalizing Your Site

### Multiple Sites in One Repo

You can create multiple personalized sites:

```
your-repo/
├── Pixie/
│   └── pages/
├── Kris/
│   └── pages/
└── AnotherSite/
    └── pages/
```

Each site is independent. Configure the Site Name in the app settings.

### Site Branding

The Site Name you configure appears in:
- Page URLs
- Page metadata
- Footer credits
- Page titles

Users never see "infinity-spark" or "Spark" branding (unless in the repo name).

---

## 🔄 Workflow Summary

```
┌─────────────┐
│   Search    │
└──────┬──────┘
       │
       v
┌─────────────┐
│ Create Page │ (Choose structure & features)
└──────┬──────┘
       │
       v
┌─────────────┐
│   Publish   │ (Generate HTML in browser)
└──────┬──────┘
       │
       v
┌─────────────┐
│  Download   │ (Save files locally)
└──────┬──────┘
       │
       v
┌─────────────┐
│Git Add/Push │ (Manual commit to repo)
└──────┬──────┘
       │
       v
┌─────────────┐
│GitHub Pages │ (Auto-build from workflow)
└──────┬──────┘
       │
       v
┌─────────────┐
│  Live URL!  │
└─────────────┘
```

---

## 💡 Tips & Best Practices

1. **Configure site settings first** - Do this before creating your first page
2. **Use descriptive page titles** - These become the URL slug
3. **Download files immediately** - Browser storage can be cleared
4. **Commit pages in batches** - Reduces rebuild frequency
5. **Wait for verification** - Let GitHub Pages complete its build cycle
6. **Use meaningful site names** - They're part of your public URLs

---

## 🆘 Troubleshooting

### Issue: "Awaiting Build" Forever

**Cause**: Files not in repository  
**Fix**: Download and commit the files manually

### Issue: 404 on Published URL

**Cause**: Workflow hasn't run or files in wrong location  
**Fix**: 
1. Check repo structure matches `<site-name>/pages/<slug>/index.html`
2. Check Actions tab for build failures
3. Verify Pages settings

### Issue: Lost Page Data

**Cause**: Browser storage cleared  
**Fix**: 
- If files were committed to repo, page still lives at its URL
- If not committed, page data is unrecoverable (download files immediately after publishing)

### Issue: Wrong Base URL

**Cause**: Incorrect site configuration  
**Fix**: Click settings ⚙️ and update GitHub username/repo name

---

## 📖 Further Reading

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
- See `PRD.md` for design philosophy
- See `README.md` for development setup

---

**Remember**: INFINITY generates the pages, but **you control publication** by choosing when to commit files to your repository.
