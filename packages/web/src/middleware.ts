import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log("MIDDLEWARE EXECUTED", req.nextUrl.pathname);
  console.log("MIDDLEWARE - START", req.nextUrl.pathname);
  console.log("MIDDLEWARE - Method:", req.method);
  console.log("MIDDLEWARE - Headers:", Object.fromEntries(req.headers.entries()));

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log("MIDDLEWARE - session:", session ? "EXISTS" : "NULL");
  console.log("MIDDLEWARE - session user:", session?.user?.id);

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

  console.log("MIDDLEWARE - isProtectedRoute:", isProtectedRoute);
  console.log("MIDDLEWARE - isAuthRoute:", isAuthRoute);

  if (isProtectedRoute && !session) {
    console.log("MIDDLEWARE - Redirecting to login (no session on protected route)");
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAuthRoute && session) {
    console.log("MIDDLEWARE - Redirecting to dashboard (session exists on auth route)");
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  console.log("MIDDLEWARE - Allowing request to proceed");
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
