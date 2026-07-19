# ADMIN CMS UI PLAN
## Skate Judging Platform Pro V2 - Admin Interface Design

**Date:** July 19, 2026  
**Version:** 2.0

---

## OVERVIEW

The Admin CMS is the central control panel for managing all aspects of the skate judging platform. It provides administrators with tools to configure organizations, manage events, oversee riders and judges, control branding, and monitor system performance.

**Key Principles:**
- Intuitive navigation with clear hierarchy
- Real-time data updates
- Comprehensive search and filtering
- Bulk operations for efficiency
- Role-based access control
- Responsive design for all devices

---

## LAYOUT STRUCTURE

### Main Layout
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Logo    |  Search    |  Notifications  |  User Menu        |  Theme Toggle │
├──────────┼─────────────┼─────────────────┼──────────────────┼───────────────┤
│          │                                                                     │
│  Sidebar  │                        Main Content Area                          │
│          │                                                                     │
│          │                                                                     │
│          │                                                                     │
│          │                                                                     │
└──────────┴─────────────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation
- Dashboard
- Organizations
- Events
- Riders
- Judges
- Operators
- Sponsors
- Branding
- Scoring
- Templates
- Users
- Roles
- Permissions
- Settings
- Reports
- Audit Logs

---

## DASHBOARD MODULE

### Dashboard Overview
**Purpose:** High-level view of system status and key metrics

**Components:**
- Statistics cards (total events, active riders, judges, organizations)
- Activity timeline (recent actions)
- Upcoming events calendar
- System health indicators
- Quick action buttons
- Performance charts

**Key Metrics:**
- Total events (active, upcoming, completed)
- Registered riders count
- Active judges
- System uptime
- API response time
- Database health

**Quick Actions:**
- Create new event
- Add new rider
- Assign judges
- Generate report
- System settings

---

## ORGANIZATIONS MODULE

### Organization List
**Purpose:** View and manage all organizations

**Features:**
- Table view with columns: Name, Slug, Status, Events, Riders, Created At
- Search by name or slug
- Filter by status (active/inactive)
- Sort by any column
- Bulk actions (activate/deactivate, delete)
- Pagination (20, 50, 100 per page)

**Actions:**
- View details
- Edit organization
- Delete organization
- View events
- View users

### Organization Details
**Purpose:** View and edit organization information

**Sections:**
- Basic Information (name, slug, description, logo)
- Contact Information (email, phone, address)
- Settings (JSON configuration editor)
- Statistics (events count, riders count, judges count)
- Activity Log
- Associated Users

**Form Fields:**
- Name (required)
- Slug (auto-generated, editable)
- Description (textarea)
- Logo URL (file upload)
- Website URL
- Contact Email
- Contact Phone
- Address fields
- Settings (JSON editor with validation)

---

## EVENTS MODULE

### Event List
**Purpose:** View and manage all events

**Features:**
- Table view with columns: Name, Type, Status, Date, Venue, Riders, Created At
- Search by name
- Filter by status, type, date range, organization
- Sort by any column
- Bulk actions (publish, unpublish, delete)
- Calendar view
- Kanban view (by status)

**Status Badges:**
- Draft (gray)
- Published (blue)
- Registration Open (green)
- Registration Closed (orange)
- In Progress (purple)
- Completed (green)
- Cancelled (red)

### Event Details
**Purpose:** Comprehensive event management

**Tabs:**
1. **Overview**
   - Event information
   - Status indicator
   - Quick actions
   - Timeline view

2. **Configuration**
   - Basic settings
   - Scoring configuration
   - Run configuration
   - Best trick configuration
   - Timer configuration

3. **Rounds & Heats**
   - Round management
   - Heat management
   - Heat assignments
   - Schedule view

4. **Riders**
   - Registered riders list
   - Registration management
   - Heat assignments
   - Rider statistics

5. **Judges**
   - Assigned judges
   - Judge assignments
   - Judge performance
   - Assignment management

6. **Operators**
   - Assigned operators
   - Operator assignments
   - Role management

7. **Sponsors**
   - Event sponsors
   - Sponsor management
   - Contract information

8. **Branding**
   - Brand configuration
   - Logo upload
   - Color scheme
   - Theme selection

9. **Scoring**
   - Scoring settings
   - Score formulas
   - Judge weights
   - Tie-breaker rules

10. **Results**
    - Leaderboard
    - Final results
    - Score breakdown
    - Export options

11. **Settings**
    - Event settings
    - Display settings
    - OBS settings
    - Notification settings

