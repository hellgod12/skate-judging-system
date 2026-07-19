# DATABASE DIAGRAM
## Skate Judging Platform Pro V2 - Visual Schema Overview

**Date:** July 19, 2026  
**Version:** 2.0

---

## OVERVIEW

This document provides a visual representation of the database schema using ASCII art diagrams to show relationships between tables and their key fields.

---

## CORE IDENTITY & ACCESS MANAGEMENT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ORGANIZATIONS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ UK  slug (TEXT)                                                            │
│    name (TEXT)                                                             │
│    description (TEXT)                                                      │
│    logo_url (TEXT)                                                         │
│    website_url (TEXT)                                                      │
│    contact_email (TEXT)                                                    │
│    contact_phone (TEXT)                                                    │
│    address (TEXT)                                                          │
│    city (TEXT)                                                             │
│    state (TEXT)                                                            │
│    country_code (CHAR(2))                                                  │
│    postal_code (TEXT)                                                      │
│    is_active (BOOLEAN)                                                      │
│    settings (JSONB)                                                         │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
│    deleted_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│      USERS        │    │      ROLES       │    │     VENUES       │
├───────────────────┤    ├───────────────────┤    ├───────────────────┤
│ PK  id (UUID)     │    │ PK  id (UUID)     │    │ PK  id (UUID)     │
│ FK  org_id (UUID)  │───│ FK  org_id (UUID)  │───│ FK  org_id (UUID)  │
│ UK  email (TEXT)   │    │ UK  slug (TEXT)    │    │ UK  slug (TEXT)    │
│    password_hash   │    │    name (TEXT)     │    │    name (TEXT)     │
│    first_name      │    │    description    │    │    description    │
│    last_name       │    │    permissions    │    │    address        │
│    display_name    │    │    is_system      │    │    city           │
│    avatar_url      │    │    created_at     │    │    country_code   │
│    is_active       │    │    updated_at     │    │    capacity       │
│    is_verified     │    └───────────────────┘    │    is_active       │
│    preferences     │                               │    created_at     │
│    created_at      │                               │    updated_at     │
│    updated_at      │                               └───────────────────┘
└───────────────────┘
        │
        │ 1:N
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER_ROLES                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  user_id (UUID) ────────────────────────────────────────────────────────┐
│ FK  role_id (UUID) ────────────────────────────────────────────────────────┼─┐
│    assigned_at (TIMESTAMP)                                                 │ │
│    expires_at (TIMESTAMP)                                                  │ │
└─────────────────────────────────────────────────────────────────────────────┘ │
                                                                                 │
                                                                                 │
┌─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│                                                                                 │
┌─────────────────────────────────────────────────────────────────────────────┐ │
│                          ROLE_PERMISSIONS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │ │
│ FK  role_id (UUID) ───────────────────────────────────────────────────────────┘
│ FK  permission_id (UUID) ────────────────────────────────────────────────────────┐
│    created_at (TIMESTAMP)                                                     │
└─────────────────────────────────────────────────────────────────────────────┘ │
                                                                                 │
                                                                                 │
