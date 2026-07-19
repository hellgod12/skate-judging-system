# ARCHITECTURE DOCUMENTATION V3
## Skate Judging Platform Pro V3 - Extensible Multi-Sport System Architecture

**Date:** July 19, 2026  
**Version:** 3.0

---

## EXECUTIVE SUMMARY

The Skate Judging Platform Pro V3 is a comprehensive, enterprise-grade multi-sport judging system designed for professional competitions. It features a modern microservices architecture, multi-tenant support, real-time scoring, complete configurability through an Admin CMS, and is built for 10-year extensibility without breaking changes.

**Key Achievements:**
- Complete database redesign with 143 tables using UUIDs
- Multi-sport architecture with sport abstraction layer
- Plugin system for third-party extensions
- Full internationalization support (i18n)
- Offline-first architecture with sync capabilities
- Workflow engine for configurable competition flows
- Schedule engine with optimization and conflict detection
- Drag-and-drop display layout builder
- Animation engine with timeline management
- Audio manager with playlist and cue support
- Media library with transcoding and rights management
- ML/combo recognition engine
- Statistics engine with predictive analytics
- Replay engine with multi-angle support
- White-label branding with domain mapping
- Multi-tenant architecture with RBAC
- Configurable competition templates (SLS, Olympic, Best Trick, Jam, Game of Skate, Custom)
- Real-time scoring with WebSocket support
- Separate interfaces for Admin, Judge, Operator, Display, OBS, and Public
- Comprehensive API with 250+ endpoints
- Production-ready deployment strategy
- 80% test coverage target
- Zero-downtime blue-green deployment

---

## SYSTEM OVERVIEW

### Architecture Type
- **Pattern:** Microservices with Monorepo
- **Style:** Event-driven with Real-time Updates
- **Deployment:** Containerized (Kubernetes)
- **Database:** PostgreSQL with Redis caching
- **Communication:** REST API + WebSocket
- **Frontend:** Next.js (React)
- **Extensibility:** Plugin-based architecture

### Design Principles
1. **Configurability:** All competition rules configurable via Admin CMS
2. **Multi-tenancy:** Support for multiple organizations
3. **Multi-sport:** Abstract sport layer for any sport support
4. **Scalability:** Horizontal scaling with Kubernetes
5. **Real-time:** WebSocket for live updates
6. **Security:** RBAC with audit logging
7. **Performance:** Optimized queries with caching
8. **Reliability:** Blue-green deployment with rollback
9. **Accessibility:** WCAG 2.1 AA compliance
10. **Extensibility:** Plugin system for 10-year evolution
11. **Internationalization:** Full i18n support
12. **Offline-first:** Sync capabilities for unreliable networks

---

## ARCHITECTURE LAYERS

### Presentation Layer
**Purpose:** User interfaces for different user types

**Components:**
- **Admin CMS:** Full-featured admin interface
- **Judge UI:** Touch-optimized scoring interface
- **Operator UI:** Event management interface
- **Display UI:** Large-screen displays
- **OBS UI:** Overlay management
- **Public UI:** Spectator-facing website

**Technologies:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui

### Application Layer
**Purpose:** Business logic and API endpoints

**Components:**
- **API Gateway:** Request routing and authentication
- **Workflow Engine:** Competition workflow management
- **Schedule Engine:** Schedule optimization and management
- **Scoring Service:** Score calculations
- **Notification Service:** Email/SMS/Push notifications
- **Media Service:** Video/image processing
- **Analytics Service:** Usage analytics
- **ML Service:** Trick recognition and predictions
- **Plugin Service:** Plugin management
- **Sync Service:** Offline synchronization

**Technologies:**
- Node.js 18+
- Express.js
- TypeScript
- JWT Authentication
- WebSocket (Socket.io)

### Data Layer
**Purpose:** Data persistence and caching

**Components:**
- **PostgreSQL:** Primary database (143 tables)
- **Redis:** Caching and sessions
- **S3:** File storage
- **CloudFront:** CDN

**Technologies:**
- PostgreSQL 15+
- Redis 7+
- AWS S3
- AWS CloudFront

### Infrastructure Layer
**Purpose:** Compute, networking, and security

**Components:**
- **Kubernetes:** Container orchestration
- **EKS:** Managed Kubernetes
- **ALB:** Load balancing
- **VPC:** Network isolation
- **WAF:** Web application firewall

**Technologies:**
- AWS EKS
- AWS ALB
- AWS VPC
- AWS WAF
- AWS Shield

---

## DATABASE ARCHITECTURE

### Database Design
- **Tables:** 143 tables (up from 47 in V2)
- **Primary Keys:** UUID (uuid_generate_v4())
- **Foreign Keys:** All indexed
- **Constraints:** Comprehensive validation
- **Triggers:** Updated_at timestamps
- **Functions:** Business logic in database
- **Views:** Simplified queries
- **Policies:** Row-level security

### Key Table Categories

#### Identity & Access (7 tables)
- organizations
- users
- roles
- user_roles
- permissions
- role_permissions
- countries

#### Sports & Multi-Sport Support (7 tables)
- sports
- sport_configurations
- sport_scoring_engines
- sport_ui_components
- sport_data_models
- sport_workflows
- multi_sport_events

#### Venues & Locations (1 table)
- venues

