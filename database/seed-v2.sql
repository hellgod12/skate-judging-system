-- ============================================================================
-- SKATE JUDGING PLATFORM PRO V2 - SEED DATA
-- ============================================================================
-- Version: 2.0
-- Date: July 19, 2026
-- Description: Comprehensive seed data for development and testing
-- ============================================================================

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================

INSERT INTO organizations (id, name, slug, description, logo_url, website_url, contact_email, contact_phone, address, city, state, country_code, postal_code, is_active, settings) VALUES
('00000000-0000-0000-0000-000000000001', 'Skate Judging Pro', 'skate-judging-pro', 'Professional skateboarding judging platform', NULL, 'https://skatejudging.com', 'info@skatejudging.com', '+1-555-0100', '123 Skate Street', 'Los Angeles', 'CA', 'US', '90001', true, '{"features": {"realtime": true, "obs_integration": true, "mobile_app": true}}'::JSONB),
('00000000-0000-0000-0000-000000000002', 'Street League Skateboarding', 'sls', 'Street League Skateboarding Organization', NULL, 'https://streetleague.com', 'contact@streetleague.com', '+1-555-0200', '456 League Ave', 'Los Angeles', 'CA', 'US', '90002', true, '{"features": {"realtime": true, "obs_integration": true, "mobile_app": true}}'::JSONB),
('00000000-0000-0000-0000-000000000003', 'World Skate', 'world-skate', 'International skateboarding federation', NULL, 'https://worldskate.org', 'info@worldskate.org', '+1-555-0300', '789 World Blvd', 'Lausanne', NULL, 'CH', '1000', true, '{"features": {"realtime": true, "obs_integration": true, "mobile_app": false}}'::JSONB);

-- ============================================================================
-- COUNTRIES
-- ============================================================================

INSERT INTO countries (id, name, code, flag_url, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'United States', 'US', '🇺🇸', true),
('00000000-0000-0000-0000-000000000002', 'Japan', 'JP', '🇯🇵', true),
('00000000-0000-0000-0000-000000000003', 'Brazil', 'BR', '🇧🇷', true),
('00000000-0000-0000-0000-000000000004', 'Portugal', 'PT', '🇵🇹', true),
('00000000-0000-0000-0000-000000000005', 'Australia', 'AU', '🇦🇺', true),
('00000000-0000-0000-0000-000000000006', 'France', 'FR', '🇫🇷', true),
('00000000-0000-0000-0000-000000000007', 'Canada', 'CA', '🇨🇦', true),
('00000000-0000-0000-0000-000000000008', 'United Kingdom', 'GB', '🇬🇧', true),
('00000000-0000-0000-0000-000000000009', 'Germany', 'DE', '🇩🇪', true),
('00000000-0000-0000-0000-000000000010', 'Spain', 'ES', '🇪🇸', true);

-- ============================================================================
-- USERS
-- ============================================================================

INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, display_name, avatar_url, phone, nationality_code, is_active, is_verified, preferences) VALUES
-- Admin users
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin@skatejudging.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'Admin', 'User', 'Admin User', NULL, '+1-555-0101', 'US', true, true, '{"theme": "dark", "language": "en"}'::JSONB),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'admin@streetleague.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'SLS', 'Admin', 'SLS Admin', NULL, '+1-555-0201', 'US', true, true, '{"theme": "dark", "language": "en"}'::JSONB),

-- Judge users
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'judge1@skatejudging.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'John', 'Smith', 'Judge John', NULL, '+1-555-0102', 'US', true, true, '{"theme": "light", "language": "en"}'::JSONB),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'judge2@skatejudging.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'Sarah', 'Johnson', 'Judge Sarah', NULL, '+1-555-0103', 'US', true, true, '{"theme": "light", "language": "en"}'::JSONB),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'judge3@skatejudging.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'Mike', 'Davis', 'Judge Mike', NULL, '+1-555-0104', 'US', true, true, '{"theme": "light", "language": "en"}'::JSONB),

-- Operator users
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'operator1@skatejudging.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'Tom', 'Wilson', 'Operator Tom', NULL, '+1-555-0105', 'US', true, true, '{"theme": "dark", "language": "en"}'::JSONB),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'operator2@skatejudging.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'Lisa', 'Brown', 'Operator Lisa', NULL, '+1-555-0106', 'US', true, true, '{"theme": "dark", "language": "en"}'::JSONB),

-- Rider users
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'nyjah@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'Nyjah', 'Huston', 'Nyjah Huston', NULL, '+1-555-0107', 'US', true, true, '{"theme": "dark", "language": "en"}'::JSONB),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'yuto@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'Yuto', 'Horigome', 'Yuto Horigome', NULL, '+1-555-0108', 'JP', true, true, '{"theme": "dark", "language": "ja"}'::JSONB),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'jagger@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqHqQqQWq', 'Jagger', 'Eaton', 'Jagger Eaton', NULL, '+1-555-0109', 'US', true, true, '{"theme": "dark", "language": "en"}'::JSONB);

