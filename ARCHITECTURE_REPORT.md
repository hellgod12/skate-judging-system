# ARCHITECTURE REPORT
## Skate Judging System - Complete Repository Architecture

**Date:** July 21, 2026
**Phase:** 1 - Repository Audit

---

## REPOSITORY STRUCTURE

### Root Directory
```
j:\app juri skate/
├── .env                          # Environment variables (local)
├── .env.example                  # Environment variables template
├── .git/                         # Git repository
├── .github/                      # GitHub workflows
├── .gitignore                    # Git ignore rules
├── .turbo/                       # Turbo cache
├── database/                     # Database schemas and migrations
├── node_modules/                 # npm dependencies
├── package.json                  # Root package.json (monorepo)
├── package-lock.json             # npm lock file
├── packages/                     # Monorepo packages
│   ├── web/                      # Next.js web application
│   └── scoring/                 # TypeScript scoring library
├── scripts/                      # Build/deployment scripts
├── turbo.json                    # Turbo configuration
└── vercel.json                   # Vercel configuration
```

### Documentation Files (Root)
30+ markdown files including:
- ARCHITECTURE_DOCUMENTATION.md (v2, v3, v4 versions)
- API_STRUCTURE.md (v2, v3, v4 versions)
- DEPLOYMENT_PLAN.md
- MIGRATION_PLAN.md
- TESTING_PLAN.md
- Various UI plans (ADMIN_CMS, DISPLAY, JUDGE, OBS, OPERATOR, PUBLIC)
- Audit reports (DATABASE_AUDIT, PRODUCTION_AUDIT, SECURITY_REPORT)
- Bug reports and test reports

**Status:** DOCUMENTATION BLOAT - Multiple versions suggest outdated files

---

## MONOREPO CONFIGURATION

### Root package.json
```json
{
  "name": "skate-judging-app",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.11.0"
  }
}
```

**Status:** CORRECT - Standard Turbo monorepo setup

---

## TURBO CONFIGURATION

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

**Status:** CORRECT - Build pipeline properly configured with dependency graph

**Analysis:**
- Build depends on ^build (build dependencies first)
- Outputs configured for .next directory (relative to each package)
- Dev mode has no cache (correct for development)
- Test depends on build (correct)

---

## WORKSPACE CONFIGURATION

### packages/web (Next.js Application)
```
packages/web/
├── .next/                        # Next.js build output
├── .turbo/                       # Turbo cache
├── next-env.d.ts                 # Next.js TypeScript definitions
├── next.config.js                # Next.js configuration
├── package.json                 # Web package dependencies
├── postcss.config.js             # PostCSS configuration
├── src/                          # Source code
│   ├── app/                      # Next.js App Router
│   ├── components/               # React components
│   ├── contexts/                 # React contexts
│   ├── lib/                      # Library code
│   └── middleware.ts             # Next.js middleware
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

### packages/web/package.json
```json
{
  "name": "@skate-judging/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2"
  }
}
```

**Status:** CORRECT - Standard Next.js package with proper dependencies

### packages/scoring (TypeScript Library)
```
packages/scoring/
├── dist/                         # Compiled output
├── src/                          # Source code
│   ├── __tests__/               # Jest tests
│   └── index.ts                 # Library entry point
├── jest.config.js               # Jest configuration
├── package.json                 # Scoring package dependencies
└── tsconfig.json                # TypeScript configuration
```

### packages/scoring/package.json
```json
{
  "name": "@skate-judging/scoring",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "@types/jest": "^29.5.5",
    "@types/node": "^20.8.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "typescript": "^5.2.2"
  }
}
```

**Status:** CORRECT - Standard TypeScript library package

---

## NEXT.JS CONFIGURATION

### packages/web/next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

**Status:** MINIMAL - No custom configuration beyond reactStrictMode

**Analysis:**
- No output directory specified (uses default .next)
- No custom webpack configuration
- No rewrites or redirects
- No image optimization configuration
- No environment variable validation

---

## VERCEL CONFIGURATION

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

**Status:** PROBLEMATIC - Configuration assumes Root Directory = packages/web

**Issues:**
1. `outputDirectory: ".next"` only works if Root Directory = packages/web
2. If Root Directory = repository root, should be `packages/web/.next`
3. Cannot verify without checking Vercel Dashboard
4. Path doubling error suggests configuration mismatch

---

## SUPABASE CONFIGURATION

### packages/web/src/lib/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isBuildTime = typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      if (isBuildTime) {
        return createClient('https://mock.supabase.co', 'mock-key') as any
      }
      throw new Error('Missing Supabase environment variables')
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'sb-skate-judging-auth-token',
      }
    })
  }
  return supabaseInstance
}

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const instance = getSupabase()
    return instance[prop as keyof typeof instance]
  },
})
```