#### Competition Management (6 tables)
- competition_templates
- events
- competition_rounds
- heats
- categories
- divisions

#### Workflow Engine (6 tables)
- workflow_definitions
- workflow_states
- workflow_transitions
- workflow_executions
- workflow_conditions
- workflow_actions

#### Schedule Engine (7 tables)
- schedules
- schedule_items
- schedule_constraints
- schedule_conflicts
- schedule_resources
- schedule_dependencies
- calendar_events

#### Rider Management (4 tables)
- riders
- rider_profiles
- event_registrations
- heat_assignments

#### Judge Management (2 tables)
- judges
- judge_assignments

#### Operator Management (2 tables)
- operators
- operator_assignments

#### Event Staff (1 table)
- event_staff

#### Sponsorship (2 tables)
- sponsors
- event_sponsors

#### Branding & Assets (2 tables)
- event_branding
- event_assets

#### Scoring Configuration (2 tables)
- scoring_settings
- score_formulas

#### Sport-Specific Data (3 tables)
- sport_entities (abstract base)
- skate_tricks (skateboarding implementation)
- trick_categories

#### Attempts & Runs (5 tables)
- attempts
- combo_attempts
- runs
- run_attempts
- best_trick_attempts

#### Judging & Scoring (4 tables)
- judge_scores
- overall_scores
- leaderboards
- results

#### Penalties (1 table)
- penalties

#### Communication (2 tables)
- announcements
- notifications

#### Display & OBS (4 tables)
- display_settings
- obs_layouts
- screen_layouts
- themes

#### Layout Builder (6 tables)
- layout_components
- layout_component_library
- layout_templates
- layout_versions
- layout_breakpoints
- layout_validations

#### Animation Engine (7 tables)
- animation_library
- animation_timelines
- animation_keyframes
- animation_sequences
- animation_triggers
- animation_templates
- animation_easings

#### Audio Manager (7 tables)
- audio_library
- audio_playlists
- audio_cues
- audio_effects
- audio_levels
- audio_metadata
- audio_sync

#### Media Library (7 tables)
- media_library
- media_tags
- media_metadata
- media_versions
- media_thumbnails
- media_transcoding
- media_rights

#### Trick Library Extensions (6 tables)
- trick_variants
- trick_algorithms
- trick_analysis
- trick_learning
- trick_calibration
- trick_similarity

#### ML/Combo Recognition (6 tables)
- ml_models
- ml_training_data
- ml_predictions
- trick_detection
- combo_patterns
- recognition_confidence

#### Statistics Engine (6 tables)
- statistics_aggregations
- statistics_trends
- statistics_predictions
- statistics_models
- data_warehouse
- aggregation_pipelines

#### Replay Engine (6 tables)
- replay_bookmarks
- replay_angles
- replay_annotations
- replay_highlights
- replay_comparisons
- replay_settings

#### Offline Sync (6 tables)
- sync_queue
- sync_conflicts
- sync_status
- offline_data
- sync_reconciliation
- data_versions

#### Plugin Architecture (7 tables)
- plugins
- plugin_hooks
- plugin_extensions
- plugin_permissions
- plugin_marketplace
- plugin_versions
- plugin_dependencies

#### Internationalization (6 tables)
- languages
- translations
- translation_keys
- locales
- currency_localization
- date_formats

#### White-label Branding (6 tables)
- domain_mappings
- custom_domains
- organization_branding
- branding_templates
- branding_approvals
- branding_versions

#### System (1 table)
- system_settings

#### Audit & Logging (2 tables)
- audit_logs
- activity_logs

### Database Features
- **Multi-tenancy:** organization_id on all multi-tenant tables
- **Multi-sport:** sport_id on sport-specific tables
- **Audit Logging:** audit_logs for all changes
- **Activity Logging:** activity_logs for user actions
- **Soft Deletes:** deleted_at on key tables
- **Timestamps:** created_at, updated_at on all tables
- **JSONB:** Flexible configuration storage
- **Indexes:** Optimized for common queries
- **Foreign Keys:** CASCADE delete/update
- **Sport Abstraction:** Abstract base tables for sport-specific implementations

---

## API ARCHITECTURE

### API Design
- **Style:** RESTful
- **Base URL:** https://api.skapejudging.com/v3
- **Authentication:** Bearer Token (JWT)
- **Rate Limiting:** 1000 requests per minute per user
- **Content-Type:** application/json

### API Endpoints (250+)

#### Authentication (6 endpoints)
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- POST /auth/forgot-password
- POST /auth/reset-password

#### Organizations (5 endpoints)
- GET /organizations
- GET /organizations/{id}
- POST /organizations
- PUT /organizations/{id}
- DELETE /organizations/{id}

#### Users (6 endpoints)
- GET /users
- GET /users/{id}
- POST /users
- PUT /users/{id}
- DELETE /users/{id}
- POST /users/{id}/roles

#### Roles (5 endpoints)
- GET /roles
- GET /roles/{id}
- POST /roles
- PUT /roles/{id}
- DELETE /roles/{id}

#### Permissions (2 endpoints)
- GET /permissions
- GET /permissions/{id}

#### Sports (7 endpoints)
- GET /sports
- GET /sports/{id}
- POST /sports
- PUT /sports/{id}
- DELETE /sports/{id}
- GET /sports/{id}/configurations
- PUT /sports/{id}/configurations

