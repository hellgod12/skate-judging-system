# API STRUCTURE DESIGN V3
## Skate Judging Platform Pro V3 - Extensible RESTful API

**Date:** July 19, 2026  
**Version:** 3.0

---

## API OVERVIEW

The API follows RESTful principles with resource-based routing, proper HTTP methods, and consistent response formats. All endpoints use UUIDs for resource identification and support JSON request/response bodies.

**Base URL:** `https://api.skatejudging.com/v3`  
**Authentication:** Bearer Token (JWT)  
**Rate Limiting:** 1000 requests per minute per user  
**Content-Type:** `application/json`

---

## RESPONSE FORMATS

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-07-19T10:00:00Z",
    "request_id": "uuid"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2024-07-19T10:00:00Z",
    "request_id": "uuid"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  },
  "meta": {
    "timestamp": "2024-07-19T10:00:00Z",
    "request_id": "uuid"
  }
}
```

---

## AUTHENTICATION ENDPOINTS (6 endpoints)

### POST /auth/register
Register a new user account.

### POST /auth/login
Authenticate user and return JWT token.

### POST /auth/logout
Logout user and invalidate token.

### POST /auth/refresh
Refresh JWT token.

### POST /auth/forgot-password
Initiate password reset.

### POST /auth/reset-password
Reset password with token.

---

## ORGANIZATION ENDPOINTS (5 endpoints)

### GET /organizations
List all organizations (admin only).

### GET /organizations/{id}
Get organization details.

### POST /organizations
Create new organization (admin only).

### PUT /organizations/{id}
Update organization details.

### DELETE /organizations/{id}
Delete organization (admin only).

---

## USER ENDPOINTS (6 endpoints)

### GET /users
List users (with filters).

### GET /users/{id}
Get user details.

### POST /users
Create new user (admin only).

### PUT /users/{id}
Update user details.

### DELETE /users/{id}
Delete user (admin only).

### POST /users/{id}/roles
Assign role to user.

---

## ROLE ENDPOINTS (5 endpoints)

### GET /roles
List all roles.

### GET /roles/{id}
Get role details.

### POST /roles
Create new role.

### PUT /roles/{id}
Update role details.

### DELETE /roles/{id}
Delete role.

---

## PERMISSION ENDPOINTS (2 endpoints)

### GET /permissions
List all permissions.

### GET /permissions/{id}
Get permission details.

---

## SPORT ENDPOINTS (7 endpoints)

### GET /sports
List all sports.

### GET /sports/{id}
Get sport details.

### POST /sports
Create new sport (admin only).

### PUT /sports/{id}
Update sport details.

### DELETE /sports/{id}
Delete sport (admin only).

### GET /sports/{id}/configurations
Get sport configurations.

### PUT /sports/{id}/configurations
Update sport configurations.

---

## SPORT CONFIGURATION ENDPOINTS (4 endpoints)

### GET /sports/{sport_id}/configurations
Get sport configurations.

### POST /sports/{sport_id}/configurations
Create sport configuration.

### PUT /sport-configurations/{id}
Update sport configuration.

### DELETE /sport-configurations/{id}
Delete sport configuration.

---

## SPORT SCORING ENGINE ENDPOINTS (5 endpoints)

### GET /sports/{sport_id}/scoring-engines
Get sport scoring engines.

### POST /sports/{sport_id}/scoring-engines
Create scoring engine.

### PUT /sport-scoring-engines/{id}
Update scoring engine.

### DELETE /sport-scoring-engines/{id}
Delete scoring engine.

### POST /sport-scoring-engines/{id}/calculate
Calculate score using engine.

---

## SPORT UI COMPONENTS ENDPOINTS (5 endpoints)

### GET /sports/{sport_id}/ui-components
Get sport UI components.

### POST /sports/{sport_id}/ui-components
Create UI component.

### PUT /sport-ui-components/{id}
Update UI component.

### DELETE /sport-ui-components/{id}
Delete UI component.

### GET /sport-ui-components/{id}/template
Get component template.

---

## SPORT DATA MODELS ENDPOINTS (5 endpoints)

### GET /sports/{sport_id}/data-models
Get sport data models.

### POST /sports/{sport_id}/data-models
Create data model.

### PUT /sport-data-models/{id}
Update data model.

### DELETE /sport-data-models/{id}
Delete data model.

### POST /sport-data-models/{id}/validate
Validate data against model.

---

## SPORT WORKFLOWS ENDPOINTS (5 endpoints)

### GET /sports/{sport_id}/workflows
Get sport workflows.

### POST /sports/{sport_id}/workflows
Create workflow.

### PUT /sport-workflows/{id}
Update workflow.

### DELETE /sport-workflows/{id}
Delete workflow.

### POST /sport-workflows/{id}/execute
Execute workflow.

---

## VENUE ENDPOINTS (5 endpoints)

### GET /venues
List venues.

### GET /venues/{id}
Get venue details.

### POST /venues
Create new venue.

### PUT /venues/{id}
Update venue details.

### DELETE /venues/{id}
Delete venue.

---

## EVENT ENDPOINTS (9 endpoints)

### GET /events
List events.

### GET /events/{id}
Get event details.

### POST /events
Create new event.

### PUT /events/{id}
Update event details.

### DELETE /events/{id}
Delete event.

### POST /events/{id}/publish
Publish event.

### POST /events/{id}/start
Start event.

### POST /events/{id}/pause
Pause event.

### POST /events/{id}/complete
Complete event.

---

## COMPETITION TEMPLATE ENDPOINTS (5 endpoints)

### GET /templates
List competition templates.

### GET /templates/{id}
Get template details.

### POST /templates
Create new template.

### PUT /templates/{id}
Update template details.

### DELETE /templates/{id}
Delete template.

---

## ROUND ENDPOINTS (5 endpoints)

### GET /events/{event_id}/rounds
List rounds for an event.

### GET /rounds/{id}
Get round details.

### POST /events/{event_id}/rounds
Create new round.

### PUT /rounds/{id}
Update round details.

### DELETE /rounds/{id}
Delete round.

---

## HEAT ENDPOINTS (5 endpoints)

### GET /rounds/{round_id}/heats
List heats for a round.

### GET /heats/{id}
Get heat details.

### POST /rounds/{round_id}/heats
Create new heat.

### PUT /heats/{id}
Update heat details.

### DELETE /heats/{id}
Delete heat.

---

## CATEGORY ENDPOINTS (5 endpoints)

### GET /categories
List categories.

### GET /categories/{id}
Get category details.

### POST /categories
Create new category.

### PUT /categories/{id}
Update category details.

### DELETE /categories/{id}
Delete category.

---

## DIVISION ENDPOINTS (5 endpoints)

### GET /divisions
List divisions.

### GET /divisions/{id}
Get division details.

### POST /divisions
Create new division.

### PUT /divisions/{id}
Update division details.

### DELETE /divisions/{id}
Delete division.

---

## WORKFLOW ENGINE ENDPOINTS (12 endpoints)

### GET /workflow-definitions
List workflow definitions.

### GET /workflow-definitions/{id}
Get workflow definition details.

### POST /workflow-definitions
Create workflow definition.

### PUT /workflow-definitions/{id}
Update workflow definition.

### DELETE /workflow-definitions/{id}
Delete workflow definition.

### GET /workflow-definitions/{id}/states
Get workflow states.

### GET /workflow-definitions/{id}/transitions
Get workflow transitions.

### GET /workflow-executions
List workflow executions.

### GET /workflow-executions/{id}
Get workflow execution details.

### POST /workflow-executions
Start workflow execution.

### PUT /workflow-executions/{id}/transition
Transition workflow state.

### POST /workflow-executions/{id}/cancel
Cancel workflow execution.

---

## SCHEDULE ENGINE ENDPOINTS (14 endpoints)

### GET /schedules
List schedules.

### GET /schedules/{id}
Get schedule details.

### POST /schedules
Create schedule.

### PUT /schedules/{id}
Update schedule.

### DELETE /schedules/{id}
Delete schedule.

### GET /schedules/{id}/items
Get schedule items.

### POST /schedules/{id}/items
Add schedule item.

### PUT /schedule-items/{id}
Update schedule item.

### DELETE /schedule-items/{id}
Delete schedule item.

### GET /schedules/{id}/conflicts
Get schedule conflicts.

### POST /schedules/{id}/optimize
Optimize schedule.

### GET /schedules/{id}/resources
Get schedule resources.

### POST /schedules/{id}/resources
Add schedule resource.

### GET /schedules/{id}/dependencies
Get schedule dependencies.

### POST /schedules/{id}/dependencies
Add schedule dependency.

---

## RIDER ENDPOINTS (6 endpoints)

### GET /riders
List riders.

### GET /riders/{id}
Get rider details.

### POST /riders
Create new rider.

### PUT /riders/{id}
Update rider details.

### DELETE /riders/{id}
Delete rider.

### GET /riders/{id}/statistics
Get rider statistics.

---

## EVENT REGISTRATION ENDPOINTS (5 endpoints)

### GET /events/{event_id}/registrations
List event registrations.

### POST /events/{event_id}/registrations
Register rider for event.

### PUT /registrations/{id}
Update registration status.

### DELETE /registrations/{id}
Cancel registration.

### POST /registrations/{id}/confirm
Confirm registration.

---

## HEAT ASSIGNMENT ENDPOINTS (5 endpoints)

### GET /heats/{heat_id}/assignments
List heat assignments.

### POST /heats/{heat_id}/assignments
Assign rider to heat.

### PUT /assignments/{id}
Update heat assignment.

### DELETE /assignments/{id}
Remove heat assignment.

### POST /heats/{heat_id}/assignments/auto
Auto-assign riders to heat.

---

## JUDGE ENDPOINTS (5 endpoints)

### GET /judges
List judges.

### GET /judges/{id}
Get judge details.

### POST /judges
Create new judge.

### PUT /judges/{id}
Update judge details.

### DELETE /judges/{id}
Delete judge.

---

## JUDGE ASSIGNMENT ENDPOINTS (4 endpoints)

### GET /events/{event_id}/judge-assignments
List judge assignments for event.

### POST /events/{event_id}/judge-assignments
Assign judge to event.

### PUT /judge-assignments/{id}
Update judge assignment.

### DELETE /judge-assignments/{id}
Remove judge assignment.

---

## OPERATOR ENDPOINTS (5 endpoints)

### GET /operators
List operators.

### GET /operators/{id}
Get operator details.

### POST /operators
Create new operator.

### PUT /operators/{id}
Update operator details.

### DELETE /operators/{id}
Delete operator.

---

## OPERATOR ASSIGNMENT ENDPOINTS (3 endpoints)

### GET /events/{event_id}/operator-assignments
List operator assignments for event.

### POST /events/{event_id}/operator-assignments
Assign operator to event.

### DELETE /operator-assignments/{id}
Remove operator assignment.

---

## SPONSOR ENDPOINTS (5 endpoints)

### GET /sponsors
List sponsors.

### GET /sponsors/{id}
Get sponsor details.

### POST /sponsors
Create new sponsor.

### PUT /sponsors/{id}
Update sponsor details.

### DELETE /sponsors/{id}
Delete sponsor.

---

## EVENT SPONSOR ENDPOINTS (4 endpoints)

### GET /events/{event_id}/sponsors
List event sponsors.

### POST /events/{event_id}/sponsors
Add sponsor to event.

### PUT /event-sponsors/{id}
Update event sponsor details.

### DELETE /event-sponsors/{id}
Remove sponsor from event.

---

## BRANDING ENDPOINTS (2 endpoints)

### GET /events/{event_id}/branding
Get event branding.

### PUT /events/{event_id}/branding
Update event branding.

---

## TRICK ENDPOINTS (6 endpoints)

### GET /tricks
List tricks.

### GET /tricks/{id}
Get trick details.

### POST /tricks
Create new trick.

### PUT /tricks/{id}
Update trick details.

### DELETE /tricks/{id}
Delete trick.

### GET /tricks/{id}/variants
Get trick variants.

---

## TRICK CATEGORY ENDPOINTS (3 endpoints)

### GET /trick-categories
List trick categories.

### GET /trick-categories/{id}
Get trick category details.

### POST /trick-categories
Create new trick category.

---

## ATTEMPT ENDPOINTS (5 endpoints)

### GET /events/{event_id}/attempts
List attempts for event.

### GET /riders/{rider_id}/attempts
List attempts for rider.

### GET /attempts/{id}
Get attempt details.

### POST /attempts
Create new attempt.

### PUT /attempts/{id}
Update attempt details.

---

## COMBO ATTEMPT ENDPOINTS (2 endpoints)

### GET /attempts/{attempt_id}/combo
Get combo attempt details.

### POST /attempts/{attempt_id}/combo
Create combo attempt details.

---

## RUN ENDPOINTS (5 endpoints)

### GET /events/{event_id}/runs
List runs for event.

### GET /riders/{rider_id}/runs
List runs for rider.

### GET /runs/{id}
Get run details.

### POST /runs
Create new run.

### PUT /runs/{id}
Update run details.

---

## RUN ATTEMPT ENDPOINTS (3 endpoints)

### GET /runs/{run_id}/attempts
List attempts in run.

### POST /runs/{run_id}/attempts
Add attempt to run.

### DELETE /run-attempts/{id}
Remove attempt from run.

---

## BEST TRICK ATTEMPT ENDPOINTS (3 endpoints)

### GET /events/{event_id}/best-trick-attempts
List best trick attempts.

### GET /best-trick-attempts/{id}
Get best trick attempt details.

### POST /best-trick-attempts
Create best trick attempt.

---

## JUDGE SCORE ENDPOINTS (4 endpoints)

### GET /attempts/{attempt_id}/judge-scores
List judge scores for attempt.

### GET /judge-scores/{id}
Get judge score details.

### POST /judge-scores
Submit judge score.

### PUT /judge-scores/{id}
Update judge score.

---

## OVERALL SCORE ENDPOINTS (4 endpoints)

### GET /events/{event_id}/overall-scores
List overall scores for event.

### GET /riders/{rider_id}/overall-scores
List overall scores for rider.

### GET /overall-scores/{id}
Get overall score details.

### POST /overall-scores
Create overall score.

---

## LEADERBOARD ENDPOINTS (2 endpoints)

### GET /events/{event_id}/leaderboard
Get event leaderboard.

### POST /events/{event_id}/leaderboard/recalculate
Recalculate leaderboard.

---

## RESULT ENDPOINTS (3 endpoints)

### GET /events/{event_id}/results
Get event results.

### GET /results/{id}
Get result details.

### POST /events/{event_id}/results/publish
Publish event results.

---

## PENALTY ENDPOINTS (4 endpoints)

### GET /events/{event_id}/penalties
List penalties for event.

### GET /penalties/{id}
Get penalty details.

### POST /penalties
Create penalty.

### POST /penalties/{id}/appeal
Appeal penalty.

---

## ANNOUNCEMENT ENDPOINTS (5 endpoints)

### GET /events/{event_id}/announcements
List announcements.

### GET /announcements/{id}
Get announcement details.

### POST /announcements
Create announcement.

### PUT /announcements/{id}
Update announcement.

### DELETE /announcements/{id}
Delete announcement.

---

## NOTIFICATION ENDPOINTS (3 endpoints)

### GET /users/{user_id}/notifications
Get user notifications.

### PUT /notifications/{id}/read
Mark notification as read.

### PUT /users/{user_id}/notifications/read-all
Mark all notifications as read.

---

## DISPLAY SETTINGS ENDPOINTS (2 endpoints)

### GET /events/{event_id}/display-settings
Get display settings.

### PUT /events/{event_id}/display-settings
Update display settings.

---

## OBS LAYOUTS ENDPOINTS (3 endpoints)

### GET /events/{event_id}/obs-layouts
Get OBS layouts.

### POST /obs-layouts
Create OBS layout.

### PUT /obs-layouts/{id}
Update OBS layout.

---

## SCREEN LAYOUTS ENDPOINTS (3 endpoints)

### GET /events/{event_id}/screen-layouts
Get screen layouts.

### POST /screen-layouts
Create screen layout.

### PUT /screen-layouts/{id}
Update screen layout.

---

## THEMES ENDPOINTS (3 endpoints)

### GET /themes
List themes.

### POST /themes
Create theme.

### PUT /themes/{id}
Update theme.

---

## SCORING SETTINGS ENDPOINTS (2 endpoints)

### GET /events/{event_id}/scoring-settings
Get scoring settings.

### PUT /events/{event_id}/scoring-settings
Update scoring settings.

---

## SCORE FORMULAS ENDPOINTS (3 endpoints)

### GET /score-formulas
List score formulas.

### POST /score-formulas
Create score formula.

### PUT /score-formulas/{id}
Update score formula.

---

## LAYOUT BUILDER ENDPOINTS (12 endpoints)

### GET /layout-components
List layout components.

### GET /layout-components/{id}
Get layout component details.

### POST /layout-components
Create layout component.

### PUT /layout-components/{id}
Update layout component.

### DELETE /layout-components/{id}
Delete layout component.

### GET /layout-templates
List layout templates.

### POST /layout-templates
Create layout template.

### PUT /layout-templates/{id}
Update layout template.

### DELETE /layout-templates/{id}
Delete layout template.

### GET /layout-versions/{layout_id}
Get layout versions.

### POST /screen-layouts/{id}/version
Create layout version.

### POST /screen-layouts/{id}/validate
Validate layout.

---

## ANIMATION ENGINE ENDPOINTS (14 endpoints)

### GET /animation-library
List animation library.

### GET /animation-library/{id}
Get animation details.

### POST /animation-library
Create animation.

### PUT /animation-library/{id}
Update animation.

### DELETE /animation-library/{id}
Delete animation.

### GET /events/{event_id}/animation-timelines
Get animation timelines.

### POST /events/{event_id}/animation-timelines
Create animation timeline.

### PUT /animation-timelines/{id}
Update animation timeline.

### DELETE /animation-timelines/{id}
Delete animation timeline.

### GET /animation-timelines/{id}/sequences
Get animation sequences.

### POST /animation-timelines/{id}/sequences
Add animation sequence.

### GET /events/{event_id}/animation-triggers
Get animation triggers.

### POST /events/{event_id}/animation-triggers
Create animation trigger.

### POST /animation-triggers/{id}/execute
Execute animation trigger.

---

## AUDIO MANAGER ENDPOINTS (14 endpoints)

### GET /audio-library
List audio library.

### GET /audio-library/{id}
Get audio details.

### POST /audio-library
Upload audio.

### PUT /audio-library/{id}
Update audio details.

### DELETE /audio-library/{id}
Delete audio.

### GET /audio-playlists
List audio playlists.

### POST /audio-playlists
Create audio playlist.

### PUT /audio-playlists/{id}
Update audio playlist.

### DELETE /audio-playlists/{id}
Delete audio playlist.

### GET /events/{event_id}/audio-cues
Get audio cues.

### POST /events/{event_id}/audio-cues
Create audio cue.

### PUT /audio-cues/{id}
Update audio cue.

### DELETE /audio-cues/{id}
Delete audio cue.

### POST /audio-cues/{id}/play
Play audio cue.

### POST /audio-cues/{id}/stop
Stop audio cue.

---

## MEDIA LIBRARY ENDPOINTS (12 endpoints)

### GET /media-library
List media library.

### GET /media-library/{id}
Get media details.

### POST /media-library
Upload media.

### PUT /media-library/{id}
Update media details.

### DELETE /media-library/{id}
Delete media.

### GET /media-library/{id}/tags
Get media tags.

### POST /media-library/{id}/tags
Add media tag.

### DELETE /media-tags/{id}
Remove media tag.

### GET /media-library/{id}/versions
Get media versions.

### POST /media-library/{id}/transcode
Transcode media.

### GET /media-transcoding/{id}
Get transcoding status.

### GET /media-library/{id}/rights
Get media rights.

---

## TRICK LIBRARY EXTENSIONS ENDPOINTS (12 endpoints)

### GET /tricks/{trick_id}/variants
Get trick variants.

### POST /tricks/{trick_id}/variants
Create trick variant.

### PUT /trick-variants/{id}
Update trick variant.

### DELETE /trick-variants/{id}
Delete trick variant.

### GET /trick-algorithms
List trick algorithms.

### POST /trick-algorithms
Create trick algorithm.

### GET /tricks/{trick_id}/analysis
Get trick analysis.

### POST /tricks/{trick_id}/analyze
Analyze trick.

### GET /tricks/{trick_id}/learning
Get trick learning data.

### POST /tricks/{trick_id}/calibrate
Calibrate trick difficulty.

### GET /tricks/{trick_id}/similarity
Get similar tricks.

### POST /tricks/{id}/compare
Compare tricks.

---

## ML/COMBO RECOGNITION ENDPOINTS (12 endpoints)

### GET /ml-models
List ML models.

### GET /ml-models/{id}
Get ML model details.

### POST /ml-models
Create ML model.

### PUT /ml-models/{id}
Update ML model.

### DELETE /ml-models/{id}
Delete ML model.

### POST /ml-models/{id}/train
Train ML model.

### GET /ml-models/{id}/training-data
Get training data.

### POST /ml-models/{id}/predict
Make prediction.

### GET /attempts/{attempt_id}/detection
Get trick detection results.

### POST /attempts/{attempt_id}/detect
Detect tricks in attempt.

### GET /combo-patterns
List combo patterns.

### POST /combo-patterns
Create combo pattern.

### POST /attempts/{attempt_id}/recognize-combo
Recognize combo in attempt.

---

## STATISTICS ENGINE ENDPOINTS (10 endpoints)

### GET /statistics-aggregations
List statistics aggregations.

### POST /statistics-aggregations
Create statistics aggregation.

### GET /statistics-trends
List statistics trends.

### GET /statistics-predictions
List statistics predictions.

### POST /statistics-predictions
Create statistics prediction.

### GET /statistics-models
List statistics models.

### POST /statistics-models
Create statistics model.

### GET /data-warehouse
Query data warehouse.

### GET /aggregation-pipelines
List aggregation pipelines.

### POST /aggregation-pipelines
Create aggregation pipeline.

---

## REPLAY ENGINE ENDPOINTS (12 endpoints)

### GET /attempts/{attempt_id}/replay-bookmarks
Get replay bookmarks.

### POST /attempts/{attempt_id}/replay-bookmarks
Create replay bookmark.

### DELETE /replay-bookmarks/{id}
Delete replay bookmark.

### GET /attempts/{attempt_id}/replay-angles
Get replay angles.

### POST /attempts/{attempt_id}/replay-angles
Add replay angle.

### GET /attempts/{attempt_id}/replay-annotations
Get replay annotations.

### POST /attempts/{attempt_id}/replay-annotations
Add replay annotation.

### GET /events/{event_id}/replay-highlights
Get replay highlights.

### POST /events/{event_id}/replay-highlights
Create replay highlight.

### GET /replay-comparisons
List replay comparisons.

### POST /replay-comparisons
Create replay comparison.

### GET /events/{event_id}/replay-settings
Get replay settings.

### PUT /events/{event_id}/replay-settings
Update replay settings.

---

## OFFLINE SYNC ENDPOINTS (12 endpoints)

### GET /users/{user_id}/sync-status
Get sync status.

### GET /users/{user_id}/sync-queue
Get sync queue.

### POST /sync-queue
Add to sync queue.

### PUT /sync-queue/{id}/retry
Retry sync operation.

### DELETE /sync-queue/{id}
Remove from sync queue.

### GET /users/{user_id}/sync-conflicts
Get sync conflicts.

### PUT /sync-conflicts/{id}/resolve
Resolve sync conflict.

### GET /users/{user_id}/offline-data
Get offline data.

### POST /offline-data
Store offline data.

### PUT /offline-data/{id}
Update offline data.

### POST /users/{user_id}/sync
Trigger manual sync.

### GET /data-versions/{resource_type}/{resource_id}
Get data versions.

---

## PLUGIN ARCHITECTURE ENDPOINTS (14 endpoints)

### GET /plugins
List plugins.

### GET /plugins/{id}
Get plugin details.

### POST /plugins
Create plugin.

### PUT /plugins/{id}
Update plugin.

### DELETE /plugins/{id}
Delete plugin.

### GET /plugins/{id}/hooks
Get plugin hooks.

### POST /plugins/{id}/hooks
Add plugin hook.

### GET /plugins/{id}/extensions
Get plugin extensions.

### POST /plugins/{id}/extensions
Add plugin extension.

### GET /plugins/{id}/permissions
Get plugin permissions.

### POST /plugins/{id}/install
Install plugin.

### POST /plugins/{id}/uninstall
Uninstall plugin.

### POST /plugins/{id}/enable
Enable plugin.

### POST /plugins/{id}/disable
Disable plugin.

### GET /plugin-marketplace
List plugin marketplace.

---

## INTERNATIONALIZATION ENDPOINTS (12 endpoints)

### GET /languages
List languages.

### GET /languages/{code}
Get language details.

### GET /translations
List translations.

### GET /translations/{id}
Get translation details.

### POST /translations
Create translation.

### PUT /translations/{id}
Update translation.

### DELETE /translations/{id}
Delete translation.

### GET /translation-keys
List translation keys.

### POST /translation-keys
Create translation key.

### GET /locales
List locales.

### GET /currency-localization
List currency localization.

### GET /date-formats
List date formats.

### POST /translations/import
Import translations.

---

## WHITE-LABEL BRANDING ENDPOINTS (12 endpoints)

### GET /domain-mappings
List domain mappings.

### POST /domain-mappings
Create domain mapping.

### PUT /domain-mappings/{id}
Update domain mapping.

### DELETE /domain-mappings/{id}
Delete domain mapping.

### GET /custom-domains
List custom domains.

### POST /custom-domains
Add custom domain.

### PUT /custom-domains/{id}/verify
Verify custom domain.

### GET /organizations/{organization_id}/branding
Get organization branding.

### PUT /organizations/{organization_id}/branding
Update organization branding.

### GET /branding-templates
List branding templates.

### POST /branding-templates
Create branding template.

### GET /branding-approvals
List branding approvals.

### POST /branding-approvals
Submit branding for approval.

---

## SYSTEM ENDPOINTS (2 endpoints)

### GET /system/settings
Get system settings.

### PUT /system/settings/{key}
Update system setting.

---

## AUDIT LOGS ENDPOINTS (2 endpoints)

### GET /audit-logs
List audit logs.

### GET /audit-logs/{id}
Get audit log details.

---

## ACTIVITY LOGS ENDPOINTS (1 endpoint)

### GET /activity-logs
List activity logs.

---

## HEALTH ENDPOINT (1 endpoint)

### GET /health
Health check endpoint.

---

## WEBSOCKET ENDPOINT (1 endpoint)

### WS /realtime
WebSocket endpoint for real-time updates.

---

## ENDPOINT SUMMARY

**Total Endpoints:** 250+ endpoints

**By Category:**
- Authentication: 6
- Organizations: 5
- Users: 6
- Roles: 5
- Permissions: 2
- Sports: 7
- Sport Configurations: 4
- Sport Scoring Engines: 5
- Sport UI Components: 5
- Sport Data Models: 5
- Sport Workflows: 5
- Venues: 5
- Events: 9
- Competition Templates: 5
- Rounds: 5
- Heats: 5
- Categories: 5
- Divisions: 5
- Workflow Engine: 12
- Schedule Engine: 14
- Riders: 6
- Event Registrations: 5
- Heat Assignments: 5
- Judges: 5
- Judge Assignments: 4
- Operators: 5
- Operator Assignments: 3
- Sponsors: 5
- Event Sponsors: 4
- Branding: 2
- Tricks: 6
- Trick Categories: 3
- Attempts: 5
- Combo Attempts: 2
- Runs: 5
- Run Attempts: 3
- Best Trick Attempts: 3
- Judge Scores: 4
- Overall Scores: 4
- Leaderboards: 2
- Results: 3
- Penalties: 4
- Announcements: 5
- Notifications: 3
- Display Settings: 2
- OBS Layouts: 3
- Screen Layouts: 3
- Themes: 3
- Scoring Settings: 2
- Score Formulas: 3
- Layout Builder: 12
- Animation Engine: 14
- Audio Manager: 14
- Media Library: 12
- Trick Library Extensions: 12
- ML/Combo Recognition: 12
- Statistics Engine: 10
- Replay Engine: 12
- Offline Sync: 12
- Plugin Architecture: 14
- Internationalization: 12
- White-label Branding: 12
- System: 2
- Audit Logs: 2
- Activity Logs: 1
- Health: 1
- WebSocket: 1

---

**END OF API STRUCTURE V3**
