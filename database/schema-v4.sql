-- ============================================================================
-- SKATE JUDGING PLATFORM PRO V4 - SKATEBOARDING-OPTIMIZED DATABASE SCHEMA
-- ============================================================================
-- Version: 4.0
-- Date: July 19, 2026
-- Description: Professional skateboarding judging platform database schema
-- Features: Multi-tenancy, RBAC, Configurable scoring, Real-time, Full audit trail
-- Focus: Skateboarding-only (no multi-sport, no AI/ML)
-- Tables: 107 tables
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE IDENTITY & ACCESS MANAGEMENT (7 tables)
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
-- VENUES & LOCATIONS (1 table)
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
-- COMPETITION MANAGEMENT (6 tables)
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

-- ============================================================================
-- WORKFLOW ENGINE (6 tables)
-- ============================================================================

-- Workflow Definitions
CREATE TABLE workflow_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  workflow_type TEXT NOT NULL, -- 'competition', 'scoring', 'judging', 'approval'
  initial_state TEXT NOT NULL,
  definition JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug, version)
);

-- Workflow States
CREATE TABLE workflow_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  state_name TEXT NOT NULL,
  state_type TEXT NOT NULL, -- 'initial', 'intermediate', 'final', 'error'
  state_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workflow_definition_id, state_name)
);

-- Workflow Transitions
CREATE TABLE workflow_transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  transition_name TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  actions JSONB DEFAULT '{}',
  is_automatic BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workflow_definition_id, from_state, to_state)
);

-- Workflow Executions
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'event', 'attempt', 'registration'
  entity_id UUID NOT NULL,
  current_state TEXT NOT NULL,
  execution_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Conditions
CREATE TABLE workflow_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  condition_type TEXT NOT NULL, -- 'field', 'expression', 'custom'
  condition_config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workflow_definition_id, condition_name)
);

-- Workflow Actions
CREATE TABLE workflow_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  action_name TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'notification', 'state_change', 'calculation', 'custom'
  action_config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workflow_definition_id, action_name)
);

-- ============================================================================
-- SCHEDULE ENGINE (7 tables)
-- ============================================================================

-- Schedules
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schedule_type TEXT NOT NULL, -- 'competition', 'practice', 'ceremony'
  timezone TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Items
CREATE TABLE schedule_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  item_type TEXT NOT NULL, -- 'heat', 'round', 'break', 'ceremony'
  item_config JSONB DEFAULT '{}',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Constraints
CREATE TABLE schedule_constraints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  constraint_type TEXT NOT NULL, -- 'min_gap', 'max_concurrent', 'resource_availability'
  constraint_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Conflicts
CREATE TABLE schedule_conflicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL,
  conflict_items JSONB NOT NULL,
  severity TEXT NOT NULL, -- 'error', 'warning', 'info'
  resolution_status TEXT DEFAULT 'unresolved',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Resources
CREATE TABLE schedule_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL, -- 'venue', 'equipment', 'personnel'
  resource_id UUID NOT NULL,
  availability JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Dependencies
CREATE TABLE schedule_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  predecessor_item_id UUID NOT NULL REFERENCES schedule_items(id) ON DELETE CASCADE,
  successor_item_id UUID NOT NULL REFERENCES schedule_items(id) ON DELETE CASCADE,
  dependency_type TEXT NOT NULL, -- 'finish_to_start', 'start_to_start', 'finish_to_finish'
  min_gap_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Calendar Events
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  external_calendar_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RIDER MANAGEMENT (4 tables)
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
-- JUDGE MANAGEMENT (2 tables)
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
-- OPERATOR MANAGEMENT (2 tables)
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
-- EVENT STAFF (1 table)
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
-- SESSION MANAGEMENT (3 tables)
-- ============================================================================

