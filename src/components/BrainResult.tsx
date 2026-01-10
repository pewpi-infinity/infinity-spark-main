export default function BrainResult() {
  const brain = (window as any).INFINITY_BRAIN;

  if (!brain) {
    return <div>🧠 Brain not loaded yet</div>;
  }

  return (
    <div style={{ padding: "1rem", fontFamily: "monospace" }}>
      <h3>🧠 Infinity Brain Snapshot</h3>
      <pre>{JSON.stringify(brain, null, 2)}</pre>
    </div>
  );
}