#### Sport Configurations (4 endpoints)
- GET /sports/{sport_id}/configurations
- POST /sports/{sport_id}/configurations
- PUT /sport-configurations/{id}
- DELETE /sport-configurations/{id}

#### Sport Scoring Engines (5 endpoints)
- GET /sports/{sport_id}/scoring-engines
- POST /sports/{sport_id}/scoring-engines
- PUT /sport-scoring-engines/{id}
- DELETE /sport-scoring-engines/{id}
- POST /sport-scoring-engines/{id}/calculate

#### Sport UI Components (5 endpoints)
- GET /sports/{sport_id}/ui-components
- POST /sports/{sport_id}/ui-components
- PUT /sport-ui-components/{id}
- DELETE /sport-ui-components/{id}
- GET /sport-ui-components/{id}/template

#### Sport Data Models (5 endpoints)
- GET /sports/{sport_id}/data-models
- POST /sports/{sport_id}/data-models
- PUT /sport-data-models/{id}
- DELETE /sport-data-models/{id}
- POST /sport-data-models/{id}/validate

#### Sport Workflows (5 endpoints)
- GET /sports/{sport_id}/workflows
- POST /sports/{sport_id}/workflows
- PUT /sport-workflows/{id}
- DELETE /sport-workflows/{id}
- POST /sport-workflows/{id}/execute

#### Venues (5 endpoints)
- GET /venues
- GET /venues/{id}
- POST /venues
- PUT /venues/{id}
- DELETE /venues/{id}

#### Events (9 endpoints)
- GET /events
- GET /events/{id}
- POST /events
- PUT /events/{id}
- DELETE /events/{id}
- POST /events/{id}/publish
- POST /events/{id}/start
- POST /events/{id}/pause
- POST /events/{id}/complete

#### Competition Templates (5 endpoints)
- GET /templates
- GET /templates/{id}
- POST /templates
- PUT /templates/{id}
- DELETE /templates/{id}

#### Rounds (5 endpoints)
- GET /events/{event_id}/rounds
- GET /rounds/{id}
- POST /events/{event_id}/rounds
- PUT /rounds/{id}
- DELETE /rounds/{id}

#### Heats (5 endpoints)
- GET /rounds/{round_id}/heats
- GET /heats/{id}
- POST /rounds/{round_id}/heats
- PUT /heats/{id}
- DELETE /heats/{id}

#### Categories (5 endpoints)
- GET /categories
- GET /categories/{id}
- POST /categories
- PUT /categories/{id}
- DELETE /categories/{id}

#### Divisions (5 endpoints)
- GET /divisions
- GET /divisions/{id}
- POST /divisions
- PUT /divisions/{id}
- DELETE /divisions/{id}

#### Workflow Engine (12 endpoints)
- GET /workflow-definitions
- GET /workflow-definitions/{id}
- POST /workflow-definitions
- PUT /workflow-definitions/{id}
- DELETE /workflow-definitions/{id}
- GET /workflow-definitions/{id}/states
- GET /workflow-definitions/{id}/transitions
- GET /workflow-executions
- GET /workflow-executions/{id}
- POST /workflow-executions
- PUT /workflow-executions/{id}/transition
- POST /workflow-executions/{id}/cancel

#### Schedule Engine (14 endpoints)
- GET /schedules
- GET /schedules/{id}
- POST /schedules
- PUT /schedules/{id}
- DELETE /schedules/{id}
- GET /schedules/{id}/items
- POST /schedules/{id}/items
- PUT /schedule-items/{id}
- DELETE /schedule-items/{id}
- GET /schedules/{id}/conflicts
- POST /schedules/{id}/optimize
- GET /schedules/{id}/resources
- POST /schedules/{id}/resources
- GET /schedules/{id}/dependencies
- POST /schedules/{id}/dependencies

#### Riders (6 endpoints)
- GET /riders
- GET /riders/{id}
- POST /riders
- PUT /riders/{id}
- DELETE /riders/{id}
- GET /riders/{id}/statistics

#### Event Registrations (5 endpoints)
- GET /events/{event_id}/registrations
- POST /events/{event_id}/registrations
- PUT /registrations/{id}
- DELETE /registrations/{id}
- POST /registrations/{id}/confirm

#### Heat Assignments (5 endpoints)
- GET /heats/{heat_id}/assignments
- POST /heats/{heat_id}/assignments
- PUT /assignments/{id}
- DELETE /assignments/{id}
- POST /heats/{heat_id}/assignments/auto

#### Judges (5 endpoints)
- GET /judges
- GET /judges/{id}
- POST /judges
- PUT /judges/{id}
- DELETE /judges/{id}

#### Judge Assignments (4 endpoints)
- GET /events/{event_id}/judge-assignments
- POST /events/{event_id}/judge-assignments
- PUT /judge-assignments/{id}
- DELETE /judge-assignments/{id}

#### Operators (5 endpoints)
- GET /operators
- GET /operators/{id}
- POST /operators
- PUT /operators/{id}
- DELETE /operators/{id}

#### Operator Assignments (3 endpoints)
- GET /events/{event_id}/operator-assignments
- POST /events/{event_id}/operator-assignments
- DELETE /operator-assignments/{id}

