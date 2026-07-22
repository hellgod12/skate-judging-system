import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { supabaseResponse, user } = await updateSession(req)

  // Protected routes
  const protectedPaths = ['/dashboard', '/admin', '/judge', '/operator']
  const isProtectedRoute = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  )

  // Auth routes (redirect if already logged in)
  const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password']
  const isAuthRoute = authPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
