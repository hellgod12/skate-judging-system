-- ============================================================================
-- Migration: Fix Users Table RLS Policies
-- ============================================================================
-- Description: Add RLS policies to allow users to create, read, and update
--              their own profiles while maintaining security
-- Version: 001
-- Date: July 20, 2026
-- ============================================================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can select own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Users can insert their own profile (for auto-creation on login)
CREATE POLICY "Users can insert own profile"
ON users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can select their own profile
CREATE POLICY "Users can select own profile"
ON users
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- End of Migration
-- ============================================================================
