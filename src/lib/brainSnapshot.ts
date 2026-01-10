export async function loadBrainSnapshot() {
  try {
    const r = await fetch("./brain/brain.json", { cache: "no-store" });
    if (!r.ok) return null;
    const d = await r.json();
    (window as any).INFINITY_BRAIN = d;
    return d;
  } catch {
    return null;
  }
}
