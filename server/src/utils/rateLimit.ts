type RateLimitEntry = {
  timestamps: number[];
};

export function createRateLimiter({ windowMs, maxRequests }: { windowMs: number; maxRequests: number }) {
  const requests = new Map<string, RateLimitEntry>();

  return {
    isAllowed(ip: string | null) {
      if (!ip) {
        return true;
      }

      const now = Date.now();
      const existing = requests.get(ip) ?? { timestamps: [] };
      const freshTimestamps = existing.timestamps.filter((timestamp) => now - timestamp < windowMs);

      if (freshTimestamps.length >= maxRequests) {
        requests.set(ip, { timestamps: freshTimestamps });
        return false;
      }

      freshTimestamps.push(now);
      requests.set(ip, { timestamps: freshTimestamps });
      return true;
    },
  };
}
