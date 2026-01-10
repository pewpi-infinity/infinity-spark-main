import { useEffect, useState } from "react"

// Spark KV exists only inside Spark runtime.
// On GitHub Pages, we fall back to localStorage.
function hasSparkKV(): boolean {
  return typeof (globalThis as any).spark !== "undefined"
    && typeof (globalThis as any).spark.kv !== "undefined"
    && typeof (globalThis as any).spark.kv.get === "function"
    && typeof (globalThis as any).spark.kv.set === "function"
}

type SetState<T> = (next: T | ((prev: T) => T)) => void

export function useKV<T>(key: string, defaultValue: T): [T, SetState<T>] {
  const [value, setValue] = useState<T>(defaultValue)

  // Load once
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (hasSparkKV()) {
          const v = await (globalThis as any).spark.kv.get(key)
          if (!cancelled) setValue((v ?? defaultValue) as T)
          return
        }

        const raw = localStorage.getItem(key)
        if (!raw) {
          if (!cancelled) setValue(defaultValue)
          return
        }
        if (!cancelled) setValue(JSON.parse(raw) as T)
      } catch {
        if (!cancelled) setValue(defaultValue)
      }
    }

    load()
    return () => { cancelled = true }
  }, [key])

  // Save whenever value changes
  useEffect(() => {
    async function save() {
      try {
        if (hasSparkKV()) {
          await (globalThis as any).spark.kv.set(key, value)
          return
        }
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // swallow — never white-screen because storage failed
      }
    }

    save()
  }, [key, value])

  const set: SetState<T> = (next) => {
    setValue((prev) => (typeof next === "function" ? (next as any)(prev) : next))
  }

  return [value, set]
    }
    
