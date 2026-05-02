// AI response cache and in-flight deduplication

const cache = new Map<string, unknown>()
const inflight = new Map<string, Promise<unknown>>()

export function getCacheKey(opts: {
  prompt: string
  system?: string
  json?: boolean
}): string {
  return JSON.stringify({ p: opts.prompt, s: opts.system, j: opts.json })
}

export function getCached(key: string): unknown | undefined {
  return cache.get(key)
}

export function setCached(key: string, value: unknown): void {
  cache.set(key, value)
}

export function deleteCached(key: string): void {
  cache.delete(key)
}

export function getInflight(key: string): Promise<unknown> | undefined {
  return inflight.get(key)
}

export function setInflight(key: string, promise: Promise<unknown>): void {
  inflight.set(key, promise)
  promise.finally(() => inflight.delete(key))
}

export function clearCache(): void {
  cache.clear()
  inflight.clear()
}
