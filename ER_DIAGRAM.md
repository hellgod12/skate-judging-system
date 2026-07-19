# ENTITY RELATIONSHIP DIAGRAM
## Skate Judging Platform Pro v2 - Database Schema

**Date:** July 19, 2026  
**Version:** 2.0

---

## LEGEND

```
[PK] Primary Key
[FK] Foreign Key
[UK] Unique Key
*  Required field
?  Optional field
```

---

## CORE IDENTITY & ACCESS MANAGEMENT

```
organizations
├── [PK] id (UUID)
├── [UK] slug (TEXT)
├── * name (TEXT)
├── ? description (TEXT)
├── ? logo_url (TEXT)
├── ? website_url (TEXT)
├── ? contact_email (TEXT)
├── ? contact_phone (TEXT)
├── ? address (TEXT)
├── ? city (TEXT)
├── ? state (TEXT)
├── ? country_code (CHAR(2))
├── ? postal_code (TEXT)
├── * is_active (BOOLEAN)
├── ? settings (JSONB)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    ├── users (organization_id)
    ├── roles (organization_id)
    ├── venues (organization_id)
    ├── competition_templates (organization_id)
    ├── events (organization_id)
    ├── categories (organization_id)
    ├── divisions (organization_id)
    ├── riders (organization_id)
    ├── judges (organization_id)
    ├── operators (organization_id)
    ├── sponsors (organization_id)
    ├── trick_categories (organization_id)
    ├── tricks (organization_id)
    ├── score_formulas (organization_id)
    ├── themes (organization_id)
    └── audit_logs (organization_id)

users
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] email (TEXT)
├── * password_hash (TEXT)
├── * first_name (TEXT)
├── * last_name (TEXT)
├── ? display_name (TEXT)
├── ? avatar_url (TEXT)
├── ? phone (TEXT)
├── ? date_of_birth (DATE)
├── ? nationality_code (CHAR(2))
├── * is_active (BOOLEAN)
├── * is_verified (BOOLEAN)
├── ? last_login_at (TIMESTAMP)
├── ? last_login_ip (TEXT)
├── ? password_changed_at (TIMESTAMP)
├── * failed_login_attempts (INTEGER)
├── ? locked_until (TIMESTAMP)
├── ? preferences (JSONB)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    ├── user_roles (user_id)
    ├── riders (user_id)
    ├── judges (user_id)
    ├── operators (user_id)
    ├── event_staff (user_id)
    ├── judge_assignments (assigned_by)
    ├── operator_assignments (assigned_by)
    ├── event_branding (created_by)
    ├── competition_templates (created_by)
    ├── events (created_by)
    ├── tricks (created_by)
    ├── score_formulas (created_by)
    ├── themes (created_by)
    ├── obs_layouts (created_by)
    ├── screen_layouts (created_by)
    ├── announcements (published_by)
    ├── audit_logs (user_id)
    ├── activity_logs (user_id)
    └── system_settings (updated_by)

roles
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── * is_system (BOOLEAN)
├── ? permissions (JSONB)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    ├── user_roles (role_id)
    └── role_permissions (role_id)

user_roles
├── [PK] id (UUID)
├── [FK] user_id (UUID) → users(id)
├── [FK] role_id (UUID) → roles(id)
├── [FK] assigned_by (UUID) → users(id)
├── * assigned_at (TIMESTAMP)
├── ? expires_at (TIMESTAMP)
└── [UK] (user_id, role_id)

permissions
├── [PK] id (UUID)
├── [UK] name (TEXT)
├── [UK] slug (TEXT)
├── ? description (TEXT)
├── * resource (TEXT)
├── * action (TEXT)
└── * created_at (TIMESTAMP)
    │
    │ 1
    │
    └── role_permissions (permission_id)

role_permissions
├── [PK] id (UUID)
├── [FK] role_id (UUID) → roles(id)
├── [FK] permission_id (UUID) → permissions(id)
├── * created_at (TIMESTAMP)
└── [UK] (role_id, permission_id)
```

