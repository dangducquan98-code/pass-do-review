import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const adminCookie = request.cookies.get('admin_auth')
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin/dashboard')

  if (isAdminPath && adminCookie?.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/dashboard/:path*',
}
