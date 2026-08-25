import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE_NAME = 'admin_auth'
const ADMIN_COOKIE_MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000

function hexToUint8Array(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return null
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

async function verifyAdminCookieEdge(
  value: string | undefined,
  secret: string
): Promise<boolean> {
  if (!value) return false

  const lastDot = value.lastIndexOf('.')
  if (lastDot <= 0) return false

  const payload = value.slice(0, lastDot)
  const signatureHex = value.slice(lastDot + 1)
  if (!payload || !signatureHex) return false

  const signatureBytes = hexToUint8Array(signatureHex)
  if (!signatureBytes) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes as BufferSource,
    encoder.encode(payload)
  )
  if (!valid) return false

  const parts = payload.split('.')
  if (parts.length !== 2 || parts[0] !== 'authenticated') return false

  const issuedAt = Number(parts[1])
  if (!Number.isFinite(issuedAt)) return false
  if (Date.now() - issuedAt > ADMIN_COOKIE_MAX_AGE_MS) return false

  return true
}

export default async function proxy(request: NextRequest) {
  const secret = process.env.ADMIN_PIN
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value

  // Fail-closed: missing ADMIN_PIN or invalid/missing signature → login
  if (!secret) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  const ok = await verifyAdminCookieEdge(adminCookie, secret)
  if (!ok) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/dashboard/:path*',
}
