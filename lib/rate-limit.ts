import "server-only";

/**
 * Rate-limiting abstraction.
 *
 * Dev/default: in-memory sliding window — per-process only, resets on restart,
 * NOT sufficient for production (serverless instances don't share memory).
 *
 * PRODUCTION REQUIREMENT (documented, not yet wired): Upstash Redis via
 * @upstash/ratelimit + @upstash/redis, selected automatically when
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are set. Until that
 * dependency is added, startup in production logs a warning through env
 * validation docs; do not launch publicly without it.
 */

export interface RateLimiter {
  /** Returns whether this key may proceed, and how many attempts remain. */
  limit(key: string): Promise<{ success: boolean; remaining: number }>;
}

class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();
  constructor(
    private max: number,
    private windowMs: number,
  ) {}

  async limit(key: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const arr = (this.hits.get(key) ?? []).filter((t) => t > windowStart);
    if (arr.length >= this.max) {
      this.hits.set(key, arr);
      return { success: false, remaining: 0 };
    }
    arr.push(now);
    this.hits.set(key, arr);
    // Opportunistic cleanup to bound memory.
    if (this.hits.size > 10_000) {
      const stale: string[] = [];
      this.hits.forEach((v, k) => {
        if (v.every((t) => t <= windowStart)) stale.push(k);
      });
      stale.forEach((k) => this.hits.delete(k));
    }
    return { success: true, remaining: this.max - arr.length };
  }
}

let leadLimiter: RateLimiter | null = null;

/** Lead-form limiter: 5 submissions per IP per 10 minutes. */
export function getLeadRateLimiter(): RateLimiter {
  if (!leadLimiter) {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      // Placeholder until the Upstash dependency is approved/added:
      console.warn(
        "⚠ UPSTASH_REDIS_* set but @upstash/ratelimit is not installed yet — falling back to in-memory limiter. Add the dependency before production launch.",
      );
    }
    leadLimiter = new MemoryRateLimiter(5, 10 * 60 * 1000);
  }
  return leadLimiter;
}
