-- ============================================================================
-- SKATE JUDGING PLATFORM PRO V2 - DATABASE SCHEMA
-- ============================================================================
-- Version: 2.0
-- Date: July 19, 2026
-- Description: Complete database schema for professional skateboarding judging platform
-- Features: Multi-tenancy, RBAC, Configurable scoring, Real-time, Full audit trail
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE IDENTITY & ACCESS MANAGEMENT
-- ============================================================================

-- Organizations (Multi-tenancy support)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country_code CHAR(2),
  postal_code TEXT,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Users (All system users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  nationality_code CHAR(2),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip TEXT,
  password_changed_at TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);

-- User Roles (Many-to-many)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, role_id)
);

-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions (Many-to-many)
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

-- ============================================================================
-- VENUES & LOCATIONS
-- ============================================================================

-- Venues
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country_code CHAR(2),
  postal_code TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  timezone TEXT,
  capacity INTEGER,
  image_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- ============================================================================
-- COMPETITION MANAGEMENT
-- ============================================================================

-- Competition Templates (Configurable formats)
CREATE TABLE competition_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  format_type TEXT NOT NULL, -- 'sls', 'olympic_street', 'olympic_park', 'best_trick', 'jam_session', 'game_of_skate', 'custom'
  scoring_config JSONB NOT NULL DEFAULT '{}',
  run_config JSONB NOT NULL DEFAULT '{}',
  best_trick_config JSONB NOT NULL DEFAULT '{}',
  jam_config JSONB NOT NULL DEFAULT '{}',
  timer_config JSONB NOT NULL DEFAULT '{}',
  display_config JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  template_id UUID REFERENCES competition_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'street', 'park', 'best_trick', 'jam', 'game_of_skate', 'custom'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_start_date TIMESTAMP WITH TIME ZONE,
  registration_end_date TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  entry_fee DECIMAL(10,2),
  prize_pool JSONB,
  scoring_config JSONB NOT NULL DEFAULT '{}',
  run_config JSONB NOT NULL DEFAULT '{}',
  best_trick_config JSONB NOT NULL DEFAULT '{}',
  jam_config JSONB NOT NULL DEFAULT '{}',
  timer_config JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  image_url TEXT,
  banner_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- Competition Rounds
CREATE TABLE competition_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  round_type TEXT NOT NULL, -- 'qualification', 'semi_final', 'final', 'consolation'
  order_index INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  scoring_config JSONB NOT NULL DEFAULT '{}',
  advancement_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Heats
CREATE TABLE heats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID NOT NULL REFERENCES competition_rounds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  age_min INTEGER,
  age_max INTEGER,
  gender TEXT, -- 'male', 'female', 'all'
  skill_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'pro'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- Divisions
CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- Countries
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code CHAR(2) NOT NULL UNIQUE,
  flag_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RIDER MANAGEMENT
-- ============================================================================

-- Riders
CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  date_of_birth DATE,
  nationality_code CHAR(2) REFERENCES countries(code),
  residence_country_code CHAR(2) REFERENCES countries(code),
  gender TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  stance TEXT, -- 'regular', 'goofy', 'switch'
  sponsor_team TEXT,
  profile_image_url TEXT,
  bio TEXT,
  social_media JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_professional BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Rider Profiles (Extended information)
CREATE TABLE rider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
  ranking INTEGER,
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  podiums INTEGER DEFAULT 0,
  total_competitions INTEGER DEFAULT 0,
  best_trick TEXT,
  signature_tricks JSONB DEFAULT '[]',
  equipment JSONB DEFAULT '{}',
  achievements JSONB DEFAULT '[]',
  statistics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rider_id, category_id, division_id)
);

-- Event Registrations
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
  registration_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'waitlisted', 'cancelled', 'no_show'
  payment_status TEXT DEFAULT 'unpaid', -- 'unpaid', 'paid', 'refunded'
  payment_amount DECIMAL(10,2),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(event_id, rider_id)
);

-- Heat Assignments
CREATE TABLE heat_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heat_id UUID NOT NULL REFERENCES heats(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
  start_order INTEGER,
  lane INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(heat_id, rider_id)
);