-- ============================================================================
-- ROLES
-- ============================================================================

INSERT INTO roles (id, organization_id, name, slug, description, is_system, permissions) VALUES
-- System roles
('00000000-0000-0000-0000-000000000001', NULL, 'Super Admin', 'super-admin', 'Full system access', true, '["*"]'::JSONB),
('00000000-0000-0000-0000-000000000002', NULL, 'Admin', 'admin', 'Organization administrator', true, '["organizations.*", "users.*", "events.*", "riders.*", "judges.*", "scoring.*"]'::JSONB),
('00000000-0000-0000-0000-000000000003', NULL, 'Judge', 'judge', 'Competition judge', true, '["events.view", "attempts.create", "scores.create", "scores.update"]'::JSONB),
('00000000-0000-0000-0000-000000000004', NULL, 'Operator', 'operator', 'Event operator', true, '["events.view", "riders.view", "runs.manage", "timer.manage"]'::JSONB),
('00000000-0000-0000-0000-000000000005', NULL, 'Viewer', 'viewer', 'Read-only access', true, '["events.view", "leaderboards.view", "results.view"]'::JSONB),

-- Custom organization roles
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Head Judge', 'head-judge', 'Head judge with additional permissions', false, '["events.view", "attempts.create", "scores.create", "scores.update", "judges.manage"]'::JSONB),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'MC', 'mc', 'Master of Ceremonies', false, '["events.view", "leaderboards.view", "announcements.create"]'::JSONB);

-- ============================================================================
-- USER ROLES
-- ============================================================================

INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
-- Admin users
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NULL),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', NULL),

-- Judge users
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),

-- Operator users
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001'),

-- Rider users
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

INSERT INTO permissions (id, name, slug, description, resource, action) VALUES
-- Organization permissions
('00000000-0000-0000-0000-000000000001', 'View Organizations', 'organizations.view', 'View organization details', 'organizations', 'view'),
('00000000-0000-0000-0000-000000000002', 'Create Organizations', 'organizations.create', 'Create new organizations', 'organizations', 'create'),
('00000000-0000-0000-0000-000000000003', 'Update Organizations', 'organizations.update', 'Update organization details', 'organizations', 'update'),
('00000000-0000-0000-0000-000000000004', 'Delete Organizations', 'organizations.delete', 'Delete organizations', 'organizations', 'delete'),

-- User permissions
('00000000-0000-0000-0000-000000000005', 'View Users', 'users.view', 'View user details', 'users', 'view'),
('00000000-0000-0000-0000-000000000006', 'Create Users', 'users.create', 'Create new users', 'users', 'create'),
('00000000-0000-0000-0000-000000000007', 'Update Users', 'users.update', 'Update user details', 'users', 'update'),
('00000000-0000-0000-0000-000000000008', 'Delete Users', 'users.delete', 'Delete users', 'users', 'delete'),

-- Event permissions
('00000000-0000-0000-0000-000000000009', 'View Events', 'events.view', 'View event details', 'events', 'view'),
('00000000-0000-0000-0000-000000000010', 'Create Events', 'events.create', 'Create new events', 'events', 'create'),
('00000000-0000-0000-0000-000000000011', 'Update Events', 'events.update', 'Update event details', 'events', 'update'),
('00000000-0000-0000-0000-000000000012', 'Delete Events', 'events.delete', 'Delete events', 'events', 'delete'),

-- Rider permissions
('00000000-0000-0000-0000-000000000013', 'View Riders', 'riders.view', 'View rider details', 'riders', 'view'),
('00000000-0000-0000-0000-000000000014', 'Create Riders', 'riders.create', 'Create new riders', 'riders', 'create'),
('00000000-0000-0000-0000-000000000015', 'Update Riders', 'riders.update', 'Update rider details', 'riders', 'update'),
('00000000-0000-0000-0000-000000000016', 'Delete Riders', 'riders.delete', 'Delete riders', 'riders', 'delete'),

-- Judge permissions
('00000000-0000-0000-0000-000000000017', 'View Judges', 'judges.view', 'View judge details', 'judges', 'view'),
('00000000-0000-0000-0000-000000000018', 'Create Judges', 'judges.create', 'Create new judges', 'judges', 'create'),
('00000000-0000-0000-0000-000000000019', 'Update Judges', 'judges.update', 'Update judge details', 'judges', 'update'),
('00000000-0000-0000-0000-000000000020', 'Delete Judges', 'judges.delete', 'Delete judges', 'judges', 'delete'),
('00000000-0000-0000-0000-000000000021', 'Manage Judges', 'judges.manage', 'Manage judge assignments', 'judges', 'manage'),

