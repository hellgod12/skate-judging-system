# API STRUCTURE DESIGN
## Skate Judging Platform Pro v2 - RESTful API

**Date:** July 19, 2026  
**Version:** 2.0

---

## API OVERVIEW

The API follows RESTful principles with resource-based routing, proper HTTP methods, and consistent response formats. All endpoints use UUIDs for resource identification and support JSON request/response bodies.

**Base URL:** `https://api.skatejudging.com/v2`  
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

## AUTHENTICATION ENDPOINTS

### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "organization_id": "uuid"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_verified": false
    }
  }
}
```

### POST /auth/login
Authenticate user and return JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "roles": ["admin"]
    }
  }
}
```

### POST /auth/logout
Logout user and invalidate token.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### POST /auth/refresh
Refresh JWT token.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token"
  }
}
```

### POST /auth/forgot-password
Initiate password reset.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

### POST /auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset_token",
  "password": "NewSecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

---

## ORGANIZATION ENDPOINTS

### GET /organizations
List all organizations (admin only).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term
- `is_active`: Filter by active status

**Response:** `200 OK`

### GET /organizations/{id}
Get organization details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Skate Judging Pro",
    "slug": "skate-judging-pro",
    "description": "Professional skateboarding judging platform",
    "logo_url": "https://...",
    "website_url": "https://...",
    "contact_email": "info@skatejudging.com",
    "is_active": true,
    "settings": { ... },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /organizations
Create new organization (admin only).

**Request:**
```json
{
  "name": "New Organization",
  "slug": "new-organization",
  "description": "Organization description",
  "contact_email": "contact@example.com"
}
```

**Response:** `201 Created`

### PUT /organizations/{id}
Update organization details.

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:** `200 OK`

### DELETE /organizations/{id}
Delete organization (admin only).

**Response:** `204 No Content`

---

## USER ENDPOINTS

### GET /users
List users (with filters).

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `organization_id`: Filter by organization
- `role`: Filter by role
- `search`: Search term
- `is_active`: Filter by active status

**Response:** `200 OK`

### GET /users/{id}
Get user details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "organization_id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "is_active": true,
    "is_verified": true,
    "roles": ["admin"],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /users
Create new user (admin only).

**Request:**
```json
{
  "organization_id": "uuid",
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "first_name": "Jane",
  "last_name": "Smith",
  "roles": ["judge"]
}
```

**Response:** `201 Created`

### PUT /users/{id}
Update user details.

**Request:**
```json
{
  "first_name": "Updated Name",
  "display_name": "Updated Display Name"
}
```

**Response:** `200 OK`

### DELETE /users/{id}
Delete user (admin only).

**Response:** `204 No Content`

### POST /users/{id}/roles
Assign role to user.

**Request:**
```json
{
  "role_id": "uuid"
}
```

**Response:** `201 Created`

### DELETE /users/{id}/roles/{role_id}
Remove role from user.

**Response:** `204 No Content`

---

## ROLE ENDPOINTS

### GET /roles
List all roles.

**Query Parameters:**
- `organization_id`: Filter by organization
- `is_system`: Filter system roles

**Response:** `200 OK`

### GET /roles/{id}
Get role details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "organization_id": "uuid",
    "name": "Admin",
    "slug": "admin",
    "description": "Administrator role",
    "is_system": false,
    "permissions": ["organizations.*", "users.*"],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /roles
Create new role.

**Request:**
```json
{
  "organization_id": "uuid",
  "name": "Custom Role",
  "slug": "custom-role",
  "description": "Custom role description",
  "permissions": ["events.view", "riders.view"]
}
```

**Response:** `201 Created`

### PUT /roles/{id}
Update role details.

**Response:** `200 OK`

### DELETE /roles/{id}
Delete role.

**Response:** `204 No Content`

---

## PERMISSION ENDPOINTS

### GET /permissions
List all permissions.

**Response:** `200 OK`

### GET /permissions/{id}
Get permission details.

**Response:** `200 OK`

---

## VENUE ENDPOINTS

### GET /venues
List venues.

**Query Parameters:**
- `organization_id`: Filter by organization
- `country_code`: Filter by country
- `search`: Search term

**Response:** `200 OK`

### GET /venues/{id}
Get venue details.

**Response:** `200 OK`

### POST /venues
Create new venue.

**Request:**
```json
{
  "organization_id": "uuid",
  "name": "New Venue",
  "slug": "new-venue",
  "description": "Venue description",
  "address": "123 Street",
  "city": "City",
  "country_code": "US",
  "capacity": 5000
}
```

**Response:** `201 Created`

### PUT /venues/{id}
Update venue details.

**Response:** `200 OK`

### DELETE /venues/{id}
Delete venue.

**Response:** `204 No Content`

---

## EVENT ENDPOINTS

### GET /events
List events.

**Query Parameters:**
- `organization_id`: Filter by organization
- `venue_id`: Filter by venue
- `status`: Filter by status
- `event_type`: Filter by type
- `start_date_from`: Filter by start date
- `start_date_to`: Filter by end date
- `is_public`: Filter public events
- `search`: Search term

**Response:** `200 OK`

### GET /events/{id}
Get event details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "organization_id": "uuid",
    "venue_id": "uuid",
    "template_id": "uuid",
    "name": "SLS Championship 2024",
    "slug": "sls-championship-2024",
    "description": "Event description",
    "event_type": "street",
    "status": "in_progress",
    "start_date": "2024-08-15T09:00:00Z",
    "end_date": "2024-08-17T18:00:00Z",
    "scoring_config": { ... },
    "run_config": { ... },
    "best_trick_config": { ... },
    "is_public": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /events
Create new event.

**Request:**
```json
{
  "organization_id": "uuid",
  "venue_id": "uuid",
  "template_id": "uuid",
  "name": "New Event",
  "slug": "new-event",
  "description": "Event description",
  "event_type": "street",
  "start_date": "2024-09-01T09:00:00Z",
  "end_date": "2024-09-03T18:00:00Z",
  "scoring_config": { ... },
  "best_trick_config": { ... }
}
```

**Response:** `201 Created`

### PUT /events/{id}
Update event details.

**Response:** `200 OK`

### DELETE /events/{id}
Delete event.

**Response:** `204 No Content`

### POST /events/{id}/publish
Publish event.

**Response:** `200 OK`

### POST /events/{id}/start
Start event.

**Response:** `200 OK`

### POST /events/{id}/pause
Pause event.

**Response:** `200 OK`

### POST /events/{id}/complete
Complete event.

**Response:** `200 OK`

---

## COMPETITION TEMPLATE ENDPOINTS

### GET /templates
List competition templates.

**Query Parameters:**
- `organization_id`: Filter by organization
- `format_type`: Filter by format
- `is_public`: Filter public templates

**Response:** `200 OK`

### GET /templates/{id}
Get template details.

**Response:** `200 OK`

### POST /templates
Create new template.

**Request:**
```json
{
  "organization_id": "uuid",
  "name": "Custom Format",
  "slug": "custom-format",
  "description": "Custom competition format",
  "format_type": "custom",
  "scoring_config": { ... },
  "run_config": { ... },
  "best_trick_config": { ... }
}
```

**Response:** `201 Created`

### PUT /templates/{id}
Update template details.

**Response:** `200 OK`

### DELETE /templates/{id}
Delete template.

**Response:** `204 No Content`

---

## ROUND ENDPOINTS

### GET /events/{event_id}/rounds
List rounds for an event.

**Response:** `200 OK`

### GET /rounds/{id}
Get round details.

**Response:** `200 OK`

### POST /events/{event_id}/rounds
Create new round.

**Request:**
```json
{
  "name": "Qualifiers",
  "round_type": "qualification",
  "order_index": 1,
  "start_time": "2024-08-15T09:00:00Z",
  "end_time": "2024-08-15T18:00:00Z",
  "advancement_config": { ... }
}
```

**Response:** `201 Created`

### PUT /rounds/{id}
Update round details.

**Response:** `200 OK`

### DELETE /rounds/{id}
Delete round.

**Response:** `204 No Content`

---

## HEAT ENDPOINTS

### GET /rounds/{round_id}/heats
List heats for a round.

**Response:** `200 OK`

### GET /heats/{id}
Get heat details.

**Response:** `200 OK`

### POST /rounds/{round_id}/heats
Create new heat.

**Request:**
```json
{
  "name": "Heat 1",
  "order_index": 1,
  "max_participants": 10,
  "start_time": "2024-08-15T09:00:00Z"
}
```

**Response:** `201 Created`

### PUT /heats/{id}
Update heat details.

**Response:** `200 OK`

### DELETE /heats/{id}
Delete heat.

**Response:** `204 No Content`

---

## CATEGORY ENDPOINTS

### GET /categories
List categories.

**Query Parameters:**
- `organization_id`: Filter by organization
- `gender`: Filter by gender
- `skill_level`: Filter by skill level

**Response:** `200 OK`

### GET /categories/{id}
Get category details.

**Response:** `200 OK`

### POST /categories
Create new category.

**Request:**
```json
{
  "organization_id": "uuid",
  "name": "Junior",
  "slug": "junior",
  "description": "Under 18 category",
  "age_max": 17,
  "gender": "all",
  "skill_level": "advanced"
}
```

**Response:** `201 Created`

### PUT /categories/{id}
Update category details.

**Response:** `200 OK`

### DELETE /categories/{id}
Delete category.

**Response:** `204 No Content`

---

## RIDER ENDPOINTS

### GET /riders
List riders.

**Query Parameters:**
- `organization_id`: Filter by organization
- `nationality_code`: Filter by nationality
- `is_professional`: Filter by professional status
- `search`: Search term

**Response:** `200 OK`

### GET /riders/{id}
Get rider details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "organization_id": "uuid",
    "user_id": "uuid",
    "first_name": "Nyjah",
    "last_name": "Huston",
    "display_name": "Nyjah Huston",
    "nationality_code": "US",
    "stance": "regular",
    "sponsor_team": "Nike SB",
    "is_active": true,
    "is_professional": true,
    "profile": {
      "ranking": 1,
      "points": 2500,
      "wins": 15,
      "podiums": 25
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /riders
Create new rider.

**Request:**
```json
{
  "organization_id": "uuid",
  "first_name": "John",
  "last_name": "Doe",
  "display_name": "John Doe",
  "nationality_code": "US",
  "stance": "regular",
  "sponsor_team": "Brand"
}
```

**Response:** `201 Created`

### PUT /riders/{id}
Update rider details.

**Response:** `200 OK`

### DELETE /riders/{id}
Delete rider.

**Response:** `204 No Content`

### GET /riders/{id}/events
Get rider's event history.

**Response:** `200 OK`

### GET /riders/{id}/statistics
Get rider statistics.

**Response:** `200 OK`

---

## EVENT REGISTRATION ENDPOINTS

### GET /events/{event_id}/registrations
List event registrations.

**Query Parameters:**
- `status`: Filter by status
- `category_id`: Filter by category

**Response:** `200 OK`

### POST /events/{event_id}/registrations
Register rider for event.

**Request:**
```json
{
  "rider_id": "uuid",
  "category_id": "uuid"
}
```

**Response:** `201 Created`

### PUT /registrations/{id}
Update registration status.

**Request:**
```json
{
  "status": "confirmed"
}
```

**Response:** `200 OK`

### DELETE /registrations/{id}
Cancel registration.

**Response:** `204 No Content`

---

## HEAT ASSIGNMENT ENDPOINTS

### GET /heats/{heat_id}/assignments
List heat assignments.

**Response:** `200 OK`

### POST /heats/{heat_id}/assignments
Assign rider to heat.

**Request:**
```json
{
  "rider_id": "uuid",
  "registration_id": "uuid",
  "start_order": 1,
  "lane": 1
}
```

**Response:** `201 Created`

### PUT /assignments/{id}
Update heat assignment.

**Response:** `200 OK`

### DELETE /assignments/{id}
Remove heat assignment.

**Response:** `204 No Content`

---

## JUDGE ENDPOINTS

### GET /judges
List judges.

**Query Parameters:**
- `organization_id`: Filter by organization
- `is_active`: Filter by active status

**Response:** `200 OK`

### GET /judges/{id}
Get judge details.

**Response:** `200 OK`

### POST /judges
Create new judge.

**Request:**
```json
{
  "organization_id": "uuid",
  "user_id": "uuid",
  "first_name": "John",
  "last_name": "Smith",
  "certification": "World Skate Certified",
  "experience_years": 15,
  "specialties": ["street", "technical"]
}
```

**Response:** `201 Created`

### PUT /judges/{id}
Update judge details.

**Response:** `200 OK`

### DELETE /judges/{id}
Delete judge.

**Response:** `204 No Content`

---

## JUDGE ASSIGNMENT ENDPOINTS

### GET /events/{event_id}/judge-assignments
List judge assignments for event.

**Response:** `200 OK`

### POST /events/{event_id}/judge-assignments
Assign judge to event.

**Request:**
```json
{
  "judge_id": "uuid",
  "role": "head_judge",
  "weight": 1.0
}
```

**Response:** `201 Created`

### PUT /judge-assignments/{id}
Update judge assignment.

**Response:** `200 OK`

### DELETE /judge-assignments/{id}
Remove judge assignment.

**Response:** `204 No Content`

---

## OPERATOR ENDPOINTS

### GET /operators
List operators.

**Query Parameters:**
- `organization_id`: Filter by organization
- `role`: Filter by role

**Response:** `200 OK`

### GET /operators/{id}
Get operator details.

**Response:** `200 OK`

### POST /operators
Create new operator.

**Request:**
```json
{
  "organization_id": "uuid",
  "user_id": "uuid",
  "role": "head_operator",
  "certifications": ["SLS Operator Level 2"]
}
```

**Response:** `201 Created`

### PUT /operators/{id}
Update operator details.

**Response:** `200 OK`

### DELETE /operators/{id}
Delete operator.

**Response:** `204 No Content`

---

## OPERATOR ASSIGNMENT ENDPOINTS

### GET /events/{event_id}/operator-assignments
List operator assignments for event.

**Response:** `200 OK`

### POST /events/{event_id}/operator-assignments
Assign operator to event.

**Request:**
```json
{
  "operator_id": "uuid",
  "role": "head_operator"
}
```

**Response:** `201 Created`

### DELETE /operator-assignments/{id}
Remove operator assignment.

**Response:** `204 No Content`

---

## SPONSOR ENDPOINTS

### GET /sponsors
List sponsors.

**Query Parameters:**
- `organization_id`: Filter by organization
- `tier`: Filter by tier

**Response:** `200 OK`

### GET /sponsors/{id}
Get sponsor details.

**Response:** `200 OK`

### POST /sponsors
Create new sponsor.

**Request:**
```json
{
  "organization_id": "uuid",
  "name": "Nike SB",
  "slug": "nike-sb",
  "description": "Nike Skateboarding",
  "tier": "platinum",
  "website_url": "https://nikesb.com"
}
```

**Response:** `201 Created`

### PUT /sponsors/{id}
Update sponsor details.

**Response:** `200 OK`

### DELETE /sponsors/{id}
Delete sponsor.

**Response:** `204 No Content`

---

## EVENT SPONSOR ENDPOINTS

### GET /events/{event_id}/sponsors
List event sponsors.

**Response:** `200 OK`

### POST /events/{event_id}/sponsors
Add sponsor to event.

**Request:**
```json
{
  "sponsor_id": "uuid",
  "tier": "platinum",
  "sponsorship_level": "title",
  "contract_value": 50000.00
}
```

**Response:** `201 Created`

### PUT /event-sponsors/{id}
Update event sponsor details.

**Response:** `200 OK`

### DELETE /event-sponsors/{id}
Remove sponsor from event.

**Response:** `204 No Content`

---

## BRANDING ENDPOINTS

### GET /events/{event_id}/branding
Get event branding.

**Response:** `200 OK`

### PUT /events/{event_id}/branding
Update event branding.

**Request:**
```json
{
  "primary_color": "#3B82F6",
  "secondary_color": "#1E40AF",
  "accent_color": "#F59E0B",
  "font_family": "Inter",
  "logo_url": "https://...",
  "browser_title": "Event Title"
}
```

**Response:** `200 OK`

---

## TRICK ENDPOINTS

### GET /tricks
List tricks.

**Query Parameters:**
- `organization_id`: Filter by organization
- `category_id`: Filter by category
- `difficulty_min`: Filter by minimum difficulty
- `difficulty_max`: Filter by maximum difficulty
- `stance`: Filter by stance
- `obstacle_type`: Filter by obstacle type
- `search`: Search term

**Response:** `200 OK`

### GET /tricks/{id}
Get trick details.

**Response:** `200 OK`

### POST /tricks
Create new trick.

**Request:**
```json
{
  "organization_id": "uuid",
  "category_id": "uuid",
  "name": "New Trick",
  "slug": "new-trick",
  "description": "Trick description",
  "difficulty_base": 5,
  "stance": "any",
  "obstacle_type": "flat",
  "is_flip": true
}
```

**Response:** `201 Created`

### PUT /tricks/{id}
Update trick details.

**Response:** `200 OK`

### DELETE /tricks/{id}
Delete trick.

**Response:** `204 No Content`

---

## TRICK CATEGORY ENDPOINTS

### GET /trick-categories
List trick categories.

**Query Parameters:**
- `organization_id`: Filter by organization

**Response:** `200 OK`

### GET /trick-categories/{id}
Get trick category details.

**Response:** `200 OK`

### POST /trick-categories
Create new trick category.

**Request:**
```json
{
  "organization_id": "uuid",
  "name": "Flip Tricks",
  "slug": "flip-tricks",
  "description": "Board rotation tricks"
}
```

**Response:** `201 Created`

---

## ATTEMPT ENDPOINTS

### GET /events/{event_id}/attempts
List attempts for event.

**Query Parameters:**
- `rider_id`: Filter by rider
- `heat_id`: Filter by heat
- `round_id`: Filter by round
- `attempt_type`: Filter by type
- `status`: Filter by status

**Response:** `200 OK`

### GET /riders/{rider_id}/attempts
List attempts for rider.

**Response:** `200 OK`

### GET /attempts/{id}
Get attempt details.

**Response:** `200 OK`

### POST /attempts
Create new attempt.

**Request:**
```json
{
  "event_id": "uuid",
  "rider_id": "uuid",
  "heat_id": "uuid",
  "round_id": "uuid",
  "attempt_type": "single_trick",
  "attempt_number": 1,
  "status": "landed",
  "raw_json": {
    "type": "single",
    "trick": "Kickflip",
    "modifiers": {
      "execution": 1.0,
      "style": 1.0,
      "amplitude": 1.0,
      "landing": 1.0,
      "risk": 1.0
    }
  }
}
```

**Response:** `201 Created`

### PUT /attempts/{id}
Update attempt details.

**Response:** `200 OK`

### DELETE /attempts/{id}
Delete attempt.

**Response:** `204 No Content`

---

## COMBO ATTEMPT ENDPOINTS

### GET /attempts/{attempt_id}/combo
Get combo attempt details.

**Response:** `200 OK`

### POST /attempts/{attempt_id}/combo
Create combo attempt details.

**Request:**
```json
{
  "trick_sequence": ["uuid1", "uuid2", "uuid3"],
  "trick_count": 3,
  "combo_multiplier": 1.35
}
```

**Response:** `201 Created`

---

## RUN ENDPOINTS

### GET /events/{event_id}/runs
List runs for event.

**Response:** `200 OK`

### GET /riders/{rider_id}/runs
List runs for rider.

**Response:** `200 OK`

### GET /runs/{id}
Get run details.

**Response:** `200 OK`

### POST /runs
Create new run.

**Request:**
```json
{
  "event_id": "uuid",
  "rider_id": "uuid",
  "heat_id": "uuid",
  "round_id": "uuid",
  "run_number": 1,
  "run_type": "qualification"
}
```

**Response:** `201 Created`

### PUT /runs/{id}
Update run details.

**Response:** `200 OK`

### POST /runs/{id}/start
Start run.

**Response:** `200 OK`

### POST /runs/{id}/stop
Stop run.

**Response:** `200 OK`

---

## RUN ATTEMPT ENDPOINTS

### GET /runs/{run_id}/attempts
List attempts in run.

**Response:** `200 OK`

### POST /runs/{run_id}/attempts
Add attempt to run.

**Request:**
```json
{
  "attempt_id": "uuid",
  "sequence_order": 1,
  "timestamp_offset": 5
}
```

**Response:** `201 Created`

---

## BEST TRICK ATTEMPT ENDPOINTS

### GET /events/{event_id}/best-trick-attempts
List best trick attempts.

**Response:** `200 OK`

### GET /best-trick-attempts/{id}
Get best trick attempt details.

**Response:** `200 OK`

### POST /best-trick-attempts
Create best trick attempt.

**Request:**
```json
{
  "event_id": "uuid",
  "rider_id": "uuid",
  "heat_id": "uuid",
  "round_id": "uuid",
  "attempt_number": 1,
  "max_attempts": 5,
  "top_score_count": 4
}
```

**Response:** `201 Created`

---

## JUDGE SCORE ENDPOINTS

### GET /attempts/{attempt_id}/judge-scores
List judge scores for attempt.

**Response:** `200 OK`

### GET /judge-scores/{id}
Get judge score details.

**Response:** `200 OK`

### POST /judge-scores
Submit judge score.

**Request:**
```json
{
  "attempt_id": "uuid",
  "judge_id": "uuid",
  "judge_assignment_id": "uuid",
  "score": 8.5,
  "execution": 1.0,
  "style": 1.0,
  "amplitude": 1.0,
  "landing": 1.0,
  "risk": 1.0,
  "notes": "Great execution"
}
```

**Response:** `201 Created`

### PUT /judge-scores/{id}
Update judge score.

**Response:** `200 OK`

---

## OVERALL SCORE ENDPOINTS

### GET /events/{event_id}/overall-scores
List overall scores for event.

**Query Parameters:**
- `round_id`: Filter by round
- `heat_id`: Filter by heat
- `score_type`: Filter by score type

**Response:** `200 OK`

### GET /riders/{rider_id}/overall-scores
List overall scores for rider.

**Response:** `200 OK`

### GET /overall-scores/{id}
Get overall score details.

**Response:** `200 OK`

### POST /overall-scores
Create overall score.

**Request:**
```json
{
  "event_id": "uuid",
  "rider_id": "uuid",
  "heat_id": "uuid",
  "round_id": "uuid",
  "score_type": "best_trick",
  "score": 35.5,
  "rank": 1,
  "calculation_method": "best_trick_total"
}
```

**Response:** `201 Created`

---

## LEADERBOARD ENDPOINTS

### GET /events/{event_id}/leaderboard
Get event leaderboard.

**Query Parameters:**
- `round_id`: Filter by round
- `heat_id`: Filter by heat
- `score_type`: Filter by score type

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "event_id": "uuid",
    "leaderboard": [
      {
        "rank": 1,
        "rider_id": "uuid",
        "rider_name": "Nyjah Huston",
        "score": 35.5,
        "best_tricks": [9.5, 9.0, 8.5, 8.5],
        "run_score": null,
        "final_score": 35.5
      }
    ],
    "generated_at": "2024-08-15T12:00:00Z"
  }
}
```