### Event Creation Wizard
**Purpose:** Step-by-step event creation

**Steps:**
1. Basic Information (name, type, dates, venue)
2. Template Selection (choose from templates or custom)
3. Scoring Configuration (method, judges, rules)
4. Registration Settings (open/close dates, limits, fees)
5. Branding (logo, colors, theme)
6. Review & Confirm

---

## RIDERS MODULE

### Rider List
**Purpose:** View and manage all riders

**Features:**
- Table view with columns: Name, Nationality, Team, Status, Events, Wins, Created At
- Search by name or team
- Filter by nationality, status, professional status
- Sort by any column
- Bulk actions (activate/deactivate, delete, export)
- Card view with rider photos
- Statistics view

### Rider Details
**Purpose:** Comprehensive rider management

**Sections:**
- Profile Information (name, nationality, stance, team)
- Profile Image (upload/crop)
- Statistics (ranking, points, wins, podiums)
- Competition History (events, results)
- Best Tricks
- Achievements
- Equipment
- Social Media Links
- Activity Log

### Rider Registration
**Purpose:** Register riders for events

**Features:**
- Event selection
- Category/division selection
- Registration number assignment
- Payment status tracking
- Confirmation management
- Bulk registration
- Import from CSV

---

## JUDGES MODULE

### Judge List
**Purpose:** View and manage all judges

**Features:**
- Table view with columns: Name, Certification, Experience, Status, Events, Created At
- Search by name
- Filter by certification, status, experience
- Sort by any column
- Bulk actions (activate/deactivate, delete)
- Card view with judge photos

### Judge Details
**Purpose:** Comprehensive judge management

**Sections:**
- Profile Information (name, certification, experience)
- Profile Image (upload/crop)
- Specialties (street, park, technical, style)
- Certification Details
- Event Assignments
- Performance Statistics
- Activity Log

### Judge Assignment
**Purpose:** Assign judges to events

**Features:**
- Event selection
- Judge selection
- Role assignment (head judge, judge, assistant)
- Weight configuration
- Availability checking
- Conflict detection
- Bulk assignment

---

## OPERATORS MODULE

### Operator List
**Purpose:** View and manage all operators

**Features:**
- Table view with columns: Name, Role, Status, Events, Created At
- Search by name
- Filter by role, status
- Sort by any column
- Bulk actions (activate/deactivate, delete)

### Operator Details
**Purpose:** Comprehensive operator management

**Sections:**
- Profile Information (name, role, certifications)
- Certifications
- Event Assignments
- Activity Log

### Operator Assignment
**Purpose:** Assign operators to events

**Features:**
- Event selection
- Operator selection
- Role assignment (head operator, operator, timer, scorer)
- Availability checking
- Bulk assignment

---

## SPONSORS MODULE

### Sponsor List
**Purpose:** View and manage all sponsors

**Features:**
- Table view with columns: Name, Tier, Status, Events, Created At
- Search by name
- Filter by tier, status
- Sort by any column
- Bulk actions (activate/deactivate, delete)
- Card view with sponsor logos

### Sponsor Details
**Purpose:** Comprehensive sponsor management

**Sections:**
- Basic Information (name, description, website)
- Logo (upload/crop)
- Contact Information
- Tier Information
- Event Sponsorships
- Contract Details
- Benefits Configuration
- Activity Log

### Event Sponsorship
**Purpose:** Manage sponsor relationships with events

**Features:**
- Event selection
- Sponsor selection
- Tier assignment (platinum, gold, silver, bronze, partner)
- Sponsorship level
- Contract value
- Benefits configuration
- Visibility settings

---

## BRANDING MODULE

### Branding Editor
**Purpose:** Configure event branding

**Sections:**
1. **Colors**
   - Primary color picker
   - Secondary color picker
   - Accent color picker
   - Background color picker
   - Text color picker
   - Preset color schemes

2. **Typography**
   - Font family selection
   - Font size configuration
   - Font weights
   - Custom font upload

3. **Logo & Banner**
   - Logo upload (drag & drop)
   - Logo positioning (top-left, top-center, top-right, etc.)
   - Banner upload
   - Favicon upload

4. **Lower Thirds**
   - Lower third template editor
   - Text configuration
   - Animation settings
   - Preview

5. **Winner Screen**
   - Winner screen template editor
   - Podium configuration
   - Celebration animations
   - Preview

6. **Animations**
   - Animation speed settings
   - Transition effects
   - Celebration effects
   - Preview

### Theme Management
**Purpose:** Create and manage themes

