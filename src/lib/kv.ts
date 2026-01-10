import { useState, useEffect } from "react";

/* ---------- Global KV (non-React, logic layer) ---------- */

export const kv = {
  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("KV set failed", err);
    }
  },

  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  delete(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};

/* ---------- React Hook (UI layer) ---------- */

export function useKV<T>(key: string, defaultValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() =>
    kv.get<T>(key, defaultValue)
  );

  useEffect(() => {
    kv.set(key, value);
  }, [key, value]);

  return [value, setValue];
}