-- ============================================================================
-- JUDGE MANAGEMENT
-- ============================================================================

-- Judges
CREATE TABLE judges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  certification TEXT,
  experience_years INTEGER,
  specialties JSONB DEFAULT '[]',
  bio TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Judge Assignments
CREATE TABLE judge_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  judge_id UUID NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'head_judge', 'judge', 'assistant'
  weight DECIMAL(3,2) DEFAULT 1.0,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  UNIQUE(event_id, judge_id)
);

-- ============================================================================
-- OPERATOR MANAGEMENT
-- ============================================================================

-- Operators
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'head_operator', 'operator', 'timer', 'scorer'
  certifications JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Operator Assignments
CREATE TABLE operator_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  UNIQUE(event_id, operator_id)
);

-- ============================================================================
-- EVENT STAFF
-- ============================================================================

-- Event Staff
CREATE TABLE event_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'mc', 'announcer', 'medic', 'security', 'production', 'other'
  department TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SPONSORSHIP
-- ============================================================================

-- Sponsors
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  tier TEXT, -- 'platinum', 'gold', 'silver', 'bronze', 'partner'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- Event Sponsors
CREATE TABLE event_sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  sponsorship_level TEXT,
  benefits JSONB DEFAULT '{}',
  contract_value DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, sponsor_id)
);

-- ============================================================================
-- BRANDING & ASSETS
-- ============================================================================

-- Event Branding
CREATE TABLE event_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E40AF',
  accent_color TEXT DEFAULT '#F59E0B',
  background_color TEXT DEFAULT '#111827',
  text_color TEXT DEFAULT '#FFFFFF',
  font_family TEXT DEFAULT 'Inter',
  logo_url TEXT,
  logo_position TEXT DEFAULT 'top_left', -- 'top_left', 'top_center', 'top_right', 'bottom_left', 'bottom_center', 'bottom_right'
  banner_url TEXT,
  favicon_url TEXT,
  browser_title TEXT,
  custom_css TEXT,
  lower_third_config JSONB DEFAULT '{}',
  winner_screen_config JSONB DEFAULT '{}',
  animations_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id)
);

-- Event Assets
CREATE TABLE event_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL, -- 'image', 'video', 'document', 'audio', 'other'
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_format TEXT,
  mime_type TEXT,
  metadata JSONB DEFAULT '{}',
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SCORING CONFIGURATION
-- ============================================================================

-- Scoring Settings
CREATE TABLE scoring_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  scoring_method TEXT NOT NULL, -- 'overall_impression', 'average', 'highest', 'lowest_removed', 'weighted', 'custom'
  judge_count INTEGER DEFAULT 5,
  score_range_min DECIMAL(4,2) DEFAULT 0.0,
  score_range_max DECIMAL(4,2) DEFAULT 10.0,
  decimal_places INTEGER DEFAULT 2,
  drop_lowest BOOLEAN DEFAULT false,
  drop_highest BOOLEAN DEFAULT false,
  judge_weights JSONB DEFAULT '{}',
  score_formula TEXT,
  tie_breaker_config JSONB DEFAULT '{}',
  replay_enabled BOOLEAN DEFAULT false,
  replay_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id)
);

-- Score Formulas
CREATE TABLE score_formulas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  formula TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- ============================================================================
-- TRICKS & COMBOS
-- ============================================================================

-- Trick Categories
CREATE TABLE trick_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES trick_categories(id) ON DELETE SET NULL,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- Tricks
CREATE TABLE tricks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES trick_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  difficulty_base INTEGER NOT NULL CHECK (difficulty_base >= 1 AND difficulty_base <= 15),
  difficulty_min INTEGER,
  difficulty_max INTEGER,
  stance TEXT, -- 'regular', 'goofy', 'switch', 'any'
  obstacle_type TEXT, -- 'flat', 'ledge', 'rail', 'stairs', 'gap', 'transition', 'any'
  rotation_degrees INTEGER,
  is_flip BOOLEAN DEFAULT false,
  is_grind BOOLEAN DEFAULT false,
  is_slide BOOLEAN DEFAULT false,
  is_manual BOOLEAN DEFAULT false,
  is_aerial BOOLEAN DEFAULT false,
  video_url TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- ============================================================================