**Features:**
- Theme list (card view)
- Theme editor
- Theme preview
- Theme duplication
- Theme export/import
- Public/private themes

---

## SCORING MODULE

### Scoring Settings
**Purpose:** Configure scoring for events

**Sections:**
- Scoring Method Selection (overall impression, average, highest, lowest removed, weighted, custom)
- Judge Count Configuration
- Score Range (min, max, decimal places)
- Drop Lowest/Highest Toggle
- Judge Weights Configuration
- Score Formula Editor
- Tie-Breaker Configuration
- Replay Settings

### Score Formula Editor
**Purpose:** Create custom scoring formulas

**Features:**
- Formula builder (drag & drop)
- Variable selection
- Function library
- Formula validation
- Test with sample data
- Save as template
- Formula documentation

### Penalty Configuration
**Purpose:** Configure penalty system

**Features:**
- Penalty types (time violation, course violation, sportsmanship, equipment, other)
- Penalty values
- Penalty descriptions
- Appeal configuration
- Penalty application rules

---

## TEMPLATES MODULE

### Template List
**Purpose:** View and manage competition templates

**Features:**
- Card view with template previews
- Filter by format type (SLS, Olympic, Best Trick, Jam, Game of Skate, Custom)
- Search by name
- Sort by name, created date
- Quick actions (duplicate, edit, delete)
- Public/private indicator

### Template Builder
**Purpose:** Create custom competition templates

**Sections:**
1. **Basic Information**
   - Name
   - Description
   - Format type
   - Public/private toggle

2. **Scoring Configuration**
   - Scoring method
   - Judge count
   - Score range
   - Formula selection

3. **Run Configuration**
   - Run enabled toggle
   - Number of runs
   - Run duration
   - Run rules

4. **Best Trick Configuration**
   - Attempts count
   - Top score count
   - Retry allowed
   - Time limit

5. **Jam Configuration**
   - Duration
   - Riders per heat
   - Jam rules

6. **Timer Configuration**
   - Countdown enabled
   - Countdown seconds
   - Clock visible

7. **Display Configuration**
   - Show clock
   - Show countdown
   - Show scores
   - Show rankings
   - Show next rider

### Template Preview
**Purpose:** Preview template configuration

**Features:**
- Live preview of settings
- Test with sample data
- Export configuration
- Share template

---

## USERS MODULE

### User List
**Purpose:** View and manage all users

**Features:**
- Table view with columns: Name, Email, Roles, Status, Last Login, Created At
- Search by name or email
- Filter by role, status, organization
- Sort by any column
- Bulk actions (activate/deactivate, delete, assign roles)
- User statistics

### User Details
**Purpose:** Comprehensive user management

**Sections:**
- Profile Information (name, email, avatar)
- Account Status (active, verified, locked)
- Roles & Permissions
- Login History
- Failed Login Attempts
- Activity Log
- Preferences

### User Creation
**Purpose:** Create new user accounts

**Features:**
- User information form
- Role assignment
- Organization assignment
- Password generation
- Welcome email
- Bulk user creation
- Import from CSV

### Role Assignment
**Purpose:** Manage user roles

**Features:**
- Role selection (multi-select)
- Role expiration date
- Assignment notes
- Bulk role assignment
- Role history

---

## ROLES MODULE

### Role List
**Purpose:** View and manage all roles

**Features:**
- Table view with columns: Name, Slug, System, Users, Created At
- Filter by system/custom
- Search by name
- Sort by any column
- Bulk actions (delete)
- System role indicator

### Role Details
**Purpose:** Comprehensive role management

**Sections:**
- Basic Information (name, slug, description)
- Permissions (tree view with checkboxes)
- Assigned Users
- Activity Log

### Role Creation
**Purpose:** Create custom roles

**Features:**
- Role information form
- Permission tree selection
- Role duplication
- Role export/import

---

## PERMISSIONS MODULE

### Permission List
**Purpose:** View all permissions

**Features:**
- Grouped by resource (organizations, users, events, etc.)
- Permission tree view
- Search by name or slug
- Filter by resource
- Permission descriptions

### Permission Assignment
**Purpose:** Assign permissions to roles

**Features:**
- Permission tree with checkboxes
- Bulk selection
- Inherited permissions
- Permission descriptions

---

## SETTINGS MODULE

### Organization Settings
**Purpose:** Configure organization-level settings

**Sections:**
- Basic Information
- Contact Information
- Branding
- Feature Flags
- Integration Settings
- API Keys

### System Settings
**Purpose:** Configure system-wide settings (admin only)

