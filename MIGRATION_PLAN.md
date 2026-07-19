# DATABASE MIGRATION PLAN
## Skate Judging Platform Pro v2 - Schema V1 to V2 Migration

**Date:** July 19, 2026  
**Version:** 1.0  
**Status:** Draft

---

## EXECUTIVE SUMMARY

This migration plan outlines the process of migrating from the existing minimal database schema (V1) to the comprehensive enterprise-grade schema (V2). The migration involves a complete architectural overhaul, moving from a 4-table prototype to a 40+ table production system.

**Migration Strategy:** Fresh installation with data migration for existing records  
**Downtime Required:** Yes (full system rebuild)  
**Rollback Strategy:** Backup existing database before migration  
**Risk Level:** High (complete system rebuild)

---

## MIGRATION APPROACH

### Recommended Approach: Fresh Installation with Data Migration

**Rationale:**
1. The new schema is fundamentally different from the old one
2. UUID vs SERIAL IDs require complete data replacement
3. New tables have no equivalent in old schema
4. Existing data is minimal (development/test data only)
5. Clean slate prevents data corruption and inconsistencies

**Process:**
1. Backup existing database
2. Create new database with V2 schema
3. Migrate existing data to new structure
4. Update application code
5. Deploy new system
6. Verify data integrity
7. Decommission old database

---

## TABLE MAPPING

### Tables to Remove (Drop)

These tables will be completely removed as they are replaced by new structures:

| Old Table | New Replacement | Reason |
|-----------|----------------|--------|
| `tricks` | `tricks`, `trick_categories` | New structure with categories, UUIDs, more fields |
| `riders` | `riders`, `rider_profiles` | Split into profile and base data, UUIDs |
| `events` | `events`, `competition_templates`, `venues` | Split into templates, venues, events |
| `attempts` | `attempts`, `combo_attempts`, `runs`, `run_attempts`, `best_trick_attempts` | Specialized attempt tables |

### Tables to Create (New)

These tables have no equivalent in the old schema and must be created:

**Identity & Access Management:**
- `organizations`
- `users`
- `roles`
- `user_roles`
- `permissions`
- `role_permissions`

**Venues & Locations:**
- `venues`
- `countries`

**Competition Management:**
- `competition_templates`
- `competition_rounds`
- `heats`
- `categories`
- `divisions`

**Event Management:**
- `event_registrations`
- `heat_assignments`

**Judge Management:**
- `judges`
- `judge_assignments`

**Operator Management:**
- `operators`
- `operator_assignments`

**Event Staff:**
- `event_staff`

**Sponsorship:**
- `sponsors`
- `event_sponsors`

**Branding & Assets:**
- `event_branding`
- `event_assets`

**Scoring Configuration:**
- `scoring_settings`
- `score_formulas`

**Trick Management:**
- `trick_categories`

**Advanced Attempt Tracking:**
- `combo_attempts`
- `runs`
- `run_attempts`
- `best_trick_attempts`

**Judging & Scoring:**
- `judge_scores`
- `overall_scores`
- `leaderboards`
- `results`
- `penalties`

**Communication:**
- `announcements`
- `notifications`

**Display & OBS:**
- `display_settings`
- `obs_layouts`
- `screen_layouts`
- `themes`

**System Configuration:**
- `system_settings`

**Audit & Logging:**
- `audit_logs`
- `activity_logs`

### Data Migration Mapping

#### tricks → tricks

**Old Schema:**
```sql
CREATE TABLE tricks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**New Schema:**
```sql
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
  stance TEXT,
  obstacle_type TEXT,
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
```

**Migration SQL:**
```sql
-- Step 1: Create default organization
INSERT INTO organizations (id, name, slug, description, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Default Organization',
  'default',
  'Default organization for migrated data',
  true
);

-- Step 2: Create default trick category
INSERT INTO trick_categories (id, organization_id, name, slug, description, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'General',
  'general',
  'General trick category',
  true
);

-- Step 3: Migrate tricks
INSERT INTO tricks (
  id,
  organization_id,
  category_id,
  name,
  slug,
  difficulty_base,
  is_active,
  created_at
)
SELECT 
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  name,
  lower(regexp_replace(name, '[^a-zA-Z0-9]', '-', 'g')),
  difficulty,
  true,
  created_at
FROM tricks_v1;
```

#### riders → riders

**Old Schema:**
```sql
CREATE TABLE riders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**New Schema:**
```sql
CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  date_of_birth DATE,
  nationality_code CHAR(2),
  residence_country_code CHAR(2),
  gender TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  stance TEXT,
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
```