---

## VENUES & LOCATIONS

```
venues
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── ? address (TEXT)
├── ? city (TEXT)
├── ? state (TEXT)
├── ? country_code (CHAR(2))
├── ? postal_code (TEXT)
├── ? latitude (DECIMAL)
├── ? longitude (DECIMAL)
├── ? timezone (TEXT)
├── ? capacity (INTEGER)
├── ? image_url (TEXT)
├── ? website_url (TEXT)
├── ? contact_email (TEXT)
├── ? contact_phone (TEXT)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    └── events (venue_id)

countries
├── [PK] id (UUID)
├── * name (TEXT)
├── [UK] code (CHAR(2))
├── ? flag_url (TEXT)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    ├── riders (nationality_code)
    ├── riders (residence_country_code)
    └── venues (country_code)
```

---

## COMPETITION MANAGEMENT

```
competition_templates
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── * name (TEXT)
├── * slug (TEXT)
├── ? description (TEXT)
├── * format_type (TEXT)
├── * scoring_config (JSONB)
├── * run_config (JSONB)
├── * best_trick_config (JSONB)
├── * jam_config (JSONB)
├── * timer_config (JSONB)
├── * display_config (JSONB)
├── * is_public (BOOLEAN)
├── * is_active (BOOLEAN)
├── [FK] created_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    └── events (template_id)

events
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [FK] venue_id (UUID) → venues(id)
├── [FK] template_id (UUID) → competition_templates(id)
├── * name (TEXT)
├── [UK] slug (TEXT, organization_id)
├── ? description (TEXT)
├── * event_type (TEXT)
├── * status (TEXT)
├── * start_date (TIMESTAMP)
├── * end_date (TIMESTAMP)
├── ? registration_start_date (TIMESTAMP)
├── ? registration_end_date (TIMESTAMP)
├── ? max_participants (INTEGER)
├── ? entry_fee (DECIMAL)
├── ? prize_pool (JSONB)
├── * scoring_config (JSONB)
├── * run_config (JSONB)
├── * best_trick_config (JSONB)
├── * jam_config (JSONB)
├── * timer_config (JSONB)
├── * is_public (BOOLEAN)
├── * is_featured (BOOLEAN)
├── ? image_url (TEXT)
├── ? banner_url (TEXT)
├── [FK] created_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    ├── competition_rounds (event_id)
    ├── event_registrations (event_id)
    ├── judge_assignments (event_id)
    ├── operator_assignments (event_id)
    ├── event_staff (event_id)
    ├── event_sponsors (event_id)
    ├── event_branding (event_id)
    ├── event_assets (event_id)
    ├── scoring_settings (event_id)
    ├── attempts (event_id)
    ├── runs (event_id)
    ├── best_trick_attempts (event_id)
    ├── overall_scores (event_id)
    ├── leaderboards (event_id)
    ├── results (event_id)
    ├── penalties (event_id)
    ├── announcements (event_id)
    ├── display_settings (event_id)
    ├── obs_layouts (event_id)
    ├── screen_layouts (event_id)
    └── activity_logs (event_id)

competition_rounds
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── * name (TEXT)
├── * round_type (TEXT)
├── * order_index (INTEGER)
├── ? start_time (TIMESTAMP)
├── ? end_time (TIMESTAMP)
├── * status (TEXT)
├── ? scoring_config (JSONB)
├── ? advancement_config (JSONB)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    ├── heats (round_id)
    ├── attempts (round_id)
    ├── runs (round_id)
    ├── best_trick_attempts (round_id)
    ├── overall_scores (round_id)
    ├── leaderboards (round_id)
    └── results (round_id)

heats
├── [PK] id (UUID)
├── [FK] round_id (UUID) → competition_rounds(id)
├── * name (TEXT)
├── * order_index (INTEGER)
├── ? start_time (TIMESTAMP)
├── ? end_time (TIMESTAMP)
├── ? max_participants (INTEGER)
├── * status (TEXT)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    ├── heat_assignments (heat_id)
    ├── attempts (heat_id)
    ├── runs (heat_id)
    ├── best_trick_attempts (heat_id)
    ├── overall_scores (heat_id)
    └── leaderboards (heat_id)

categories
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── ? age_min (INTEGER)
├── ? age_max (INTEGER)
├── ? gender (TEXT)
├── ? skill_level (TEXT)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    ├── rider_profiles (category_id)
    └── event_registrations (category_id)

divisions
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    └── rider_profiles (division_id)
```