#### Sponsors (5 endpoints)
- GET /sponsors
- GET /sponsors/{id}
- POST /sponsors
- PUT /sponsors/{id}
- DELETE /sponsors/{id}

#### Event Sponsors (4 endpoints)
- GET /events/{event_id}/sponsors
- POST /events/{event_id}/sponsors
- PUT /event-sponsors/{id}
- DELETE /event-sponsors/{id}

#### Branding (2 endpoints)
- GET /events/{event_id}/branding
- PUT /events/{event_id}/branding

#### Tricks (6 endpoints)
- GET /tricks
- GET /tricks/{id}
- POST /tricks
- PUT /tricks/{id}
- DELETE /tricks/{id}
- GET /tricks/{id}/variants

#### Trick Categories (3 endpoints)
- GET /trick-categories
- GET /trick-categories/{id}
- POST /trick-categories

#### Attempts (5 endpoints)
- GET /events/{event_id}/attempts
- GET /riders/{rider_id}/attempts
- GET /attempts/{id}
- POST /attempts
- PUT /attempts/{id}

#### Combo Attempts (2 endpoints)
- GET /attempts/{attempt_id}/combo
- POST /attempts/{attempt_id}/combo

#### Runs (5 endpoints)
- GET /events/{event_id}/runs
- GET /riders/{rider_id}/runs
- GET /runs/{id}
- POST /runs
- PUT /runs/{id}

#### Run Attempts (3 endpoints)
- GET /runs/{run_id}/attempts
- POST /runs/{run_id}/attempts
- DELETE /run-attempts/{id}

#### Best Trick Attempts (3 endpoints)
- GET /events/{event_id}/best-trick-attempts
- GET /best-trick-attempts/{id}
- POST /best-trick-attempts

#### Judge Scores (4 endpoints)
- GET /attempts/{attempt_id}/judge-scores
- GET /judge-scores/{id}
- POST /judge-scores
- PUT /judge-scores/{id}

#### Overall Scores (4 endpoints)
- GET /events/{event_id}/overall-scores
- GET /riders/{rider_id}/overall-scores
- GET /overall-scores/{id}
- POST /overall-scores

#### Leaderboards (2 endpoints)
- GET /events/{event_id}/leaderboard
- POST /events/{event_id}/leaderboard/recalculate

#### Results (3 endpoints)
- GET /events/{event_id}/results
- GET /results/{id}
- POST /events/{event_id}/results/publish

#### Penalties (4 endpoints)
- GET /events/{event_id}/penalties
- GET /penalties/{id}
- POST /penalties
- POST /penalties/{id}/appeal

#### Announcements (5 endpoints)
- GET /events/{event_id}/announcements
- GET /announcements/{id}
- POST /announcements
- PUT /announcements/{id}
- DELETE /announcements/{id}

#### Notifications (3 endpoints)
- GET /users/{user_id}/notifications
- PUT /notifications/{id}/read
- PUT /users/{user_id}/notifications/read-all

#### Display Settings (2 endpoints)
- GET /events/{event_id}/display-settings
- PUT /events/{event_id}/display-settings

#### OBS Layouts (3 endpoints)
- GET /events/{event_id}/obs-layouts
- POST /obs-layouts
- PUT /obs-layouts/{id}

#### Screen Layouts (3 endpoints)
- GET /events/{event_id}/screen-layouts
- POST /screen-layouts
- PUT /screen-layouts/{id}

#### Themes (3 endpoints)
- GET /themes
- POST /themes
- PUT /themes/{id}

#### Scoring Settings (2 endpoints)
- GET /events/{event_id}/scoring-settings
- PUT /events/{event_id}/scoring-settings

#### Score Formulas (3 endpoints)
- GET /score-formulas
- POST /score-formulas
- PUT /score-formulas/{id}

#### Layout Builder (12 endpoints)
- GET /layout-components
- GET /layout-components/{id}
- POST /layout-components
- PUT /layout-components/{id}
- DELETE /layout-components/{id}
- GET /layout-templates
- POST /layout-templates
- PUT /layout-templates/{id}
- DELETE /layout-templates/{id}
- GET /layout-versions/{layout_id}
- POST /screen-layouts/{id}/version
- POST /screen-layouts/{id}/validate

#### Animation Engine (14 endpoints)
- GET /animation-library
- GET /animation-library/{id}
- POST /animation-library
- PUT /animation-library/{id}
- DELETE /animation-library/{id}
- GET /events/{event_id}/animation-timelines
- POST /events/{event_id}/animation-timelines
- PUT /animation-timelines/{id}
- DELETE /animation-timelines/{id}
- GET /animation-timelines/{id}/sequences
- POST /animation-timelines/{id}/sequences
- GET /events/{event_id}/animation-triggers
- POST /events/{event_id}/animation-triggers
- POST /animation-triggers/{id}/execute

#### Audio Manager (14 endpoints)
- GET /audio-library
- GET /audio-library/{id}
- POST /audio-library
- PUT /audio-library/{id}
- DELETE /audio-library/{id}
- GET /audio-playlists
- POST /audio-playlists
- PUT /audio-playlists/{id}
- DELETE /audio-playlists/{id}
- GET /events/{event_id}/audio-cues
- POST /events/{event_id}/audio-cues
- PUT /audio-cues/{id}
- DELETE /audio-cues/{id}
- POST /audio-cues/{id}/play
- POST /audio-cues/{id}/stop

