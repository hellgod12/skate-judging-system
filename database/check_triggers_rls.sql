-- ============================================================================
-- CHECK: Triggers and RLS Policies on public.users
-- ============================================================================
-- Purpose: Identify what might be blocking INSERT into public.users
-- Run these queries in Supabase SQL Editor
-- ============================================================================

-- 1. Check all triggers on public.users
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_order,
    action_condition,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table = 'users'
ORDER BY event_manipulation, action_timing, action_order;

-- 2. Check all RLS policies on public.users
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'users';

-- 3. Check if RLS is enabled on public.users
SELECT 
    relname AS table_name,
    relrowsecurity AS rls_enabled,
    relforcerowsecurity AS rls_forced
FROM pg_class
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE pg_namespace.nspname = 'public'
AND pg_class.relname = 'users';

-- 4. Verify auth.users.id equals public.users.id
-- This query shows the relationship between auth.users and public.users
-- Run this after a user is logged in to verify the UUIDs match
SELECT 
    au.id AS auth_user_id,
    au.email AS auth_email,
    pu.id AS public_user_id,
    pu.email AS public_email,
    CASE 
        WHEN au.id = pu.id THEN 'UUIDs MATCH'
        ELSE 'UUIDs DO NOT MATCH'
    END AS uuid_match_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'your-test-email@example.com'; -- Replace with actual email

-- 5. Check if there are any BEFORE INSERT triggers that might block inserts
SELECT
    tgname AS trigger_name,
    tgtype AS trigger_type,
    tgenabled AS trigger_enabled,
    tgisinternal AS is_internal,
    pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE pg_namespace.nspname = 'public'
AND pg_class.relname = 'users'
AND NOT tgisinternal
ORDER BY tgname;

-- 6. Check for any CHECK constraints on users table
SELECT
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints AS tc
JOIN information_schema.check_constraints AS cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'users'
AND tc.constraint_type = 'CHECK';

-- ============================================================================
-- END OF CHECK QUERIES
-- ============================================================================