┌─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│                                                                                 │
┌─────────────────────────────────────────────────────────────────────────────┐ │
│                          PERMISSIONS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │ │
│ UK  name (TEXT)                                                            │ │
│ UK  slug (TEXT)                                                            │ │
│    description (TEXT)                                                      │ │
│    resource (TEXT)                                                          │ │
│    action (TEXT)                                                            │ │
│    created_at (TIMESTAMP)                                                   │ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPETITION MANAGEMENT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPETITION_TEMPLATES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  org_id (UUID)                                                          │
│    name (TEXT)                                                             │
│    slug (TEXT)                                                             │
│    format_type (TEXT)                                                      │
│    scoring_config (JSONB)                                                  │
│    run_config (JSONB)                                                      │
│    best_trick_config (JSONB)                                               │
│    jam_config (JSONB)                                                      │
│    timer_config (JSONB)                                                    │
│    display_config (JSONB)                                                  │
│    is_public (BOOLEAN)                                                      │
│    is_active (BOOLEAN)                                                      │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EVENTS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  org_id (UUID)                                                          │
│ FK  venue_id (UUID)                                                         │
│ FK  template_id (UUID)                                                     │
│ UK  slug (TEXT)                                                            │
│    name (TEXT)                                                             │
│    event_type (TEXT)                                                        │
│    status (TEXT)                                                            │
│    start_date (TIMESTAMP)                                                   │
│    end_date (TIMESTAMP)                                                     │
│    scoring_config (JSONB)                                                  │
│    run_config (JSONB)                                                      │
│    best_trick_config (JSONB)                                               │
│    jam_config (JSONB)                                                      │
│    is_public (BOOLEAN)                                                      │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│ COMPETITION_ROUNDS│    │ EVENT_REGISTRATIONS│   │  JUDGE_ASSIGNMENTS │
├───────────────────┤    ├───────────────────┤    ├───────────────────┤
│ PK  id (UUID)     │    │ PK  id (UUID)     │    │ PK  id (UUID)     │
│ FK  event_id (UUID)│───│ FK  event_id (UUID)│───│ FK  event_id (UUID)│
│    name (TEXT)     │    │ FK  rider_id (UUID)│───│ FK  judge_id (UUID)│
│    round_type      │    │ FK  category_id   │    │    role (TEXT)    │
│    order_index     │    │    status (TEXT)  │    │    weight (DECIMAL)│
│    status (TEXT)   │    │    payment_status │    │    assigned_at    │
│    advancement_cfg │    │    registered_at  │    └───────────────────┘
│    created_at      │    └───────────────────┘
│    updated_at      │
└───────────────────┘
        │
        │ 1:N
        │
        ▼
┌───────────────────┐
│      HEATS        │
├───────────────────┤
│ PK  id (UUID)     │
│ FK  round_id (UUID)│
│    name (TEXT)     │
│    order_index     │
│    max_participants│
│    status (TEXT)   │
│    created_at      │
│    updated_at      │
└───────────────────┘
        │
        │ 1:N
        │
        ▼
┌───────────────────┐
│  HEAT_ASSIGNMENTS │
├───────────────────┤
│ PK  id (UUID)     │
│ FK  heat_id (UUID) │
│ FK  rider_id (UUID)│
│ FK  reg_id (UUID)  │
│    start_order    │
│    lane (INTEGER)  │
│    created_at      │
└───────────────────┘
```

---

## RIDER MANAGEMENT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RIDERS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  org_id (UUID)                                                          │
│ FK  user_id (UUID)                                                         │
│ FK  nationality (CHAR(2))                                                   │
│    first_name (TEXT)                                                       │
│    last_name (TEXT)                                                        │
│    display_name (TEXT)                                                     │
│    stance (TEXT)                                                           │
│    sponsor_team (TEXT)                                                     │
│    is_professional (BOOLEAN)                                               │
│    is_active (BOOLEAN)                                                      │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  RIDER_PROFILES   │    │ EVENT_REGISTRATIONS│   │      ATTEMPTS     │
├───────────────────┤    ├───────────────────┤    ├───────────────────┤
│ PK  id (UUID)     │    │ PK  id (UUID)     │    │ PK  id (UUID)     │
│ FK  rider_id (UUID)│───│ FK  rider_id (UUID)│───│ FK  rider_id (UUID)│
│ FK  category_id   │    │ FK  event_id (UUID)│    │ FK  event_id (UUID)│
│ FK  division_id   │    │    status (TEXT)  │    │ FK  heat_id (UUID) │
│    ranking (INT)  │    │    payment_status │    │ FK  round_id (UUID)│
│    points (INT)   │    │    registered_at  │    │    attempt_type   │
│    wins (INT)     │    └───────────────────┘    │    attempt_number │
│    podiums (INT)  │                               │    status (TEXT)  │
│    best_trick     │                               │    raw_json (JSONB)│
│    signature_tricks│                              │    calculated_score│
│    achievements   │                               │    created_at     │
│    statistics    │                               └───────────────────┘
│    created_at     │
│    updated_at     │
└───────────────────┘
```

---

