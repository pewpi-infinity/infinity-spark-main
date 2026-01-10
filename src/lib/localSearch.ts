import { synthesizeResearch } from "../lib/researchEngine";
import { kv } from "../lib/kv";

/**
 * LocalSearch replacement that:
 * - Generates a structured research-style result
 * - Stores it via the app’s KV system
 * - Returns the result for rendering
 */
export default async function LocalSearch(query: string) {
  console.log("[LocalSearch] called with:", query);

  // Generate research article style result
  const result = synthesizeResearch(query);
  console.log("[LocalSearch] synthesized:", result);

  // Compute the same key format the rest of the app expects
  const key = `page:${result.token.id}`;
  console.log("[LocalSearch] writing key:", key);

  try {
    kv.set(key, result);
    console.log("[LocalSearch] kv.set OK");
  } catch (err) {
    console.error("[LocalSearch] kv.set FAILED", err);
  }

  return result;
}
