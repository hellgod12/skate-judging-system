# DEPENDENCY REPORT
## Skate Judging System - Complete Dependency Audit

**Date:** July 21, 2026
**Phase:** 2 - Dependency Audit

---

## DEPENDENCY TREE

### Root Dependencies
```
skate-judging-app@1.0.0
├── turbo@1.13.4
├── @skate-judging/scoring@1.0.0
└── @skate-judging/web@1.0.0
```

### Web Package Dependencies
```
@skate-judging/web@1.0.0
├── @radix-ui/react-alert-dialog@1.1.19
├── @radix-ui/react-label@2.1.11
├── @radix-ui/react-slot@1.3.0
├── @supabase/auth-helpers-nextjs@0.8.7
├── @supabase/supabase-js@2.110.7
├── @types/node@20.19.43 (deduped)
├── @types/react-dom@18.3.7
├── @types/react@18.3.31
├── autoprefixer@10.5.4
├── class-variance-authority@0.7.1
├── clsx@2.1.1
├── eslint-config-next@14.0.4
├── eslint@8.57.1
├── lucide-react@0.294.0
├── next@14.0.4
├── postcss@8.5.19
├── react-dom@18.3.1
├── react@18.3.1
├── tailwind-merge@2.6.1
├── tailwindcss@3.4.19
└── typescript@5.9.3 (deduped)
```

### Scoring Package Dependencies
```
@skate-judging/scoring@1.0.0
├── @types/jest@29.5.14
├── @types/node@20.19.43
├── jest@29.7.0
├── ts-jest@29.4.11
└── typescript@5.9.3
```

---

## DUPLICATE LIBRARIES DETECTION

### React Versions
- **web package:** react@18.3.1
- **scoring package:** None (no React dependency)
- **Status:** NO DUPLICATE - Single React version across monorepo

### Next.js Versions
- **web package:** next@14.0.4
- **scoring package:** None (no Next.js dependency)
- **Status:** NO DUPLICATE - Single Next.js version

### Supabase Versions
- **@supabase/supabase-js:** 2.110.7 (package.json specifies ^2.38.0, resolved to 2.110.7)
- **@supabase/auth-helpers-nextjs:** 0.8.7
- **Status:** NO DUPLICATE - Single Supabase version

### TypeScript Versions
- **root:** typescript@5.9.3 (deduped)
- **web:** typescript@5.9.3 (deduped)
- **scoring:** typescript@5.9.3
- **Status:** NO DUPLICATE - Single TypeScript version

### @types/node Versions
- **web:** @types/node@20.19.43 (deduped)
- **scoring:** @types/node@20.19.43
- **Status:** NO DUPLICATE - Single @types/node version

---

## DUPLICATE AUTH HELPERS DETECTION

### Supabase Auth Helpers
- **@supabase/auth-helpers-nextjs:** 0.8.7 (single instance)
- **Usage locations:**
  - `src/middleware.ts` - createMiddlewareClient
  - No other auth helper packages detected
- **Status:** NO DUPLICATE - Single auth helper package

---

## MULTIPLE SUPABASE CLIENTS DETECTION

### Client Creation Patterns

#### Pattern 1: Singleton (lib/supabase.ts)
```typescript
// Singleton pattern with Proxy
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const instance = getSupabase()
    return instance[prop as keyof typeof instance]
  },
})
```
**Usage:** Client-side components, lib modules
**Status:** CORRECT - Singleton pattern

#### Pattern 2: Middleware Client (middleware.ts)
```typescript
const supabase = createMiddlewareClient({ req, res })
```
**Usage:** Next.js middleware
**Status:** CORRECT - Required for middleware