## SCORING & JUDGING

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ATTEMPTS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│ FK  rider_id (UUID)                                                         │
│ FK  heat_id (UUID)                                                          │
│ FK  round_id (UUID)                                                         │
│    attempt_type (TEXT)                                                      │
│    attempt_number (INTEGER)                                                 │
│    status (TEXT)                                                            │
│    raw_json (JSONB)                                                         │
│    calculated_score (DECIMAL)                                               │
│    normalized_score (DECIMAL)                                               │
│    video_url (TEXT)                                                         │
│    replay_count (INTEGER)                                                   │
│    penalty_applied (DECIMAL)                                                │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  COMBO_ATTEMPTS   │    │   JUDGE_SCORES   │    │   RUN_ATTEMPTS   │
├───────────────────┤    ├───────────────────┤    ├───────────────────┤
│ PK  id (UUID)     │    │ PK  id (UUID)     │    │ PK  id (UUID)     │
│ FK  attempt_id    │───│ FK  attempt_id    │───│ FK  run_id (UUID) │
│    trick_sequence │    │ FK  judge_id (UUID)│    │ FK  attempt_id    │
│    trick_count    │    │ FK  assignment_id │    │    sequence_order │
│    combo_multiplier│   │    score (DECIMAL)│    │    timestamp_offset│
│    transition_scores│   │    execution     │    │    created_at     │
│    flow_score     │    │    style         │    └───────────────────┘
│    created_at     │    │    amplitude     │
└───────────────────┘    │    landing       │
                         │    risk          │
                         │    variety       │
                         │    consistency   │
                         │    difficulty    │
                         │    composition   │
                         │    notes (TEXT)  │
                         │    is_revised    │
                         │    created_at     │
                         │    updated_at     │
                         └───────────────────┘