**Status:** CORRECT - Singleton pattern with build-time mock

**Analysis:**
- Singleton pattern prevents multiple instances
- Build-time mock client for SSG/SSR
- Auth options properly configured
- Custom storage key for session
- Lazy initialization via Proxy

---

## MIDDLEWARE CONFIGURATION

### packages/web/src/middleware.ts
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Debug logs (wrapped in NODE_ENV check)
  
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

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

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

**Status:** CORRECT - Proper middleware implementation

**Analysis:**
- Uses createMiddlewareClient (correct for Next.js middleware)
- Session checking for protected routes
- Redirect logic for auth routes
- Matcher excludes API and static assets
- Debug logs wrapped in NODE_ENV check

---

## AUTHENTICATION ARCHITECTURE

### AuthContext (packages/web/src/contexts/AuthContext.tsx)
```typescript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import type { User, AuthState } from '@/lib/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to check authentication',
      });
    }
  };

  const login = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const response = await AuthService.login({ email, password });
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  };

  const register = async (data: any) => { /* ... */ };
  const logout = async () => { /* ... */ };
  const refreshUser = async () => { /* ... */ };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**Status:** CORRECT - Standard React Context pattern

**Analysis:**
- Single AuthProvider at root layout
- State management for user, isAuthenticated, isLoading, error
- Methods: login, register, logout, refreshUser
- Debug logs wrapped in NODE_ENV check
- Proper error handling

---

## ROUTING ARCHITECTURE

### App Router Structure
```
packages/web/src/app/
├── admin/
│   └── roles/
│       └── page.tsx              # Admin roles page
├── api/                          # API routes (32 endpoints)
│   ├── attempts/
│   ├── categories/
│   ├── debug-attempts/
│   ├── debug-riders/
│   ├── diagnostics/
│   ├── events/
│   ├── heat-assignments/
│   ├── heats/
│   ├── judge-assignments/
│   ├── judges/
│   ├── organizations/
│   ├── permissions/
│   ├── riders/
│   ├── roles/
│   ├── rounds/
│   ├── test-env/
│   ├── timers/
│   ├── tricks/
│   └── user-roles/
├── auth/
│   ├── forgot-password/
│   │   └── page.tsx              # Forgot password page
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Register page
│   └── reset-password/
│       └── page.tsx              # Reset password page
├── dashboard/
│   └── page.tsx                  # Dashboard page
├── debug-attempts/
│   └── page.tsx                  # Debug attempts page
├── display/
│   └── page.tsx                  # Display page
├── judge/
│   └── page.tsx                  # Judge page
├── leaderboard/
│   └── page.tsx                  # Leaderboard page
├── operator/
│   └── page.tsx                  # Operator page
├── scoreboard/
│   └── page.tsx                  # Scoreboard page
├── test/
│   └── page.tsx                  # Test page
├── globals.css                   # Global styles
├── layout.tsx                    # Root layout
└── page.tsx                      # Home page
```

**Status:** CORRECT - Standard App Router structure

**Analysis:**
- Single root layout (no nested layouts)
- 14 page routes
- 32 API routes
- All auth pages in /auth directory
- Protected routes: /dashboard, /admin, /judge, /operator
- Debug pages: /debug-attempts, /test (should be removed in production)

---

## PROVIDERS ARCHITECTURE

### Root Layout (packages/web/src/app/layout.tsx)
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skate Judging System',
  description: 'SLS-style skateboard street competition judging system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Status:** CORRECT - Single provider at root

**Analysis:**
- AuthProvider wraps entire application
- No duplicate providers
- No nested providers
- No ErrorBoundary
- No Suspense

---

## LAYOUTS ARCHITECTURE

### Layout Hierarchy
```
RootLayout (packages/web/src/app/layout.tsx)
└── AuthProvider
    └── children (all pages)