-- Judge Sessions
CREATE TABLE judge_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  judge_id UUID NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE,
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Operator Sessions
CREATE TABLE operator_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE,
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Timers
CREATE TABLE timers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  timer_type TEXT NOT NULL, -- 'countdown', 'run_timer', 'jam_timer'
  duration_seconds INTEGER NOT NULL,
  remaining_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'stopped', -- 'stopped', 'running', 'paused', 'completed'
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SPONSORSHIP (2 tables)
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
-- BRANDING & ASSETS (2 tables)
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
-- SCORING CONFIGURATION (2 tables)
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
-- SKATEBOARDING TRICKS (3 tables)
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

-- Tricks (Skateboarding-specific)
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

-- Trick Variants (Skateboarding-specific)
CREATE TABLE trick_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trick_id UUID NOT NULL REFERENCES tricks(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  variant_type TEXT NOT NULL, -- 'nollie', 'switch', 'fakie', 'late', 'bigspin', 'etc'
  variant_config JSONB NOT NULL,
  difficulty_modifier DECIMAL(3,2) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ATTEMPTS & RUNS (5 tables)
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
-- JUDGING & SCORING (4 tables)
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

-- ============================================================================
-- PENALTIES (1 table)
-- ============================================================================

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
-- COMMUNICATION (2 tables)
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
-- DISPLAY & OBS (4 tables)
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OBS Layouts
CREATE TABLE obs_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  layout_type TEXT NOT NULL, -- 'leaderboard', 'scoreboard', 'lower_third', 'winner_screen', 'timer', 'sponsor'
  config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Screen Layouts
CREATE TABLE screen_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  layout_config JSONB NOT NULL,
  zones JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Themes
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  theme_config JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);

-- ============================================================================
-- LAYOUT BUILDER (6 tables)
-- ============================================================================

-- Layout Components
CREATE TABLE layout_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  component_type TEXT NOT NULL, -- 'leaderboard', 'scoreboard', 'timer', 'rider_info', 'sponsor', 'custom'
  component_name TEXT NOT NULL,
  component_config JSONB NOT NULL DEFAULT '{}',
  default_properties JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Layout Component Library
CREATE TABLE layout_component_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES layout_components(id) ON DELETE CASCADE,
  custom_config JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Layout Templates
CREATE TABLE layout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  layout_config JSONB NOT NULL,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);

-- Layout Versions
CREATE TABLE layout_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  layout_id UUID NOT NULL REFERENCES layout_templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  layout_config JSONB NOT NULL,
  change_description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Layout Breakpoints
CREATE TABLE layout_breakpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  layout_id UUID NOT NULL REFERENCES layout_templates(id) ON DELETE CASCADE,
  breakpoint_name TEXT NOT NULL, -- 'mobile', 'tablet', 'desktop', 'large'
  min_width INTEGER,
  max_width INTEGER,
  layout_config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Layout Validations
CREATE TABLE layout_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  layout_id UUID NOT NULL REFERENCES layout_templates(id) ON DELETE CASCADE,
  validation_type TEXT NOT NULL,
  validation_config JSONB NOT NULL,
  error_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ANIMATION ENGINE (7 tables)
-- ============================================================================

-- Animation Library
CREATE TABLE animation_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  animation_type TEXT NOT NULL, -- 'fade', 'slide', 'scale', 'rotate', 'bounce', 'custom'
  default_duration INTEGER,
  default_easing TEXT,
  animation_config JSONB DEFAULT '{}',
  preview_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug)
);

-- Animation Timelines
CREATE TABLE animation_timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  timeline_name TEXT NOT NULL,
  timeline_config JSONB NOT NULL,
  duration INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Animation Keyframes
CREATE TABLE animation_keyframes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animation_id UUID NOT NULL REFERENCES animation_library(id) ON DELETE CASCADE,
  keyframe_time INTEGER NOT NULL,
  properties JSONB NOT NULL,
  easing TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Animation Sequences
