# GitHub API Publishing Guide for INFINITY

## Overview

INFINITY now uses **GitHub REST API** to publish pages directly to the `c13b0/infinity-spark` repository. This replaces the previous KV-storage approach and provides instant publishing with automated deployment via GitHub Pages.

## How It Works

1. **GitHub Authentication**: User provides a fine-grained Personal Access Token (PAT) with write access to the repository
2. **Token Storage**: Token is stored securely in Spark KV storage (never hardcoded or exposed)
3. **API Publishing**: When publishing, the app calls GitHub's REST API to create/update files
4. **Auto Deployment**: GitHub Pages automatically builds and deploys within 1-3 minutes

## For Users: Getting Started

### Step 1: Create a GitHub Token

1. Go to **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. Click **"Generate new token"**
3. Configure the token:
   - **Name**: `INFINITY Publishing`
   - **Expiration**: Choose your preferred duration
   - **Repository access**: Select **"Only select repositories"** → Choose `c13b0/infinity-spark`
   - **Repository permissions**:
     - **Contents**: Read and write ✓

4. Click **"Generate token"** and copy it immediately

### Step 2: Authenticate in INFINITY

1. Create a page in INFINITY
2. Click **"Setup & Publish"** button
3. When prompted, paste your GitHub token
4. Click **"Verify & Save Token"**

The token is stored securely and you won't need to enter it again.

### Step 3: Publish Pages

1. After building a page, click **"Publish to GitHub"**
2. The page is committed to the repository via GitHub API
3. GitHub Pages builds automatically
4. Your page is live in 1-3 minutes at: `https://c13b0.github.io/infinity-spark/pages/[slug]/`

## For Repository Owner: Setup Requirements

### Repository Configuration

The `c13b0/infinity-spark` repository must have:

1. **GitHub Pages enabled** with source set to `main` branch, `/` (root)
2. **Public visibility** (required for GitHub Pages)
3. A basic `index.html` in the root (can be the INFINITY app itself)

### Directory Structure

Pages are published to:
```
infinity-spark/
├── index.html (INFINITY app or landing)
├── pages/
│   ├── page-slug-1/
│   │   └── index.html
│   ├── page-slug-2/
│   │   └── index.html
│   └── ...
```

### GitHub Actions (Optional but Recommended)

While not strictly necessary (GitHub Pages auto-deploys), you can add a workflow for monitoring:

```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
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
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Technical Implementation

### API Endpoints Used

- `PUT /repos/{owner}/{repo}/contents/{path}` - Create or update files
- `GET /repos/{owner}/{repo}/contents/{path}` - Get existing file SHA (for updates)
- `GET /user` - Verify token validity
- `GET /repos/{owner}/{repo}` - Verify repository access

### File Format

Published pages are complete HTML files with:
- Embedded CSS (no external dependencies)
- Cosmic minimalist theme matching INFINITY
- Responsive mobile-first design
- Semantic metadata (title, description, keywords)

### Security

- **Token storage**: Spark KV (user-specific, encrypted at rest)
- **Token transmission**: HTTPS only via GitHub API
- **No exposure**: Token never appears in code, logs, or UI
- **Verification**: Token validated before first use

## Troubleshooting

### "Invalid token or insufficient permissions"
- Verify token has **Contents: Read and write** permission
- Ensure token has access to `c13b0/infinity-spark` repository
- Check token hasn't expired

### "Cannot access infinity-spark repository"
- Verify repository exists and is accessible
- Check repository name is exactly `c13b0/infinity-spark`
- Ensure token has correct repository access

### "Page not appearing after 3+ minutes"
- Check GitHub Pages is enabled in repository settings
- Verify main branch contains the committed file
- Look at repository Actions tab for build status
- Try manually triggering a Pages rebuild in settings

### "403 Forbidden" errors
- Token may lack necessary permissions
- Rate limit may be exceeded (60 requests/hour for authenticated)
- Repository may have branch protection rules

## Advantages Over Previous Approach

### Old System (KV Storage + Owner Deployment)
- ❌ Owner had to manually deploy pages
- ❌ Delays of hours/days before pages went live
- ❌ Users couldn't see immediate results
- ❌ Required Python scripts and manual process

### New System (GitHub API)
- ✅ Instant publishing via API
- ✅ Live in 1-3 minutes (GitHub Pages build time)
- ✅ Direct commit to repository
- ✅ No manual intervention needed
- ✅ Full audit trail in Git history
- ✅ Users control their own publishing

## API Rate Limits

GitHub API rate limits:
- **Authenticated requests**: 5,000 requests per hour
- **Per-token**: Based on token owner's account

For INFINITY use case, this is more than sufficient as each publish is typically 1-2 API calls.

## Future Enhancements

Possible improvements:
- Batch publishing for multiple pages
- Custom domain support
- Page analytics integration
- Direct editing of published pages
- Version history and rollback
- Custom themes per page

## Support

For issues or questions:
1. Check GitHub repository Actions tab for build status
2. Verify token permissions in GitHub settings
3. Check browser console for detailed error messages
4. File an issue in the INFINITY repository
