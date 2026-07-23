# IMPLEMENTATION PLAN

**Based on:** ROOT_CAUSE_ANALYSIS.md  
**Date:** July 23, 2026  
**Objective:** Fix critical and high priority issues systematically

---

## PHASE 1: CRITICAL ISSUES (P0)

### Issue 1: Vercel Deployment Configuration Mismatch
**Priority:** CRITICAL  
**Impact:** Deployment fails  
**Root Cause:** vercel.json `outputDirectory: ".next"` assumes Root Directory = `packages/web` in Vercel Dashboard, but this configuration is not verified and may be causing path doubling.

**Files Affected:**
- `vercel.json`

**Fix Strategy:**
- Move vercel.json from root to packages/web/ directory
- Update buildCommand to use `npm run build` (no cd needed)
- Update outputDirectory to `.next` (relative to packages/web)
- Remove vercel.json from root if it exists

**Verification:**
- Build locally: `npm run build` in packages/web
- Verify .next directory is created at packages/web/.next
- Test deployment to Vercel

---

### Issue 2: Database Schema Duplication
**Priority:** CRITICAL  
**Impact:** Database migration failures, trigger conflicts  
**Root Cause:** Multiple schema versions (v2, v3, v4, v4-final) with duplicate triggers and policies.

**Files Affected:**
- `database/schema-v4.sql`
- `database/schema-v3.sql`
- `database/schema-v2.sql`
- `database/schema-v4-final.sql`
- `database/migrations/001_fix_users_rls.sql`

**Fix Strategy:**
- Remove duplicate trigger `update_run_attempts_updated_at` from schema-v4.sql (line 2292)
- Remove duplicate RLS policies from migrations/001_fix_users_rls.sql
- Consolidate to single schema file: schema-v4-final.sql as the authoritative schema
- Archive old schema files (v2, v3, v4) to database/archive/

**Verification:**
- Run schema validation
- Test trigger creation
- Test RLS policy creation

---

## PHASE 2: HIGH PRIORITY ISSUES (P1)

### Issue 3: No Clear Migration Strategy
**Priority:** HIGH  
**Impact:** Database state uncertainty, migration conflicts  
**Root Cause:** Multiple full schema files instead of incremental migrations.

**Files Affected:**
- All database schema files

**Fix Strategy:**
- Establish migration version tracking table
- Convert full schema to initial migration (000_initial_schema.sql)
- Create incremental migrations for future changes
- Document migration execution order

---

### Issue 4: Inconsistent Supabase Client Creation
**Priority:** HIGH  
**Impact:** Potential session inconsistencies, performance overhead  
**Root Cause:** API routes create new Supabase clients instead of using shared pattern.

**Files Affected:**
- `packages/web/src/app/api/tricks/route.ts`
- `packages/web/src/app/api/riders/[id]/attempts/route.ts`
- `packages/web/src/app/api/diagnostics/route.ts`
- `packages/web/src/app/api/events/[id]/leaderboard/route.ts`
- `packages/web/src/app/api/debug-riders/route.ts`
- `packages/web/src/app/api/debug-attempts/route.ts`
- `packages/web/src/app/api/attempts/route.ts`

**Fix Strategy:**
- Create shared Supabase client utility for API routes
- Update all API routes to use shared utility
- Remove lib/supabase.ts singleton if no longer needed

---

### Issue 5: Debug Code in Production
**Priority:** HIGH  
**Impact:** Performance overhead, console pollution, security risk  
**Root Cause:** Extensive debug logging wrapped in NODE_ENV checks.

**Files Affected:**
- `packages/web/src/lib/auth.ts`
- `packages/web/src/contexts/AuthContext.tsx`
- `packages/web/src/middleware.ts`
- `packages/web/src/lib/supabase.ts`

**Fix Strategy:**
- Remove all DEBUG flag checks
- Remove all console.log statements
- Replace with proper logging library (e.g., pino) if needed
- Keep error console.error for debugging only

---

## PHASE 3: MEDIUM PRIORITY ISSUES (P2)

### Issue 6: Git History Quality
**Priority:** MEDIUM  
**Impact:** Poor traceability, unclear change history  
**Root Cause:** Generic commit messages in Indonesian.

**Fix Strategy:**
- Establish commit message convention
- Use conventional commits format
- Document in CONTRIBUTING.md

---

### Issue 7: Unnecessary Documentation Files
**Priority:** MEDIUM  
**Impact:** Repository bloat, confusion  
**Root Cause:** Multiple architecture and plan documents not maintained.

**Fix Strategy:**
- Consolidate to single ARCHITECTURE.md
- Consolidate to single API_STRUCTURE.md
- Archive outdated versions to docs/archive/
- Keep only current versions

---

### Issue 8: Tailwind Content Path Configuration
**Priority:** MEDIUM  
**Impact:** Potential missing styles  
**Root Cause:** Tailwind config includes `src/pages/**/*` but project uses App Router.

**Files Affected:**
- `packages/web/tailwind.config.ts`

**Fix Strategy:**
- Remove `./src/pages/**/*.{js,ts,jsx,tsx,mdx}` from content paths
- Keep only App Router paths

---

## PHASE 4: LOW PRIORITY ISSUES (P3)

### Issue 9: No Error Boundaries
**Priority:** LOW  
**Impact:** Errors may crash entire app  
**Root Cause:** No ErrorBoundary components.

**Fix Strategy:**
- Add ErrorBoundary to root layout
- Create error page component

---

### Issue 10: No Suspense Boundaries
**Priority:** LOW  
**Impact:** Poor loading UX  
**Root Cause:** No Suspense components for async operations.

**Fix Strategy:**
- Add Suspense boundaries to async components
- Create loading components

---

## EXECUTION ORDER

1. **Phase 1 Issue 1:** Vercel Deployment Configuration Mismatch
2. **Phase 1 Issue 2:** Database Schema Duplication
3. **Phase 2 Issue 3:** No Clear Migration Strategy
4. **Phase 2 Issue 4:** Inconsistent Supabase Client Creation
5. **Phase 2 Issue 5:** Debug Code in Production
6. **Phase 3 Issue 6:** Git History Quality
7. **Phase 3 Issue 7:** Unnecessary Documentation Files
8. **Phase 3 Issue 8:** Tailwind Content Path Configuration
9. **Phase 4 Issue 9:** No Error Boundaries
10. **Phase 4 Issue 10:** No Suspense Boundaries

---

## VERIFICATION CHECKLIST FOR EACH FIX

- [ ] Build succeeds: `npm run build`
- [ ] TypeScript check passes: `npx tsc --noEmit`
- [ ] ESLint passes: `npm run lint`
- [ ] Localhost verification: `npm run dev`
- [ ] Manual testing of affected features
- [ ] Generate FIX_REPORT.md
- [ ] Commit changes with descriptive message
