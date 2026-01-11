# 📚 INFINITY Documentation Index

## Quick Start

👉 **New to INFINITY?** Start here: [YOUR_WORKFLOW.md](./YOUR_WORKFLOW.md)

👉 **Confused about publishing?** Read: [WORKFLOW_SUMMARY.md](./WORKFLOW_SUMMARY.md)

## Documentation Overview

### For Users

| Document | Purpose | Read This If... |
|----------|---------|-----------------|
| **[README.md](./README.md)** | Project overview | You want to understand what INFINITY is |
| **[YOUR_WORKFLOW.md](./YOUR_WORKFLOW.md)** | Exact publishing steps | You want to publish a page right now |
| **[WORKFLOW_SUMMARY.md](./WORKFLOW_SUMMARY.md)** | Quick explanation | You're confused about the workflow |
| **[PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md)** | Complete guide | You want detailed step-by-step instructions |
| **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** | Visual diagrams | You're a visual learner |

### For Developers

| Document | Purpose | Read This If... |
|----------|---------|-----------------|
| **[PRD.md](./PRD.md)** | Product requirements | You want to understand the design philosophy |
| **[WORKFLOW_EXPLANATION.md](./WORKFLOW_EXPLANATION.md)** | Technical details | You want to understand why things work this way |
| **[PUBLISHING.md](./PUBLISHING.md)** | Technical publishing | You're working on the codebase |
| **[FIXES_APPLIED.md](./FIXES_APPLIED.md)** | Development history | You want to see what was changed |

### For Troubleshooting

| Problem | Read This |
|---------|-----------|
| "My pages aren't publishing" | [WORKFLOW_SUMMARY.md](./WORKFLOW_SUMMARY.md) |
| "404 on published URL" | [YOUR_WORKFLOW.md](./YOUR_WORKFLOW.md#common-issues) |
| "Workflow doesn't work" | [WORKFLOW_EXPLANATION.md](./WORKFLOW_EXPLANATION.md) |
| "I don't understand the architecture" | [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) |

## Key Concepts

### 1. Architecture

INFINITY is a **browser-based SPA** (Single Page Application):
- Runs entirely in your browser
- No backend server
- Cannot automatically commit to GitHub
- Uses manual publish workflow

See: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)

### 2. Publishing Workflow

Publishing requires **3 phases**:

1. **Browser** - Generate files (automatic)
2. **Manual** - Download and commit files (you do this)
3. **GitHub** - Build and deploy (automatic)

See: [YOUR_WORKFLOW.md](./YOUR_WORKFLOW.md)

### 3. GitHub Workflow

The workflow in `.github/workflows/pages.yml` is **correct and complete**:
- Builds the Spark app
- Deploys to GitHub Pages
- Includes manually committed files

**Do NOT add** the "Collect Spark Pages" workflow - it's incompatible.

See: [WORKFLOW_EXPLANATION.md](./WORKFLOW_EXPLANATION.md)

## Common Questions

### Q: Why can't it auto-publish?

Browser apps cannot write to GitHub repos. They lack:
- Git client
- GitHub authentication
- File system access to your repo
- API tokens

See: [ARCHITECTURE_DIAGRAM.md - Why Manual Commit Is Required](./ARCHITECTURE_DIAGRAM.md#why-manual-commit-is-required)

### Q: Is the workflow broken?

No. The workflow is perfect. It deploys what's in your repo. If you haven't committed page files, there's nothing to deploy.

See: [WORKFLOW_EXPLANATION.md - The Correct Workflow](./WORKFLOW_EXPLANATION.md#the-correct-workflow-already-in-place)

### Q: What does "Awaiting Build" mean?

It means files are generated in browser storage, but **not yet committed to your repo**. You need to download and commit them.

See: [YOUR_WORKFLOW.md - Step 2: Download Files](./YOUR_WORKFLOW.md#2-download-files)

### Q: Can I make it automatic?

Only with a complete rewrite that adds:
- Backend server
- Database
- GitHub OAuth
- API integration

This transforms it from a simple browser app to a complex SaaS platform.

See: [WORKFLOW_EXPLANATION.md - Alternative: Automated Publishing](./WORKFLOW_EXPLANATION.md#alternative-automated-publishing-would-require-major-changes)

### Q: Where's the "Spark Preview" workflow?

It doesn't exist. That workflow is for a different architecture. INFINITY doesn't use it.

See: [WORKFLOW_SUMMARY.md - The Issue You Encountered](./WORKFLOW_SUMMARY.md#the-issue-you-encountered)

## Quick Reference

### Publishing a Page (5 Steps)

```
1. Generate → Click "Generate Page Files" in app
2. Download → Click "Download Page Files"
3. Create → mkdir -p Site/pages/slug/
4. Commit → git add, git commit, git push
5. Verify → Wait 2-3 min, click "Check if Live"
```

See: [YOUR_WORKFLOW.md](./YOUR_WORKFLOW.md)

### Repository Structure

```
infinity-spark/
├── .github/workflows/pages.yml  ✅ Correct workflow
├── src/                         ✅ Spark app source
├── YourSite/                    ✅ You create this
│   └── pages/
│       └── slug/
│           ├── index.html       ✅ You commit this
│           └── page.json        ✅ You commit this
```

See: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)

### What Gets Deployed

| Location | Content | How |
|----------|---------|-----|
| Root URL | INFINITY app | Workflow builds from src/ |
| Site/pages/slug/ | Published page | You commit manually |

See: [YOUR_WORKFLOW.md - What Each URL Serves](./YOUR_WORKFLOW.md#what-each-url-serves)

## In-App Help

The INFINITY app has built-in help:
- Click **"Publishing Help"** button on any page view
- Shows step-by-step instructions
- Explains why manual commit is required
- Links to this documentation

## Getting Help

### If Pages Aren't Publishing

1. Read: [YOUR_WORKFLOW.md - Common Issues](./YOUR_WORKFLOW.md#common-issues)
2. Check: Did you commit files to the repo?
3. Check: Actions tab - did workflow run?
4. Check: Settings → Pages - is it enabled?
5. Read: [PUBLISHING_GUIDE.md - Troubleshooting](./PUBLISHING_GUIDE.md#-troubleshooting)

### If Workflow Seems Wrong

1. Read: [WORKFLOW_EXPLANATION.md](./WORKFLOW_EXPLANATION.md)
2. Verify: `.github/workflows/pages.yml` exists
3. Don't add: "Collect Spark Pages" workflow
4. The workflow you have is correct!

### If You Don't Understand Architecture

1. Look at: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)
2. Visual diagrams explain the flow
3. Shows why manual commit is required
4. Compares to what the other workflow expected

## Summary

### ✅ Your Workflow Is Correct

The `.github/workflows/pages.yml` file is perfect. Don't change it.

### ✅ Manual Commit Is Required

Browser apps cannot write to GitHub. You must download and commit files manually.

### ✅ Architecture Is By Design

This is a simple browser-based app. Automatic publishing would require a complete rewrite.

### 📖 Full Documentation Available

Everything is documented in detail. Start with [YOUR_WORKFLOW.md](./YOUR_WORKFLOW.md) for immediate steps, or [WORKFLOW_SUMMARY.md](./WORKFLOW_SUMMARY.md) for a quick explanation.

---

**Lost?** Start here: [YOUR_WORKFLOW.md](./YOUR_WORKFLOW.md)

**Technical?** Read: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)

**Just need steps?** See: [WORKFLOW_SUMMARY.md](./WORKFLOW_SUMMARY.md)
