/**
 * Simple in-memory rate limiter for Next.js API routes.
 * NOTE: For production deployments on Vercel, serverless functions do not share state.
 * Use Redis (e.g. @upstash/ratelimit) for true distributed rate limiting.
 */

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60000 // default 1 minute
): RateLimitResult {
  const now = Date.now();
  const windowData = rateLimitMap.get(ip);

  if (!windowData) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  // If window expired, reset
  if (now > windowData.expiresAt) {
    windowData.count = 1;
    windowData.expiresAt = now + windowMs;
    return { success: true, limit, remaining: limit - 1, reset: windowData.expiresAt };
  }

  // Increment inside window
  windowData.count += 1;
  const remaining = Math.max(0, limit - windowData.count);

  return {
    success: windowData.count <= limit,
    limit,
    remaining,
    reset: windowData.expiresAt,
  };
}