---

## RIDER MANAGEMENT

```
riders
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [FK] user_id (UUID) → users(id)
├── * first_name (TEXT)
├── * last_name (TEXT)
├── ? display_name (TEXT)
├── ? date_of_birth (DATE)
├── [FK] nationality_code (CHAR(2)) → countries(code)
├── [FK] residence_country_code (CHAR(2)) → countries(code)
├── ? gender (TEXT)
├── ? height_cm (INTEGER)
├── ? weight_kg (INTEGER)
├── ? stance (TEXT)
├── ? sponsor_team (TEXT)
├── ? profile_image_url (TEXT)
├── ? bio (TEXT)
├── ? social_media (JSONB)
├── * is_active (BOOLEAN)
├── * is_professional (BOOLEAN)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    ├── rider_profiles (rider_id)
    ├── event_registrations (rider_id)
    ├── heat_assignments (rider_id)
    ├── attempts (rider_id)
    ├── runs (rider_id)
    ├── best_trick_attempts (rider_id)
    ├── overall_scores (rider_id)
    ├── results (rider_id)
    └── penalties (rider_id)

rider_profiles
├── [PK] id (UUID)
├── [FK] rider_id (UUID) → riders(id)
├── [FK] category_id (UUID) → categories(id)
├── [FK] division_id (UUID) → divisions(id)
├── ? ranking (INTEGER)
├── * points (INTEGER)
├── * wins (INTEGER)
├── * podiums (INTEGER)
├── * total_competitions (INTEGER)
├── ? best_trick (TEXT)
├── ? signature_tricks (JSONB)
├── ? equipment (JSONB)
├── ? achievements (JSONB)
├── ? statistics (JSONB)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── [UK] (rider_id, category_id, division_id)

event_registrations
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] rider_id (UUID) → riders(id)
├── [FK] category_id (UUID) → categories(id)
├── [FK] division_id (UUID) → divisions(id)
├── ? registration_number (TEXT)
├── * status (TEXT)
├── * payment_status (TEXT)
├── ? payment_amount (DECIMAL)
├── * registered_at (TIMESTAMP)
├── ? confirmed_at (TIMESTAMP)
├── ? cancelled_at (TIMESTAMP)
├── ? notes (TEXT)
└── [UK] (event_id, rider_id)
    │
    │ 1
    │
    └── heat_assignments (registration_id)

heat_assignments
├── [PK] id (UUID)
├── [FK] heat_id (UUID) → heats(id)
├── [FK] rider_id (UUID) → riders(id)
├── [FK] registration_id (UUID) → event_registrations(id)
├── ? start_order (INTEGER)
├── ? lane (INTEGER)
├── * created_at (TIMESTAMP)
└── [UK] (heat_id, rider_id)
```

---

## JUDGE MANAGEMENT

```
judges
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [FK] user_id (UUID) → users(id)
├── * first_name (TEXT)
├── * last_name (TEXT)
├── ? display_name (TEXT)
├── ? certification (TEXT)
├── ? experience_years (INTEGER)
├── ? specialties (JSONB)
├── ? bio (TEXT)
├── ? profile_image_url (TEXT)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    └── judge_assignments (judge_id)

judge_assignments
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] judge_id (UUID) → judges(id)
├── * role (TEXT)
├── * weight (DECIMAL)
├── * assigned_at (TIMESTAMP)
├── [FK] assigned_by (UUID) → users(id)
└── [UK] (event_id, judge_id)
    │
    │ 1
    │
    └── judge_scores (judge_assignment_id)
```

