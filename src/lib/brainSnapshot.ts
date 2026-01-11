export async function loadBrainSnapshot() {
  try {
    const base = import.meta.env.BASE_URL || "/";
    const url = `${base}brain/brain.json`;

    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) {
      console.warn("brain.json not found, using empty snapshot");
      return null;
    }

    const d = await r.json();
    (window as any).INFINITY_BRAIN = d;
    return d;
  } catch (e) {
    console.warn("brain load failed (this is expected for new projects)", e);
    return null;
  }
}