CREATE TABLE animation_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timeline_id UUID NOT NULL REFERENCES animation_timelines(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  animation_id UUID NOT NULL REFERENCES animation_library(id) ON DELETE CASCADE,
  start_time INTEGER NOT NULL,
  duration INTEGER,
  sequence_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Animation Triggers
CREATE TABLE animation_triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL, -- 'score', 'leaderboard_update', 'timer_start', 'timer_end', 'custom'
  trigger_config JSONB NOT NULL,
  animation_sequence_id UUID REFERENCES animation_sequences(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Animation Templates
CREATE TABLE animation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  template_config JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);

-- Animation Easings
CREATE TABLE animation_easings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  easing_function TEXT NOT NULL,
  cubic_bezier TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug)
);

-- ============================================================================
-- AUDIO MANAGER (7 tables)
-- ============================================================================

-- Audio Library
CREATE TABLE audio_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  audio_type TEXT NOT NULL, -- 'music', 'sfx', 'voiceover', 'custom'
  file_url TEXT NOT NULL,
  file_size INTEGER,
  duration_seconds INTEGER,
  bitrate INTEGER,
  sample_rate INTEGER,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);

-- Audio Playlists
CREATE TABLE audio_playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  playlist_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);

-- Audio Cues
CREATE TABLE audio_cues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  cue_name TEXT NOT NULL,
  audio_id UUID NOT NULL REFERENCES audio_library(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL, -- 'timer_start', 'timer_end', 'score', 'custom'
  trigger_config JSONB NOT NULL,
  volume DECIMAL(3,2) DEFAULT 1.0,
  fade_in_ms INTEGER DEFAULT 0,
  fade_out_ms INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audio Effects
CREATE TABLE audio_effects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  effect_type TEXT NOT NULL, -- 'reverb', 'echo', 'distortion', 'equalizer', 'custom'
  effect_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug)
);

-- Audio Levels
CREATE TABLE audio_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  volume DECIMAL(3,2) DEFAULT 1.0,
  mute BOOLEAN DEFAULT false,
  solo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audio Metadata
CREATE TABLE audio_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audio_id UUID NOT NULL REFERENCES audio_library(id) ON DELETE CASCADE,
  metadata_key TEXT NOT NULL,
  metadata_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(audio_id, metadata_key)
);

-- Audio Sync
CREATE TABLE audio_sync (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL,
  sync_config JSONB NOT NULL,
  master_clock_source TEXT,
  latency_ms INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MEDIA LIBRARY (7 tables)
-- ============================================================================

-- Media Library
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL, -- 'image', 'video', 'document', 'audio', 'other'
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_format TEXT,
  mime_type TEXT,
  duration_seconds INTEGER,
  width INTEGER,
  height INTEGER,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Media Tags
CREATE TABLE media_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(media_id, tag)
);

-- Media Metadata
CREATE TABLE media_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  metadata_key TEXT NOT NULL,
  metadata_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(media_id, metadata_key)
);

-- Media Versions
CREATE TABLE media_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  format TEXT,
  quality TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Media Thumbnails
CREATE TABLE media_thumbnails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  thumbnail_type TEXT NOT NULL, -- 'small', 'medium', 'large'
  file_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Media Transcoding
CREATE TABLE media_transcoding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  target_format TEXT NOT NULL,
  target_quality TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  output_file_url TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Media Rights
CREATE TABLE media_rights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  rights_holder TEXT NOT NULL,
  license_type TEXT NOT NULL,
  usage_rights JSONB NOT NULL,
  expiration_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- STATISTICS ENGINE (4 tables - non-predictive)
-- ============================================================================

-- Statistics Aggregations
CREATE TABLE statistics_aggregations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aggregation_type TEXT NOT NULL,
  aggregation_config JSONB NOT NULL,
  data_source TEXT NOT NULL,
  aggregation_period TEXT NOT NULL,
  result JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Statistics Trends
CREATE TABLE statistics_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,4),
  trend_direction TEXT,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Data Warehouse