-- Attempt permissions
('00000000-0000-0000-0000-000000000022', 'View Attempts', 'attempts.view', 'View attempt details', 'attempts', 'view'),
('00000000-0000-0000-0000-000000000023', 'Create Attempts', 'attempts.create', 'Create new attempts', 'attempts', 'create'),
('00000000-0000-0000-0000-000000000024', 'Update Attempts', 'attempts.update', 'Update attempt details', 'attempts', 'update'),
('00000000-0000-0000-0000-000000000025', 'Delete Attempts', 'attempts.delete', 'Delete attempts', 'attempts', 'delete'),

-- Score permissions
('00000000-0000-0000-0000-000000000026', 'View Scores', 'scores.view', 'View score details', 'scores', 'view'),
('00000000-0000-0000-0000-000000000027', 'Create Scores', 'scores.create', 'Create new scores', 'scores', 'create'),
('00000000-0000-0000-0000-000000000028', 'Update Scores', 'scores.update', 'Update score details', 'scores', 'update'),
('00000000-0000-0000-0000-000000000029', 'Delete Scores', 'scores.delete', 'Delete scores', 'scores', 'delete'),

-- Scoring permissions
('00000000-0000-0000-0000-000000000030', 'View Scoring', 'scoring.view', 'View scoring configuration', 'scoring', 'view'),
('00000000-0000-0000-0000-000000000031', 'Update Scoring', 'scoring.update', 'Update scoring configuration', 'scoring', 'update'),

-- Leaderboard permissions
('00000000-0000-0000-0000-000000000032', 'View Leaderboards', 'leaderboards.view', 'View leaderboards', 'leaderboards', 'view'),

-- Results permissions
('00000000-0000-0000-0000-000000000033', 'View Results', 'results.view', 'View event results', 'results', 'view'),
('00000000-0000-0000-0000-000000000034', 'Publish Results', 'results.publish', 'Publish event results', 'results', 'publish'),

-- Announcement permissions
('00000000-0000-0000-0000-000000000035', 'View Announcements', 'announcements.view', 'View announcements', 'announcements', 'view'),
('00000000-0000-0000-0000-000000000036', 'Create Announcements', 'announcements.create', 'Create announcements', 'announcements', 'create'),
('00000000-0000-0000-0000-000000000037', 'Update Announcements', 'announcements.update', 'Update announcements', 'announcements', 'update'),
('00000000-0000-0000-0000-000000000038', 'Delete Announcements', 'announcements.delete', 'Delete announcements', 'announcements', 'delete'),

-- Run permissions
('00000000-0000-0000-0000-000000000039', 'View Runs', 'runs.view', 'View run details', 'runs', 'view'),
('00000000-0000-0000-0000-000000000040', 'Manage Runs', 'runs.manage', 'Manage runs', 'runs', 'manage'),

-- Timer permissions
('00000000-0000-0000-0000-000000000041', 'View Timer', 'timer.view', 'View timer status', 'timer', 'view'),
('00000000-0000-0000-0000-000000000042', 'Manage Timer', 'timer.manage', 'Manage timer', 'timer', 'manage');

-- ============================================================================
-- VENUES
-- ============================================================================

INSERT INTO venues (id, organization_id, name, slug, description, address, city, state, country_code, postal_code, latitude, longitude, timezone, capacity, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'LA Skate Park', 'la-skate-park', 'Premier skateboarding facility in Los Angeles', '123 Skate Street', 'Los Angeles', 'CA', 'US', '90001', 34.0522, -118.2437, 'America/Los_Angeles', 5000, true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Tokyo Skate Plaza', 'tokyo-skate-plaza', 'World-class skateboarding venue in Tokyo', '456 Skate Ave', 'Tokyo', NULL, 'JP', '100-0001', 35.6762, 139.6503, 'Asia/Tokyo', 8000, true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'SLS Arena', 'sls-arena', 'Street League official arena', '789 League Blvd', 'Los Angeles', 'CA', 'US', '90002', 34.0522, -118.2437, 'America/Los_Angeles', 10000, true);

-- ============================================================================
-- COMPETITION TEMPLATES
-- ============================================================================

INSERT INTO competition_templates (id, organization_id, name, slug, description, format_type, scoring_config, run_config, best_trick_config, jam_config, timer_config, display_config, is_public, is_active, created_by) VALUES
-- SLS Template
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Street League Style', 'sls-style', 'Street League Skateboarding format with best trick scoring', 'sls', 
'{"method": "best_trick", "top_count": 4, "attempts": 5, "score_range": {"min": 0, "max": 10}, "decimal_places": 2, "drop_lowest": false, "drop_highest": false}'::JSONB,
'{"enabled": false, "runs": 0}'::JSONB,
'{"attempts": 5, "top_count": 4, "retry_allowed": true, "time_limit": 45}'::JSONB,
'{"enabled": false}'::JSONB,
'{"countdown": true, "countdown_seconds": 10, "clock_visible": true}'::JSONB,
'{"show_clock": true, "show_countdown": true, "show_scores": true, "show_rankings": true}'::JSONB,
true, true, '00000000-0000-0000-0000-000000000001'),

