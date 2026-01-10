import { synthesizeResearch } from "../lib/researchEngine";

export type SearchResult = {
  title: string;
  abstract: string;
  sections: { heading: string; content: string }[];
  siteBlueprint: {
    pages: string[];
    widgets: string[];
    media: string[];
  };
  token: {
    id: string;
    type: string;
    seed: string;
  };
};

export async function runLocalSearch(query: string): Promise<SearchResult> {
  // 1. Generate research-style explanation (Spark replacement)
  const result = synthesizeResearch(query);

  // 2. Persist result (this is the key Spark used to set)
  try {
    localStorage.setItem(
      `page:${result.token.id}`,
      JSON.stringify(result)
    );
  } catch (err) {
    console.error("Failed to set key", err);
  }

  return result;
}

/**
 * Default export for compatibility with existing imports
 * that expect a callable search function.
 */
export default async function LocalSearch(query: string) {
  return runLocalSearch(query);
}
export { LocalSearch } from './LocalSearch'
    