CREATE TABLE data_warehouse (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  data JSONB NOT NULL,
  warehouse_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Aggregation Pipelines
CREATE TABLE aggregation_pipelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pipeline_name TEXT NOT NULL,
  pipeline_config JSONB NOT NULL,
  source_tables JSONB NOT NULL,
  target_table TEXT NOT NULL,
  schedule TEXT,
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- REPLAY ENGINE (6 tables - manual, no AI)
-- ============================================================================

-- Replay Bookmarks
CREATE TABLE replay_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  bookmark_name TEXT NOT NULL,
  timestamp_seconds INTEGER NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Replay Angles
CREATE TABLE replay_angles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  angle_name TEXT NOT NULL,
  camera_id TEXT,
  angle_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Replay Annotations
CREATE TABLE replay_annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  timestamp_seconds INTEGER NOT NULL,
  annotation_type TEXT NOT NULL, -- 'comment', 'highlight', 'marker'
  annotation_data JSONB NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Replay Highlights
CREATE TABLE replay_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  highlight_name TEXT NOT NULL,
  start_timestamp INTEGER NOT NULL,
  end_timestamp INTEGER NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Replay Comparisons
CREATE TABLE replay_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comparison_name TEXT NOT NULL,
  attempt_ids JSONB NOT NULL,
  comparison_config JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Replay Settings
CREATE TABLE replay_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  replay_config JSONB NOT NULL,
  slow_motion_speeds JSONB DEFAULT '{}',
  default_angle TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- OFFLINE SYNC (6 tables)
-- ============================================================================

-- Sync Queue
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sync Conflicts
CREATE TABLE sync_conflicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  local_version JSONB NOT NULL,
  remote_version JSONB NOT NULL,
  conflict_type TEXT NOT NULL,
  resolution_status TEXT DEFAULT 'unresolved',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sync Status
CREATE TABLE sync_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT NOT NULL,
  pending_operations INTEGER DEFAULT 0,
  failed_operations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Offline Data
CREATE TABLE offline_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  data JSONB NOT NULL,
  version INTEGER NOT NULL,
  last_modified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sync Reconciliation
CREATE TABLE sync_reconciliation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reconciliation_type TEXT NOT NULL,
  reconciliation_data JSONB NOT NULL,
  reconciled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Data Versions
CREATE TABLE data_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  version INTEGER NOT NULL,
  data JSONB NOT NULL,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PLUGIN ARCHITECTURE (7 tables)
-- ============================================================================

-- Plugins
CREATE TABLE plugins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  version TEXT NOT NULL,
  author TEXT,
  plugin_type TEXT NOT NULL, -- 'scoring', 'ui', 'notification', 'analytics', 'custom'
  plugin_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plugin Hooks
CREATE TABLE plugin_hooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  hook_name TEXT NOT NULL,
  hook_config JSONB NOT NULL DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plugin Extensions
CREATE TABLE plugin_extensions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  extension_type TEXT NOT NULL,
  extension_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plugin Permissions
CREATE TABLE plugin_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  permission_name TEXT NOT NULL,
  permission_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plugin Marketplace
CREATE TABLE plugin_marketplace (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  marketplace_config JSONB NOT NULL DEFAULT '{}',
  listing_status TEXT DEFAULT 'pending',
  price DECIMAL(10,2),
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1),
  reviews_count INTEGER DEFAULT 0,
  listed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plugin Versions
CREATE TABLE plugin_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  changelog TEXT,
  download_url TEXT,
  file_size INTEGER,
  checksum TEXT,
  is_active BOOLEAN DEFAULT true,
  released_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plugin Dependencies
CREATE TABLE plugin_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  dependency_plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  min_version TEXT,
  max_version TEXT,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INTERNATIONALIZATION (6 tables)
-- ============================================================================

-- Languages
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code CHAR(2) NOT NULL UNIQUE,
  native_name TEXT,
  is_active BOOLEAN DEFAULT true,
  is_rtl BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Translations
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_code CHAR(2) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  translation_key TEXT NOT NULL,
  translation_value TEXT NOT NULL,
  context TEXT,
  plural TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language_code, translation_key, context)
);