---

## OPERATOR MANAGEMENT

```
operators
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [FK] user_id (UUID) → users(id)
├── * role (TEXT)
├── ? certifications (JSONB)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── operator_assignments (operator_id)

operator_assignments
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] operator_id (UUID) → operators(id)
├── * role (TEXT)
├── * assigned_at (TIMESTAMP)
├── [FK] assigned_by (UUID) → users(id)
└── [UK] (event_id, operator_id)
```

---

## EVENT STAFF

```
event_staff
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] user_id (UUID) → users(id)
├── * first_name (TEXT)
├── * last_name (TEXT)
├── * role (TEXT)
├── ? department (TEXT)
├── ? contact_phone (TEXT)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
```

---

## SPONSORSHIP

```
sponsors
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── ? logo_url (TEXT)
├── ? website_url (TEXT)
├── ? contact_email (TEXT)
├── ? contact_phone (TEXT)
├── ? tier (TEXT)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    └── event_sponsors (sponsor_id)

event_sponsors
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] sponsor_id (UUID) → sponsors(id)
├── * tier (TEXT)
├── ? sponsorship_level (TEXT)
├── ? benefits (JSONB)
├── ? contract_value (DECIMAL)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── [UK] (event_id, sponsor_id)
```

---

## BRANDING & ASSETS

```
event_branding
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── ? primary_color (TEXT)
├── ? secondary_color (TEXT)
├── ? accent_color (TEXT)
├── ? background_color (TEXT)
├── ? text_color (TEXT)
├── ? font_family (TEXT)
├── ? logo_url (TEXT)
├── ? logo_position (TEXT)
├── ? banner_url (TEXT)
├── ? favicon_url (TEXT)
├── ? browser_title (TEXT)
├── ? custom_css (TEXT)
├── ? lower_third_config (JSONB)
├── ? winner_screen_config (JSONB)
├── ? animations_config (JSONB)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── [UK] (event_id)

event_assets
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── * asset_type (TEXT)
├── * name (TEXT)
├── ? description (TEXT)
├── * file_url (TEXT)
├── ? file_size (INTEGER)
├── ? file_format (TEXT)
├── ? mime_type (TEXT)
├── ? metadata (JSONB)
├── [FK] uploaded_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
```

---

## SCORING CONFIGURATION

```
scoring_settings
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── * scoring_method (TEXT)
├── ? judge_count (INTEGER)
├── ? score_range_min (DECIMAL)
├── ? score_range_max (DECIMAL)
├── ? decimal_places (INTEGER)
├── ? drop_lowest (BOOLEAN)
├── ? drop_highest (BOOLEAN)
├── ? judge_weights (JSONB)
├── ? score_formula (TEXT)
├── ? tie_breaker_config (JSONB)
├── ? replay_enabled (BOOLEAN)
├── ? replay_count (INTEGER)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── [UK] (event_id)

score_formulas
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── * formula (TEXT)
├── ? variables (JSONB)
├── * is_public (BOOLEAN)
├── * is_active (BOOLEAN)
├── [FK] created_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
```

---

## TRICKS & COMBOS

```
trick_categories
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── [FK] parent_id (UUID) → trick_categories(id)
├── ? icon_url (TEXT)
├── * is_active (BOOLEAN)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
    │
    │ 1
    │
    ├── tricks (category_id)
    └── trick_categories (parent_id)

tricks
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [FK] category_id (UUID) → trick_categories(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── * difficulty_base (INTEGER)
├── ? difficulty_min (INTEGER)
├── ? difficulty_max (INTEGER)
├── ? stance (TEXT)
├── ? obstacle_type (TEXT)
├── ? rotation_degrees (INTEGER)
├── ? is_flip (BOOLEAN)
├── ? is_grind (BOOLEAN)
├── ? is_slide (BOOLEAN)
├── ? is_manual (BOOLEAN)
├── ? is_aerial (BOOLEAN)
├── ? video_url (TEXT)
├── ? image_url (TEXT)
├── * is_active (BOOLEAN)
├── [FK] created_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
```