### POST /events/{event_id}/leaderboard/recalculate
Recalculate leaderboard.

**Response:** `200 OK`

---

## RESULT ENDPOINTS

### GET /events/{event_id}/results
Get event results.

**Query Parameters:**
- `round_id`: Filter by round

**Response:** `200 OK`

### GET /results/{id}
Get result details.

**Response:** `200 OK`

### POST /events/{event_id}/results/publish
Publish event results.

**Response:** `200 OK`

---

## PENALTY ENDPOINTS

### GET /events/{event_id}/penalties
List penalties for event.

**Query Parameters:**
- `rider_id`: Filter by rider

**Response:** `200 OK`

### GET /penalties/{id}
Get penalty details.

**Response:** `200 OK`

### POST /penalties
Create penalty.

**Request:**
```json
{
  "event_id": "uuid",
  "rider_id": "uuid",
  "attempt_id": "uuid",
  "penalty_type": "time_violation",
  "description": "Exceeded time limit",
  "penalty_value": -1.0
}
```

**Response:** `201 Created`

### PUT /penalties/{id}
Update penalty details.

**Response:** `200 OK`

### POST /penalties/{id}/appeal
Appeal penalty.

**Request:**
```json
{
  "appeal_notes": "Penalty should be removed due to..."
}
```