-- ATTEMPTS & RUNS
-- ============================================================================

-- Attempts (Generic attempt table)
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  heat_id UUID REFERENCES heats(id) ON DELETE SET NULL,
  round_id UUID REFERENCES competition_rounds(id) ON DELETE SET NULL,
  attempt_type TEXT NOT NULL, -- 'single_trick', 'combo', 'run_section', 'best_trick'
  attempt_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'landed', -- 'landed', 'bail', 'miss', 'retry', 'pending'
  raw_json JSONB NOT NULL DEFAULT '{}',
  calculated_score DECIMAL(10,4),
  normalized_score DECIMAL(10,2),
  video_url TEXT,
  video_timestamp_start INTEGER,
  video_timestamp_end INTEGER,
  replay_count INTEGER DEFAULT 0,
  penalty_applied DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Combo Attempts (Extended combo tracking)
CREATE TABLE combo_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  trick_sequence TEXT NOT NULL, -- JSON array of trick IDs in order
  trick_count INTEGER NOT NULL,
  combo_multiplier DECIMAL(4,3),
  transition_scores JSONB DEFAULT '{}',
  flow_score DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Runs
CREATE TABLE runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  heat_id UUID REFERENCES heats(id) ON DELETE SET NULL,
  round_id UUID REFERENCES competition_rounds(id) ON DELETE SET NULL,
  run_number INTEGER NOT NULL,
  run_type TEXT NOT NULL, -- 'qualification', 'semi_final', 'final'
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'interrupted', 'cancelled'
  trick_count INTEGER DEFAULT 0,
  line_utilization JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Run Attempts (Tricks within runs)
CREATE TABLE run_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  timestamp_offset INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Best Trick Attempts
CREATE TABLE best_trick_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  heat_id UUID REFERENCES heats(id) ON DELETE SET NULL,
  round_id UUID REFERENCES competition_rounds(id) ON DELETE SET NULL,
  attempt_number INTEGER NOT NULL,
  max_attempts INTEGER DEFAULT 5,
  top_score_count INTEGER DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'forfeited'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, rider_id, heat_id, round_id, attempt_number)
);

-- ============================================================================
-- JUDGING & SCORING
-- ============================================================================

-- Judge Scores (Individual judge scores)
CREATE TABLE judge_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  judge_id UUID NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  judge_assignment_id UUID REFERENCES judge_assignments(id) ON DELETE SET NULL,
  score DECIMAL(10,4) NOT NULL,
  execution DECIMAL(4,2),
  style DECIMAL(4,2),
  amplitude DECIMAL(4,2),
  landing DECIMAL(4,2),
  risk DECIMAL(4,2),
  variety DECIMAL(4,2),
  consistency DECIMAL(4,2),
  difficulty DECIMAL(4,2),
  composition DECIMAL(4,2),
  notes TEXT,
  is_revised BOOLEAN DEFAULT false,
  original_score_id UUID REFERENCES judge_scores(id) ON DELETE SET NULL,
  revised_at TIMESTAMP WITH TIME ZONE,
  revised_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(attempt_id, judge_id)
);

-- Overall Scores (Final calculated scores)
CREATE TABLE overall_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  heat_id UUID REFERENCES heats(id) ON DELETE SET NULL,
  round_id UUID REFERENCES competition_rounds(id) ON DELETE CASCADE,
  score_type TEXT NOT NULL, -- 'best_trick', 'run', 'jam', 'final'
  score DECIMAL(10,4) NOT NULL,
  rank INTEGER,
  tie_breaker_score DECIMAL(10,4),
  calculation_method TEXT,
  calculation_details JSONB DEFAULT '{}',
  is_official BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, rider_id, heat_id, round_id, score_type)
);

-- Leaderboards (Cached leaderboard data)
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  round_id UUID REFERENCES competition_rounds(id) ON DELETE SET NULL,
  heat_id UUID REFERENCES heats(id) ON DELETE SET NULL,
  leaderboard_type TEXT NOT NULL, -- 'overall', 'best_trick', 'run', 'jam'
  data JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, round_id, heat_id, leaderboard_type)
);