---

## ATTEMPTS & RUNS

```
attempts
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] rider_id (UUID) → riders(id)
├── [FK] heat_id (UUID) → heats(id)
├── [FK] round_id (UUID) → competition_rounds(id)
├── * attempt_type (TEXT)
├── * attempt_number (INTEGER)
├── * status (TEXT)
├── * raw_json (JSONB)
├── ? calculated_score (DECIMAL)
├── ? normalized_score (DECIMAL)
├── ? video_url (TEXT)
├── ? video_timestamp_start (INTEGER)
├── ? video_timestamp_end (INTEGER)
├── * replay_count (INTEGER)
├── * penalty_applied (DECIMAL)
├── ? notes (TEXT)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    ├── combo_attempts (attempt_id)
    ├── judge_scores (attempt_id)
    └── run_attempts (attempt_id)

combo_attempts
├── [PK] id (UUID)
├── [FK] attempt_id (UUID) → attempts(id)
├── * trick_sequence (TEXT)
├── * trick_count (INTEGER)
├── ? combo_multiplier (DECIMAL)
├── ? transition_scores (JSONB)
├── ? flow_score (DECIMAL)
└── * created_at (TIMESTAMP)

runs
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] rider_id (UUID) → riders(id)
├── [FK] heat_id (UUID) → heats(id)
├── [FK] round_id (UUID) → competition_rounds(id)
├── * run_number (INTEGER)
├── * run_type (TEXT)
├── ? start_time (TIMESTAMP)
├── ? end_time (TIMESTAMP)
├── ? duration_seconds (INTEGER)
├── * status (TEXT)
├── * trick_count (INTEGER)
├── ? line_utilization (JSONB)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── run_attempts (run_id)

run_attempts
├── [PK] id (UUID)
├── [FK] run_id (UUID) → runs(id)
├── [FK] attempt_id (UUID) → attempts(id)
├── * sequence_order (INTEGER)
├── ? timestamp_offset (INTEGER)
└── * created_at (TIMESTAMP)

best_trick_attempts
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] rider_id (UUID) → riders(id)
├── [FK] heat_id (UUID) → heats(id)
├── [FK] round_id (UUID) → competition_rounds(id)
├── * attempt_number (INTEGER)
├── * max_attempts (INTEGER)
├── * top_score_count (INTEGER)
├── * status (TEXT)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── [UK] (event_id, rider_id, heat_id, round_id, attempt_number)
```

---

## JUDGING & SCORING