**Response:** `200 OK`

---

## ANNOUNCEMENT ENDPOINTS

### GET /events/{event_id}/announcements
List event announcements.

**Query Parameters:**
- `priority`: Filter by priority
- `announcement_type`: Filter by type

**Response:** `200 OK`

### GET /announcements/{id}
Get announcement details.

**Response:** `200 OK`

### POST /announcements
Create announcement.

**Request:**
```json
{
  "event_id": "uuid",
  "title": "Schedule Change",
  "content": "Event schedule has been updated...",
  "announcement_type": "schedule_change",
  "priority": "high",
  "is_public": true
}
```

**Response:** `201 Created`

### PUT /announcements/{id}
Update announcement.

**Response:** `200 OK`

### DELETE /announcements/{id}
Delete announcement.

**Response:** `204 No Content`

---

## NOTIFICATION ENDPOINTS

### GET /users/{user_id}/notifications
List user notifications.

**Query Parameters:**
- `is_read`: Filter by read status

**Response:** `200 OK`

### PUT /notifications/{id}/read
Mark notification as read.

**Response:** `200 OK`

### PUT /users/{user_id}/notifications/read-all
Mark all notifications as read.

**Response:** `200 OK`

---

## DISPLAY SETTINGS ENDPOINTS

### GET /events/{event_id}/display-settings
Get display settings.

