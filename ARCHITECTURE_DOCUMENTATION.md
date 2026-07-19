# ARCHITECTURE DOCUMENTATION
## Skate Judging Platform Pro V2 - Complete System Architecture

**Date:** July 19, 2026  
**Version:** 2.0

---

## EXECUTIVE SUMMARY

The Skate Judging Platform Pro V2 is a comprehensive, enterprise-grade skateboarding judging system designed for professional competitions. It features a modern microservices architecture, multi-tenant support, real-time scoring, and complete configurability through an Admin CMS without requiring source code modifications.

**Key Achievements:**
- Complete database redesign with 47 tables using UUIDs
- Multi-tenant architecture with RBAC
- Configurable competition templates (SLS, Olympic, Best Trick, Jam, Game of Skate)
- Real-time scoring with WebSocket support
- Separate interfaces for Admin, Judge, Operator, Display, OBS, and Public
- Comprehensive API with 100+ endpoints
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

### Design Principles
1. **Configurability:** All competition rules configurable via Admin CMS
2. **Multi-tenancy:** Support for multiple organizations
3. **Scalability:** Horizontal scaling with Kubernetes
4. **Real-time:** WebSocket for live updates
5. **Security:** RBAC with audit logging
6. **Performance:** Optimized queries with caching
7. **Reliability:** Blue-green deployment with rollback
8. **Accessibility:** WCAG 2.1 AA compliance

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
- **Scoring Service:** Score calculations
- **Notification Service:** Email/SMS/Push notifications
- **Media Service:** Video/image processing
- **Analytics Service:** Usage analytics

**Technologies:**
- Node.js 18+
- Express.js
- TypeScript
- JWT Authentication
- WebSocket (Socket.io)

### Data Layer
**Purpose:** Data persistence and caching

**Components:**
- **PostgreSQL:** Primary database
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
- **Tables:** 47 tables
- **Primary Keys:** UUID (uuid_generate_v4())
- **Foreign Keys:** All indexed
- **Constraints:** Comprehensive validation
- **Triggers:** Updated_at timestamps
- **Functions:** Business logic in database
- **Views:** Simplified queries
- **Policies:** Row-level security

### Key Tables

#### Identity & Access (7 tables)
- organizations
- users
- roles
- user_roles
- permissions
- role_permissions
- countries

#### Competition Management (6 tables)
- competition_templates
- events
- competition_rounds
- heats
- categories
- divisions

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

#### Branding (2 tables)
- event_branding
- event_assets

#### Scoring (2 tables)
- scoring_settings
- score_formulas

#### Tricks (2 tables)
- trick_categories
- tricks

#### Attempts & Runs (5 tables)
- attempts
- combo_attempts
- runs
- run_attempts
- best_trick_attempts

#### Judging (4 tables)
- judge_scores
- overall_scores
- leaderboards
- results

#### Penalties (1 table)
- penalties

#### Communication (2 tables)
- announcements
- notifications

#### Display (4 tables)
- display_settings
- obs_layouts
- screen_layouts
- themes

#### System (1 table)
- system_settings

#### Audit (2 tables)
- audit_logs
- activity_logs

### Database Features
- **Multi-tenancy:** organization_id on all multi-tenant tables
- **Audit Logging:** audit_logs for all changes
- **Activity Logging:** activity_logs for user actions
- **Soft Deletes:** deleted_at on key tables
- **Timestamps:** created_at, updated_at on all tables
- **JSONB:** Flexible configuration storage
- **Indexes:** Optimized for common queries
- **Foreign Keys:** CASCADE delete/update

---

## API ARCHITECTURE

### API Design
- **Style:** RESTful
- **Base URL:** https://api.skatejudging.com/v2
- **Authentication:** Bearer Token (JWT)
- **Rate Limiting:** 1000 requests/minute
- **Content-Type:** application/json

### API Endpoints (100+)

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

#### Riders (6 endpoints)
- GET /riders
- GET /riders/{id}
- POST /riders
- PUT /riders/{id}
- DELETE /riders/{id}
- GET /riders/{id}/events

#### Event Registrations (5 endpoints)
- GET /events/{event_id}/registrations
- POST /events/{event_id}/registrations
- PUT /registrations/{id}
- DELETE /registrations/{id}