```
judge_scores
├── [PK] id (UUID)
├── [FK] attempt_id (UUID) → attempts(id)
├── [FK] judge_id (UUID) → judges(id)
├── [FK] judge_assignment_id (UUID) → judge_assignments(id)
├── * score (DECIMAL)
├── ? execution (DECIMAL)
├── ? style (DECIMAL)
├── ? amplitude (DECIMAL)
├── ? landing (DECIMAL)
├── ? risk (DECIMAL)
├── ? variety (DECIMAL)
├── ? consistency (DECIMAL)
├── ? difficulty (DECIMAL)
├── ? composition (DECIMAL)
├── ? notes (TEXT)
├── * is_revised (BOOLEAN)
├── [FK] original_score_id (UUID) → judge_scores(id)
├── ? revised_at (TIMESTAMP)
├── [FK] revised_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── [UK] (attempt_id, judge_id)

overall_scores
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] rider_id (UUID) → riders(id)
├── [FK] heat_id (UUID) → heats(id)
├── [FK] round_id (UUID) → competition_rounds(id)
├── * score_type (TEXT)
├── * score (DECIMAL)
├── ? rank (INTEGER)
├── ? tie_breaker_score (DECIMAL)
├── ? calculation_method (TEXT)
├── ? calculation_details (JSONB)
├── * is_official (BOOLEAN)
├── [FK] verified_by (UUID) → users(id)
├── ? verified_at (TIMESTAMP)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── [UK] (event_id, rider_id, heat_id, round_id, score_type)

leaderboards
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] round_id (UUID) → competition_rounds(id)
├── [FK] heat_id (UUID) → heats(id)
├── * leaderboard_type (TEXT)
├── * data (JSONB)
├── * generated_at (TIMESTAMP)
└── [UK] (event_id, round_id, heat_id, leaderboard_type)

results
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] round_id (UUID) → competition_rounds(id)
├── [FK] rider_id (UUID) → riders(id)
├── * rank (INTEGER)
├── * score (DECIMAL)
├── ? prize (JSONB)
├── * is_official (BOOLEAN)
├── * published_at (TIMESTAMP)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)

penalties
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── [FK] rider_id (UUID) → riders(id)
├── [FK] attempt_id (UUID) → attempts(id)
├── * penalty_type (TEXT)
├── ? description (TEXT)
├── * penalty_value (DECIMAL)
├── [FK] applied_by (UUID) → users(id)
├── * applied_at (TIMESTAMP)
├── * is_appealed (BOOLEAN)
├── ? appeal_status (TEXT)
├── ? appeal_notes (TEXT)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
```

---

## COMMUNICATION

```
announcements
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── * title (TEXT)
├── * content (TEXT)
├── * announcement_type (TEXT)
├── ? priority (TEXT)
├── * is_public (BOOLEAN)
├── [FK] published_by (UUID) → users(id)
├── * published_at (TIMESTAMP)
├── ? expires_at (TIMESTAMP)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)

notifications
├── [PK] id (UUID)
├── [FK] user_id (UUID) → users(id)
├── [FK] event_id (UUID) → events(id)
├── * notification_type (TEXT)
├── * title (TEXT)
├── * content (TEXT)
├── ? data (JSONB)
├── * is_read (BOOLEAN)
├── ? read_at (TIMESTAMP)
└── * created_at (TIMESTAMP)
```

---

## DISPLAY & OBS

```
display_settings
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── * display_type (TEXT)
├── ? resolution (TEXT)
├── ? refresh_rate (INTEGER)
├── ? show_clock (BOOLEAN)
├── ? show_countdown (BOOLEAN)
├── ? show_scores (BOOLEAN)
├── ? show_rankings (BOOLEAN)
├── ? show_next_rider (BOOLEAN)
├── ? animation_speed (INTEGER)
├── ? transition_effects (JSONB)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)
    │
    │ 1
    │
    └── [UK] (event_id, display_type)

obs_layouts
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── * name (TEXT)
├── * slug (TEXT)
├── * layout_type (TEXT)
├── * config (JSONB)
├── ? is_default (BOOLEAN)
├── * is_active (BOOLEAN)
├── [FK] created_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)

screen_layouts
├── [PK] id (UUID)
├── [FK] event_id (UUID) → events(id)
├── * name (TEXT)
├── * slug (TEXT)
├── * layout_config (JSONB)
├── ? zones (JSONB)
├── ? is_default (BOOLEAN)
├── * is_active (BOOLEAN)
├── [FK] created_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
└── * updated_at (TIMESTAMP)

themes
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [UK] slug (TEXT, organization_id)
├── * name (TEXT)
├── ? description (TEXT)
├── * colors (JSONB)
├── * fonts (JSONB)
├── * spacing (JSONB)
├── * borders (JSONB)
├── * shadows (JSONB)
├── * animations (JSONB)
├── * is_public (BOOLEAN)
├── * is_active (BOOLEAN)
├── [FK] created_by (UUID) → users(id)
├── * created_at (TIMESTAMP)
├── * updated_at (TIMESTAMP)
└── ? deleted_at (TIMESTAMP)
```