**Response:** `200 OK`

### PUT /events/{event_id}/display-settings
Update display settings.

**Request:**
```json
{
  "display_type": "tv",
  "resolution": "1920x1080",
  "show_clock": true,
  "show_countdown": true,
  "show_scores": true
}
```

**Response:** `200 OK`

---

## OBS LAYOUT ENDPOINTS

### GET /events/{event_id}/obs-layouts
List OBS layouts.

**Response:** `200 OK`

### GET /obs-layouts/{id}
Get OBS layout details.

**Response:** `200 OK`

### POST /obs-layouts
Create OBS layout.

**Request:**
```json
{
  "event_id": "uuid",
  "name": "Leaderboard Overlay",
  "slug": "leaderboard-overlay",
  "layout_type": "leaderboard",
  "config": {
    "position": "right",
    "width": 400,
    "height": 600
  }
}
```

**Response:** `201 Created`

### PUT /obs-layouts/{id}
Update OBS layout.

**Response:** `200 OK`

---

## SCREEN LAYOUT ENDPOINTS

### GET /events/{event_id}/screen-layouts
List screen layouts.

**Response:** `200 OK`

### GET /screen-layouts/{id}
Get screen layout details.

**Response:** `200 OK`

### POST /screen-layouts
Create screen layout.

**Request:**
```json
{
  "event_id": "uuid",
  "name": "Standard Layout",
  "slug": "standard-layout",
  "layout_config": {
    "columns": 3,
    "rows": 2
  },
  "zones": { ... }
}
```