**Migration SQL:**
```sql
-- Step 1: Migrate riders (split name into first/last)
INSERT INTO riders (
  id,
  organization_id,
  first_name,
  last_name,
  display_name,
  sponsor_team,
  is_active,
  created_at
)
SELECT 
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  split_part(name, ' ', 1),
  CASE 
    WHEN array_length(regexp_split_to_array(name, ' '), 1) > 1 
    THEN array_to_string(regexp_split_to_array(name, ' ')[2:array_length(regexp_split_to_array(name, ' '), 1)], ' ')
    ELSE ''
  END,
  name,
  team,
  true,
  created_at
FROM riders_v1;

-- Step 2: Create rider profiles
INSERT INTO rider_profiles (
  id,
  rider_id,
  is_active
)
SELECT 
  uuid_generate_v4(),
  r.id,
  true
FROM riders r
WHERE r.organization_id = '00000000-0000-0000-0000-000000000001';
```

#### events → events

**Old Schema:**
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  use_run BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**New Schema:**
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  template_id UUID REFERENCES competition_templates(id) ON DELETE SET NULL,
  name TEXT NUT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
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
```

**Migration SQL:**
```sql
-- Step 1: Create default competition template
INSERT INTO competition_templates (
  id,
  organization_id,
  name,
  slug,
  description,
  format_type,
  scoring_config,
  run_config,
  best_trick_config,
  is_public,
  is_active
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'SLS Style',
  'sls-style',
  'Street League Skateboarding format',
  'sls',
  '{"method": "best_trick", "top_count": 4, "attempts": 5}'::JSONB,
  '{"enabled": false}'::JSONB,
  '{"attempts": 5, "top_count": 4}'::JSONB,
  true,
  true
);

-- Step 2: Migrate events
INSERT INTO events (
  id,
  organization_id,
  template_id,
  name,
  slug,
  event_type,
  status,
  start_date,
  end_date,
  scoring_config,
  best_trick_config,
  is_public,
  created_at
)
SELECT 
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  name,
  lower(regexp_replace(name, '[^a-zA-Z0-9]', '-', 'g')),
  'street',
  'draft',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP + INTERVAL '1 day',
  '{"method": "best_trick", "top_count": 4, "attempts": 5}'::JSONB,
  '{"attempts": 5, "top_count": 4}'::JSONB,
  false,
  created_at
FROM events_v1;
```

#### attempts → attempts

**Old Schema:**
```sql
CREATE TABLE attempts (
  id SERIAL PRIMARY KEY,
  rider_id INTEGER NOT NULL REFERENCES riders(id),
  event_id INTEGER NOT NULL REFERENCES events(id),
  attempt_no INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('single', 'combo')),
  raw_json JSONB NOT NULL,
  score FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**New Schema:**
```sql
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  heat_id UUID REFERENCES heats(id) ON DELETE SET NULL,
  round_id UUID REFERENCES competition_rounds(id) ON DELETE SET NULL,
  attempt_type TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'landed',
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
```

**Migration SQL:**
```sql
-- This requires mapping old IDs to new UUIDs
-- Create a temporary mapping table
CREATE TEMP TABLE old_new_rider_mapping AS
SELECT 
  old.id as old_id,
  new.id as new_id
FROM riders_v1 old
JOIN riders new ON new.display_name = old.name;

CREATE TEMP TABLE old_new_event_mapping AS
SELECT 
  old.id as old_id,
  new.id as new_id
FROM events_v1 old
JOIN events new ON new.name = old.name;

-- Migrate attempts
INSERT INTO attempts (
  id,
  event_id,
  rider_id,
  attempt_type,
  attempt_number,
  status,
  raw_json,
  calculated_score,
  normalized_score,
  created_at
)
SELECT 
  uuid_generate_v4(),
  em.new_id,
  rm.new_id,
  type,
  attempt_no,
  'landed',
  raw_json,
  score,
  score,
  created_at
FROM attempts_v1 a
JOIN old_new_rider_mapping rm ON a.rider_id = rm.old_id
JOIN old_new_event_mapping em ON a.event_id = em.old_id;

-- Handle combo attempts separately
INSERT INTO combo_attempts (
  id,
  attempt_id,
  trick_sequence,
  trick_count,
  combo_multiplier
)
SELECT 
  uuid_generate_v4(),
  a.id,
  a.raw_json->'tricks',
  jsonb_array_length(a.raw_json->'tricks'),
  CASE jsonb_array_length(a.raw_json->'tricks')
    WHEN 2 THEN 1.2
    WHEN 3 THEN 1.35
    WHEN 4 THEN 1.5
    WHEN 5 THEN 1.7
    ELSE 1.0
  END
FROM attempts a
WHERE a.attempt_type = 'combo';
```