---

## SYSTEM CONFIGURATION

```
system_settings
├── [PK] key (TEXT)
├── * value (JSONB)
├── ? description (TEXT)
├── ? is_public (BOOLEAN)
├── ? is_encrypted (BOOLEAN)
├── [FK] updated_by (UUID) → users(id)
└── * updated_at (TIMESTAMP)
```

---

## AUDIT & LOGGING

```
audit_logs
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [FK] user_id (UUID) → users(id)
├── * action (TEXT)
├── * resource_type (TEXT)
├── [FK] resource_id (UUID)
├── ? old_values (JSONB)
├── ? new_values (JSONB)
├── ? ip_address (TEXT)
├── ? user_agent (TEXT)
├── ? metadata (JSONB)
└── * created_at (TIMESTAMP)

activity_logs
├── [PK] id (UUID)
├── [FK] organization_id (UUID) → organizations(id)
├── [FK] event_id (UUID) → events(id)
├── [FK] user_id (UUID) → users(id)
├── * activity_type (TEXT)
├── ? description (TEXT)
├── ? data (JSONB)
├── ? ip_address (TEXT)
└── * created_at (TIMESTAMP)
```

---

## RELATIONSHIP SUMMARY

### One-to-Many Relationships
- organizations → users, roles, venues, events, categories, divisions, riders, judges, operators, sponsors, tricks, etc.
- users → user_roles, riders, judges, operators, etc.
- roles → user_roles, role_permissions
- events → competition_rounds, event_registrations, judge_assignments, etc.
- competition_rounds → heats, attempts, runs, etc.
- heats → heat_assignments, attempts, runs, etc.
- riders → rider_profiles, event_registrations, attempts, runs, etc.
- judges → judge_assignments
- attempts → combo_attempts, judge_scores, run_attempts
- runs → run_attempts

### Many-to-Many Relationships
- users ↔ roles (via user_roles)
- roles ↔ permissions (via role_permissions)
- events ↔ riders (via event_registrations)
- events ↔ judges (via judge_assignments)
- events ↔ operators (via operator_assignments)
- events ↔ sponsors (via event_sponsors)
- riders ↔ categories/divisions (via rider_profiles)

### Self-Referencing Relationships
- trick_categories → trick_categories (parent_id)
- judge_scores → judge_scores (original_score_id)

---

## KEY INDEXES

### Primary Keys
All tables use UUID primary keys for global uniqueness.

### Foreign Keys
All foreign keys are indexed for performance.

### Unique Constraints
- organizations.slug (per organization)
- users.email
- roles.slug (per organization)
- venues.slug (per organization)
- events.slug (per organization)
- categories.slug (per organization)
- divisions.slug (per organization)
- sponsors.slug (per organization)
- trick_categories.slug (per organization)
- tricks.slug (per organization)
- score_formulas.slug (per organization)
- themes.slug (per organization)
- user_roles (user_id, role_id)
- role_permissions (role_id, permission_id)
- event_registrations (event_id, rider_id)
- heat_assignments (heat_id, rider_id)
- judge_assignments (event_id, judge_id)
- operator_assignments (event_id, operator_id)
- event_sponsors (event_id, sponsor_id)
- event_branding (event_id)
- scoring_settings (event_id)
- display_settings (event_id, display_type)
- leaderboards (event_id, round_id, heat_id, leaderboard_type)
- overall_scores (event_id, rider_id, heat_id, round_id, score_type)
- best_trick_attempts (event_id, rider_id, heat_id, round_id, attempt_number)
- judge_scores (attempt_id, judge_id)

### Performance Indexes
- created_at timestamps on all tables
- status fields on events, rounds, heats, attempts, runs
- is_active flags on users, riders, judges, operators, sponsors
- organization_id on all multi-tenant tables
- event_id on all event-related tables
- rider_id on all rider-related tables
- judge_id on all judge-related tables

---

**END OF ER DIAGRAM**
