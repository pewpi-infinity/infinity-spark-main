import { synthesizeResearch } from '@/lib/researchEngine'
import { kv } from '@/lib/kv'

export async function LocalSearch(query: string) {
  const result = synthesizeResearch(query)
  kv.set(`page:${result.token.id}`, result)
  return result
}

export default LocalSearch
