-- ============================================================================
-- RESET DATABASE SCRIPT
-- ============================================================================
-- This script safely removes all database objects for a clean install.
-- It can be run multiple times safely (idempotent).
-- Compatible with PostgreSQL 16 and Supabase.
-- ============================================================================

-- Drop all policies (RLS policies)
DO $$ 
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_rec.policyname, policy_rec.tablename);
    END LOOP;
END $$;

-- Drop all triggers (excluding system triggers)
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    FOR trigger_rec IN 
        SELECT t.tgname AS trigger_name, c.relname AS table_name
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
        AND NOT t.tgisinternal
        AND t.tgname NOT LIKE 'RI_%' -- Skip foreign key triggers
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', trigger_rec.trigger_name, trigger_rec.table_name);
    END LOOP;
END $$;

-- Drop all functions (custom functions only)
DO $$
DECLARE
    func_rec RECORD;
BEGIN
    FOR func_rec IN 
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public'
        AND routine_type = 'FUNCTION'
        AND routine_name NOT LIKE 'pg_%'
        AND routine_name NOT LIKE 'uuid_%'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I CASCADE', func_rec.routine_name);
    END LOOP;
END $$;

-- Drop all views
DO $$
DECLARE
    view_rec RECORD;
BEGIN
    FOR view_rec IN 
        SELECT table_name 
        FROM information_schema.views 
        WHERE table_schema = 'public'
    LOOP
        EXECUTE format('DROP VIEW IF EXISTS %I CASCADE', view_rec.table_name);
    END LOOP;
END $$;

-- Drop all tables (in correct order to handle foreign keys)
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', table_rec.table_name);
    END LOOP;
END $$;

-- Drop all sequences
DO $$
DECLARE
    seq_rec RECORD;
BEGIN
    FOR seq_rec IN 
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS %I CASCADE', seq_rec.sequence_name);
    END LOOP;
END $$;

-- Drop all custom types (enums, composites)
DO $$
DECLARE
    type_rec RECORD;
BEGIN
    FOR type_rec IN 
        SELECT typname 
        FROM pg_type 
        WHERE typtype IN ('e', 'c') -- enums and composite types
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    LOOP
        EXECUTE format('DROP TYPE IF EXISTS %I CASCADE', type_rec.typname);
    END LOOP;
END $$;

-- ============================================================================
-- RESET COMPLETE
-- ============================================================================
-- Database is now clean and ready for schema installation.
-- Run schema-v4.sql next.
-- ============================================================================
