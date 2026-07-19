-- ============================================================================
-- AUDIT: Users Table Structure and Constraints
-- ============================================================================
-- Purpose: Identify why INSERT INTO public.users fails after Supabase Auth login
-- Run these queries in Supabase SQL Editor to inspect the users table
-- ============================================================================

-- 1. Check users table structure (all columns, types, nullability, defaults)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Check NOT NULL columns without defaults
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND is_nullable = 'NO'
AND (column_default IS NULL OR column_default = '')
ORDER BY ordinal_position;

-- 3. Check organization_id specifically
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    foreign_key_exists
FROM information_schema.columns c
LEFT JOIN (
    SELECT 
        attname AS column_name,
        TRUE AS foreign_key_exists
    FROM pg_attribute a
    JOIN pg_class cl ON a.attrelid = cl.oid
    JOIN pg_namespace n ON cl.relnamespace = n.oid
    JOIN pg_constraint con ON a.attnum = ANY(con.conkey) AND con.contype = 'f'
    WHERE n.nspname = 'public'
    AND cl.relname = 'users'
    AND a.attname = 'organization_id'
) fk ON c.column_name = fk.column_name
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name = 'organization_id';

-- 4. Check foreign key constraints on users table
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
    AND tc.table_schema = rc.constraint_schema
WHERE tc.table_schema = 'public'
AND tc.table_name = 'users'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 5. Check RLS policies on users table
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

-- 6. Check if RLS is enabled on users table
SELECT 
    relname AS table_name,
    relrowsecurity AS rls_enabled,
    relforcerowsecurity AS rls_forced
FROM pg_class
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE pg_namespace.nspname = 'public'
AND pg_class.relname = 'users';

-- 7. Check triggers on users table
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

-- 8. Check check constraints on users table
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

-- 9. Test INSERT with minimal data (to see exact error)
-- Run this to see the exact error message
-- Note: Replace with actual auth.uid() value from your session
INSERT INTO public.users (id, email, password_hash, first_name, last_name, display_name, is_active, is_verified)
VALUES (
    'test-uuid-here',  -- Replace with actual UUID from auth.uid()
    'test@example.com',
    '',
    'Test',
    'User',
    'Test User',
    true,
    false
);

-- 10. Check what data the INSERT is trying to insert (from auth.ts)
-- The INSERT from auth.ts tries to insert:
-- id: data.user.id (UUID from Supabase Auth)
-- email: data.user.email || ''
-- password_hash: ''
-- first_name: data.user.user_metadata?.first_name || ''
-- last_name: data.user.user_metadata?.last_name || ''
-- display_name: data.user.user_metadata?.display_name || data.user.user_metadata?.full_name || ''
-- is_active: true
-- is_verified: data.user.email_confirmed_at != null

-- Missing columns in INSERT:
-- organization_id (nullable in schema, but check if it's actually nullable)
-- avatar_url (nullable)
-- phone (nullable)
-- date_of_birth (nullable)
-- nationality_code (nullable)
-- last_login_at (nullable)
-- last_login_ip (nullable)
-- password_changed_at (nullable)
-- failed_login_attempts (has default 0)
-- locked_until (nullable)
-- preferences (has default '{}')
-- created_at (has default CURRENT_TIMESTAMP)
-- updated_at (has default CURRENT_TIMESTAMP)
-- deleted_at (nullable)

-- ============================================================================
-- END OF AUDIT QUERIES
-- ============================================================================
