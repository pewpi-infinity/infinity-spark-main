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
