type RateLimitEntry = {
  timestamps: number[];
};

export function createRateLimiter({ windowMs, maxRequests }: { windowMs: number; maxRequests: number }) {
  const requests = new Map<string, RateLimitEntry>();

  function getFreshTimestamps(ip: string, now: number) {
    const existing = requests.get(ip) ?? { timestamps: [] };
    return existing.timestamps.filter((timestamp) => now - timestamp < windowMs);
  }

  return {
    check(ip: string | null) {
      if (!ip) {
        return {
          allowed: true,
          retryAfterSeconds: null,
        };
      }

      const now = Date.now();
      const freshTimestamps = getFreshTimestamps(ip, now);

      if (freshTimestamps.length >= maxRequests) {
        requests.set(ip, { timestamps: freshTimestamps });

        const oldestTimestamp = freshTimestamps[0] ?? now;
        const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldestTimestamp)) / 1000));

        return {
          allowed: false,
          retryAfterSeconds,
        };
      }

      freshTimestamps.push(now);
      requests.set(ip, { timestamps: freshTimestamps });

      return {
        allowed: true,
        retryAfterSeconds: null,
      };
    },
    isAllowed(ip: string | null) {
      return this.check(ip).allowed;
    },
  };
}