-- Translation Keys
CREATE TABLE translation_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Locales
CREATE TABLE locales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locale_code TEXT NOT NULL UNIQUE,
  language_code CHAR(2) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  country_code CHAR(2),
  locale_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Currency Localization
CREATE TABLE currency_localization (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_code CHAR(3) NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  symbol_position TEXT NOT NULL,
  decimal_places INTEGER NOT NULL,
  thousands_separator TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Date Formats
CREATE TABLE date_formats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locale_code TEXT NOT NULL,
  format_type TEXT NOT NULL,
  format_string TEXT NOT NULL,
  example TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- WHITE-LABEL BRANDING (6 tables)
-- ============================================================================

-- Domain Mappings
CREATE TABLE domain_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_name TEXT NOT NULL UNIQUE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  ssl_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Custom Domains
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL UNIQUE,
  verification_status TEXT DEFAULT 'pending',
  dns_config JSONB DEFAULT '{}',
  ssl_certificate_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Organization Branding
CREATE TABLE organization_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branding_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id)
);

-- Branding Templates
CREATE TABLE branding_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  template_config JSONB NOT NULL,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Branding Approvals
CREATE TABLE branding_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branding_type TEXT NOT NULL,
  branding_config JSONB NOT NULL,
  requested_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approval_status TEXT NOT NULL DEFAULT 'pending',
  approval_notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Branding Versions
CREATE TABLE branding_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  branding_config JSONB NOT NULL,
  change_description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ARCHIVE (1 table)
-- ============================================================================

-- Archived Events
CREATE TABLE archived_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  participant_count INTEGER DEFAULT 0,
  total_scores INTEGER DEFAULT 0,
  leaderboard_data JSONB NOT NULL DEFAULT '{}',
  archived_by UUID REFERENCES users(id),
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SYSTEM (1 table)
-- ============================================================================

-- System Settings
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_type TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- AUDIT & LOGGING (2 tables)
-- ============================================================================

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
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

