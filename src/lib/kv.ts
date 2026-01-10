import { useState, useEffect } from "react";

/* ---------- Global KV (logic layer) ---------- */
export const kv = {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  },
  remove(key: string) {
    localStorage.removeItem(key);
  }
};

/* ---------- React Hook (UI layer) ---------- */
export function useKV<T>(key: string, defaultValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => kv.get(key, defaultValue));

  useEffect(() => {
    kv.set(key, value);
  }, [key, value]);

  return [value, setValue];
}
