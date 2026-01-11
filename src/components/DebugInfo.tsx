import { useEffect } from 'react'

export function DebugInfo() {
  useEffect(() => {
    console.log('[DEBUG] DebugInfo component mounted')
    console.log('[DEBUG] Window.spark available:', typeof window.spark !== 'undefined')
    console.log('[DEBUG] Document ready state:', document.readyState)
    
    return () => {
      console.log('[DEBUG] DebugInfo component unmounted')
    }
  }, [])

  return null
}