**Response:** `201 Created`

---

## THEME ENDPOINTS

### GET /themes
List themes.

**Query Parameters:**
- `organization_id`: Filter by organization
- `is_public`: Filter public themes

**Response:** `200 OK`

### GET /themes/{id}
Get theme details.

**Response:** `200 OK`

### POST /themes
Create new theme.

**Request:**
```json
{
  "organization_id": "uuid",
  "name": "Custom Theme",
  "slug": "custom-theme",
  "description": "Custom theme description",
  "colors": { ... },
  "fonts": { ... },
  "is_public": false
}
```

**Response:** `201 Created`

---

## SCORING SETTINGS ENDPOINTS

### GET /events/{event_id}/scoring-settings
Get scoring settings.

**Response:** `200 OK`

### PUT /events/{event_id}/scoring-settings
Update scoring settings.

**Request:**
```json
{
  "scoring_method": "best_trick",
  "judge_count": 5,
  "score_range_min": 0.0,
  "score_range_max": 10.0,
  "decimal_places": 2,
  "drop_lowest": false,
  "drop_highest": false
}
```

**Response:** `200 OK`

---

## SCORE FORMULA ENDPOINTS

### GET /score-formulas
List score formulas.

**Query Parameters:**
- `organization_id`: Filter by organization

**Response:** `200 OK`

