type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5000

function prune(now: number) {
  if (buckets.size < MAX_BUCKETS) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
  remaining: number
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  prune(now)
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: Math.max(0, limit - 1),
    }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      remaining: 0,
    }
  }

  existing.count += 1
  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, limit - existing.count),
  }
}

export function clearRateLimit(...keys: string[]) {
  for (const key of keys) buckets.delete(key)
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}