#### Media Library (12 endpoints)
- GET /media-library
- GET /media-library/{id}
- POST /media-library
- PUT /media-library/{id}
- DELETE /media-library/{id}
- GET /media-library/{id}/tags
- POST /media-library/{id}/tags
- DELETE /media-tags/{id}
- GET /media-library/{id}/versions
- POST /media-library/{id}/transcode
- GET /media-transcoding/{id}
- GET /media-library/{id}/rights

#### Trick Library Extensions (12 endpoints)
- GET /tricks/{trick_id}/variants
- POST /tricks/{trick_id}/variants
- PUT /trick-variants/{id}
- DELETE /trick-variants/{id}
- GET /trick-algorithms
- POST /trick-algorithms
- GET /tricks/{trick_id}/analysis
- POST /tricks/{trick_id}/analyze
- GET /tricks/{trick_id}/learning
- POST /tricks/{trick_id}/calibrate
- GET /tricks/{trick_id}/similarity
- POST /tricks/{id}/compare

#### ML/Combo Recognition (12 endpoints)
- GET /ml-models
- GET /ml-models/{id}
- POST /ml-models
- PUT /ml-models/{id}
- DELETE /ml-models/{id}
- POST /ml-models/{id}/train
- GET /ml-models/{id}/training-data
- POST /ml-models/{id}/predict
- GET /attempts/{attempt_id}/detection
- POST /attempts/{attempt_id}/detect
- GET /combo-patterns
- POST /combo-patterns
- POST /attempts/{attempt_id}/recognize-combo

#### Statistics Engine (10 endpoints)
- GET /statistics-aggregations
- POST /statistics-aggregations
- GET /statistics-trends
- GET /statistics-predictions
- POST /statistics-predictions
- GET /statistics-models
- POST /statistics-models
- GET /data-warehouse
- GET /aggregation-pipelines
- POST /aggregation-pipelines

#### Replay Engine (12 endpoints)
- GET /attempts/{attempt_id}/replay-bookmarks
- POST /attempts/{attempt_id}/replay-bookmarks
- DELETE /replay-bookmarks/{id}
- GET /attempts/{attempt_id}/replay-angles
- POST /attempts/{attempt_id}/replay-angles
- GET /attempts/{attempt_id}/replay-annotations
- POST /attempts/{attempt_id}/replay-annotations
- GET /events/{event_id}/replay-highlights
- POST /events/{event_id}/replay-highlights
- GET /replay-comparisons
- POST /replay-comparisons
- GET /events/{event_id}/replay-settings
- PUT /events/{event_id}/replay-settings

#### Offline Sync (12 endpoints)
- GET /users/{user_id}/sync-status
- GET /users/{user_id}/sync-queue
- POST /sync-queue
- PUT /sync-queue/{id}/retry
- DELETE /sync-queue/{id}
- GET /users/{user_id}/sync-conflicts
- PUT /sync-conflicts/{id}/resolve
- GET /users/{user_id}/offline-data
- POST /offline-data
- PUT /offline-data/{id}
- POST /users/{user_id}/sync
- GET /data-versions/{resource_type}/{resource_id}

#### Plugin Architecture (14 endpoints)
- GET /plugins
- GET /plugins/{id}
- POST /plugins
- PUT /plugins/{id}
- DELETE /plugins/{id}
- GET /plugins/{id}/hooks
- POST /plugins/{id}/hooks
- GET /plugins/{id}/extensions
- POST /plugins/{id}/extensions
- GET /plugins/{id}/permissions
- POST /plugins/{id}/install
- POST /plugins/{id}/uninstall
- POST /plugins/{id}/enable
- POST /plugins/{id}/disable
- GET /plugin-marketplace

#### Internationalization (12 endpoints)
- GET /languages
- GET /languages/{code}
- GET /translations
- GET /translations/{id}
- POST /translations
- PUT /translations/{id}
- DELETE /translations/{id}
- GET /translation-keys
- POST /translation-keys
- GET /locales
- GET /currency-localization
- GET /date-formats
- POST /translations/import

#### White-label Branding (12 endpoints)
- GET /domain-mappings
- POST /domain-mappings
- PUT /domain-mappings/{id}
- DELETE /domain-mappings/{id}
- GET /custom-domains
- POST /custom-domains
- PUT /custom-domains/{id}/verify
- GET /organizations/{organization_id}/branding
- PUT /organizations/{organization_id}/branding
- GET /branding-templates
- POST /branding-templates
- GET /branding-approvals
- POST /branding-approvals

#### System (2 endpoints)
- GET /system/settings
- PUT /system/settings/{key}

#### Audit Logs (2 endpoints)
- GET /audit-logs
- GET /audit-logs/{id}

#### Activity Logs (1 endpoint)
- GET /activity-logs

#### Health (1 endpoint)
- GET /health

#### WebSocket (1 endpoint)
- WS /realtime

### Response Formats
- **Success:** { success: true, data: {...}, meta: {...} }
- **Error:** { success: false, error: {...}, meta: {...} }
- **Paginated:** { success: true, data: [...], pagination: {...}, meta: {...} }

---

## FRONTEND ARCHITECTURE