**Sections:**
- Application Settings (name, version, environment)
- Maintenance Mode
- Upload Settings (max file size, allowed types)
- Session Settings (timeout, security)
- Email Configuration
- SMS Configuration
- Security Settings
- Rate Limiting

### Notification Settings
**Purpose:** Configure notification preferences

**Sections:**
- Email Notifications
- SMS Notifications
- Push Notifications
- In-App Notifications
- Notification Templates

### Security Settings
**Purpose:** Configure security options

**Sections:**
- Password Policy
- Two-Factor Authentication
- Session Management
- IP Whitelist
- Audit Logging
- Security Headers

### Integration Settings
**Purpose:** Configure third-party integrations

**Sections:**
- OBS Integration
- Streaming Services
- Social Media
- Payment Gateways
- Analytics Services

---

## REPORTS MODULE

### Report Generator
**Purpose:** Generate various reports

**Report Types:**
- Event Reports (summary, detailed, participant list)
- Rider Reports (performance, history, statistics)
- Judge Reports (performance, assignments, consistency)
- Score Reports (detailed, breakdown, analysis)
- Financial Reports (revenue, expenses, sponsorships)
- System Reports (usage, performance, errors)

### Report Viewer
**Purpose:** View and export reports

**Features:**
- Report preview
- Filter options
- Sort options
- Export formats (PDF, Excel, CSV, JSON)
- Schedule reports
- Email reports

### Report Templates
**Purpose:** Create custom report templates

**Features:**
- Template builder
- Field selection
- Filter configuration
- Sort configuration
- Grouping options
- Chart configuration
- Save as template

---

## AUDIT LOGS MODULE

### Audit Log Viewer
**Purpose:** View system audit logs

**Features:**
- Table view with columns: Timestamp, User, Action, Resource, Details
- Search by user, action, resource
- Filter by date range, organization, resource type
- Sort by timestamp
- Pagination
- Export logs
- Log details modal

### Activity Logs
**Purpose:** View user activity logs

**Features:**
- Timeline view
- Filter by user, event, activity type
- Search functionality
- Export logs

---

## COMMON UI COMPONENTS

### Data Tables
- Sortable columns
- Filterable columns
- Search functionality
- Pagination
- Bulk selection
- Row actions menu
- Export functionality
- Column visibility toggle

### Forms
- Validation
- Auto-save
- Field dependencies
- Conditional fields
- File upload
- Rich text editor
- JSON editor
- Date/time pickers
- Color pickers

### Modals
- Confirmation dialogs
- Form modals
- Detail modals
- Preview modals
- Full-screen modals

### Notifications
- Toast notifications
- In-app notifications
- Notification center
- Notification preferences

### Loading States
- Skeleton screens
- Progress indicators
- Loading spinners
- Empty states

---

## RESPONSIVE DESIGN

### Desktop (1920px+)
- Full sidebar
- Multi-column layouts
- Expanded data tables
- Rich visualizations

### Tablet (768px - 1920px)
- Collapsible sidebar
- Responsive tables
- Stacked layouts
- Touch-friendly controls

### Mobile (< 768px)
- Bottom navigation
- Card-based layouts
- Simplified tables
- Swipe gestures
- Optimized forms

---

## ACCESSIBILITY

### WCAG 2.1 AA Compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Focus indicators
- ARIA labels
- Alt text for images
- Skip to content links

---

## PERFORMANCE

### Optimization Strategies
- Lazy loading for large lists
- Virtual scrolling for tables
- Image optimization
- Code splitting
- Caching strategies
- Debounced search
- Optimistic updates

---

## SECURITY

### Security Features
- Role-based access control
- Permission checks on all actions
- Audit logging for sensitive operations
- Session timeout
- CSRF protection
- XSS prevention
- Input validation
- Output encoding

---

## THEME SYSTEM

### Theme Options
- Light theme
- Dark theme
- High contrast theme
- Custom organization themes
- Event-specific themes

### Theme Customization
- Color scheme
- Typography
- Spacing
- Border radius
- Shadows
- Animations

---

## INTEGRATION POINTS

### Real-time Updates
- WebSocket connections
- Live data updates
- Notification subscriptions
- Collaboration features

### External Services
- OBS integration
- Streaming platforms
- Payment gateways
- Email services
- SMS services
- Analytics platforms

---

## USER EXPERIENCE

### Onboarding
- Welcome tour
- Feature highlights
- Quick start guide
- Video tutorials
- Help documentation

### Help & Support
- Contextual help
- Tooltips
- Help center
- Support chat
- Contact form

---

**END OF ADMIN CMS UI PLAN**
