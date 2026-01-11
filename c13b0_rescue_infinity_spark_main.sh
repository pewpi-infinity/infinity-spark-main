#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

🧱log(){ printf "%b\n" "$*"; }

REPO_URL="https://github.com/pewpi-infinity/infinity-spark-main.git"
DIR="$HOME/infinity-spark-main"
TS="$(date +%Y%m%d_%H%M%S)"

🧱log "🧱⭐🧱 c13b0 RESCUE: infinity-spark-main"

command -v git >/dev/null 2>&1 || { 🧱log "🧱💲🧱 git missing. Run: pkg install git"; exit 1; }

# 1) Get into the repo folder (or clone)
if [ -d "$DIR/.git" ]; then
  🧱log "🧱 Repo exists. Entering: $DIR"
  cd "$DIR"
  git checkout main >/dev/null 2>&1 || git checkout -b main
  git fetch --all --prune || true
  git pull --rebase origin main || true
else
  🧱log "🧱 Repo not found. Cloning to: $DIR"
  git clone "$REPO_URL" "$DIR"
  cd "$DIR"
  git checkout main >/dev/null 2>&1 || git checkout -b main
fi

🧱log "🧱 In folder: $(pwd)"

# 2) Ensure Vite-served brain file exists (MUST be under public/)
🧱log "🧱 Creating public brain snapshot: public/brain/brain.json"
mkdir -p public/brain

cat > public/brain/brain.json <<JSON
{
  "engine": "mongoose",
  "status": "online",
  "updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "note": "Static brain snapshot served by Vite/GitHub Pages",
  "payload": {
    "message": "Infinity brain snapshot loaded successfully."
  }
}
JSON

# 3) Add a tiny loader module (no touching components, no crashes)
LOADER="src/lib/brainSnapshot.ts"
if [ ! -f "$LOADER" ]; then
  🧱log "🧱 Adding loader module: $LOADER"
  mkdir -p src/lib
  cat > "$LOADER" <<'TS'
/**
 * 🧱 c13b0 brain snapshot loader (GitHub Pages safe)
 * Loads /brain/brain.json (served from /public/brain/brain.json by Vite)
 * Exposes window.INFINITY_BRAIN_SNAPSHOT
 */
export async function loadBrainSnapshot(): Promise<any | null> {
  try {
    const r = await fetch("./brain/brain.json", { cache: "no-store" });
    if (!r.ok) return null;
    const data = await r.json();
    (window as any).INFINITY_BRAIN_SNAPSHOT = data;
    return data;
  } catch {
    return null;
  }
}
TS
else
  🧱log "🧱 Loader already exists: $LOADER"
fi

# 4) Import loader from src/main.tsx (safe, minimal, reversible)
MAIN="src/main.tsx"
if [ ! -f "$MAIN" ]; then
  🧱log "🧱💲🧱 ERROR: expected $MAIN but not found."
  🧱log "🧱 Found src files:"
  ls -la src || true
  exit 1
fi

# Backup main.tsx locally (not committed)
BKDIR=".c13b0_backups/$TS"
mkdir -p "$BKDIR"
cp -f "$MAIN" "$BKDIR/main.tsx"

# Ensure import exists
if ! grep -q 'loadBrainSnapshot' "$MAIN"; then
  🧱log "🧱 Patching $MAIN to load brain snapshot at startup"
  # Add import near top (after React imports)
  # If file has imports, inject after first import line; else prepend.
  awk '
    BEGIN{added=0}
    NR==1{
      print $0
      next
    }
    /^import / && added==0{
      print "import { loadBrainSnapshot } from \"./lib/brainSnapshot\";"
      added=1
      print $0
      next
    }
    {print $0}
    END{
      if(added==0){
        # no import lines found, prepend (rare)
      }
    }
  ' "$MAIN" > "$MAIN.tmp" && mv "$MAIN.tmp" "$MAIN"
fi

# Ensure call exists (does not affect rendering)
if ! grep -q 'loadBrainSnapshot();' "$MAIN"; then
  🧱log "🧱 Injecting loadBrainSnapshot() call (non-blocking)"
  echo -e '\n// 🧱 c13b0: load static brain snapshot (non-blocking)\nloadBrainSnapshot();\n' >> "$MAIN"
fi

# 5) Show what changed
🧱log "🧱 Changes status:"
git status -sb || true

# 6) Commit + push only if there are changes
git add public/brain/brain.json "$LOADER" "$MAIN" || true

if git diff --cached --quiet; then
  🧱log "🧱⭐🧱 Nothing to commit. Repo already in desired state."
else
  🧱log "🧱👑🧱 Committing…"
  git commit -m "🧱 c13b0: load static brain snapshot from public/brain (Pages-safe)" || true
  🧱log "🧱🚀 Pushing…"
  git push origin main
fi

🧱log ""
🧱log "🧱⭐✨⭐🧱 DONE."
🧱log "🧱 Site: https://pewpi-infinity.github.io/infinity-spark-main/"
🧱log "🧱 Brain file should be reachable at: https://pewpi-infinity.github.io/infinity-spark-main/brain/brain.json"
