// src/components/BrainResult.tsx
import { useEffect, useState } from 'react'

type BrainData = {
  query: string
  summary: string
  insights: string[]
  timestamp: string
}

export default function BrainResult() {
  const [data, setData] = useState<BrainData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/generated/hydrogen_helium_atomic_coherence.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load brain output')
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
  }, [])

  if (error) return <div>Error: {error}</div>
  if (!data) return <div>Loading brain output…</div>

  return (
    <div style={{ padding: 16 }}>
      <h2>{data.query}</h2>
      <p>{data.summary}</p>
      <ul>
        {data.insights.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
      <small>{new Date(data.timestamp).toLocaleString()}</small>
    </div>
  )
    }
                 
