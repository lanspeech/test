type RateLimitEntry = {
  count: number;
  reset: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __rateLimitStore?: Map<string, RateLimitEntry>;
};

const store = globalForRateLimit.__rateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalForRateLimit.__rateLimitStore) {
  globalForRateLimit.__rateLimitStore = store;
}

export function applyRateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.reset <= now) {
    const reset = now + windowMs;
    store.set(key, { count: 1, reset });
    return {
      success: true,
      remaining: limit - 1,
      reset,
    };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.reset,
    };
  }

  entry.count += 1;
  store.set(key, entry);

  return {
    success: true,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.reset,
  };
}

export function secondsUntil(timestamp: number): number {
  return Math.max(0, Math.ceil((timestamp - Date.now()) / 1000));
}
