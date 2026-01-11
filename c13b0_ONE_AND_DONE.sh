#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

log(){ printf "%s\n" "$*"; }

REPO="infinity-spark-main"
URL="https://github.com/pewpi-infinity/infinity-spark-main.git"

log "🧱 C13B0 START"

# 1) Force HOME and repo
cd "$HOME" || { log "❌ cannot cd HOME"; exit 1; }

if [ ! -d "$REPO/.git" ]; then
  log "🧱 cloning $REPO"
  git clone "$URL" "$REPO" || { log "❌ clone failed"; exit 1; }
fi

cd "$REPO" || { log "❌ cannot cd $REPO"; exit 1; }

log "🧱 IN DIR: $(pwd)"

# 2) Verify git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { log "❌ not a git repo"; exit 1; }

# 3) Rebase cleanly
log "🧱 pulling with rebase"
git fetch origin
git pull --rebase origin main || { log "❌ rebase failed"; exit 1; }

# 4) Ensure Vite-served brain snapshot
log "🧱 ensuring public/brain/brain.json"
mkdir -p public/brain
cat > public/brain/brain.json <<JSON
{
  "engine": "mongoose",
  "status": "online",
  "updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "note": "static snapshot"
}
JSON

# 5) Add tiny loader (non-destructive)
LOADER="src/lib/brainSnapshot.ts"
mkdir -p src/lib
cat > "$LOADER" <<'TS'
export async function loadBrainSnapshot() {
  try {
    const r = await fetch("./brain/brain.json", { cache: "no-store" });
    if (!r.ok) return null;
    const d = await r.json();
    (window as any).INFINITY_BRAIN = d;
    return d;
  } catch { return null; }
}
TS

# 6) Patch main.tsx to call loader (append-only)
MAIN="src/main.tsx"
[ -f "$MAIN" ] || { log "❌ src/main.tsx missing"; exit 1; }

grep -q 'loadBrainSnapshot' "$MAIN" || {
  log "🧱 patching main.tsx"
  printf '\nimport { loadBrainSnapshot } from "./lib/brainSnapshot";\nloadBrainSnapshot();\n' >> "$MAIN"
}

# 7) Commit & push
log "🧱 committing"
git add public/brain/brain.json "$LOADER" "$MAIN"
git commit -m "🧱 c13b0: static brain snapshot (Pages-safe)" || log "🧱 nothing new to commit"

log "🧱 pushing"
git push origin main || { log "❌ push failed"; exit 1; }

log "🧱 DONE"
log "🧱 SITE: https://pewpi-infinity.github.io/infinity-spark-main/"
log "🧱 BRAIN: https://pewpi-infinity.github.io/infinity-spark-main/brain/brain.json"
