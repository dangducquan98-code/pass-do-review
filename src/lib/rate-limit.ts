import 'server-only'

type AttemptRecord = {
  count: number
  resetAt: number
}

/** In-memory limiter — không persist giữa serverless instances; đủ quy mô nhỏ. */
const loginAttempts = new Map<string, AttemptRecord>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 phút

export function checkLoginRateLimit(ip: string): {
  allowed: boolean
  retryAfterSec?: number
} {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || now >= record.resetAt) {
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((record.resetAt - now) / 1000),
    }
  }

  return { allowed: true }
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || now >= record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return
  }

  record.count += 1
}

export function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip)
}