### GET /score-formulas/{id}
Get score formula details.

**Response:** `200 OK`

### POST /score-formulas
Create score formula.

**Request:**
```json
{
  "organization_id": "uuid",
  "name": "Custom Formula",
  "slug": "custom-formula",
  "description": "Custom scoring formula",
  "formula": "SUM(top_4_scores) * 1.1",
  "variables": {
    "top_4_scores": "Array of top 4 scores"
  }
}
```

**Response:** `201 Created`

---

## SYSTEM SETTINGS ENDPOINTS

### GET /system/settings
Get system settings (admin only).

**Response:** `200 OK`

### PUT /system/settings/{key}
Update system setting (admin only).

**Request:**
```json
{
  "value": "new_value"
}
```

**Response:** `200 OK`

---

## AUDIT LOG ENDPOINTS

### GET /audit-logs
List audit logs (admin only).

**Query Parameters:**
- `organization_id`: Filter by organization
- `user_id`: Filter by user
- `resource_type`: Filter by resource type
- `action`: Filter by action
- `from_date`: Filter by date range
- `to_date`: Filter by date range

**Response:** `200 OK`

### GET /audit-logs/{id}
Get audit log details.

**Response:** `200 OK`

---

## ACTIVITY LOG ENDPOINTS

### GET /activity-logs
List activity logs.