### Application Structure
- **Monorepo:** Turborepo for workspace management
- **Apps:** web, admin, mobile, api
- **Packages:** database, auth, scoring, realtime, ui, utils, types, config, workflow, schedule, layout, animation, audio, media, ml, statistics, replay, sync, plugin, i18n, branding

### Component Architecture
- **Base UI:** Reusable primitives (button, input, etc.)
- **Feature Components:** Domain-specific (scoring panel, leaderboard)
- **Layout Components:** Structural (header, sidebar)
- **Shared Components:** Cross-cutting (error boundary, loading)
- **Plugin Components:** Extensible plugin components

### State Management
- **Local State:** React hooks (useState, useReducer)
- **Server State:** React Query (TanStack Query)
- **Global State:** Zustand (if needed)
- **Real-time:** WebSocket subscriptions
- **Offline State:** Offline-first state management

### Routing
- **Web App:** Next.js App Router
- **Admin App:** Next.js App Router
- **Mobile App:** React Navigation

### Styling
- **CSS Framework:** TailwindCSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Fonts:** Inter (Google Fonts)

### Internationalization
- **Library:** next-intl
- **Support:** 10+ languages
- **RTL:** Full RTL support
- **Formatting:** Locale-aware formatting

---

## REAL-TIME ARCHITECTURE

### WebSocket Implementation
- **Protocol:** WebSocket over TLS (WSS)
- **Library:** Socket.io
- **Channels:** Event-based subscriptions
- **Authentication:** JWT token in handshake

### Channels
- event:{event_id}:scores
- event:{event_id}:leaderboard
- event:{event_id}:runs
- event:{event_id}:announcements
- user:{user_id}:notifications
- sync:{user_id}:status
- plugin:{plugin_id}:events

### Message Format
```json
{
  "channel": "event:uuid:scores",
  "event": "score_updated",
  "data": { ... },
  "timestamp": "2024-07-19T10:00:00Z"
}
```

### Connection Management
- **Auto-reconnect:** Exponential backoff
- **Heartbeat:** Every 30 seconds
- **Reconnection:** Automatic with state sync
- **Error Handling:** Graceful degradation

---

## SCORING ARCHITECTURE

### Scoring Engine
- **Location:** packages/scoring
- **Language:** TypeScript
- **Extensibility:** Plugin-based scoring engines
- **Calculations:**
  - Trick score calculation
  - Combo score calculation
  - Run score calculation
  - Best trick total calculation
  - Final score calculation
  - Normalization to SLS scale
  - Sport-specific calculations via plugins

### Scoring Configuration
- **Storage:** JSONB in database
- **Configurable:**
  - Scoring method
  - Judge count
  - Score range
  - Decimal places
  - Judge weights
  - Score formula
  - Tie-breaker rules
  - Replay settings
  - Sport-specific settings

### Scoring Formulas
- **Built-in:** SLS, Olympic, Best Trick, Jam
- **Custom:** Formula editor in Admin CMS
- **Plugin:** Custom scoring engines via plugins
- **Variables:** Top scores, run scores, modifiers
- **Validation:** Formula validation before save

---

## WORKFLOW ENGINE ARCHITECTURE

### Workflow System
- **Purpose:** Manage competition workflows
- **Components:**
  - Workflow definitions
  - Workflow states
  - Workflow transitions
  - Workflow conditions
  - Workflow actions
  - Workflow executions

### Workflow Types
- Competition workflows
- Scoring workflows
- Judging workflows
- Approval workflows
- Custom workflows

### Workflow Features
- State machine implementation
- Conditional branching
- Parallel execution
- Workflow versioning
- Audit trail
- Event triggers

---

## SCHEDULE ENGINE ARCHITECTURE

### Schedule System
- **Purpose:** Optimize and manage schedules
- **Components:**
  - Schedules
  - Schedule items
  - Schedule constraints
  - Schedule conflicts
  - Schedule resources
  - Schedule dependencies
  - Calendar events

### Schedule Features
- Conflict detection
- Schedule optimization
- Resource allocation
- Dependency management
- Calendar integration
- Time zone support
- Schedule templates

---

## PLUGIN ARCHITECTURE

### Plugin System
- **Purpose:** Extensible third-party integrations
- **Components:**
  - Plugin registry
  - Plugin hooks
  - Plugin extensions
  - Plugin permissions
  - Plugin marketplace
  - Plugin versioning
  - Plugin dependencies

### Plugin Types
- Scoring engines
- UI components
- Data sources
- Notifications
- Analytics
- Custom workflows
- Sport-specific modules

### Plugin Features
- Hook system
- Extension points
- Sandboxing
- Permission management
- Version compatibility
- Dependency resolution
- Marketplace integration

---

## OFFLINE SYNC ARCHITECTURE

### Sync System
- **Purpose:** Offline-first operation
- **Components:**
  - Sync queue
  - Sync conflicts
  - Sync status
  - Offline data
  - Sync reconciliation
  - Data versions

### Sync Features
- Conflict resolution
- Automatic sync
- Manual sync
- Sync prioritization
- Data versioning
- Change tracking
- Offline indicators

---

## INTERNATIONALIZATION ARCHITECTURE

### i18n System
- **Purpose:** Multi-language support
- **Components:**
  - Languages
  - Translations
  - Translation keys
  - Locales
  - Currency localization
  - Date formats