#### Pattern 3: API Route Clients (8 files)
```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
**Usage:** API routes
**Files:**
- `app/api/tricks/route.ts`
- `app/api/riders/[id]/attempts/route.ts`
- `app/api/diagnostics/route.ts`
- `app/api/events/[id]/leaderboard/route.ts`
- `app/api/debug-riders/route.ts`
- `app/api/debug-attempts/route.ts`
- `app/api/attempts/route.ts`

**Status:** INCONSISTENT - API routes create new clients instead of using shared utility

**Analysis:**
- API routes should use a shared server-side Supabase client utility
- Current pattern creates a new client for each request
- This is acceptable for server-side but inconsistent with singleton pattern

---

## UNUSED PACKAGES DETECTION

### Web Package
All dependencies are actively used:
- `@supabase/*` - Authentication and database
- `next` - Framework
- `react*` - UI framework
- `lucide-react` - Icons
- `clsx`, `tailwind-merge` - Styling utilities
- `@radix-ui/*` - UI primitives
- `class-variance-authority` - Component variants

**Status:** NO UNUSED PACKAGES DETECTED

### Scoring Package
All dependencies are actively used:
- `jest*` - Testing
- `typescript` - Compilation

**Status:** NO UNUSED PACKAGES DETECTED

---

## CONFLICTING VERSIONS DETECTION

### Version Conflicts
- **None detected** - All versions are compatible
- TypeScript 5.9.3 is compatible across all packages
- React 18.3.1 is compatible with Next.js 14.0.4
- Supabase 2.110.7 is compatible with auth-helpers-nextjs 0.8.7

**Status:** NO CONFLICTING VERSIONS

---

## PEER DEPENDENCIES DETECTION

### Web Package Peer Dependencies
- **next:** 14.0.4 (no peer dependency conflicts)
- **react:** 18.3.1 (no peer dependency conflicts)
- **react-dom:** 18.3.1 (no peer dependency conflicts)

### Radix UI Peer Dependencies
- All Radix UI packages require React 16.8+ or 18+
- Current React version: 18.3.1 ✅
- **Status:** NO PEER DEPENDENCY CONFLICTS

---

## CIRCULAR IMPORTS DETECTION

### Import Graph Analysis
```
lib/supabase.ts → (no imports from project)
lib/auth.ts → lib/supabase.ts
contexts/AuthContext.tsx → lib/auth.ts
app/layout.tsx → contexts/AuthContext.tsx
app/auth/login/page.tsx → contexts/AuthContext.tsx
app/dashboard/page.tsx → contexts/AuthContext.tsx
```

**Status:** NO CIRCULAR IMPORTS DETECTED

**Verification:** TypeScript compilation succeeded

---

## WRONG ALIASES DETECTION

### TypeScript Path Aliases
```json
"paths": {
  "@/*": ["./src/*"]
}
```

**Usage verification:**
- `@/contexts/AuthContext` → `src/contexts/AuthContext.tsx` ✅
- `@/lib/auth` → `src/lib/auth.ts` ✅
- `@/components/ui/button` → `src/components/ui/button.tsx` ✅

**Status:** ALL ALIASES CORRECT

---

## DEPENDENCY VERSION ANALYSIS

### Package.json vs Installed Versions

#### Web Package
| Package | package.json | Installed | Status |
|---------|--------------|-----------|--------|
| @supabase/supabase-js | ^2.38.0 | 2.110.7 | ✅ Compatible |
| @supabase/auth-helpers-nextjs | ^0.8.7 | 0.8.7 | ✅ Exact |
| next | 14.0.4 | 14.0.4 | ✅ Exact |
| react | ^18.2.0 | 18.3.1 | ✅ Compatible |
| react-dom | ^18.2.0 | 18.3.1 | ✅ Compatible |
| typescript | ^5.2.2 | 5.9.3 | ✅ Compatible |

#### Scoring Package
| Package | package.json | Installed | Status |
|---------|--------------|-----------|--------|
| typescript | ^5.2.2 | 5.9.3 | ✅ Compatible |
| jest | ^29.7.0 | 29.7.0 | ✅ Exact |

**Status:** ALL VERSIONS COMPATIBLE

---

## DEPENDENCY SECURITY ANALYSIS

### Vulnerability Scanning
**Status:** NOT PERFORMED - Requires npm audit command

**Note:** This should be run as part of the fix plan

---

## DEPENDENCY SUMMARY

### Correct Components
- ✅ No duplicate libraries
- ✅ No duplicate React versions
- ✅ No duplicate Next.js versions
- ✅ No duplicate Supabase versions
- ✅ No duplicate TypeScript versions
- ✅ No duplicate auth helpers
- ✅ No unused packages
- ✅ No conflicting versions
- ✅ No peer dependency conflicts
- ✅ No circular imports
- ✅ All path aliases correct
- ✅ All versions compatible

### Issues Found
- ⚠️ API routes create new Supabase clients instead of using shared utility (inconsistent pattern)

### Recommendations
1. Create shared server-side Supabase client utility for API routes
2. Run `npm audit` to check for security vulnerabilities
3. Consider pinning exact versions for production stability

---

## DEPENDENCY GRAPH

```
Root (skate-judging-app)
├── turbo
├── @skate-judging/scoring
│   ├── typescript
│   ├── jest
│   └── @types/*
└── @skate-judging/web
    ├── next
    ├── react
    ├── react-dom
    ├── @supabase/supabase-js
    ├── @supabase/auth-helpers-nextjs
    ├── @radix-ui/*
    ├── lucide-react
    ├── clsx
    ├── tailwind-merge
    ├── class-variance-authority
    ├── eslint
    └── typescript (deduped)
```

---

## DEPENDENCY HEALTH SCORE

**Overall Score:** 9/10

**Deductions:**
- -1 for inconsistent Supabase client creation pattern in API routes

**Status:** HEALTHY - No critical dependency issues