**Query Parameters:**
- `organization_id`: Filter by organization
- `event_id`: Filter by event
- `user_id`: Filter by user
- `activity_type`: Filter by activity type

**Response:** `200 OK`

---

## HEALTH ENDPOINTS

### GET /health
Health check endpoint.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-07-19T10:00:00Z",
    "services": {
      "database": "healthy",
      "redis": "healthy",
      "api": "healthy"
    }
  }
}
```

---

## WEBSOCKET ENDPOINTS

### WS /realtime
Real-time WebSocket connection for live updates.

**Connection:**
```
wss://api.skatejudging.com/v2/realtime?token={jwt_token}
```

**Subscribe to channels:**
```json
{
  "action": "subscribe",
  "channels": ["event:{event_id}:scores", "event:{event_id}:leaderboard"]
}
```

**Message format:**
```json
{
  "channel": "event:{event_id}:scores",
  "event": "score_updated",
  "data": { ... },
  "timestamp": "2024-07-19T10:00:00Z"
}
```

---

## ERROR CODES

| Code | Description |
|------|-------------|
| `AUTH_INVALID_TOKEN` | Invalid or expired token |
| `AUTH_INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `VALIDATION_ERROR` | Request validation failed |
| `RESOURCE_NOT_FOUND` | Resource not found |
| `RESOURCE_CONFLICT` | Resource conflict (duplicate, etc.) |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | Internal server error |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `DATABASE_ERROR` | Database error |
| `EXTERNAL_SERVICE_ERROR` | External service error |

---

## RATE LIMITING

- **Default:** 1000 requests per minute per user
- **Authenticated:** 2000 requests per minute
- **Admin:** 5000 requests per minute
- **WebSocket:** 100 messages per second per connection

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1692477600
```

---

**END OF API STRUCTURE**
