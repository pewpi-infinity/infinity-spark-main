import { synthesizeResearch } from "../lib/researchEngine";
import { kv } from "../lib/kv";

export default async function LocalSearch(query: string) {
  // 1. Generate research article (Spark replacement)
  const result = synthesizeResearch(query);

  // 2. Compute the SAME key Spark used
  const key = `page:${result.token.id}`;

  // 3. Store through KV (not localStorage directly)
  try {
    kv.set(key, result);
  } catch (err) {
    console.error("Failed to set key", err);
  }

  // 4. Return result for immediate rendering
  return result;
}