-- Olympic Street Template
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Olympic Street', 'olympic-street', 'Olympic street skating format with runs', 'olympic_street',
'{"method": "overall_impression", "judge_count": 5, "score_range": {"min": 0, "max": 100}, "decimal_places": 1, "drop_lowest": true, "drop_highest": true}'::JSONB,
'{"enabled": true, "runs": 2, "run_time": 45}'::JSONB,
'{"attempts": 0, "top_count": 0}'::JSONB,
'{"enabled": false}'::JSONB,
'{"countdown": true, "countdown_seconds": 5, "clock_visible": true}'::JSONB,
'{"show_clock": true, "show_countdown": true, "show_scores": true, "show_rankings": true}'::JSONB,
true, true, '00000000-0000-0000-0000-000000000001'),

-- Best Trick Template
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Best Trick', 'best-trick', 'Best trick competition format', 'best_trick',
'{"method": "highest", "attempts": 5, "top_count": 1, "score_range": {"min": 0, "max": 10}, "decimal_places": 2}'::JSONB,
'{"enabled": false}'::JSONB,
'{"attempts": 5, "top_count": 1, "retry_allowed": true, "time_limit": 60}'::JSONB,
'{"enabled": false}'::JSONB,
'{"countdown": true, "countdown_seconds": 10, "clock_visible": true}'::JSONB,
'{"show_clock": true, "show_countdown": true, "show_scores": true}'::JSONB,
true, true, '00000000-0000-0000-0000-000000000001'),

-- Jam Session Template
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Jam Session', 'jam-session', 'Jam session format with multiple riders', 'jam_session',
'{"method": "overall_impression", "judge_count": 3, "score_range": {"min": 0, "max": 10}, "decimal_places": 1}'::JSONB,
'{"enabled": false}'::JSONB,
'{"enabled": false}'::JSONB,
'{"enabled": true, "duration": 300, "riders_per_heat": 5}'::JSONB,
'{"countdown": true, "countdown_seconds": 5, "clock_visible": true}'::JSONB,
'{"show_clock": true, "show_countdown": true, "show_scores": true}'::JSONB,
true, true, '00000000-0000-0000-0000-000000000001'),

-- Game of Skate Template
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Game of Skate', 'game-of-skate', 'Game of SKATE elimination format', 'game_of_skate',
'{"method": "elimination", "letters": 5, "sudden_death": true}'::JSONB,
'{"enabled": false}'::JSONB,
'{"enabled": false}'::JSONB,
'{"enabled": false}'::JSONB,
'{"countdown": false, "clock_visible": false}'::JSONB,
'{"show_clock": false, "show_countdown": false, "show_scores": true}'::JSONB,
true, true, '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- EVENTS
-- ============================================================================

INSERT INTO events (id, organization_id, venue_id, template_id, name, slug, description, event_type, status, start_date, end_date, registration_start_date, registration_end_date, max_participants, entry_fee, scoring_config, run_config, best_trick_config, jam_config, timer_config, is_public, is_featured, created_by) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SLS Championship 2024', 'sls-championship-2024', 'Street League Skateboarding Championship 2024', 'street', 'published', '2024-08-15 09:00:00', '2024-08-17 18:00:00', '2024-06-01 00:00:00', '2024-08-01 00:00:00', 50, 100.00, '{"method": "best_trick", "top_count": 4, "attempts": 5}'::JSONB, '{"enabled": false}'::JSONB, '{"attempts": 5, "top_count": 4}'::JSONB, '{"enabled": false}'::JSONB, '{"countdown": true, "countdown_seconds": 10}'::JSONB, true, true, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Tokyo Open 2024', 'tokyo-open-2024', 'Olympic-style street competition in Tokyo', 'street', 'registration_open', '2024-09-10 09:00:00', '2024-09-12 18:00:00', '2024-07-01 00:00:00', '2024-09-01 00:00:00', 40, 150.00, '{"method": "overall_impression", "judge_count": 5}'::JSONB, '{"enabled": true, "runs": 2}'::JSONB, '{"attempts": 0}'::JSONB, '{"enabled": false}'::JSONB, '{"countdown": true, "countdown_seconds": 5}'::JSONB, true, false, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Best Trick Invitational', 'best-trick-invitational-2024', 'Best trick invitational event', 'best_trick', 'draft', '2024-10-05 10:00:00', '2024-10-05 18:00:00', '2024-08-01 00:00:00', '2024-09-15 00:00:00', 20, 200.00, '{"method": "highest", "attempts": 5}'::JSONB, '{"enabled": false}'::JSONB, '{"attempts": 5, "top_count": 1}'::JSONB, '{"enabled": false}'::JSONB, '{"countdown": true, "countdown_seconds": 10}'::JSONB, true, false, '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- COMPETITION ROUNDS
-- ============================================================================