---

## MIGRATION STEPS

### Phase 1: Pre-Migration Preparation

1. **Backup Existing Database**
   ```bash
   pg_dump -U postgres -h localhost skate_judging_v1 > backup_v1_$(date +%Y%m%d).sql
   ```

2. **Document Existing Data**
   - Count records in each table
   - Identify critical data relationships
   - Document any custom modifications

3. **Prepare Migration Scripts**
   - Review and test migration SQL
   - Create rollback scripts
   - Prepare validation queries

4. **Schedule Maintenance Window**
   - Notify all users
   - Schedule appropriate downtime
   - Prepare communication plan

### Phase 2: Schema Migration

1. **Create New Database**
   ```sql
   CREATE DATABASE skate_judging_v2;
   ```

2. **Apply V2 Schema**
   ```bash
   psql -U postgres -d skate_judging_v2 -f database/schema-v2.sql
   ```

3. **Verify Schema Creation**
   - Check all tables created
   - Verify indexes
   - Test foreign key constraints

### Phase 3: Data Migration

1. **Create Default Organization**
   ```sql
   INSERT INTO organizations (id, name, slug, description, is_active)
   VALUES (
     '00000000-0000-0000-0000-000000000001',
     'Default Organization',
     'default',
     'Default organization for migrated data',
     true
   );
   ```

2. **Migrate Reference Data**
   - Countries
   - Default categories
   - Default divisions

3. **Migrate Core Data**
   - Tricks (with categories)
   - Riders (with profiles)
   - Events (with templates)

4. **Migrate Transactional Data**
   - Attempts
   - Combo attempts
   - Scores

5. **Create Missing Relationships**
   - Event registrations
   - Judge assignments
   - Operator assignments

### Phase 4: Post-Migration Validation

1. **Data Integrity Checks**
   ```sql
   -- Verify record counts
   SELECT 'tricks' as table_name, COUNT(*) as count FROM tricks
   UNION ALL
   SELECT 'riders', COUNT(*) FROM riders
   UNION ALL
   SELECT 'events', COUNT(*) FROM events
   UNION ALL
   SELECT 'attempts', COUNT(*) FROM attempts;
   ```

2. **Foreign Key Validation**
   ```sql
   -- Check for orphaned records
   SELECT COUNT(*) FROM attempts WHERE rider_id NOT IN (SELECT id FROM riders);
   SELECT COUNT(*) FROM attempts WHERE event_id NOT IN (SELECT id FROM events);
   ```

3. **Data Quality Checks**
   - Verify UUID formats
   - Check required fields
   - Validate data types

4. **Functional Testing**
   - Test API endpoints
   - Verify scoring calculations
   - Test leaderboard generation

### Phase 5: Application Migration

1. **Update Environment Variables**
   - Update database connection strings
   - Update API endpoints
   - Configure new settings

2. **Deploy New Application Code**
   - Update API routes
   - Update UI components
   - Update scoring logic

3. **Configure System Settings**
   - Create default roles
   - Set up permissions
   - Configure scoring formulas

4. **Test Application**
   - User authentication
   - Event creation
   - Scoring workflow
   - Leaderboard display

### Phase 6: Cutover

1. **Final Backup**
   ```bash
   pg_dump -U postgres -h localhost skate_judging_v1 > final_backup_v1.sql
   ```

2. **Stop Old System**
   - Stop application servers
   - Close database connections
   - Verify no active sessions

3. **Switch DNS/Routes**
   - Update database connection strings
   - Update API endpoints
   - Clear caches

4. **Start New System**
   - Start application servers
   - Verify health checks
   - Monitor logs

5. **Verify Cutover**
   - Test critical workflows
   - Monitor performance
   - Check error rates

### Phase 7: Post-Cutover

1. **Monitor System**
   - Watch error logs
   - Monitor performance
   - Track user feedback

2. **Optimize Performance**
   - Analyze query performance
   - Add missing indexes
   - Tune database settings

3. **Clean Up**
   - Archive old database
   - Remove temporary files
   - Document lessons learned

4. **Decommission Old System**
   - After 30 days of stable operation
   - Final backup
   - Drop old database

---

## ROLLBACK PLAN

### Rollback Triggers

1. **Critical data corruption**
2. **Application instability**
3. **Performance degradation**
4. **Security breach**

### Rollback Procedure