```

**Status:** SIMPLE - Single layout, no nesting

**Analysis:**
- No nested layouts
- No route groups
- No parallel routes
- No intercepting routes

---

## BUILD SYSTEM ARCHITECTURE

### Build Commands
```
Root: npm run build → turbo run build
  ↓
packages/web: next build → packages/web/.next
  ↓
packages/scoring: tsc → packages/scoring/dist
```

**Status:** CORRECT - Turbo orchestrates builds

**Analysis:**
- Turbo runs build in dependency order
- Web package outputs to .next
- Scoring package outputs to dist
- Build verified successful locally

---

## COMPONENT ARCHITECTURE

### UI Components (packages/web/src/components/ui/)
```
ui/
├── alert.tsx                     # Alert component
├── button.tsx                    # Button component
├── card.tsx                      # Card component
├── input.tsx                     # Input component
├── label.tsx                     # Label component
└── slider.tsx                    # Slider component
```

**Status:** MINIMAL - Basic UI components from shadcn/ui pattern

**Analysis:**
- Radix UI primitives
- Tailwind styling
- class-variance-authority for variants
- No custom components beyond basic UI

---

## LIB ARCHITECTURE

### Library Modules (packages/web/src/lib/)
```
lib/
├── archive.ts                    # Archive operations
├── auth.ts                       # Authentication service
├── branding.ts                   # Branding operations
├── category.ts                   # Category operations
├── competition-settings.ts       # Competition settings
├── competition.ts                 # Competition operations
├── event.ts                      # Event operations
├── heat-assignment.ts           # Heat assignment operations
├── judge.ts                      # Judge operations
├── leaderboard.ts                # Leaderboard operations
├── organization.ts               # Organization operations
├── rbac.ts                       # RBAC operations
├── report.ts                     # Report operations
├── rider.ts                     # Rider operations
├── score.ts                      # Score operations
├── scoring.ts                    # Scoring operations
├── session.ts                    # Session operations
├── settings.ts                   # Settings operations
├── sponsor.ts                    # Sponsor operations
├── supabase.ts                   # Supabase client
├── timer.ts                      # Timer operations
├── trick.ts                      # Trick operations
├── utils.ts                      # Utility functions
└── types/                        # TypeScript types
    ├── archive.ts
    ├── auth.ts
    ├── branding.ts
    ├── category.ts
    ├── competition-settings.ts
    ├── competition.ts
    ├── event.ts
    ├── heat-assignment.ts
    ├── judge.ts
    ├── leaderboard.ts
    ├── organization.ts
    ├── rbac.ts
    ├── report.ts
    ├── rider.ts
    ├── score.ts
    ├── session.ts
    ├── settings.ts
    ├── sponsor.ts
    ├── timer.ts
    └── trick.ts
```

**Status:** ORGANIZED - Clear separation of concerns

**Analysis:**
- Each module has corresponding types file
- AuthService handles authentication
- Supabase client singleton
- No circular dependencies detected

---

## TYPESCRIPT CONFIGURATION

### packages/web/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Status:** CORRECT - Standard Next.js TypeScript configuration

**Analysis:**
- Path alias @/* configured
- Strict mode enabled
- Next.js plugin configured
- Incremental compilation enabled

---

## TAILWIND CONFIGURATION

### packages/web/tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f0ff',
          pink: '#ff00ff',
          green: '#00ff00',
          purple: '#a855f7',
        },
      },
    },
  },
  plugins: [],
}
export default config
```

**Status:** INCORRECT - Includes pages directory which doesn't exist