INSERT INTO competition_rounds (id, event_id, name, round_type, order_index, start_time, end_time, status, scoring_config, advancement_config) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Qualifiers', 'qualification', 1, '2024-08-15 09:00:00', '2024-08-15 18:00:00', 'scheduled', '{}'::JSONB, '{"advance_count": 16}'::JSONB),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Semi Finals', 'semi_final', 2, '2024-08-16 09:00:00', '2024-08-16 18:00:00', 'scheduled', '{}'::JSONB, '{"advance_count": 8}'::JSONB),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Finals', 'final', 3, '2024-08-17 09:00:00', '2024-08-17 18:00:00', 'scheduled', '{}'::JSONB, '{"advance_count": 1}'::JSONB);

-- ============================================================================
-- HEATS
-- ============================================================================

INSERT INTO heats (id, round_id, name, order_index, start_time, end_time, max_participants, status) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Heat 1', 1, '2024-08-15 09:00:00', '2024-08-15 11:00:00', 10, 'scheduled'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Heat 2', 2, '2024-08-15 11:00:00', '2024-08-15 13:00:00', 10, 'scheduled'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Heat 3', 3, '2024-08-15 13:00:00', '2024-08-15 15:00:00', 10, 'scheduled'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Heat 4', 4, '2024-08-15 15:00:00', '2024-08-15 17:00:00', 10, 'scheduled'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Heat 5', 5, '2024-08-15 17:00:00', '2024-08-15 18:00:00', 10, 'scheduled');

-- ============================================================================
-- CATEGORIES
-- ============================================================================

INSERT INTO categories (id, organization_id, name, slug, description, age_min, age_max, gender, skill_level, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Open', 'open', 'Open category for all ages', NULL, NULL, 'all', 'pro', true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Men', 'men', 'Men category', 18, NULL, 'male', 'pro', true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Women', 'women', 'Women category', 18, NULL, 'female', 'pro', true),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Junior', 'junior', 'Junior category under 18', NULL, 17, 'all', 'advanced', true),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Amateur', 'amateur', 'Amateur category', 18, NULL, 'all', 'intermediate', true);

-- ============================================================================
-- DIVISIONS
-- ============================================================================

INSERT INTO divisions (id, organization_id, name, slug, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Street', 'street', 'Street skating division', true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Park', 'park', 'Park/transition skating division', true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Vert', 'vert', 'Vert skating division', true);

-- ============================================================================
-- TRICK CATEGORIES
-- ============================================================================

INSERT INTO trick_categories (id, organization_id, name, slug, description, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Flip Tricks', 'flip-tricks', 'Board rotation tricks', true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Grinds', 'grinds', 'Truck grinding tricks', true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Slides', 'slides', 'Board sliding tricks', true),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Manuals', 'manuals', 'Manual tricks', true),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Aerials', 'aerials', 'Aerial tricks', true),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Transitions', 'transitions', 'Transition tricks', true);

-- ============================================================================
-- TRICKS
-- ============================================================================

INSERT INTO tricks (id, organization_id, category_id, name, slug, description, difficulty_base, difficulty_min, difficulty_max, stance, obstacle_type, rotation_degrees, is_flip, is_grind, is_slide, is_manual, is_aerial, is_active) VALUES
-- Flip Tricks
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Kickflip', 'kickflip', 'Basic flip trick', 4, 3, 5, 'any', 'flat', 0, true, false, false, false, false, true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Heelflip', 'heelflip', 'Heel-side flip trick', 4, 3, 5, 'any', 'flat', 0, true, false, false, false, false, true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Treflip', 'treflip', '360 flip trick', 7, 6, 8, 'any', 'flat', 360, true, false, false, false, false, true),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Hardflip', 'hardflip', 'Complex flip trick', 11, 10, 12, 'any', 'flat', 0, true, false, false, false, false, true),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Laser Flip', 'laser-flip', '360 heelflip', 12, 11, 13, 'any', 'flat', 360, true, false, false, false, false, true),

-- Grinds
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '50-50', '50-50', 'Basic grind', 5, 4, 6, 'any', 'rail', 0, false, true, false, false, false, true),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '5-0', '5-0', 'Back truck grind', 6, 5, 7, 'any', 'rail', 0, false, true, false, false, false, true),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Smith Grind', 'smith-grind', 'Back truck grind with board angled', 8, 7, 9, 'any', 'rail', 0, false, true, false, false, false, true),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Feeble Grind', 'feeble-grind', 'Back truck grind with board angled opposite', 8, 7, 9, 'any', 'rail', 0, false, true, false, false, false, true),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Crooked Grind', 'crooked-grind', 'Nose grind with board angled', 9, 8, 10, 'any', 'rail', 0, false, true, false, false, false, true),

