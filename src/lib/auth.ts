import 'server-only'

import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const ADMIN_COOKIE_NAME = 'admin_auth'
export const ADMIN_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7 // 7 days
const ADMIN_COOKIE_MAX_AGE_MS = ADMIN_COOKIE_MAX_AGE_SEC * 1000

function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_PIN
  return secret && secret.length > 0 ? secret : null
}

/** Cookie value: `authenticated.<timestamp>.<hmac-hex>` */
export function signAdminCookie(secret: string): string {
  const payload = `authenticated.${Date.now()}`
  const signature = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${signature}`
}

export function verifyAdminCookieValue(
  value: string | undefined | null,
  secret: string | null = getAdminSecret()
): boolean {
  if (!secret || !value) return false

  const lastDot = value.lastIndexOf('.')
  if (lastDot <= 0) return false

  const payload = value.slice(0, lastDot)
  const signature = value.slice(lastDot + 1)
  if (!payload || !signature) return false

  const expected = createHmac('sha256', secret).update(payload).digest('hex')

  try {
    const sigBuf = Buffer.from(signature, 'utf8')
    const expBuf = Buffer.from(expected, 'utf8')
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return false
    }
  } catch {
    return false
  }

  const parts = payload.split('.')
  if (parts.length !== 2 || parts[0] !== 'authenticated') return false

  const issuedAt = Number(parts[1])
  if (!Number.isFinite(issuedAt)) return false
  if (Date.now() - issuedAt > ADMIN_COOKIE_MAX_AGE_MS) return false

  return true
}

/** Server actions: redirect to login if cookie missing/invalid. */
export async function assertAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (!verifyAdminCookieValue(value)) {
    redirect('/admin')
  }
}

/**
 * Fail-closed AI API key check.
 * Returns a Response on failure; returns null when authorized.
 * Never treats a missing env key as authorized.
 */
export function assertAiApiKey(request: Request): Response | null {
  const secretKey = process.env.AI_AGENT_API_KEY
  if (!secretKey) {
    return Response.json(
      { error: 'AI_AGENT_API_KEY chưa được cấu hình' },
      { status: 503 }
    )
  }

  const apiKeyHeader = request.headers.get('x-api-key')
  const authHeader = request.headers.get('authorization')
  const bearer = authHeader?.replace(/^Bearer\s+/i, '').trim()

  if (apiKeyHeader === secretKey || bearer === secretKey) {
    return null
  }

  return Response.json(
    { error: 'Unauthorized: Invalid or missing API Key' },
    { status: 401 }
  )
}
