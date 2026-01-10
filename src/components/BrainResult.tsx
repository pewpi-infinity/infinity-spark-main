import { useEffect, useState } from "react";

type BrainData = {
  engine?: string;
  status?: string;
  payload?: any;
};

export default function BrainResult() {
  const [brain, setBrain] = useState<BrainData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/brain/brain.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("brain.json not found");
        return r.json();
      })
      .then((data) => {
        setBrain(data);
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  if (error) {
    return <div>🧠 Brain load failed</div>;
  }

  if (!brain) {
    return <div>🧠 Loading brain…</div>;
  }

  return (
    <div>
      <h3>🧠 Infinity Brain</h3>
      <pre>{JSON.stringify(brain, null, 2)}</pre>
    </div>
  );
}
