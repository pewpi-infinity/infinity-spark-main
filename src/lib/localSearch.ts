import { synthesizeResearch } from '@/lib/researchEngine'
import { kv } from '@/lib/kv'

/**
 * LocalSearch
 * - Generates research-style content
 * - Stores it in KV
 * - Returns structured result
 */
export async function LocalSearch(query: string) {
  const result = synthesizeResearch(query)

  const key = `page:${result.token.id}`
  kv.set(key, result)

  return result
}
