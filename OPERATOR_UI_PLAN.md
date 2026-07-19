# OPERATOR UI PLAN
## Skate Judging Platform Pro V2 - Operator Interface Design

**Date:** July 19, 2026  
**Version:** 2.0

---

## OVERVIEW

The Operator UI is designed for event operators to manage the flow of competition, control timing, coordinate riders, and oversee the overall event execution. It provides comprehensive controls for managing runs, heats, and rider queues with real-time synchronization.

**Key Principles:**
- Clear visual hierarchy
- One-click actions for common tasks
- Real-time status updates
- Comprehensive oversight
- Touch-friendly for tablets
- Emergency controls

---

## LAYOUT STRUCTURE

### Main Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Event Info  |  Round/Heat  |  Timer  |  Status  |  Announcements  |  Logout │
├──────────────┼──────────────┼────────┼─────────┼─────────────────┼─────────┤
│              │              │        │         │                 │         │
│   Rider      │   Timer      │        │   Run   │                 │         │
│   Queue      │   Control    │        │   Status│                 │         │
│              │              │        │         │                 │         │
│              │              │        │         │                 │         │
│              │              │        │         │                 │         │
│              │              │        │         │                 │         │
│              │              │        │         │                 │         │
│              │              │        │         │                 │         │
│              │              │        │         │                 │         │
│              │              │        │         │                 │         │
│              │              │        │         │                 │         │
└──────────────┴──────────────┴────────┴─────────┴─────────────────┴─────────┘
```

### Main Layout (Tablet)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Event  |  Round  |  Timer  |  Status  |  Announce  |  Menu  │  Logout │
├─────────┼─────────┼────────┼─────────┼────────────┼────────┼─────────┤
│                                                                     │         │
│                              Timer Control                            │         │
│                                                                     │         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │         │
│                              Rider Queue                             │         │
│                                                                     │         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │         │
│                              Run Status                              │         │
│                                                                     │         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## HEADER SECTION

### Event Information
**Purpose:** Display current event context

**Components:**
- Event name (clickable for details)
- Round/Heat indicator
- Heat status badge
- Time remaining in heat
- Event progress indicator

### Timer Display
**Purpose:** Show current timing status

**Components:**
- Countdown timer (large, prominent)
- Timer status (running, paused, stopped)
- Time elapsed
- Visual progress bar
- Audio indicator (sound on/off)

### Status Display
**Purpose:** Show overall event status

**Components:**
- Current rider indicator
- Run status
- Heat progress
- Judge status
- System status

### Announcements
**Purpose:** Quick access to announcements

**Components:**
- New announcement badge
- Quick announcement button
- Announcement count

---

## TIMER CONTROL PANEL

### Main Timer
**Purpose:** Primary countdown timer

**Components:**
- Large digital display (HH:MM:SS)
- Millisecond display (optional)
- Visual progress ring
- Color-coded status:
  - Green: Normal time
  - Yellow: Warning time
  - Red: Overtime
  - Blue: Paused

**Controls:**
- Start button (large, prominent)
- Pause button
- Stop button
- Reset button
- Add time button (+10s, +30s, +1m)
- Subtract time button (-10s, -30s, -1m)

### Timer Configuration
**Purpose:** Configure timer settings

**Components:**
- Preset durations (30s, 45s, 60s, 90s, 120s)
- Custom duration input
- Warning time setting
- Overtime setting
- Sound settings
- Countdown seconds setting

### Audio Controls
**Purpose:** Manage timer sounds

**Components:**
- Sound toggle
- Volume control
- Sound selection (beep, horn, whistle, custom)
- Warning sound setting
- End sound setting
- Overtime sound setting

---

## RIDER QUEUE PANEL

### Queue Display
**Purpose:** Show rider queue and status

**Components:**
- Current rider (highlighted, large)
- Next riders (list)
- Queue position indicators
- Rider information cards:
  - Rider photo
  - Rider name
  - Rider number
  - Team/sponsor
  - Current score
  - Status (ready, on deck, finished)

### Queue Management
**Purpose:** Manage rider queue

**Controls:**
- Move rider up
- Move rider down
- Remove rider
- Add rider
- Reorder queue (drag & drop)
- Swap riders
- Insert rider at position

### Queue Status
**Purpose:** Show queue progress

**Components:**
- Progress bar
- Riders completed
- Riders remaining
- Estimated completion time
- Average time per rider

### Rider Details Modal
**Purpose:** View detailed rider information

**Components:**
- Full rider profile
- Competition history
- Current heat performance
- Attempts summary
- Notes
- Actions (call rider, hold rider, remove rider)

---

## RUN STATUS PANEL

### Current Run Display
**Purpose:** Show current run information

**Components:**
- Current rider information
- Run number
- Run type (qualification, semi-final, final)
- Run status (waiting, in progress, completed)
- Run duration
- Trick count
- Line utilization (visual)

### Run Controls
**Purpose:** Control run execution

**Controls:**
- Start run button
- End run button
- Pause run button
- Abort run button
- Extend run button
- Call next rider button
- Hold rider button

### Attempt Tracking
**Purpose:** Track attempts within run

**Components:**
- Attempt counter
- Attempt list (with timestamps)
- Attempt status indicators
- Trick names
- Scores (if available)
- Landing rate

### Run Statistics
**Purpose:** Show run statistics

**Components:**
- Total tricks landed
- Total tricks attempted
- Landing rate
- Average score
- Best trick
- Line utilization percentage

---

## HEAT MANAGEMENT PANEL

### Heat Overview
**Purpose:** Show heat information and status

**Components:**
- Heat name/number
- Heat status
- Heat duration
- Riders in heat
- Riders completed
- Riders remaining
- Heat progress bar

### Heat Controls
**Purpose:** Manage heat execution

**Controls:**
- Start heat button
- Pause heat button
- End heat button
- Skip to next heat
- Extend heat
- Add rider to heat
- Remove rider from heat

### Heat Schedule
**Purpose:** Show heat schedule

**Components:**
- Heat timeline
- Scheduled times
- Actual times
- Delays
- Upcoming heats
- Previous heats

---

## ROUND MANAGEMENT PANEL

### Round Overview
**Purpose:** Show round information and status

**Components:**
- Round name/number
- Round type (qualification, semi-final, final)
- Round status
- Heats in round
- Heats completed
- Heats remaining
- Round progress bar

### Round Controls
**Purpose:** Manage round execution

**Controls:**
- Start round button
- Pause round button
- End round button
- Skip to next round
- Add heat
- Remove heat

### Advancement
**Purpose:** Manage rider advancement

**Components:**
- Advancement rules display
- Qualified riders list
- Eliminated riders list
- Advancement status
- Manual override options

---

## ANNOUNCEMENTS PANEL

### Announcement Creation
**Purpose:** Create and send announcements

**Components:**
- Announcement type selector (general, schedule change, weather, emergency, result)
- Priority selector (low, normal, high, urgent)
- Title input
- Content textarea
- Target audience selector (all, judges, riders, public)
- Send button
- Schedule button (for future announcements)

### Announcement History
**Purpose:** View sent announcements

**Components:**
- List of announcements
- Timestamp
- Type indicator
- Priority indicator
- Status (sent, scheduled, delivered)
- View details button

### Quick Announcements
**Purpose:** Pre-defined quick announcements

**Components:**
- "Rider called to start"
- "Time warning"
- "Time expired"
- "Run completed"
- "Heat completed"
- "Custom quick messages"

---

## PENALTY MANAGEMENT

### Penalty Assignment
**Purpose:** Assign penalties to riders

**Components:**
- Rider selector
- Penalty type selector (time violation, course violation, sportsmanship, equipment, other)
- Penalty value input
- Description textarea
- Apply button

### Penalty History
**Purpose:** View assigned penalties

**Components:**
- List of penalties
- Rider name
- Penalty type
- Penalty value
- Status (applied, appealed, rejected)
- Appeal button

### Appeal Management
**Purpose:** Handle penalty appeals

**Components:**
- Appeal details
- Appeal notes
- Approve button
- Reject button
- Modify penalty button

---

## SCORE OVERSIGHT

### Score Monitoring
**Purpose:** Monitor scores in real-time

**Components:**
- Live leaderboard
- Current scores
- Judge scores comparison
- Score consistency indicator
- Outlier detection

### Score Status
**Purpose:** Show scoring status

**Components:**
- Judges status (ready, scoring, waiting)
- Scores submitted count
- Scores pending count
- Average time to score
- Scoring progress

### Score Actions
**Purpose:** Manage scoring process

**Controls:**
- Request judge attention
- Remind judges
- Lock scores
- Unlock scores
- Override scores (head judge only)

---

## DISPLAY CONTROL

### Display Settings
**Purpose:** Control display screens

**Components:**
- Display selector (TV, LED, Projector, Mobile, Web)
- Show/hide elements:
  - Clock
  - Countdown
  - Scores
  - Rankings
  - Next rider
  - Sponsor logos
- Layout selector
- Theme selector

### OBS Control
**Purpose:** Control OBS overlays

**Components:**
- Overlay selector
- Show/hide overlay
- Trigger lower third
- Trigger winner screen
- Update score overlay
- Update leaderboard overlay

---

## NOTIFICATIONS

### Operator Notifications
**Purpose:** Notify operator of important events

**Types:**
- Rider ready
- Time warning
- Time expired
- Run completed
- Heat completed
- Judge attention needed
- System alert
- Emergency

### Notification Center
**Purpose:** View and manage notifications

**Components:**
- Notification list
- Filter by type
- Mark as read
- Delete notifications
- Notification settings

---

## SETTINGS PANEL

### Operator Preferences
**Purpose:** Configure operator-specific settings

**Components:**
- Timer presets
- Quick announcements
- Display preferences
- Notification preferences
- Keyboard shortcuts
- Sound preferences

### Event Settings
**Purpose:** Configure event-specific settings

**Components:**
- Timer configuration
- Display configuration
- Announcement settings
- Penalty settings
- Scoring settings

---

## KEYBOARD SHORTCUTS

### Timer Shortcuts
- `Space`: Start/Pause timer
- `S`: Stop timer
- `R`: Reset timer
- `+`: Add 10 seconds
- `-`: Subtract 10 seconds
- `1-5`: Quick timer presets

### Queue Shortcuts
- `N`: Call next rider
- `H`: Hold current rider
- `D`: Remove rider
- `U`: Move rider up
- `D`: Move rider down

### Run Shortcuts
- `Enter`: Start run
- `Esc`: End run
- `P`: Pause run
- `A`: Abort run

### General Shortcuts
- `Tab`: Next section
- `Shift+Tab`: Previous section
- `F`: Search rider
- `A`: Create announcement
- `?`: Show shortcuts

---

## TOUCH GESTURES

### Tablet Gestures
- Swipe left: Next rider
- Swipe right: Previous rider
- Swipe up: Start timer
- Swipe down: Stop timer
- Double tap: Quick action
- Long press: Show options

---

## RESPONSIVE DESIGN

### Desktop (1920px+)
- Full four-panel layout
- Large timer display
- Expanded queue
- Rich visualizations

### Laptop (1024px - 1920px)
- Compact four-panel layout
- Medium timer display
- Collapsible sections
- Optimized spacing

### Tablet (768px - 1024px)
- Two-panel layout
- Vertical stacking
- Touch-optimized controls
- Simplified navigation

### Mobile (< 768px)
- Single panel layout
- Tab-based navigation
- Bottom action bar
- Simplified controls

---

## ACCESSIBILITY

### WCAG 2.1 AA Compliance
- Keyboard navigation for all controls
- Screen reader support
- High contrast mode
- Large touch targets (44px minimum)
- Focus indicators
- ARIA labels
- Alternative text for images

### Visual Accessibility
- Color-blind friendly palettes
- Adjustable font sizes
- High contrast themes
- Motion reduction option

---

## PERFORMANCE

### Optimization Strategies
- Real-time updates via WebSocket
- Local caching of rider data
- Optimized animations
- Debounced actions
- Offline queue management
- Lazy loading for history

---

## OFFLINE MODE

### Offline Capabilities
- Local rider database
- Cached event information
- Queue management offline
- Timer functionality offline
- Sync when connection restored

---

## INTEGRATION

### Real-time Sync
- WebSocket connection
- Live timer sync
- Queue updates
- Score updates
- Judge status updates

### OBS Integration
- Timer overlay updates
- Lower third triggers
- Score overlay updates
- Leaderboard updates
- Winner screen triggers

### Audio Integration
- Timer sounds
- Announcement audio
- Warning sounds
- Custom audio files

---

## ERROR HANDLING

### Error States
- Connection lost indicator
- Sync failure notification
- Timer sync error
- Queue sync error
- Submission failure

### Recovery
- Auto-reconnect
- Auto-sync restoration
- Local backup of state
- Conflict resolution
- Manual override options

---

## SECURITY

### Security Features
- Authentication required
- Role-based access
- Session timeout
- Audit logging
- Permission checks
- Emergency override codes

---

## THEME OPTIONS

### Light Theme
- Clean, modern design
- High contrast
- Professional appearance

### Dark Theme
- Reduced eye strain
- High contrast accents
- Professional appearance

### High Contrast Theme
- Maximum readability
- Large text
- Bold colors

---

## CUSTOMIZATION

### Operator Customization
- Timer presets
- Quick announcements
- Display preferences
- Keyboard shortcuts
- Sound preferences
- Layout preferences

### Event Customization
- Event branding
- Custom timer settings
- Custom display settings
- Event-specific announcements

---

## COLLABORATION

### Operator Collaboration
- Multi-operator support
- Role assignment
- Handoff capabilities
- Communication tools
- Status sharing

---

## EMERGENCY CONTROLS

### Emergency Features
- Emergency stop button (always visible)
- Emergency announcement
- Emergency pause
- Emergency reset
- Emergency override
- Emergency contact

### Emergency Protocols
- Clear visual indicators
- Confirmation dialogs
- Audit logging
- Notification to all operators
- Automatic system alerts

---

## ANALYTICS

### Operator Analytics
- Timer accuracy
- Queue efficiency
- Run completion rate
- Average time per rider
- Delays and causes
- Performance metrics

---

## SUPPORT

### Help Features
- Contextual help
- Operator guidelines
- Timer reference
- Video tutorials
- Contact support

---

**END OF OPERATOR UI PLAN**