-- Slides
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Boardslide', 'boardslide', 'Basic slide', 7, 6, 8, 'any', 'rail', 0, false, false, true, false, false, true),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Lipslide', 'lipslide', 'Backside slide', 7, 6, 8, 'any', 'rail', 0, false, false, true, false, false, true),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Tailslide', 'tailslide', 'Tail slide', 9, 8, 10, 'any', 'rail', 0, false, false, true, false, false, true),
('00000000-0000-0000-0000-00000000000014', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Noseslide', 'noseslide', 'Nose slide', 9, 8, 10, 'any', 'rail', 0, false, false, true, false, false, true),
('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Bluntslide', 'bluntslide', 'Blunt slide', 10, 9, 11, 'any', 'rail', 0, false, false, true, false, false, true),

-- Manuals
('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Manual', 'manual', 'Basic manual', 4, 3, 5, 'any', 'flat', 0, false, false, false, true, false, true),
('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Nose Manual', 'nose-manual', 'Nose manual', 5, 4, 6, 'any', 'flat', 0, false, false, false, true, false, true),

-- Aerials
('00000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'Ollie', 'ollie', 'Basic aerial', 2, 1, 3, 'any', 'flat', 0, false, false, false, false, true, true),
('00000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'Nollie', 'nollie', 'Nose ollie', 3, 2, 4, 'any', 'flat', 0, false, false, false, false, true, true),

-- Combination tricks
('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Kickflip Backside Lipslide', 'kickflip-backside-lipslide', 'Kickflip into backside lipslide', 11, 10, 12, 'any', 'rail', 0, true, false, true, false, false, true),
('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Treflip Frontside Boardslide', 'treflip-frontside-boardslide', '360 flip into frontside boardslide', 12, 11, 13, 'any', 'rail', 360, true, false, true, false, false, true),
('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Switch Frontside 360 Kickflip', 'switch-frontside-360-kickflip', 'Switch frontside 360 kickflip', 14, 13, 15, 'switch', 'flat', 360, true, false, false, false, false, true);

-- ============================================================================
-- RIDERS
-- ============================================================================

INSERT INTO riders (id, organization_id, user_id, first_name, last_name, display_name, date_of_birth, nationality_code, residence_country_code, gender, stance, sponsor_team, is_active, is_professional) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', 'Nyjah', 'Huston', 'Nyjah Huston', '1994-11-30', 'US', 'US', 'male', 'regular', 'Nike SB', true, true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000009', 'Yuto', 'Horigome', 'Yuto Horigome', '1999-01-07', 'JP', 'JP', 'male', 'regular', 'Nike SB', true, true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Jagger', 'Eaton', 'Jagger Eaton', '1998-10-20', 'US', 'US', 'male', 'goofy', 'Plan B', true, true),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', NULL, 'Gustavo', 'Ribeiro', 'Gustavo Ribeiro', '1999-03-05', 'PT', 'PT', 'male', 'regular', 'Primitive', true, true),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', NULL, 'Kelvin', 'Hoefler', 'Kelvin Hoefler', '1994-02-10', 'BR', 'BR', 'male', 'goofy', 'Primitive', true, true),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', NULL, 'Shane', 'O''Neill', 'Shane O''Neill', '1990-01-04', 'AU', 'US', 'male', 'regular', 'Nike SB', true, true),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', NULL, 'Luan', 'Oliveira', 'Luan Oliveira', '1992-09-22', 'BR', 'BR', 'male', 'regular', 'Nike SB', true, true),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', NULL, 'Chris', 'Joslin', 'Chris Joslin', '1995-12-21', 'CA', 'CA', 'male', 'regular', 'Plan B', true, true),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', NULL, 'Milton', 'Martinez', 'Milton Martinez', '1996-06-15', 'AR', 'US', 'male', 'goofy', 'Primitive', true, true),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', NULL, 'Cory', 'Juneau', 'Cory Juneau', '1999-06-20', 'US', 'US', 'male', 'goofy', 'Powell Peralta', true, true);

-- ============================================================================
-- RIDER PROFILES
-- ============================================================================

INSERT INTO rider_profiles (id, rider_id, ranking, points, wins, podiums, total_competitions, best_trick, signature_tricks, achievements) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1, 2500, 15, 25, 50, 'Nollie Hardflip Late', '["Nollie Hardflip Late", "Switch Frontside 360 Kickflip", "Kickflip Backside Tailslide"]'::JSONB, '{"titles": ["3x SLS Champion", "X-Games Gold Medal"], "sponsorships": ["Nike SB", "Diamond Supply Co."]}'::JSONB),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 2, 2300, 12, 20, 45, 'Switch Frontside 360 Kickflip', '["Switch Frontside 360 Kickflip", "Nollie 360 Heelflip", "Kickflip Mute"]'::JSONB, '{"titles": ["Olympic Gold Medalist", "X-Games Gold Medal"], "sponsorships": ["Nike SB", "Venture"]}'::JSONB),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 3, 2100, 10, 18, 40, 'Backside 360 Kickflip', '["Backside 360 Kickflip", "Frontside 360 Kickflip", "Kickflip Backside Lipslide"]'::JSONB, '{"titles": ["X-Games Gold Medal", "Dew Tour Champion"], "sponsorships": ["Plan B", "Red Bull"]}'::JSONB);

-- ============================================================================
-- EVENT REGISTRATIONS
-- ============================================================================