**Issue:**
- `./src/pages/**/*.{js,ts,jsx,tsx,mdx}` - Project uses App Router, no pages directory
- This is harmless but incorrect

---

## ENVIRONMENT VARIABLES

### .env.example
```
NEXT_PUBLIC_SUPABASE_URL=https://uqxjrfdzsevpoghulktl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Status:** CORRECT - Properly named environment variables

**Analysis:**
- NEXT_PUBLIC_ prefix for client-side variables
- Supabase URL and anon key
- No server-only secrets in example

---

## ARCHITECTURE SUMMARY

### Correct Components
- ✅ Monorepo structure (Turbo + npm workspaces)
- ✅ Turbo configuration
- ✅ Next.js App Router
- ✅ Single root layout
- ✅ Single AuthProvider
- ✅ Middleware at correct location
- ✅ Supabase singleton pattern
- ✅ TypeScript configuration
- ✅ Environment variables

### Problematic Components
- ❌ Vercel configuration (outputDirectory mismatch)
- ❌ Tailwind configuration (includes non-existent pages directory)
- ❌ Documentation bloat (multiple versions)
- ❌ Debug pages in production code
- ❌ Extensive debug logging in production code

### Missing Components
- ❌ Error boundaries
- ❌ Suspense boundaries
- ❌ Loading states
- ❌ Error handling UI

---

## ARCHITECTURE DECISIONS

### Good Decisions
1. **Turbo Monorepo** - Proper build orchestration
2. **App Router** - Modern Next.js routing
3. **Singleton Supabase Client** - Prevents multiple instances
4. **Context API for Auth** - Standard React pattern
5. **TypeScript** - Type safety throughout

### Questionable Decisions
1. **API Routes Create New Clients** - Inconsistent with singleton pattern
2. **Extensive Debug Logging** - Wrapped in NODE_ENV but still present
3. **Multiple Schema Versions** - Unclear which is current
4. **No Migration Strategy** - Multiple full schemas instead of incremental migrations

### Bad Decisions
1. **Vercel Configuration Ambiguity** - Cannot verify without dashboard access
2. **Documentation Bloat** - Multiple versions not maintained
3. **Debug Pages in Production** - Should be removed or conditional

---

## DEPENDENCY GRAPH

### Root Dependencies
```
turbo (^1.11.0)
```

### Web Package Dependencies
```
@supabase/supabase-js (^2.38.0)
@supabase/auth-helpers-nextjs (^0.8.7)
next (14.0.4)
react (^18.2.0)
react-dom (^18.2.0)
lucide-react (^0.294.0)
clsx (^2.0.0)
tailwind-merge (^2.0.0)
@radix-ui/react-label (^2.0.2)
@radix-ui/react-slot (^1.0.2)
@radix-ui/react-alert-dialog (^1.0.5)
class-variance-authority (^0.7.0)
```

### Scoring Package Dependencies
```
jest (^29.7.0)
ts-jest (^29.1.1)
typescript (^5.2.2)
```

**Status:** NO DUPLICATE LIBRARIES DETECTED

---

## CALL GRAPH

### Authentication Flow
```
LoginPage (useAuth.login)
  ↓
AuthContext.login
  ↓
AuthService.login
  ↓
Supabase Client (signInWithPassword)
  ↓
AuthService.getCurrentUser (profile fetch/create)
  ↓
AuthContext.setState
  ↓
Dashboard renders
```

### Middleware Flow
```
Request
  ↓
Middleware (createMiddlewareClient)
  ↓
Supabase Client (getSession)
  ↓
Route check (protected/auth)
  ↓
Redirect or proceed
  ↓
Page renders
```

---

## ARCHITECTURE ISSUES SUMMARY

### Critical Issues
1. Vercel configuration mismatch (deployment failure)

### High Priority Issues
1. No clear migration strategy (database uncertainty)
2. Inconsistent Supabase client creation (API routes)
3. Debug code in production (performance/security)

### Medium Priority Issues
1. Documentation bloat (repository confusion)
2. Tailwind config includes non-existent directory

### Low Priority Issues
1. No error boundaries
2. No suspense boundaries
3. Debug pages in production code
