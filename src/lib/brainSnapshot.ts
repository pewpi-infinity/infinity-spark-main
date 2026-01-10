export async function loadBrainSnapshot() {
  try {
    const base = import.meta.env.BASE_URL || "/";
    const url = `${base}brain/brain.json`;

    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("brain.json not found");

    const d = await r.json();
    (window as any).INFINITY_BRAIN = d;
    return d;
  } catch (e) {
    console.error("brain load failed", e);
    return null;
  }
}
