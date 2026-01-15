export const cache = {
  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as unknown as T
    }
  },
  set(key: string, value: unknown) {
    const raw = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, raw)
  },
  remove(key: string) {
    localStorage.removeItem(key)
  }
}