-- Results (Official event results)
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  round_id UUID REFERENCES competition_rounds(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  score DECIMAL(10,4) NOT NULL,
  prize JSONB,
  is_official BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, round_id, rider_id)
);

-- Penalties
CREATE TABLE penalties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL,
  penalty_type TEXT NOT NULL, -- 'time_violation', 'course_violation', 'sportsmanship', 'equipment', 'other'
  description TEXT,
  penalty_value DECIMAL(10,2) NOT NULL,
  applied_by UUID REFERENCES users(id),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_appealed BOOLEAN DEFAULT false,
  appeal_status TEXT, -- 'pending', 'approved', 'rejected'
  appeal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- COMMUNICATION
-- ============================================================================

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT NOT NULL, -- 'general', 'schedule_change', 'weather', 'emergency', 'result'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  is_public BOOLEAN DEFAULT true,
  published_by UUID REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL, -- 'event_update', 'score_update', 'announcement', 'system', 'reminder'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DISPLAY & OBS
-- ============================================================================

-- Display Settings
CREATE TABLE display_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  display_type TEXT NOT NULL, -- 'tv', 'led', 'projector', 'mobile', 'web'
  resolution TEXT,
  refresh_rate INTEGER,
  show_clock BOOLEAN DEFAULT true,
  show_countdown BOOLEAN DEFAULT true,
  show_scores BOOLEAN DEFAULT true,
  show_rankings BOOLEAN DEFAULT true,
  show_next_rider BOOLEAN DEFAULT true,
  animation_speed INTEGER DEFAULT 1000,
  transition_effects JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, display_type)
);

-- OBS Layouts
CREATE TABLE obs_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  layout_type TEXT NOT NULL, -- 'leaderboard', 'score', 'rider_info', 'lower_third', 'winner', 'custom'
  config JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, slug)
);

-- Screen Layouts
CREATE TABLE screen_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  layout_config JSONB NOT NULL DEFAULT '{}',
  zones JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, slug)
);

-- Themes
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  colors JSONB NOT NULL DEFAULT '{}',
  fonts JSONB NOT NULL DEFAULT '{}',
  spacing JSONB NOT NULL DEFAULT '{}',
  borders JSONB NOT NULL DEFAULT '{}',
  shadows JSONB NOT NULL DEFAULT '{}',
  animations JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, slug)
);

-- ============================================================================
-- SYSTEM CONFIGURATION
-- ============================================================================

-- System Settings
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  is_encrypted BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- AUDIT & LOGGING
-- ============================================================================

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete'
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  data JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_is_active ON organizations(is_active);

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Roles
CREATE INDEX idx_roles_organization_id ON roles(organization_id);
CREATE INDEX idx_roles_slug ON roles(organization_id, slug);

-- User Roles
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Venues
CREATE INDEX idx_venues_organization_id ON venues(organization_id);
CREATE INDEX idx_venues_slug ON venues(organization_id, slug);
CREATE INDEX idx_venues_is_active ON venues(is_active);

