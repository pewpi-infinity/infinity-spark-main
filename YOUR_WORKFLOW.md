# Your Publishing Workflow - Exact Steps

## Current Situation

You have:
- ✅ INFINITY app deployed at GitHub Pages
- ✅ Working `pages.yml` workflow
- ✅ Browser-based page generator
- ❌ No automatic file commits (by design)

## The Correct Workflow File

Your `.github/workflows/pages.yml` is **perfect as-is**. Don't change it. Don't add the "Collect Spark Pages" workflow.

## How To Publish A Page

### 1. Generate Page in Browser

1. Open your INFINITY app at `https://pewpi-infinity.github.io/infinity-spark/`
2. Search for something (generates token)
3. Click "Build This Into a Page"
4. Choose structure and features
5. Click **"Generate Page Files"**

This creates files in **browser storage only**.

### 2. Download Files

After generation, scroll down and click **"Download Page Files"**

You'll get:
- `index.html` - The page
- `page.json` - Metadata

### 3. Create Folder Structure

In your `infinity-spark` repository, create:

```
infinity-spark/
├── YourSiteName/        ← Use the site name from settings
    └── pages/
        └── your-page-slug/
            ├── index.html    ← Put downloaded file here
            └── page.json     ← Put downloaded file here
```

### 4. Commit & Push

```bash
# Navigate to your repo
cd infinity-spark

# Create the folder structure
mkdir -p YourSiteName/pages/your-page-slug

# Move downloaded files (adjust paths as needed)
mv ~/Downloads/index.html YourSiteName/pages/your-page-slug/
mv ~/Downloads/page.json YourSiteName/pages/your-page-slug/

# Add to git
git add YourSiteName/

# Commit
git commit -m "Add page: your-page-slug"

# Push
git push origin main
```

### 5. Wait For Build

1. Go to your repo → **Actions** tab
2. You'll see `pages-build-deployment` running
3. Wait for it to complete (usually 2-3 minutes)

### 6. Verify Live

1. Go back to the page in INFINITY app
2. Click **"Check if Live"**
3. If verified, click **"View Live"**

Your page is now at:
```
https://pewpi-infinity.github.io/infinity-spark/YourSiteName/pages/your-page-slug/
```

## Example: Publishing "Hydrogen Programming" Page

### Step 1: Generate in browser
- Site name configured: "Kris"
- Page title: "Hydrogen Programming"
- Generated slug: "hydrogen-programming"

### Step 2: Download files
- `index.html` downloaded
- `page.json` downloaded

### Step 3: Create structure
```bash
mkdir -p Kris/pages/hydrogen-programming
mv ~/Downloads/index.html Kris/pages/hydrogen-programming/
mv ~/Downloads/page.json Kris/pages/hydrogen-programming/
```

### Step 4: Commit
```bash
git add Kris/
git commit -m "Add page: Hydrogen Programming"
git push origin main
```

### Step 5: Live URL
```
https://pewpi-infinity.github.io/infinity-spark/Kris/pages/hydrogen-programming/
```

## Batch Publishing Multiple Pages

If you have multiple pages to publish:

```bash
# Download all page files first (use the download button for each)

# Then commit them all at once
mkdir -p YourSite/pages/page-1
mkdir -p YourSite/pages/page-2
mkdir -p YourSite/pages/page-3

mv ~/Downloads/index.html YourSite/pages/page-1/
mv ~/Downloads/index-1.html YourSite/pages/page-2/index.html
mv ~/Downloads/index-2.html YourSite/pages/page-3/index.html

# Same for JSON files

git add YourSite/
git commit -m "Add 3 new pages"
git push origin main
```

## Repository Structure After Publishing

```
infinity-spark/
├── .github/
│   └── workflows/
│       └── pages.yml          # Your working workflow
│
├── src/                       # Spark app source
├── dist/                      # Built app (auto-generated)
│
├── Pixie/                     # Example site 1
│   └── pages/
│       ├── memory-1/
│       │   ├── index.html
│       │   └── page.json
│       └── memory-2/
│           ├── index.html
│           └── page.json
│
├── Kris/                      # Example site 2
│   └── pages/
│       └── hydrogen-programming/
│           ├── index.html
│           └── page.json
│
└── index.html                 # Spark app entry
```

## What Each URL Serves

| URL | Serves |
|-----|--------|
| `pewpi-infinity.github.io/infinity-spark/` | The INFINITY app (React SPA) |
| `pewpi-infinity.github.io/infinity-spark/Pixie/pages/memory-1/` | Published page (manual commit) |
| `pewpi-infinity.github.io/infinity-spark/Kris/pages/hydrogen-programming/` | Published page (manual commit) |

## Common Issues

### Issue: "Page says 'Awaiting Build' but never goes live"

**Cause:** Files not committed to repo

**Fix:** Download files and commit them manually (see steps above)

### Issue: "404 on page URL"

**Cause:** One of:
- Files not in correct location
- Wrong folder structure
- Workflow hasn't run yet
- Pages not enabled

**Fix:**
1. Verify files exist at `<SiteName>/pages/<slug>/index.html`
2. Check Actions tab for workflow status
3. Wait 2-3 minutes for build
4. Check repo Settings → Pages is enabled

### Issue: "Downloaded files have weird names"

**Cause:** Browser adds numbers to prevent overwrites

**Fix:** Rename to `index.html` and `page.json` when moving to repo

## Why This Process?

**Q: Why can't it auto-commit?**

This is a browser app. It has no way to:
- Authenticate with GitHub
- Write files to your repo
- Create commits
- Push changes

Those require either:
- GitHub OAuth + backend server
- GitHub API tokens (security risk)
- Git client in browser (doesn't exist)

**Q: Is manual commit a bug?**

No. It's a feature. You get:
- ✅ Full control over what's published
- ✅ No authentication hassles
- ✅ Standard git workflow
- ✅ Review before going live
- ✅ No backend infrastructure needed

## Alternative: Automated Publishing

To make it automatic, you'd need to build:

1. **Backend server** (Node.js/Python/etc.)
2. **Database** to store page data
3. **GitHub OAuth** for authentication
4. **GitHub API integration** for commits
5. **Webhook workflows** to trigger builds
6. **User management** system

This transforms a simple browser app into a complex SaaS platform.

## Summary

### DO:
✅ Use the existing `pages.yml` workflow  
✅ Download files from the app  
✅ Commit them manually to your repo  
✅ Wait for GitHub Pages to build  
✅ Verify pages go live  

### DON'T:
❌ Add "Collect Spark Pages" workflow  
❌ Expect files to appear in repo automatically  
❌ Assume "Awaiting Build" means it's publishing  
❌ Try to create artifact-based workflows  

## Resources

- **In-app help:** Click "Publishing Help" button
- **[PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md)** - Detailed guide
- **[WORKFLOW_EXPLANATION.md](./WORKFLOW_EXPLANATION.md)** - Technical details
- **[WORKFLOW_SUMMARY.md](./WORKFLOW_SUMMARY.md)** - Quick explanation

---

**The workflow you have is correct. The manual commit step is required and intentional.**