INSERT INTO event_registrations (id, event_id, rider_id, category_id, registration_number, status, payment_status, payment_amount, registered_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SLS24-001', 'confirmed', 'paid', 100.00, '2024-06-15 10:00:00'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'SLS24-002', 'confirmed', 'paid', 100.00, '2024-06-15 10:05:00'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'SLS24-003', 'confirmed', 'paid', 100.00, '2024-06-15 10:10:00'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'SLS24-004', 'confirmed', 'paid', 100.00, '2024-06-15 10:15:00'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'SLS24-005', 'confirmed', 'paid', 100.00, '2024-06-15 10:20:00');

-- ============================================================================
-- HEAT ASSIGNMENTS
-- ============================================================================

INSERT INTO heat_assignments (id, heat_id, rider_id, registration_id, start_order, lane) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1, 1),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 2, 2),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 1, 1),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '2', 2),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 1, 1);

-- ============================================================================
-- JUDGES
-- ============================================================================

INSERT INTO judges (id, organization_id, user_id, first_name, last_name, display_name, certification, experience_years, specialties, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'John', 'Smith', 'Judge John', 'World Skate Certified', 15, '["street", "technical"]'::JSONB, true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Sarah', 'Johnson', 'Judge Sarah', 'SLS Certified', 10, '["street", "style"]'::JSONB, true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'Mike', 'Davis', 'Judge Mike', 'Olympic Certified', 12, '["street", "amplitude"]'::JSONB, true);

-- ============================================================================
-- JUDGE ASSIGNMENTS
-- ============================================================================

INSERT INTO judge_assignments (id, event_id, judge_id, role, weight, assigned_by) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'head_judge', 1.0, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'judge', 1.0, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'judge', 1.0, '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- OPERATORS
-- ============================================================================

INSERT INTO operators (id, organization_id, user_id, role, certifications, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'head_operator', '["SLS Operator Level 2", "World Skate Operator"]'::JSONB, true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'operator', '["SLS Operator Level 1"]'::JSONB, true);

-- ============================================================================
-- OPERATOR ASSIGNMENTS
-- ============================================================================

INSERT INTO operator_assignments (id, event_id, operator_id, role, assigned_by) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'head_operator', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'operator', '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- SPONSORS
-- ============================================================================

INSERT INTO sponsors (id, organization_id, name, slug, description, logo_url, website_url, tier, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Nike SB', 'nike-sb', 'Nike Skateboarding', NULL, 'https://nikesb.com', 'platinum', true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Red Bull', 'red-bull', 'Red Bull Energy Drink', NULL, 'https://redbull.com', 'gold', true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Mountain Dew', 'mountain-dew', 'Mountain Dew', NULL, 'https://mountaindew.com', 'gold', true),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Plan B', 'plan-b', 'Plan B Skateboards', NULL, 'https://planbskate.com', 'silver', true),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Primitive', 'primitive', 'Primitive Skateboards', NULL, 'https://primitiveskate.com', 'silver', true);

-- ============================================================================
-- EVENT SPONSORS
-- ============================================================================

INSERT INTO event_sponsors (id, event_id, sponsor_id, tier, sponsorship_level, contract_value, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'platinum', 'title', 50000.00, true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'gold', 'presenting', 25000.00, true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'gold', 'official', 20000.00, true);

-- ============================================================================
-- EVENT BRANDING
-- ============================================================================

INSERT INTO event_branding (id, event_id, primary_color, secondary_color, accent_color, background_color, text_color, font_family, logo_position, browser_title) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '#3B82F6', '#1E40AF', '#F59E0B', '#111827', '#FFFFFF', 'Inter', 'top_left', 'SLS Championship 2024 - Live Scoring'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '#EF4444', '#B91C1C', '#FBBF24', '#1F2937', '#FFFFFF', 'Roboto', 'top_center', 'Tokyo Open 2024 - Live Scoring');

-- ============================================================================
-- SCORING SETTINGS
-- ============================================================================

INSERT INTO scoring_settings (id, event_id, scoring_method, judge_count, score_range_min, score_range_max, decimal_places, drop_lowest, drop_highest, tie_breaker_config) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'best_trick', 5, 0.0, 10.0, 2, false, false, '{"method": "highest_score", "criteria": ["total_score", "best_single_trick"]}'::JSONB),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'overall_impression', 5, 0.0, 100.0, 1, true, true, '{"method": "average_after_drop", "criteria": ["average_score", "highest_score"]}'::JSONB);

-- ============================================================================
-- SCORE FORMULAS
-- ============================================================================

INSERT INTO score_formulas (id, organization_id, name, slug, description, formula, variables, is_public, is_active, created_by) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SLS Best Trick', 'sls-best-trick', 'SLS best trick scoring formula', 'SUM(top_4_scores)', '{"top_4_scores": "Array of top 4 trick scores"}'::JSONB, true, true, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Olympic Overall', 'olympic-overall', 'Olympic overall impression scoring', 'AVERAGE(dropped_scores)', '{"dropped_scores": "Array of scores after dropping highest and lowest"}'::JSONB, true, true, '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- DISPLAY SETTINGS
-- ============================================================================

