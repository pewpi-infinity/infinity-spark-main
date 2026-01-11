# INFINITY Publishing Guide

## Overview

INFINITY is a browser-based app that generates web pages from search queries. Because it runs entirely in your browser, it **cannot automatically commit files to GitHub**. This guide explains how to publish your generated pages.

## Why Manual Publishing?

This app:
- ✅ Runs entirely in your browser (no backend required)
- ✅ Generates HTML and metadata files
- ✅ Stores files in browser storage
- ❌ Cannot write directly to GitHub repositories
- ❌ Cannot create commits on your behalf
- ❌ Cannot push changes automatically

**You maintain full control over your repository.**

## Publishing Process

### Step 1: Generate Page Files

1. Search for something in INFINITY
2. When results appear, click **"Promote to Page"**
3. Select your page structure (knowledge, business, tool, etc.)
4. Choose features (charts, images, video, etc.)
5. Click **"Generate Page Files"**

The app will generate:
- `index.html` - Your published page
- `page.json` - Metadata and settings

### Step 2: Download Files

After generating, you'll see a **"Download Page Files"** button. Click it to download both files to your computer.

### Step 3: Create Folder Structure

In your repository, create the folder structure shown in the app. For example, if your page slug is `hydrogen-programming`:

```
<your-site-name>/
  pages/
    hydrogen-programming/
      index.html
      page.json
```

**Important:** The folder structure must match exactly what the app shows, or GitHub Pages won't find your files.

### Step 4: Commit and Push

Using Git in your terminal or GitHub Desktop:

```bash
# Add the new files
git add <your-site-name>/pages/<slug>/

# Commit with a descriptive message
git commit -m "Add page: <your-page-title>"

# Push to GitHub
git push origin main
```

### Step 5: Wait for GitHub Pages Build

GitHub Pages takes **2-3 minutes** to rebuild after you push. You can:

1. Check the **Actions** tab in your GitHub repo to see build progress
2. Click **"Check if Live"** button in the app to verify the page is live

## GitHub Pages Setup

Your repository must have GitHub Pages enabled:

1. Go to your repo → **Settings** → **Pages**
2. **Source**: Select "GitHub Actions"
3. Ensure you have a workflow file at `.github/workflows/pages.yml`

### Sample Workflow File

If you don't have a workflow file, create `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v5
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Troubleshooting

### My page shows 404

**Common causes:**

1. **Folder structure mismatch**: Ensure the folder path matches exactly what the app shows
2. **Missing index.html**: The file must be named `index.html`, not `index.htm` or anything else
3. **Pages not enabled**: Check Settings → Pages is configured
4. **Build still running**: Wait 2-3 minutes and check Actions tab
5. **Wrong branch**: Ensure you pushed to the correct branch (usually `main`)

### Files aren't downloading

- Check your browser's download settings
- Make sure pop-ups aren't blocked
- Try a different browser

### URL doesn't match

The app generates URLs based on your site configuration. To change:

1. Click the **Settings** icon on the home page
2. Update your **Site Name**, **GitHub User**, and **Repo Name**
3. The URL format will be: `https://<github-user>.github.io/<repo-name>/<site-name>/pages/<slug>/`

## Site Configuration

### Setting Up Your Site

On first launch, INFINITY will prompt you to configure your site:

- **Site Name**: Your personalized site identity (e.g., "Pixie", "MyKnowledge")
- **Owner Name**: Your name
- **GitHub User**: Your GitHub username
- **Repo Name**: The repository name where pages will be published
- **Pages Root**: Usually `/` (leave default unless you know you need `/docs`)

### Multiple Sites

You can create multiple sites in the same repository by using different Site Names. Each site will have its own folder:

```
repo/
  SiteOne/
    pages/
      page-1/
  SiteTwo/
    pages/
      page-1/
```

## Advanced: Automating Publishing

If you want to automate the process, you would need to:

1. Build a backend service that watches for published pages
2. Use the GitHub API to create commits
3. Host this service somewhere (not in the browser)

This is beyond the scope of this app, which prioritizes simplicity and no-backend operation.

## Support

If you encounter issues:

1. Check the browser console for errors (F12 → Console)
2. Verify your GitHub Pages settings
3. Ensure your workflow file exists and is configured correctly
4. Check that your repository is public (or you have GitHub Pro for private repos)

## Summary

**The publishing process in 5 steps:**

1. ✨ Generate page files in the app
2. ⬇️ Download the files
3. 📁 Create the folder structure in your repo
4. ☁️ Commit and push to GitHub
5. ⏱️ Wait 2-3 minutes for Pages to build

Your page will then be live at the URL shown in the app!