```

---

## RUNS & BEST TRICK

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                RUNS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│ FK  rider_id (UUID)                                                         │
│ FK  heat_id (UUID)                                                          │
│ FK  round_id (UUID)                                                         │
│    run_number (INTEGER)                                                     │
│    run_type (TEXT)                                                          │
│    start_time (TIMESTAMP)                                                   │
│    end_time (TIMESTAMP)                                                     │
│    duration_seconds (INTEGER)                                                │
│    status (TEXT)                                                            │
│    trick_count (INTEGER)                                                     │
│    line_utilization (JSONB)                                                 │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        BEST_TRICK_ATTEMPTS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│ FK  rider_id (UUID)                                                         │
│ FK  heat_id (UUID)                                                          │
│ FK  round_id (UUID)                                                         │
│    attempt_number (INTEGER)                                                 │
│    max_attempts (INTEGER)                                                   │
│    top_score_count (INTEGER)                                                │
│    status (TEXT)                                                            │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SCORES & LEADERBOARDS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OVERALL_SCORES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│ FK  rider_id (UUID)                                                         │
│ FK  heat_id (UUID)                                                          │
│ FK  round_id (UUID)                                                         │
│    score_type (TEXT)                                                        │
│    score (DECIMAL)                                                          │
│    rank (INTEGER)                                                           │
│    tie_breaker_score (DECIMAL)                                              │
│    calculation_method (TEXT)                                                 │
│    calculation_details (JSONB)                                              │
│    is_official (BOOLEAN)                                                     │
│ FK  verified_by (UUID)                                                      │
│    verified_at (TIMESTAMP)                                                  │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           LEADERBOARDS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│ FK  round_id (UUID)                                                         │
│ FK  heat_id (UUID)                                                          │
│    leaderboard_type (TEXT)                                                   │
│    data (JSONB)                                                             │
│    generated_at (TIMESTAMP)                                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              RESULTS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│ FK  round_id (UUID)                                                         │
│ FK  rider_id (UUID)                                                         │
│    rank (INTEGER)                                                           │
│    score (DECIMAL)                                                          │
│    prize (JSONB)                                                            │
│    is_official (BOOLEAN)                                                     │
│    published_at (TIMESTAMP)                                                  │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## TRICKS & CATEGORIES

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TRICK_CATEGORIES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  org_id (UUID)                                                          │
│ FK  parent_id (UUID) ───────────────────────────────────────────────────────┐
│ UK  slug (TEXT)                                                            │
│    name (TEXT)                                                             │
│    description (TEXT)                                                      │
│    icon_url (TEXT)                                                         │
│    is_active (BOOLEAN)                                                      │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TRICKS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  org_id (UUID)                                                          │
│ FK  category_id (UUID)                                                      │
│ UK  slug (TEXT)                                                            │
│    name (TEXT)                                                             │
│    description (TEXT)                                                      │
│    difficulty_base (INTEGER)                                                │
│    difficulty_min (INTEGER)                                                 │
│    difficulty_max (INTEGER)                                                 │
│    stance (TEXT)                                                           │
│    obstacle_type (TEXT)                                                     │
│    rotation_degrees (INTEGER)                                               │
│    is_flip (BOOLEAN)                                                        │
│    is_grind (BOOLEAN)                                                       │
│    is_slide (BOOLEAN)                                                       │
│    is_manual (BOOLEAN)                                                      │
│    is_aerial (BOOLEAN)                                                      │
│    video_url (TEXT)                                                         │
│    image_url (TEXT)                                                         │
│    is_active (BOOLEAN)                                                      │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## BRANDING & DISPLAY

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EVENT_BRANDING                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│    primary_color (TEXT)                                                     │
│    secondary_color (TEXT)                                                   │
│    accent_color (TEXT)                                                      │
│    background_color (TEXT)                                                  │
│    text_color (TEXT)                                                        │
│    font_family (TEXT)                                                         │
│    logo_url (TEXT)                                                          │
│    logo_position (TEXT)                                                     │
│    banner_url (TEXT)                                                         │
│    lower_third_config (JSONB)                                               │
│    winner_screen_config (JSONB)                                             │
│    animations_config (JSONB)                                                │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         DISPLAY_SETTINGS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│    display_type (TEXT)                                                      │
│    resolution (TEXT)                                                        │
│    refresh_rate (INTEGER)                                                    │
│    show_clock (BOOLEAN)                                                     │
│    show_countdown (BOOLEAN)                                                 │
│    show_scores (BOOLEAN)                                                     │
│    show_rankings (BOOLEAN)                                                   │
│    show_next_rider (BOOLEAN)                                                │
│    animation_speed (INTEGER)                                                 │
│    transition_effects (JSONB)                                               │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            OBS_LAYOUTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│    name (TEXT)                                                             │
│    slug (TEXT)                                                             │
│    layout_type (TEXT)                                                       │
│    config (JSONB)                                                          │
│    is_default (BOOLEAN)                                                     │
│    is_active (BOOLEAN)                                                      │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           SCREEN_LAYOUTS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  event_id (UUID)                                                         │
│    name (TEXT)                                                             │
│    slug (TEXT)                                                             │
│    layout_config (JSONB)                                                    │
│    zones (JSONB)                                                           │
│    is_default (BOOLEAN)                                                     │
│    is_active (BOOLEAN)                                                      │
│    created_at (TIMESTAMP)                                                   │
│    updated_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## AUDIT & LOGGING

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUDIT_LOGS                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  org_id (UUID)                                                          │
│ FK  user_id (UUID)                                                         │
│    action (TEXT)                                                            │
│    resource_type (TEXT)                                                     │
│ FK  resource_id (UUID)                                                      │
│    old_values (JSONB)                                                       │
│    new_values (JSONB)                                                       │
│    ip_address (TEXT)                                                        │
│    user_agent (TEXT)                                                        │
│    metadata (JSONB)                                                         │
│    created_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          ACTIVITY_LOGS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                              │
│ FK  org_id (UUID)                                                          │
│ FK  event_id (UUID)                                                         │
│ FK  user_id (UUID)                                                         │
│    activity_type (TEXT)                                                     │
│    description (TEXT)                                                      │
│    data (JSONB)                                                             │
│    ip_address (TEXT)                                                        │
│    created_at (TIMESTAMP)                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## TABLE COUNT SUMMARY

**Total Tables:** 47

**By Category:**
- Identity & Access: 7 (organizations, users, roles, user_roles, permissions, role_permissions)
- Venues & Locations: 2 (venues, countries)
- Competition: 6 (templates, events, rounds, heats, categories, divisions)
- Riders: 3 (riders, rider_profiles, event_registrations, heat_assignments)
- Judges: 2 (judges, judge_assignments)
- Operators: 2 (operators, operator_assignments)
- Event Staff: 1 (event_staff)
- Sponsors: 2 (sponsors, event_sponsors)
- Branding: 2 (event_branding, event_assets)
- Scoring: 2 (scoring_settings, score_formulas)
- Tricks: 2 (trick_categories, tricks)
- Attempts: 5 (attempts, combo_attempts, runs, run_attempts, best_trick_attempts)
- Judging: 4 (judge_scores, overall_scores, leaderboards, results)
- Penalties: 1 (penalties)
- Communication: 2 (announcements, notifications)
- Display: 4 (display_settings, obs_layouts, screen_layouts, themes)
- System: 1 (system_settings)
- Audit: 2 (audit_logs, activity_logs)

---

**END OF DATABASE DIAGRAM**