1. **Stop New System**
   ```bash
   # Stop application servers
   systemctl stop skate-judging-app
   ```

2. **Restore Old Database**
   ```bash
   psql -U postgres -h localhost -d skate_judging_v1 < final_backup_v1.sql
   ```

3. **Restore Old Application**
   ```bash
   git checkout previous-stable-tag
   npm install
   npm run build
   systemctl start skate-judging-app
   ```

4. **Verify Rollback**
   - Test critical functions
   - Verify data integrity
   - Monitor system health

5. **Communicate**
   - Notify stakeholders
   - Document rollback reason
   - Schedule fix deployment

---

## RISK MITIGATION

### High Risks

1. **Data Loss**
   - **Mitigation:** Multiple backups, validation checks, rollback plan
   - **Probability:** Low
   - **Impact:** Critical

2. **Extended Downtime**
   - **Mitigation:** Detailed testing, parallel run, staged rollout
   - **Probability:** Medium
   - **Impact:** High

3. **Application Incompatibility**
   - **Mitigation:** Comprehensive testing, API versioning, feature flags
   - **Probability:** Medium
   - **Impact:** High

### Medium Risks

1. **Performance Issues**
   - **Mitigation:** Performance testing, indexing strategy, monitoring
   - **Probability:** Medium
   - **Impact:** Medium

2. **User Training Required**
   - **Mitigation:** Documentation, training sessions, gradual rollout
   - **Probability:** High
   - **Impact:** Medium

### Low Risks

1. **Minor Data Inconsistencies**
   - **Mitigation:** Data validation, cleanup scripts
   - **Probability:** Low
   - **Impact:** Low

---

## TESTING PLAN

### Pre-Migration Testing

1. **Schema Validation**
   - Test schema creation in staging
   - Verify all constraints
   - Test foreign keys

2. **Migration Script Testing**
   - Run migration on test data
   - Validate data transformation
   - Test rollback procedures

3. **Application Testing**
   - Test with new schema
   - Verify API compatibility
   - Test UI components

### Post-Migration Testing

1. **Smoke Tests**
   - User login
   - Event creation
   - Score submission
   - Leaderboard display

2. **Integration Tests**
   - End-to-end workflows
   - Real-time subscriptions
   - File uploads

3. **Performance Tests**
   - Load testing
   - Stress testing
   - Database query performance

---

## TIMELINE

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Preparation | 3 days | None |
| Phase 2: Schema Migration | 1 day | Phase 1 |
| Phase 3: Data Migration | 2 days | Phase 2 |
| Phase 4: Validation | 2 days | Phase 3 |
| Phase 5: Application Migration | 3 days | Phase 4 |
| Phase 6: Cutover | 1 day | Phase 5 |
| Phase 7: Post-Cutover | 7 days | Phase 6 |

**Total Timeline:** 19 days (3 weeks)

---

## RESOURCES REQUIRED

### Personnel

- Database Administrator (1)
- Backend Developer (2)
- Frontend Developer (1)
- QA Engineer (1)
- DevOps Engineer (1)
- Project Manager (1)

### Infrastructure

- Staging environment
- Production environment
- Backup storage
- Monitoring tools

### Tools

- Database migration tools
- Testing frameworks
- Monitoring dashboards
- Communication tools

---

## SUCCESS CRITERIA

### Technical Success

- All data migrated without loss
- Zero data corruption
- All foreign keys valid
- All indexes created
- All functions working
- All views returning data

### Functional Success

- All API endpoints working
- All UI components functional
- Scoring calculations accurate
- Leaderboard generation working
- Real-time subscriptions active

### Performance Success

- Response times < 500ms
- Database queries optimized
- No memory leaks
- CPU usage < 70%
- Error rate < 0.1%

---

## COMMUNICATION PLAN

### Pre-Migration

- 2 weeks: Announcement to stakeholders
- 1 week: Detailed communication to users
- 3 days: Final reminder with downtime schedule

### During Migration

- Hourly status updates
- Emergency contact information
- Progress dashboard

### Post-Migration

- Completion announcement
- Training resources
- Support contact information
- Feedback collection

---

## APPENDICES

### Appendix A: Migration Scripts

See separate file: `database/migration-scripts.sql`

### Appendix B: Validation Queries

See separate file: `database/validation-queries.sql`

### Appendix C: Rollback Scripts

See separate file: `database/rollback-scripts.sql`

### Appendix D: Contact Information

- Database Admin: [Contact]
- Project Manager: [Contact]
- Emergency Contact: [Contact]

---

**END OF MIGRATION PLAN**