INSERT INTO display_settings (id, event_id, display_type, resolution, refresh_rate, show_clock, show_countdown, show_scores, show_rankings, show_next_rider) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'tv', '1920x1080', 60, true, true, true, true, true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'led', '3840x2160', 30, true, true, true, true, true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'mobile', '1080x1920', 60, true, true, true, true, false);

-- ============================================================================
-- OBS LAYOUTS
-- ============================================================================

INSERT INTO obs_layouts (id, event_id, name, slug, layout_type, config, is_default, is_active, created_by) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Leaderboard Overlay', 'leaderboard-overlay', 'leaderboard', '{"position": "right", "width": 400, "height": 600, "background": "rgba(0,0,0,0.8)"}'::JSONB, true, true, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Score Overlay', 'score-overlay', 'score', '{"position": "bottom_left", "width": 300, "height": 200, "background": "rgba(0,0,0,0.7)"}'::JSONB, false, true, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Lower Third', 'lower-third', 'lower_third', '{"position": "bottom", "width": 800, "height": 100, "background": "rgba(17,24,39,0.9)"}'::JSONB, false, true, '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- SCREEN LAYOUTS
-- ============================================================================

INSERT INTO screen_layouts (id, event_id, name, slug, layout_config, zones, is_default, is_active, created_by) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Standard Layout', 'standard-layout', '{"columns": 3, "rows": 2}'::JSONB, '{"header": {"x": 0, "y": 0, "w": 3, "h": 1}, "leaderboard": {"x": 0, "y": 1, "w": 1, "h": 1}, "score": {"x": 1, "y": 1, "w": 1, "h": 1}, "timer": {"x": 2, "y": 1, "w": 1, "h": 1}}'::JSONB, true, true, '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- THEMES
-- ============================================================================

INSERT INTO themes (id, organization_id, name, slug, description, colors, fonts, spacing, borders, shadows, animations, is_public, is_active, created_by) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Dark Theme', 'dark-theme', 'Default dark theme', '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B", "background": "#111827", "text": "#FFFFFF", "success": "#10B981", "danger": "#EF4444", "warning": "#F59E0B"}'::JSONB, '{"primary": "Inter", "mono": "JetBrains Mono"}'::JSONB, '{"xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2rem", "xl": "3rem"}'::JSONB, '{"radius": "0.5rem", "width": "1px"}'::JSONB, '{"sm": "0 1px 2px rgba(0,0,0,0.05)", "md": "0 4px 6px rgba(0,0,0,0.1)", "lg": "0 10px 15px rgba(0,0,0,0.1)"}'::JSONB, '{"duration": "300ms", "easing": "ease-in-out"}'::JSONB, true, true, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Light Theme', 'light-theme', 'Default light theme', '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B", "background": "#FFFFFF", "text": "#111827", "success": "#10B981", "danger": "#EF4444", "warning": "#F59E0B"}'::JSONB, '{"primary": "Inter", "mono": "JetBrains Mono"}'::JSONB, '{"xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2rem", "xl": "3rem"}'::JSONB, '{"radius": "0.5rem", "width": "1px"}'::JSONB, '{"sm": "0 1px 2px rgba(0,0,0,0.05)", "md": "0 4px 6px rgba(0,0,0,0.1)", "lg": "0 10px 15px rgba(0,0,0,0.1)"}'::JSONB, '{"duration": "300ms", "easing": "ease-in-out"}'::JSONB, true, true, '00000000-0000-0000-0000-000000000001');

-- ============================================================================
-- SYSTEM SETTINGS
-- ============================================================================

INSERT INTO system_settings (key, value, description, is_public, is_encrypted) VALUES
('app.name', '"Skate Judging Pro"', 'Application name', true, false),
('app.version', '"2.0.0"', 'Application version', true, false),
('app.environment', '"development"', 'Application environment', true, false),
('maintenance.mode', 'false', 'Maintenance mode flag', true, false),
('max_upload_size', '10485760', 'Maximum upload size in bytes', false, false),
('session_timeout', '3600', 'Session timeout in seconds', false, false),
('default_timezone', '"America/Los_Angeles"', 'Default timezone', true, false),
('default_language', '"en"', 'Default language', true, false),
('realtime_enabled', 'true', 'Enable real-time features', false, false),
('obs_integration_enabled', 'true', 'Enable OBS integration', false, false);

-- ============================================================================
-- ANNOUNCEMENTS
-- ============================================================================

INSERT INTO announcements (id, event_id, title, content, announcement_type, priority, is_public, published_by, published_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Welcome to SLS Championship 2024', 'Welcome to the Street League Skateboarding Championship 2024! Competition starts at 9:00 AM.', 'general', 'normal', true, '00000000-0000-0000-0000-000000000001', '2024-08-14 10:00:00');

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