### i18n Features
- 10+ languages
- RTL support
- Locale-aware formatting
- Currency formatting
- Date/time formatting
- Number formatting
- Translation management
- Translation import/export

---

## WHITElABEL BRANDING ARCHITECTURE

### Branding System
- **Purpose:** Custom branding per organization
- **Components:**
  - Domain mappings
  - Custom domains
  - Organization branding
  - Branding templates
  - Branding approvals
  - Branding versions

### Branding Features
- Custom domains
- Domain mapping
- Branding templates
- Approval workflow
- Versioning
- A/B testing support
- Complete customization

---

## SECURITY ARCHITECTURE

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Algorithm:** RS256 (asymmetric)
- **Expiration:** 24 hours (refreshable)
- **Storage:** HttpOnly cookies + LocalStorage

### Authorization
- **Model:** RBAC (Role-Based Access Control)
- **Roles:** Admin, Judge, Operator, Rider, Public
- **Permissions:** Granular permissions
- **Enforcement:** Middleware on all protected routes

### Data Security
- **Encryption:** AES-256 at rest
- **Transit:** TLS 1.3
- **Secrets:** AWS Secrets Manager
- **Backups:** Encrypted backups
- **PII:** Identified and protected

### Network Security
- **VPC:** Private subnets for database
- **Security Groups:** Restrictive rules
- **WAF:** AWS WAF enabled
- **DDoS:** AWS Shield Standard
- **VPN:** For admin access

### Audit Logging
- **All Changes:** Logged in audit_logs
- **User Actions:** Logged in activity_logs
- **IP Tracking:** All requests logged
- **User Agent:** All requests logged
- **Retention:** 90 days

---

## PERFORMANCE ARCHITECTURE

### Caching Strategy
- **Redis:** Session caching, data caching
- **CDN:** Static assets, API responses
- **Application:** React Query caching
- **Database:** Query result caching

### Optimization Techniques
- **Lazy Loading:** Images, components
- **Code Splitting:** Route-based
- **Tree Shaking:** Unused code removal
- **Minification:** JavaScript, CSS
- **Compression:** Gzip, Brotli
- **Image Optimization:** WebP, responsive images

### Performance Targets
- **API Response:** < 500ms
- **Page Load:** < 2s
- **Time to Interactive:** < 3s
- **WebSocket Message:** < 100ms
- **Database Query:** < 100ms

---

## DEPLOYMENT ARCHITECTURE

### Deployment Strategy
- **Method:** Blue-Green Deployment
- **Downtime:** Zero downtime
- **Rollback:** One-click rollback
- **Infrastructure:** Kubernetes (EKS)

### Environments
- **Development:** Local Docker Compose
- **Staging:** AWS (smaller scale)
- **Production:** AWS (full scale)

### CI/CD Pipeline
- **Platform:** GitHub Actions
- **Triggers:** Push to main, pull requests
- **Stages:** Build, Test, Deploy
- **Notifications:** Slack, Email

### Infrastructure as Code
- **Tool:** Terraform
- **Repository:** Git
- **State:** S3 backend
- **Drift Detection:** Automated

---

## MONITORING ARCHITECTURE

### Application Monitoring
- **APM:** New Relic / Datadog
- **Error Tracking:** Sentry
- **Performance:** Lighthouse CI
- **Uptime:** UptimeRobot / Pingdom

### Infrastructure Monitoring
- **Metrics:** CloudWatch Metrics
- **Logs:** CloudWatch Logs
- **Dashboards:** Grafana
- **Alerts:** CloudWatch Alarms

### Database Monitoring
- **Performance:** RDS Performance Insights
- **Slow Queries:** CloudWatch
- **Connections:** CloudWatch
- **Storage:** CloudWatch

---

## DISASTER RECOVERY

### Backup Strategy
- **Database:** Daily full, hourly incremental
- **Retention:** 30 days
- **Location:** S3 (multi-region)
- **Encryption:** AES-256

### Recovery Objectives
- **RPO:** 1 hour
- **RTO:** 4 hours
- **Failover:** Automatic
- **Testing:** Monthly

### Disaster Recovery Plan
- **Primary Region:** us-west-2
- **Secondary Region:** us-east-1
- **Failover:** DNS-based
- **Data Replication:** Cross-region

---

## SCALABILITY ARCHITECTURE

### Horizontal Scaling
- **Kubernetes:** Horizontal Pod Autoscaler
- **Load Balancer:** Application Load Balancer
- **Database:** Read replicas
- **Cache:** Redis Cluster

### Vertical Scaling
- **Database:** RDS instance scaling
- **Cache:** ElastiCache scaling
- **Application:** Pod resource requests/limits

### Auto-scaling Triggers
- **CPU:** > 70% for 5 minutes
- **Memory:** > 70% for 5 minutes
- **Requests:** > 1000 per minute
- **Custom:** Application metrics

---

## COMPLIANCE

### GDPR Compliance
- **Data Processing:** Documented
- **User Consent:** Cookie consent
- **Right to be Forgotten:** Implemented
- **Data Export:** User data export
- **Breach Notification:** 72 hours

### Accessibility
- **Standard:** WCAG 2.1 AA
- **Testing:** Automated + manual
- **Tools:** axe DevTools, Lighthouse
- **Documentation:** Accessibility guide

