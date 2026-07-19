# JUDGE UI PLAN
## Skate Judging Platform Pro V2 - Judge Interface Design

**Date:** July 19, 2026  
**Version:** 2.0

---

## OVERVIEW

The Judge UI is designed for judges to efficiently score skating attempts in real-time. It provides an intuitive interface for selecting tricks, adjusting modifiers, viewing replays, and submitting scores with minimal friction.

**Key Principles:**
- Fast and efficient scoring workflow
- Clear visual feedback
- Real-time synchronization
- Replay integration
- Minimal cognitive load
- Touch-friendly for tablets

---

## LAYOUT STRUCTURE

### Main Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Event Info  |  Heat/Round  |  Timer  |  Rider Queue  |  My Status  |  Logout │
├──────────────┼──────────────┼────────┼───────────────┼────────────┼─────────┤
│              │              │        │               │            │         │
│   Rider      │   Scoring    │        │   Score       │            │         │
│   Info       │   Panel      │        │   History     │            │         │
│              │              │        │               │            │         │
│              │              │        │               │            │         │
│              │              │        │               │            │         │
│              │              │        │               │            │         │
│              │              │        │               │            │         │
│              │              │        │               │            │         │
│              │              │        │               │            │         │
│              │              │        │               │            │         │
│              │              │        │               │            │         │
└──────────────┴──────────────┴────────┴───────────────┴────────────┴─────────┘
```

### Main Layout (Tablet)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Event  |  Heat  |  Timer  |  Rider Queue  |  Status  │  Menu  │  Logout │
├─────────┼────────┼────────┼───────────────┼─────────┼────────┼─────────┤
│                                                                     │         │
│                              Rider Info                               │         │
│                                                                     │         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │         │
│                            Scoring Panel                            │         │
│                                                                     │         │
│                                                                     │         │
│                                                                     │         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │         │
│                            Score History                             │         │
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
- Event status badge
- Time remaining in heat

### Timer Display
**Purpose:** Show current timing status

**Components:**
- Countdown timer (large, prominent)
- Timer status (running, paused, stopped)
- Time elapsed
- Visual progress bar

### Rider Queue
**Purpose:** Show upcoming riders

**Components:**
- Current rider (highlighted)
- Next 3 riders
- Queue position indicator
- Tap to view full queue

### Judge Status
**Purpose:** Show judge's current status

**Components:**
- Status indicator (ready, scoring, waiting)
- Scores submitted count
- Pending scores count
- Connection status

---

## RIDER INFO PANEL

### Rider Card
**Purpose:** Display current rider information

**Components:**
- Rider photo (large, centered)
- Rider name (prominent)
- Rider nationality (flag)
- Rider team/sponsor
- Current rank/position
- Best trick so far
- Total score so far
- Attempt number indicator

### Rider Statistics
**Purpose:** Show rider's performance in current heat

**Components:**
- Attempts completed
- Attempts remaining
- Average score
- Best single trick
- Landing rate
- Consistency score

---

## SCORING PANEL

### Trick Selection
**Purpose:** Select the trick performed

**Components:**
- Searchable trick dropdown
- Category tabs (Flip, Grind, Slide, Manual, Aerial)
- Recent tricks (quick access)
- Favorite tricks (customizable)
- Trick difficulty indicator
- Stance indicator (regular/goofy/switch)

**Features:**
- Fuzzy search
- Keyboard shortcuts
- Voice search (optional)
- Trick preview (video/image)

### Modifier Sliders
**Purpose:** Adjust scoring modifiers

**Layout:** 5 vertical sliders arranged horizontally

**Sliders:**
1. **Execution** (0.8 - 1.2)
   - Cleanliness of trick execution
   - Visual feedback with color gradient
   - Real-time score impact display

2. **Style** (0.8 - 1.1)
   - Style and creativity
   - Visual feedback with color gradient
   - Real-time score impact display

3. **Amplitude** (0.8 - 1.3)
   - Height and power
   - Visual feedback with color gradient
   - Real-time score impact display

4. **Landing** (0.7 - 1.1)
   - Cleanliness of landing
   - Visual feedback with color gradient
   - Real-time score impact display

5. **Risk** (1.0 - 1.4)
   - Difficulty and risk factor
   - Visual feedback with color gradient
   - Real-time score impact display

**Features:**
- Touch-friendly sliders
- Keyboard shortcuts (1-5 for quick adjustment)
- Preset buttons (Low, Medium, High)
- Reset to default
- Modifier tooltips with descriptions

### Score Display
**Purpose:** Show calculated score in real-time

**Components:**
- Raw score (large, prominent)
- Normalized score (SLS scale)
- Score breakdown
- Comparison to average
- Score quality indicator (color-coded)

**Color Coding:**
- Green: Excellent (8.5+)
- Blue: Good (7.0-8.4)
- Yellow: Average (5.5-6.9)
- Orange: Below Average (4.0-5.4)
- Red: Poor (<4.0)

### Combo Builder
**Purpose:** Build combo attempts

**Components:**
- Trick sequence display
- Add trick button
- Remove trick button
- Reorder tricks (drag & drop)
- Combo multiplier display
- Combo flow score
- Total combo score

**Features:**
- Visual trick sequence
- Transition indicators
- Combo multiplier calculation
- Combo preview

### Notes Field
**Purpose:** Add notes to the score

**Components:**
- Text area for notes
- Quick note templates
- Voice-to-text (optional)
- Character limit indicator

### Submit Actions
**Purpose:** Submit or modify scores

**Components:**
- Submit button (primary action)
- Submit & Next button
- Request Replay button
- Modify Previous button
- Skip Attempt button

**States:**
- Normal: All buttons enabled
- Submitted: Show modification options
- Pending: Disable submit until complete
- Locked: Disable all (after deadline)

---

## SCORE HISTORY PANEL

### Attempt List
**Purpose:** Show rider's previous attempts

**Components:**
- List of attempts with:
  - Attempt number
  - Trick name
  - Score
  - Status (landed, bail, retry)
  - Timestamp
- Sort by attempt number or score
- Filter by status
- Tap to view details

### Attempt Details Modal
**Purpose:** View detailed attempt information

**Components:**
- Trick information
- Modifier values
- Score breakdown
- Notes
- Video replay
- Modify option (if allowed)

---

## REPLAY VIEWER

### Video Player
**Purpose:** Watch video replays for scoring

**Components:**
- Video player with controls
- Slow motion toggle
- Frame-by-frame navigation
- Playback speed control
- Bookmark frames
- Loop section
- Fullscreen mode

**Features:**
- Sync with scoring panel
- Mark timestamps
- Compare attempts
- Side-by-side comparison

---

## JUDGE QUEUE

### Queue View
**Purpose:** View full rider queue

**Components:**
- Full rider list
- Queue positions
- Estimated times
- Rider information cards
- Filter by status
- Search by name

### Queue Status
**Purpose:** Show queue progress

**Components:**
- Progress bar
- Riders completed
- Riders remaining
- Estimated completion time
- Queue position for current rider

---

## SETTINGS PANEL

### Judge Preferences
**Purpose:** Configure judge-specific settings

**Components:**
- Modifier presets
- Favorite tricks
- Quick note templates
- Notification preferences
- Display preferences
- Keyboard shortcuts

### Display Settings
**Purpose:** Configure display options

**Components:**
- Theme selection
- Font size
- Color scheme
- Layout preference
- Animation speed

---

## NOTIFICATIONS

### Score Notifications
**Purpose:** Notify of score-related events

**Types:**
- Score submitted confirmation
- Score modification request
- Replay available
- Deadline approaching
- Score locked

### System Notifications
**Purpose:** Notify of system events

**Types:**
- Connection status
- Sync status
- Error messages
- Maintenance notices

---

## KEYBOARD SHORTCUTS

### Scoring Shortcuts
- `1-5`: Adjust modifier sliders
- `S`: Submit score
- `N`: Submit & Next
- `R`: Request replay
- `M`: Modify previous
- `K`: Skip attempt
- `C`: Clear/reset
- `Space`: Play/pause video
- `←/→`: Navigate tricks
- `↑/↓`: Navigate attempts

### Navigation Shortcuts
- `Tab`: Next field
- `Shift+Tab`: Previous field
- `Enter`: Submit/confirm
- `Escape`: Cancel/close modal
- `F`: Search tricks
- `H`: View history
- `Q`: View queue
- `?`: Show shortcuts

---

## TOUCH GESTURES

### Tablet Gestures
- Swipe left/right: Navigate attempts
- Swipe up/down: Navigate tricks
- Double tap: Submit score
- Long press: Show options
- Pinch: Zoom video

---

## RESPONSIVE DESIGN

### Desktop (1920px+)
- Full three-panel layout
- Large video player
- Expanded trick list
- Rich visualizations

### Laptop (1024px - 1920px)
- Compact three-panel layout
- Medium video player
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
- Lazy loading for trick list
- Video preloading
- Optimized images
- Debounced search
- Local caching
- Offline support for critical features

---

## OFFLINE MODE

### Offline Capabilities
- Local trick database
- Cached rider information
- Queue scoring for sync
- Offline score calculation
- Sync when connection restored

---

## INTEGRATION

### Real-time Sync
- WebSocket connection
- Live score updates
- Judge score comparison
- Leaderboard updates
- Notification sync

### OBS Integration
- Score overlay updates
- Lower third triggers
- Winner screen triggers
- Replay cue points

---

## ERROR HANDLING

### Error States
- Connection lost indicator
- Sync failure notification
- Submit failure with retry
- Video load error
- Timeout handling

### Recovery
- Auto-reconnect
- Auto-retry submission
- Local backup of scores
- Conflict resolution

---

## SECURITY

### Security Features
- Authentication required
- Session timeout
- Score encryption
- Audit logging
- Permission checks
- IP restrictions (optional)

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

### Judge Customization
- Modifier presets
- Favorite tricks
- Quick notes
- Layout preferences
- Keyboard shortcuts
- Notification settings

### Event Customization
- Event branding
- Custom modifiers
- Custom scoring ranges
- Event-specific notes

---

## COLLABORATION

### Judge Collaboration
- Live score comparison
- Judge chat (optional)
- Score discussion
- Consensus building
- Head judge override

---

## TRAINING MODE

### Training Features
- Practice mode
- Score comparison with experts
- Training videos
- Scoring guidelines
- Performance feedback

---

## ANALYTICS

### Judge Analytics
- Scoring consistency
- Average score
- Score distribution
- Time to score
- Comparison to other judges
- Performance metrics

---

## SUPPORT

### Help Features
- Contextual help
- Scoring guidelines
- Trick reference
- Video tutorials
- Contact support

---

**END OF JUDGE UI PLAN**