#### Heat Assignments (5 endpoints)
- GET /heats/{heat_id}/assignments
- POST /heats/{heat_id}/assignments
- PUT /assignments/{id}
- DELETE /assignments/{id}

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

#### Tricks (5 endpoints)
- GET /tricks
- GET /tricks/{id}
- POST /tricks
- PUT /tricks/{id}
- DELETE /tricks/{id}

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
- POST /runs/{id}/start
- POST /runs/{id}/stop

#### Best Trick Attempts (2 endpoints)
- GET /events/{event_id}/best-trick-attempts
- POST /best-trick-attempts

#### Judge Scores (3 endpoints)
- GET /attempts/{attempt_id}/judge-scores
- POST /judge-scores
- PUT /judge-scores/{id}

#### Overall Scores (3 endpoints)
- GET /events/{event_id}/overall-scores
- GET /riders/{rider_id}/overall-scores
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
- POST /penalties
- PUT /penalties/{id}
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

#### System Settings (2 endpoints)
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
- **Packages:** database, auth, scoring, realtime, ui, utils, types, config

### Component Architecture
- **Base UI:** Reusable primitives (button, input, etc.)
- **Feature Components:** Domain-specific (scoring panel, leaderboard)
- **Layout Components:** Structural (header, sidebar)
- **Shared Components:** Cross-cutting (error boundary, loading)

### State Management
- **Local State:** React hooks (useState, useReducer)
- **Server State:** React Query (TanStack Query)
- **Global State:** Zustand (if needed)
- **Real-time:** WebSocket subscriptions

### Routing
- **Web App:** Next.js App Router
- **Admin App:** Next.js App Router
- **Mobile App:** React Navigation

### Styling
- **CSS Framework:** TailwindCSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Fonts:** Inter (Google Fonts)

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
- **Calculations:**
  - Trick score calculation
  - Combo score calculation
  - Run score calculation
  - Best trick total calculation
  - Final score calculation
  - Normalization to SLS scale

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

### Scoring Formulas
- **Built-in:** SLS, Olympic, Best Trick, Jam
- **Custom:** Formula editor in Admin CMS
- **Variables:** Top scores, run scores, modifiers
- **Validation:** Formula validation before save

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

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Auth:** JWT
- **Validation:** Zod
- **ORM:** Prisma
- **WebSocket:** Socket.io

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

### Documentation
- [x] DATABASE_AUDIT_REPORT.md
- [x] MIGRATION_PLAN.md
- [x] database/schema-v2.sql
- [x] database/seed-v2.sql
- [x] FOLDER_STRUCTURE.md
- [x] API_STRUCTURE.md
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
- [x] ARCHITECTURE_DOCUMENTATION.md

### Database Files
- [x] database/schema-v2.sql (1082 lines)
- [x] database/seed-v2.sql (639 lines)

---

## NEXT STEPS

### Immediate Actions
1. Review all documentation with stakeholders
2. Obtain approval for architecture
3. Begin implementation of database schema
4. Set up development environment
5. Start with core API endpoints

### Implementation Phases
1. **Phase 1:** Database setup and migration
2. **Phase 2:** Core API development
3. **Phase 3:** Admin CMS development
4. **Phase 4:** Judge UI development
5. **Phase 5:** Operator UI development
6. **Phase 6:** Display UI development
7. **Phase 7:** OBS UI development
8. **Phase 8:** Public UI development
9. **Phase 9:** Integration testing
10. **Phase 10:** Deployment to production

### Estimated Timeline
- **Phase 1-2:** 4 weeks
- **Phase 3-5:** 8 weeks
- **Phase 6-8:** 6 weeks
- **Phase 9-10:** 4 weeks
- **Total:** 22 weeks (~5 months)

---

## CONCLUSION

The Skate Judging Platform Pro V2 architecture provides a comprehensive, scalable, and configurable solution for professional skateboarding competitions. The system addresses all identified issues from the original system and introduces enterprise-grade features including multi-tenancy, RBAC, real-time updates, and complete configurability.

The architecture is production-ready with detailed deployment plans, testing strategies, and operational procedures. All documentation has been created to support the implementation team in building this system.

**Status:** Architecture design complete, ready for implementation phase.

---

**END OF ARCHITECTURE DOCUMENTATION**