-- Events
CREATE INDEX idx_events_organization_id ON events(organization_id);
CREATE INDEX idx_events_slug ON events(organization_id, slug);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_template_id ON events(template_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_is_public ON events(is_public);

-- Competition Rounds
CREATE INDEX idx_competition_rounds_event_id ON competition_rounds(event_id);
CREATE INDEX idx_competition_rounds_status ON competition_rounds(status);

-- Heats
CREATE INDEX idx_heats_round_id ON heats(round_id);
CREATE INDEX idx_heats_status ON heats(status);

-- Categories
CREATE INDEX idx_categories_organization_id ON categories(organization_id);
CREATE INDEX idx_categories_slug ON categories(organization_id, slug);

-- Riders
CREATE INDEX idx_riders_organization_id ON riders(organization_id);
CREATE INDEX idx_riders_user_id ON riders(user_id);
CREATE INDEX idx_riders_nationality_code ON riders(nationality_code);
CREATE INDEX idx_riders_is_active ON riders(is_active);

-- Rider Profiles
CREATE INDEX idx_rider_profiles_rider_id ON rider_profiles(rider_id);
CREATE INDEX idx_rider_profiles_category_id ON rider_profiles(category_id);

-- Event Registrations
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_rider_id ON event_registrations(rider_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

-- Heat Assignments
CREATE INDEX idx_heat_assignments_heat_id ON heat_assignments(heat_id);
CREATE INDEX idx_heat_assignments_rider_id ON heat_assignments(rider_id);

-- Judges
CREATE INDEX idx_judges_organization_id ON judges(organization_id);
CREATE INDEX idx_judges_user_id ON judges(user_id);
CREATE INDEX idx_judges_is_active ON judges(is_active);

-- Judge Assignments
CREATE INDEX idx_judge_assignments_event_id ON judge_assignments(event_id);
CREATE INDEX idx_judge_assignments_judge_id ON judge_assignments(judge_id);

-- Operators
CREATE INDEX idx_operators_organization_id ON operators(organization_id);
CREATE INDEX idx_operators_user_id ON operators(user_id);

-- Operator Assignments
CREATE INDEX idx_operator_assignments_event_id ON operator_assignments(event_id);
CREATE INDEX idx_operator_assignments_operator_id ON operator_assignments(operator_id);

-- Event Staff
CREATE INDEX idx_event_staff_event_id ON event_staff(event_id);
CREATE INDEX idx_event_staff_user_id ON event_staff(user_id);

-- Sponsors
CREATE INDEX idx_sponsors_organization_id ON sponsors(organization_id);
CREATE INDEX idx_sponsors_slug ON sponsors(organization_id, slug);

-- Event Sponsors
CREATE INDEX idx_event_sponsors_event_id ON event_sponsors(event_id);
CREATE INDEX idx_event_sponsors_sponsor_id ON event_sponsors(sponsor_id);

-- Event Branding
CREATE INDEX idx_event_branding_event_id ON event_branding(event_id);

-- Event Assets
CREATE INDEX idx_event_assets_event_id ON event_assets(event_id);
CREATE INDEX idx_event_assets_asset_type ON event_assets(asset_type);

-- Scoring Settings
CREATE INDEX idx_scoring_settings_event_id ON scoring_settings(event_id);

-- Score Formulas
CREATE INDEX idx_score_formulas_organization_id ON score_formulas(organization_id);
CREATE INDEX idx_score_formulas_slug ON score_formulas(organization_id, slug);

-- Trick Categories
CREATE INDEX idx_trick_categories_organization_id ON trick_categories(organization_id);
CREATE INDEX idx_trick_categories_slug ON trick_categories(organization_id, slug);

-- Tricks
CREATE INDEX idx_tricks_organization_id ON tricks(organization_id);
CREATE INDEX idx_tricks_slug ON tricks(organization_id, slug);
CREATE INDEX idx_tricks_category_id ON tricks(category_id);
CREATE INDEX idx_tricks_difficulty_base ON tricks(difficulty_base);

-- Attempts
CREATE INDEX idx_attempts_event_id ON attempts(event_id);
CREATE INDEX idx_attempts_rider_id ON attempts(rider_id);
CREATE INDEX idx_attempts_heat_id ON attempts(heat_id);
CREATE INDEX idx_attempts_round_id ON attempts(round_id);
CREATE INDEX idx_attempts_attempt_type ON attempts(attempt_type);
CREATE INDEX idx_attempts_created_at ON attempts(created_at);

-- Combo Attempts
CREATE INDEX idx_combo_attempts_attempt_id ON combo_attempts(attempt_id);

-- Runs
CREATE INDEX idx_runs_event_id ON runs(event_id);
CREATE INDEX idx_runs_rider_id ON runs(rider_id);
CREATE INDEX idx_runs_heat_id ON runs(heat_id);
CREATE INDEX idx_runs_round_id ON runs(round_id);

-- Run Attempts
CREATE INDEX idx_run_attempts_run_id ON run_attempts(run_id);
CREATE INDEX idx_run_attempts_attempt_id ON run_attempts(attempt_id);

-- Best Trick Attempts
CREATE INDEX idx_best_trick_attempts_event_id ON best_trick_attempts(event_id);
CREATE INDEX idx_best_trick_attempts_rider_id ON best_trick_attempts(rider_id);
CREATE INDEX idx_best_trick_attempts_heat_id ON best_trick_attempts(heat_id);

-- Judge Scores
CREATE INDEX idx_judge_scores_attempt_id ON judge_scores(attempt_id);
CREATE INDEX idx_judge_scores_judge_id ON judge_scores(judge_id);
CREATE INDEX idx_judge_scores_judge_assignment_id ON judge_scores(judge_assignment_id);

-- Overall Scores
CREATE INDEX idx_overall_scores_event_id ON overall_scores(event_id);
CREATE INDEX idx_overall_scores_rider_id ON overall_scores(rider_id);
CREATE INDEX idx_overall_scores_heat_id ON overall_scores(heat_id);
CREATE INDEX idx_overall_scores_round_id ON overall_scores(round_id);
CREATE INDEX idx_overall_scores_score_type ON overall_scores(score_type);

-- Leaderboards
CREATE INDEX idx_leaderboards_event_id ON leaderboards(event_id);
CREATE INDEX idx_leaderboards_round_id ON leaderboards(round_id);
CREATE INDEX idx_leaderboards_heat_id ON leaderboards(heat_id);

-- Results
CREATE INDEX idx_results_event_id ON results(event_id);
CREATE INDEX idx_results_round_id ON results(round_id);
CREATE INDEX idx_results_rider_id ON results(rider_id);

-- Penalties
CREATE INDEX idx_penalties_event_id ON penalties(event_id);
CREATE INDEX idx_penalties_rider_id ON penalties(rider_id);
CREATE INDEX idx_penalties_attempt_id ON penalties(attempt_id);

-- Announcements
CREATE INDEX idx_announcements_event_id ON announcements(event_id);
CREATE INDEX idx_announcements_published_at ON announcements(published_at);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Display Settings
CREATE INDEX idx_display_settings_event_id ON display_settings(event_id);

-- OBS Layouts
CREATE INDEX idx_obs_layouts_event_id ON obs_layouts(event_id);

-- Screen Layouts
CREATE INDEX idx_screen_layouts_event_id ON screen_layouts(event_id);

-- Themes
CREATE INDEX idx_themes_organization_id ON themes(organization_id);
CREATE INDEX idx_themes_slug ON themes(organization_id, slug);

-- Audit Logs
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Activity Logs
CREATE INDEX idx_activity_logs_organization_id ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_event_id ON activity_logs(event_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp trigger to tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competition_templates_updated_at BEFORE UPDATE ON competition_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competition_rounds_updated_at BEFORE UPDATE ON competition_rounds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_heats_updated_at BEFORE UPDATE ON heats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_divisions_updated_at BEFORE UPDATE ON divisions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_riders_updated_at BEFORE UPDATE ON riders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rider_profiles_updated_at BEFORE UPDATE ON rider_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_judges_updated_at BEFORE UPDATE ON judges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_operators_updated_at BEFORE UPDATE ON operators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_staff_updated_at BEFORE UPDATE ON event_staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_sponsors_updated_at BEFORE UPDATE ON event_sponsors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_branding_updated_at BEFORE UPDATE ON event_branding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_assets_updated_at BEFORE UPDATE ON event_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scoring_settings_updated_at BEFORE UPDATE ON scoring_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_score_formulas_updated_at BEFORE UPDATE ON score_formulas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trick_categories_updated_at BEFORE UPDATE ON trick_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tricks_updated_at BEFORE UPDATE ON tricks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attempts_updated_at BEFORE UPDATE ON attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_runs_updated_at BEFORE UPDATE ON runs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_best_trick_attempts_updated_at BEFORE UPDATE ON best_trick_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_judge_scores_updated_at BEFORE UPDATE ON judge_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_overall_scores_updated_at BEFORE UPDATE ON overall_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_penalties_updated_at BEFORE UPDATE ON penalties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_display_settings_updated_at BEFORE UPDATE ON display_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obs_layouts_updated_at BEFORE UPDATE ON obs_layouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_screen_layouts_updated_at BEFORE UPDATE ON screen_layouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate leaderboard
CREATE OR REPLACE FUNCTION calculate_leaderboard(p_event_id UUID, p_round_id UUID DEFAULT NULL, p_heat_id UUID DEFAULT NULL, p_score_type TEXT DEFAULT 'final')
RETURNS JSONB AS $$
DECLARE
  v_leaderboard JSONB := '[]'::JSONB;
BEGIN
  -- This is a placeholder function for leaderboard calculation
  -- The actual implementation will depend on the scoring configuration
  -- This function will be called by the application layer
  
  RETURN v_leaderboard;
END;
$$ LANGUAGE plpgsql;

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
  p_organization_id UUID,
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID,
  p_old_values JSONB,
  p_new_values JSONB,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_metadata JSONB
)
RETURNS UUID AS $$
DECLARE
  v_audit_log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_organization_id,
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent,
    p_metadata
  ) RETURNING id INTO v_audit_log_id;
  
  RETURN v_audit_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create activity log entry
CREATE OR REPLACE FUNCTION create_activity_log(
  p_organization_id UUID,
  p_event_id UUID,
  p_user_id UUID,
  p_activity_type TEXT,
  p_description TEXT,
  p_data JSONB,
  p_ip_address TEXT
)
RETURNS UUID AS $$
DECLARE
  v_activity_log_id UUID;
BEGIN
  INSERT INTO activity_logs (
    organization_id,
    event_id,
    user_id,
    activity_type,
    description,
    data,
    ip_address
  ) VALUES (
    p_organization_id,
    p_event_id,
    p_user_id,
    p_activity_type,
    p_description,
    p_data,
    p_ip_address
  ) RETURNING id INTO v_activity_log_id;
  
  RETURN v_activity_log_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for active events
CREATE OR REPLACE VIEW active_events AS
SELECT 
  e.*,
  o.name as organization_name,
  v.name as venue_name,
  ct.name as template_name,
  COUNT(DISTINCT er.rider_id) as registered_count
FROM events e
LEFT JOIN organizations o ON e.organization_id = o.id
LEFT JOIN venues v ON e.venue_id = v.id
LEFT JOIN competition_templates ct ON e.template_id = ct.id
LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'confirmed'
WHERE e.status IN ('registration_open', 'in_progress')
AND e.deleted_at IS NULL
GROUP BY e.id, o.name, v.name, ct.name;

-- View for event leaderboard
CREATE OR REPLACE VIEW event_leaderboard AS
SELECT 
  e.id as event_id,
  e.name as event_name,
  r.id as rider_id,
  r.first_name,
  r.last_name,
  r.display_name,
  os.score,
  os.rank,
  os.score_type
FROM events e
JOIN overall_scores os ON e.id = os.event_id
JOIN riders r ON os.rider_id = r.id
WHERE os.is_official = true
AND e.deleted_at IS NULL
ORDER BY e.id, os.score_type, os.rank;

-- View for judge assignments
CREATE OR REPLACE VIEW judge_assignments_detail AS
SELECT 
  ja.*,
  e.name as event_name,
  j.first_name as judge_first_name,
  j.last_name as judge_last_name,
  j.display_name as judge_display_name,
  u.email as judge_email
FROM judge_assignments ja
JOIN events e ON ja.event_id = e.id
JOIN judges j ON ja.judge_id = j.id
LEFT JOIN users u ON j.user_id = u.id
WHERE e.deleted_at IS NULL;

-- View for rider statistics
CREATE OR REPLACE VIEW rider_statistics AS
SELECT 
  r.id as rider_id,
  r.first_name,
  r.last_name,
  r.display_name,
  rp.wins,
  rp.podiums,
  rp.total_competitions,
  rp.ranking,
  rp.points,
  COUNT(DISTINCT er.event_id) as events_participated
FROM riders r
LEFT JOIN rider_profiles rp ON r.id = rp.rider_id
LEFT JOIN event_registrations er ON r.id = er.rider_id AND er.status = 'confirmed'
WHERE r.deleted_at IS NULL
GROUP BY r.id, rp.wins, rp.podiums, rp.total_competitions, rp.ranking, rp.points;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