### Security Standards
- **OWASP Top 10:** Addressed
- **Penetration Testing:** Quarterly
- **Vulnerability Scanning:** Monthly
- **Security Audit:** Annual

---

## TECHNOLOGY STACK

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Components:** shadcn/ui
- **State:** React Query
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **i18n:** next-intl
- **Offline:** Service Workers

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Auth:** JWT
- **Validation:** Zod
- **ORM:** Prisma
- **WebSocket:** Socket.io
- **ML:** TensorFlow.js
- **Workflow:** Node-RED

### Database
- **Primary:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Storage:** S3
- **CDN:** CloudFront

### Infrastructure
- **Container:** Docker
- **Orchestration:** Kubernetes (EKS)
- **Cloud:** AWS
- **CI/CD:** GitHub Actions
- **IaC:** Terraform

### Monitoring
- **APM:** New Relic
- **Error Tracking:** Sentry
- **Logs:** CloudWatch Logs
- **Metrics:** CloudWatch Metrics
- **Uptime:** UptimeRobot

---

## DELIVERABLES SUMMARY

### Documentation V3
- [x] ARCHITECTURE_REVIEW.md
- [x] database/schema-v3.sql (143 tables)
- [x] API_STRUCTURE_V3.md (250+ endpoints)
- [x] ARCHITECTURE_DOCUMENTATION_V3.md

### Previous Deliverables (V2)
- [x] DATABASE_AUDIT_REPORT.md
- [x] MIGRATION_PLAN.md
- [x] database/schema-v2.sql (47 tables - deprecated)
- [x] database/seed-v2.sql
- [x] FOLDER_STRUCTURE.md
- [x] API_STRUCTURE.md (100+ endpoints - deprecated)
- [x] COMPONENT_STRUCTURE.md
- [x] ER_DIAGRAM.md
- [x] DATABASE_DIAGRAM.md
- [x] ADMIN_CMS_UI_PLAN.md
- [x] JUDGE_UI_PLAN.md
- [x] OPERATOR_UI_PLAN.md
- [x] DISPLAY_UI_PLAN.md
- [x] OBS_UI_PLAN.md
- [x] PUBLIC_UI_PLAN.md
- [x] DEPLOYMENT_PLAN.md
- [x] TESTING_PLAN.md
- [x] PRODUCTION_CHECKLIST.md
- [x] ARCHITECTURE_DOCUMENTATION.md (deprecated)

---

## NEXT STEPS

### Immediate Actions
1. Review V3 architecture with stakeholders
2. Obtain approval for V3 architecture
3. Update ER diagram for V3 schema
4. Update database diagram for V3 schema
5. Update seed data for V3 schema
6. Update migration plan for V3
7. Begin implementation of V3 database schema
8. Set up development environment
9. Start with core API endpoints

### Implementation Phases
1. **Phase 1:** V3 Database setup and migration
2. **Phase 2:** Core API development (V3)
3. **Phase 3:** Plugin system implementation
4. **Phase 4:** Workflow engine implementation
5. **Phase 5:** Schedule engine implementation
6. **Phase 6:** Layout builder implementation
7. **Phase 7:** Animation engine implementation
8. **Phase 8:** Audio manager implementation
9. **Phase 9:** Media library implementation
10. **Phase 10:** ML/combo recognition implementation
11. **Phase 11:** Statistics engine implementation
12. **Phase 12:** Replay engine implementation
13. **Phase 13:** Offline sync implementation
14. **Phase 14:** i18n implementation
15. **Phase 15:** White-label branding implementation
16. **Phase 16:** Admin CMS development (V3)
17. **Phase 17:** Judge UI development (V3)
18. **Phase 18:** Operator UI development (V3)
19. **Phase 19:** Display UI development (V3)
20. **Phase 20:** OBS UI development (V3)
21. **Phase 21:** Public UI development (V3)
22. **Phase 22:** Integration testing
23. **Phase 23:** Deployment to production

### Estimated Timeline
- **Phase 1-5:** 8 weeks
- **Phase 6-10:** 12 weeks
- **Phase 11-15:** 8 weeks
- **Phase 16-21:** 12 weeks
- **Phase 22-23:** 4 weeks
- **Total:** 44 weeks (~11 months)

---

## CONCLUSION

The Skate Judging Platform Pro V3 architecture provides a comprehensive, scalable, and configurable solution for multi-sport judging competitions. The system addresses all identified issues from the original system, introduces enterprise-grade features including multi-tenancy, RBAC, real-time updates, complete configurability, and is built for 10-year extensibility without breaking changes.

The architecture supports all 15 required modules:
1. Competition Workflow Engine ✓
2. Schedule Engine ✓
3. Drag-and-drop Display Layout Builder ✓
4. Animation Engine ✓
5. Audio Manager ✓
6. Media Library ✓
7. Trick Library ✓
8. Combo Recognition Engine ✓
9. Statistics Engine ✓
10. Replay Engine ✓
11. Offline Sync ✓
12. Plugin Architecture ✓
13. Multi-language ✓
14. White-label Branding ✓
15. Future Sports Extensions ✓

The architecture is production-ready with detailed deployment plans, testing strategies, and operational procedures. All documentation has been created to support the implementation team in building this system.

**Status:** Architecture V3 design complete, ready for implementation phase.

---

**END OF ARCHITECTURE DOCUMENTATION V3**