-- Events
CREATE INDEX idx_events_organization_id ON events(organization_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_slug ON events(organization_id, slug);

-- Attempts
CREATE INDEX idx_attempts_event_id ON attempts(event_id);
CREATE INDEX idx_attempts_rider_id ON attempts(rider_id);
CREATE INDEX idx_attempts_heat_id ON attempts(heat_id);
CREATE INDEX idx_attempts_round_id ON attempts(round_id);
CREATE INDEX idx_attempts_created_at ON attempts(created_at);

-- Judge Scores
CREATE INDEX idx_judge_scores_attempt_id ON judge_scores(attempt_id);
CREATE INDEX idx_judge_scores_judge_id ON judge_scores(judge_id);

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
CREATE INDEX idx_leaderboards_type ON leaderboards(leaderboard_type);

-- Tricks
CREATE INDEX idx_tricks_organization_id ON tricks(organization_id);
CREATE INDEX idx_tricks_category_id ON tricks(category_id);
CREATE INDEX idx_tricks_difficulty ON tricks(difficulty_base);
CREATE INDEX idx_tricks_stance ON tricks(stance);
CREATE INDEX idx_tricks_obstacle ON tricks(obstacle_type);

-- Sync Queue
CREATE INDEX idx_sync_queue_user_id ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_status ON sync_queue(status);
CREATE INDEX idx_sync_queue_created_at ON sync_queue(created_at);

-- Offline Data
CREATE INDEX idx_offline_data_user_id ON offline_data(user_id);
CREATE INDEX idx_offline_data_resource ON offline_data(resource_type, resource_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Activity Logs
CREATE INDEX idx_activity_logs_organization_id ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_event_id ON activity_logs(event_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Workflow Executions
CREATE INDEX idx_workflow_executions_entity ON workflow_executions(entity_type, entity_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(current_state);

-- Schedule Items
CREATE INDEX idx_schedule_items_schedule_id ON schedule_items(schedule_id);
CREATE INDEX idx_schedule_items_start_time ON schedule_items(start_time);

-- Media Library
CREATE INDEX idx_media_library_organization_id ON media_library(organization_id);
CREATE INDEX idx_media_library_type ON media_library(media_type);

-- Plugins
CREATE INDEX idx_plugins_slug ON plugins(slug);
CREATE INDEX idx_plugins_is_active ON plugins(is_active);

-- Translations
CREATE INDEX idx_translations_language ON translations(language_code);
CREATE INDEX idx_translations_key ON translations(translation_key);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
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

CREATE TRIGGER update_judge_sessions_updated_at BEFORE UPDATE ON judge_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_operator_sessions_updated_at BEFORE UPDATE ON operator_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timers_updated_at BEFORE UPDATE ON timers
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

CREATE TRIGGER update_trick_variants_updated_at BEFORE UPDATE ON trick_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attempts_updated_at BEFORE UPDATE ON attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_combo_attempts_updated_at BEFORE UPDATE ON combo_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_runs_updated_at BEFORE UPDATE ON runs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_run_attempts_updated_at BEFORE UPDATE ON run_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_best_trick_attempts_updated_at BEFORE UPDATE ON best_trick_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_judge_scores_updated_at BEFORE UPDATE ON judge_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_overall_scores_updated_at BEFORE UPDATE ON overall_scores
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

CREATE TRIGGER update_archived_events_updated_at BEFORE UPDATE ON archived_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_logs_updated_at BEFORE UPDATE ON activity_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Additional triggers for tables with updated_at that were missing
CREATE TRIGGER update_competition_templates_updated_at BEFORE UPDATE ON competition_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_definitions_updated_at BEFORE UPDATE ON workflow_definitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_executions_updated_at BEFORE UPDATE ON workflow_executions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_items_updated_at BEFORE UPDATE ON schedule_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_constraints_updated_at BEFORE UPDATE ON schedule_constraints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_dependencies_updated_at BEFORE UPDATE ON schedule_dependencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_best_trick_attempts_updated_at BEFORE UPDATE ON best_trick_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layout_versions_updated_at BEFORE UPDATE ON layout_versions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layout_breakpoints_updated_at BEFORE UPDATE ON layout_breakpoints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layout_validations_updated_at BEFORE UPDATE ON layout_validations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animation_library_updated_at BEFORE UPDATE ON animation_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animation_timelines_updated_at BEFORE UPDATE ON animation_timelines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animation_templates_updated_at BEFORE UPDATE ON animation_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_library_updated_at BEFORE UPDATE ON audio_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_playlists_updated_at BEFORE UPDATE ON audio_playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_cues_updated_at BEFORE UPDATE ON audio_cues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_levels_updated_at BEFORE UPDATE ON audio_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_sync_updated_at BEFORE UPDATE ON audio_sync
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON media_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugins_updated_at BEFORE UPDATE ON plugins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugin_hooks_updated_at BEFORE UPDATE ON plugin_hooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugin_extensions_updated_at BEFORE UPDATE ON plugin_extensions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugin_permissions_updated_at BEFORE UPDATE ON plugin_permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plugin_marketplace_updated_at BEFORE UPDATE ON plugin_marketplace
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translation_keys_updated_at BEFORE UPDATE ON translation_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locales_updated_at BEFORE UPDATE ON locales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_currency_localization_updated_at BEFORE UPDATE ON currency_localization
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_date_formats_updated_at BEFORE UPDATE ON date_formats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domain_mappings_updated_at BEFORE UPDATE ON domain_mappings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_domains_updated_at BEFORE UPDATE ON custom_domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_branding_updated_at BEFORE UPDATE ON organization_branding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branding_templates_updated_at BEFORE UPDATE ON branding_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branding_versions_updated_at BEFORE UPDATE ON branding_versions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON languages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- END OF SCHEMA V4
-- ============================================================================
