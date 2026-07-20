# FIX PLAN
## Skate Judging System - Navigation Failure Resolution

**Date:** July 20, 2026
**Based on:** ROOT_CAUSE_REPORT.md

---

## CRITICAL FIXES (Must Complete First)

### Fix 1: Login Page Navigation Failure
**File:** `packages/web/src/app/auth/login/page.tsx`
**Issue:** `window.location.replace('/dashboard')` not executing or being blocked
**Root Cause:** Form submission interference or JavaScript error

**Solution Options:**

**Option A: Use Next.js Router (Recommended)**
```typescript
import { useRouter } from 'next/navigation';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    await login(email, password);
    router.push('/dashboard');
    router.refresh(); // Force refresh to ensure middleware runs
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed');
  } finally {
    setIsLoading(false);
  }
};
```

**Option B: Use window.location.href with Delay**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    await login(email, password);
    // Small delay to ensure state updates
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed');
  } finally {
    setIsLoading(false);
  }
};
```

**Option C: Use form action attribute**
```typescript
<form onSubmit={handleSubmit} action="/dashboard">
```

**Selected Solution:** Option A (Next.js Router with refresh)

**Implementation Steps:**
1. Remove `window.location.replace('/dashboard')`
2. Add `router.refresh()` after `router.push('/dashboard')`
3. Remove debug logs (optional, can keep for now)
4. Test navigation

---

### Fix 2: Restore Dashboard Page
**File:** `packages/web/src/app/dashboard/page.tsx`
**Issue:** Currently simplified to `<h1>DASHBOARD WORKS</h1>`
**Root Cause:** Simplified for debugging

**Solution:** Restore full dashboard with useAuth hook

**Implementation:**
```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Skate Judging Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.display_name || `${user?.first_name} ${user?.last_name}`}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome to the Skate Judging Platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage your skateboarding events</p>
              <Button className="w-full">View Events</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage rider profiles and registrations</p>
              <Button className="w-full">View Riders</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Judges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage judge assignments and certifications</p>
              <Button className="w-full">View Judges</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage competition categories and divisions</p>
              <Button className="w-full">View Categories</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage organization settings and branding</p>
              <Button className="w-full">View Organizations</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Configure system settings and preferences</p>
              <Button className="w-full">View Settings</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
```

---

## HIGH PRIORITY FIXES

### Fix 3: Vercel Configuration
**File:** `vercel.json` (new file)
**Issue:** No explicit Vercel configuration
**Root Cause:** Missing deployment configuration

**Solution:** Add vercel.json at repository root

**Implementation:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "packages/web/.next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rootDirectory": "."
}
```

---

## LOW PRIORITY FIXES (Optional)

### Fix 4: Remove Debug Logs
**Files:** Multiple files with console.log statements
**Issue:** Debug logs cluttering production
**Root Cause:** Added during debugging

**Solution:** Remove or conditionally enable debug logs

**Files to Update:**
- `packages/web/src/lib/auth.ts`
- `packages/web/src/contexts/AuthContext.tsx`
- `packages/web/src/middleware.ts`
- `packages/web/src/app/auth/login/page.tsx`
- `packages/web/src/app/dashboard/page.tsx`
- `packages/web/src/lib/supabase.ts`
- `packages/web/src/app/layout.tsx`

**Implementation Strategy:**
```typescript
// Add debug flag
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log("DEBUG MESSAGE");
}
```

---

### Fix 5: Add Error Boundaries
**Files:** `packages/web/src/app/layout.tsx` and new error boundary component
**Issue:** No error handling for component errors
**Root Cause:** Missing error boundaries

**Solution:** Add ErrorBoundary wrapper

**Implementation:**
```typescript
// components/ErrorBoundary.tsx
'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Update layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

### Fix 6: Optimize API Route Supabase Clients
**Files:** All API route files
**Issue:** Creating new Supabase instances in each route
**Root Cause:** Not using singleton pattern

**Solution:** Create shared Supabase client utility for API routes

**Implementation:**
```typescript
// lib/api-supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let apiSupabaseInstance: ReturnType<typeof createClient> | null = null;

export const getApiSupabase = () => {
  if (!apiSupabaseInstance) {
    apiSupabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return apiSupabaseInstance;
};
```

---

## IMPLEMENTATION ORDER

1. **Fix 1:** Login page navigation (CRITICAL)
2. **Fix 2:** Restore dashboard page (CRITICAL)
3. **Fix 3:** Vercel configuration (HIGH)
4. **Fix 4:** Remove debug logs (LOW - optional)
5. **Fix 5:** Add error boundaries (LOW - optional)
6. **Fix 6:** Optimize API clients (LOW - optional)

---

## TESTING CHECKLIST

After implementing fixes:

- [ ] Login with valid credentials
- [ ] Verify navigation to /dashboard completes
- [ ] Verify middleware logs appear
- [ ] Verify dashboard renders with user data
- [ ] Verify logout works
- [ ] Test protected routes redirect to login
- [ ] Test auth routes redirect to dashboard when logged in
- [ ] Verify session persistence after page refresh
- [ ] Test in production build
- [ ] Verify Vercel deployment uses correct configuration

---

## ROLLBACK PLAN

If fixes introduce new issues:

1. Revert to commit `9ff2659`
2. Test alternative navigation approach (Option B or C)
3. Incrementally apply fixes
4. Test after each fix
