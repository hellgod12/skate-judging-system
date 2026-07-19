# COMPONENT STRUCTURE DESIGN
## Skate Judging Platform Pro v2 - React Components

**Date:** July 19, 2026  
**Version:** 2.0

---

## COMPONENT ARCHITECTURE

The component architecture follows a hierarchical structure with clear separation of concerns:

- **Base UI Components:** Reusable primitive components (buttons, inputs, etc.)
- **Feature Components:** Domain-specific components (scoring panels, leaderboards, etc.)
- **Layout Components:** Structural components (headers, sidebars, etc.)
- **Shared Components:** Cross-cutting components (error boundaries, loading states, etc.)

---

## BASE UI COMPONENTS (packages/ui/src/components)

### Button
```
button/
├── Button.tsx
├── Button.types.ts
├── Button.variants.ts
└── index.ts
```

**Props:** `variant`, `size`, `disabled`, `loading`, `icon`, `children`  
**Variants:** `primary`, `secondary`, `ghost`, `danger`, `success`  
**Sizes:** `sm`, `md`, `lg`, `xl`

### Input
```
input/
├── Input.tsx
├── Input.types.ts
├── Input.variants.ts
└── index.ts
```

**Props:** `type`, `placeholder`, `disabled`, `error`, `label`, `helperText`

### Select
```
select/
├── Select.tsx
├── Select.types.ts
├── SelectOption.tsx
└── index.ts
```

**Props:** `options`, `value`, `onChange`, `placeholder`, `disabled`, `searchable`

### Table
```
table/
├── Table.tsx
├── TableHeader.tsx
├── TableBody.tsx
├── TableRow.tsx
├── TableCell.tsx
├── Table.types.ts
└── index.ts
```

**Props:** `columns`, `data`, `sortable`, `selectable`, `pagination`

### Modal
```
modal/
├── Modal.tsx
├── ModalHeader.tsx
├── ModalBody.tsx
├── ModalFooter.tsx
├── Modal.types.ts
└── index.ts
```

**Props:** `isOpen`, `onClose`, `size`, `closeOnOverlayClick`, `closeOnEsc`

### Dropdown
```
dropdown/
├── Dropdown.tsx
├── DropdownMenu.tsx
├── DropdownItem.tsx
├── Dropdown.types.ts
└── index.ts
```

**Props:** `trigger`, `items`, `placement`, `offset`

### Tabs
```
tabs/
├── Tabs.tsx
├── TabList.tsx
├── Tab.tsx
├── TabPanel.tsx
├── Tabs.types.ts
└── index.ts
```

**Props:** `defaultValue`, `value`, `onChange`, `orientation`

### Card
```
card/
├── Card.tsx
├── CardHeader.tsx
├── CardBody.tsx
├── CardFooter.tsx
├── Card.types.ts
└── index.ts
```

**Props:** `variant`, `elevation`, `hoverable`

### Badge
```
badge/
├── Badge.tsx
├── Badge.types.ts
├── Badge.variants.ts
└── index.ts
```

**Props:** `variant`, `size`, `dot`, `count`

### Avatar
```
avatar/
├── Avatar.tsx
├── AvatarImage.tsx
├── AvatarFallback.tsx
├── Avatar.types.ts
└── index.ts
```

**Props:** `src`, `alt`, `size`, `fallback`

### Loading
```
loading/
├── Loading.tsx
├── Spinner.tsx
├── Skeleton.tsx
├── Loading.types.ts
└── index.ts
```

**Props:** `type`, `size`, `color`, `text`

### Slider
```
slider/
├── Slider.tsx
├── SliderTrack.tsx
├── SliderThumb.tsx
├── Slider.types.ts
└── index.ts
```

**Props:** `min`, `max`, `step`, `value`, `onChange`, `marks`

### Switch
```
switch/
├── Switch.tsx
├── Switch.types.ts
└── index.ts
```

**Props:** `checked`, `onChange`, `disabled`, `label`

### Checkbox
```
checkbox/
├── Checkbox.tsx
├── CheckboxGroup.tsx
├── Checkbox.types.ts
└── index.ts
```

**Props:** `checked`, `onChange`, `disabled`, `label`, `indeterminate`

### Radio
```
radio/
├── Radio.tsx
├── RadioGroup.tsx
├── Radio.types.ts
└── index.ts
```

**Props:** `value`, `onChange`, `disabled`, `label`

### DatePicker
```
date-picker/
├── DatePicker.tsx
├── DatePicker.types.ts
└── index.ts
```

**Props:** `value`, `onChange`, `disabled`, `minDate`, `maxDate`

### TimePicker
```
time-picker/
├── TimePicker.tsx
├── TimePicker.types.ts
└── index.ts
```

**Props:** `value`, `onChange`, `disabled`, `format`

### FileUpload
```
file-upload/
├── FileUpload.tsx
├── FileDropzone.tsx
├── FilePreview.tsx
├── FileUpload.types.ts
└── index.ts
```

**Props:** `accept`, `multiple`, `maxSize`, `onUpload`, `onRemove`

### RichText
```
rich-text/
├── RichText.tsx
├── RichTextToolbar.tsx
├── RichText.types.ts
└── index.ts
```

**Props:** `value`, `onChange`, `toolbar`, `plugins`

### ProgressBar
```
progress-bar/
├── ProgressBar.tsx
├── ProgressBar.types.ts
└── index.ts
```

**Props:** `value`, `max`, `color`, `animated`

### Tooltip
```
tooltip/
├── Tooltip.tsx
├── Tooltip.types.ts
└── index.ts
```

**Props:** `content`, `placement`, `delay`

### Alert
```
alert/
├── Alert.tsx
├── Alert.types.ts
├── Alert.variants.ts
└── index.ts
```

**Props:** `variant`, `title`, `description`, `closable`, `onClose`

### Toast
```
toast/
├── Toast.tsx
├── ToastContainer.tsx
├── Toast.types.ts
└── index.ts
```

**Props:** `type`, `message`, `duration`, `position`

---

## ADMIN COMPONENTS (apps/web/src/components/admin)

### Dashboard
```
dashboard/
├── Dashboard.tsx
├── DashboardStats.tsx
├── DashboardChart.tsx
├── RecentActivity.tsx
├── QuickActions.tsx
└── index.ts
```

**Features:** Statistics overview, activity charts, quick action buttons

### Organizations
```
organizations/
├── OrganizationList.tsx
├── OrganizationCard.tsx
├── OrganizationForm.tsx
├── OrganizationDetails.tsx
├── OrganizationSettings.tsx
└── index.ts
```

**Features:** List view, card view, create/edit forms, settings panel

### Events
```
events/
├── EventList.tsx
├── EventCard.tsx
├── EventForm.tsx
├── EventDetails.tsx
├── EventSchedule.tsx
├── EventStatus.tsx
├── EventSettings.tsx
└── index.ts
```

**Features:** Event management, scheduling, status tracking, configuration

### Riders
```
riders/
├── RiderList.tsx
├── RiderCard.tsx
├── RiderForm.tsx
├── RiderProfile.tsx
├── RiderStatistics.tsx
├── RiderHistory.tsx
└── index.ts
```

**Features:** Rider management, profiles, statistics, competition history

### Judges
```
judges/
├── JudgeList.tsx
├── JudgeCard.tsx
├── JudgeForm.tsx
├── JudgeProfile.tsx
├── JudgeAssignments.tsx
├── JudgePerformance.tsx
└── index.ts
```

**Features:** Judge management, assignments, performance tracking

### Operators
```
operators/
├── OperatorList.tsx
├── OperatorCard.tsx
├── OperatorForm.tsx
├── OperatorAssignments.tsx
└── index.ts
```

**Features:** Operator management, event assignments

### Sponsors
```
sponsors/
├── SponsorList.tsx
├── SponsorCard.tsx
├── SponsorForm.tsx
├── SponsorDetails.tsx
├── EventSponsors.tsx
└── index.ts
```

**Features:** Sponsor management, event sponsorships, contract management

### Branding
```
branding/
├── BrandingEditor.tsx
├── ColorPicker.tsx
├── FontSelector.tsx
├── LogoUploader.tsx
├── BannerUploader.tsx
├── ThemePreview.tsx
├── LowerThirdEditor.tsx
├── WinnerScreenEditor.tsx
└── index.ts
```

**Features:** Brand customization, theme editor, graphic design

### Scoring
```
scoring/
├── ScoringSettings.tsx
├── ScoringMethodSelector.tsx
├── JudgeWeightConfig.tsx
├── ScoreFormulaEditor.tsx
├── TieBreakerConfig.tsx
├── PenaltyConfig.tsx
└── index.ts
```

**Features:** Scoring configuration, formula editor, penalty system

### Templates
```
templates/
├── TemplateList.tsx
├── TemplateCard.tsx
├── TemplateForm.tsx
├── TemplateBuilder.tsx
├── TemplatePreview.tsx
├── SlsTemplate.tsx
├── OlympicTemplate.tsx
├── BestTrickTemplate.tsx
├── JamTemplate.tsx
├── GameOfSkateTemplate.tsx
└── index.ts
```

**Features:** Template management, visual builder, preview

### Users
```
users/
├── UserList.tsx
├── UserCard.tsx
├── UserForm.tsx
├── UserProfile.tsx
├── UserRoles.tsx
├── UserPermissions.tsx
└── index.ts
```

**Features:** User management, role assignment, permission configuration

### Roles
```
roles/
├── RoleList.tsx
├── RoleCard.tsx
├── RoleForm.tsx
├── RolePermissions.tsx
├── PermissionTree.tsx
└── index.ts
```

**Features:** Role management, permission assignment, permission tree

### Permissions
```
permissions/
├── PermissionList.tsx
├── PermissionGroup.tsx
├── PermissionChecker.tsx
└── index.ts
```

**Features:** Permission management, grouping, checking

### Settings
```
settings/
├── SettingsLayout.tsx
├── OrganizationSettings.tsx
├── SystemSettings.tsx
├── NotificationSettings.tsx
├── SecuritySettings.tsx
├── IntegrationSettings.tsx
└── index.ts
```

**Features:** Organization settings, system configuration, integrations

### Reports
```
reports/
├── ReportList.tsx
├── ReportGenerator.tsx
├── ReportViewer.tsx
├── EventReport.tsx
├── RiderReport.tsx
├── JudgeReport.tsx
├── ScoreReport.tsx
└── index.ts
```

**Features:** Report generation, viewing, export (PDF, Excel, CSV)

---

## JUDGE COMPONENTS (apps/web/src/components/judge)

### Scoring Panel
```
scoring-panel/
├── ScoringPanel.tsx
├── TrickSelector.tsx
├── ModifierSliders.tsx
├── ScoreDisplay.tsx
├── ScoreHistory.tsx
├── ScoreSubmit.tsx
└── index.ts
```

**Features:** Trick selection, modifier adjustment, score calculation, submission

### Combo Builder
```
combo-builder/
├── ComboBuilder.tsx
├── TrickSequence.tsx
├── ComboPreview.tsx
├── ComboMultiplier.tsx
├── ComboScore.tsx
└── index.ts
```

**Features:** Combo construction, sequence management, multiplier display

### Replay Viewer
```
replay-viewer/
├── ReplayViewer.tsx
├── VideoPlayer.tsx
├── ReplayControls.tsx
├── SlowMotion.tsx
├── FrameByFrame.tsx
└── index.ts
```

**Features:** Video playback, slow motion, frame-by-frame analysis

### Attempt History
```
attempt-history/
├── AttemptHistory.tsx
├── AttemptCard.tsx
├── AttemptDetails.tsx
├── AttemptFilter.tsx
└── index.ts
```

**Features:** Attempt listing, filtering, detailed view

### Judge Queue
```
judge-queue/
├── JudgeQueue.tsx
├── QueueItem.tsx
├── QueueStatus.tsx
├── QueueTimer.tsx
└── index.ts
```

**Features:** Scoring queue, status tracking, timer

---

## OPERATOR COMPONENTS (apps/web/src/components/operator)

### Run Manager
```
run-manager/
├── RunManager.tsx
├── RunList.tsx
├── RunCard.tsx
├── RunControls.tsx
├── RunStatus.tsx
└── index.ts
```

**Features:** Run management, controls, status display

### Timer Control
```
timer-control/
├── TimerControl.tsx
├── CountdownTimer.tsx
├── Stopwatch.tsx
├── TimerDisplay.tsx
├── TimerSettings.tsx
└── index.ts
```

**Features:** Countdown, stopwatch, display, configuration

### Heat Manager
```
heat-manager/
├── HeatManager.tsx
├── HeatList.tsx
├── HeatCard.tsx
├── HeatControls.tsx
├── HeatRiders.tsx
└── index.ts
```

**Features:** Heat management, rider assignment, controls

### Rider Queue
```
rider-queue/
├── RiderQueue.tsx
├── QueueItem.tsx
├── QueueControls.tsx
├── QueueReorder.tsx
└── index.ts
```

**Features:** Rider queue, ordering, controls

### Status Display
```
status-display/
├── StatusDisplay.tsx
├── EventStatus.tsx
├── RoundStatus.tsx
├── HeatStatus.tsx
├── RiderStatus.tsx
└── index.ts
```

**Features:** Multi-level status display, real-time updates

---

## DISPLAY COMPONENTS (apps/web/src/components/display)

### Leaderboard
```
leaderboard/
├── Leaderboard.tsx
├── LeaderboardRow.tsx
├── LeaderboardHeader.tsx
├── LeaderboardFooter.tsx
├── LeaderboardAnimation.tsx
└── index.ts
```

**Features:** Leaderboard display, animations, real-time updates

### Scoreboard
```
scoreboard/
├── Scoreboard.tsx
├── CurrentRider.tsx
├── ScoreDisplay.tsx
├── RankDisplay.tsx
├── ScoreAnimation.tsx
└── index.ts
```

**Features:** Score display, current rider, animations

### Timer
```
timer/
├── Timer.tsx
├── Countdown.tsx
├── Clock.tsx
├── TimerAnimation.tsx
└── index.ts
```

**Features:** Timer display, countdown, clock

### Rider Card
```
rider-card/
├── RiderCard.tsx
├── RiderAvatar.tsx
├── RiderInfo.tsx
├── RiderStats.tsx
└── index.ts
```

**Features:** Rider information, avatar, statistics

### Score Ticker
```
score-ticker/
├── ScoreTicker.tsx
├── TickerItem.tsx
├── TickerAnimation.tsx
└── index.ts
```

**Features:** Live score updates, scrolling ticker

### Animations
```
animations/
├── ScoreAnimation.tsx
├── RankAnimation.tsx
├── TransitionAnimation.tsx
├── CelebrationAnimation.tsx
└── index.ts
```

**Features:** Score reveal, rank changes, celebrations

---

## OBS COMPONENTS (apps/web/src/components/obs)

### Overlays
```
overlays/
├── Overlay.tsx
├── LeaderboardOverlay.tsx
├── ScoreOverlay.tsx
├── RiderInfoOverlay.tsx
├── TimerOverlay.tsx
└── index.ts
```

**Features:** Various OBS overlays, transparent backgrounds

### Lower Thirds
```
lower-thirds/
├── LowerThird.tsx
├── RiderLowerThird.tsx
├── ScoreLowerThird.tsx
├── SponsorLowerThird.tsx
└── index.ts
```

**Features:** Lower third graphics, animations

### Winner Screen
```
winner-screen/
├── WinnerScreen.tsx
├── PodiumDisplay.tsx
├── WinnerAnimation.tsx
├── Confetti.tsx
└── index.ts
```

**Features:** Winner announcement, podium, celebration

### Graphics
```
graphics/
├── Graphic.tsx
├── LogoGraphic.tsx
├── SponsorGraphic.tsx
├── BackgroundGraphic.tsx
└── index.ts
```

**Features:** Static graphics, logos, backgrounds

---

## PUBLIC COMPONENTS (apps/web/src/components/public)

### Event Card
```
event-card/
├── EventCard.tsx
├── EventImage.tsx
├── EventInfo.tsx
├── EventStatus.tsx
└── index.ts
```

**Features:** Event display, image, information, status

### Rider Profile
```
rider-profile/
├── RiderProfile.tsx
├── RiderHeader.tsx
├── RiderBio.tsx
├── RiderStats.tsx
├── RiderAchievements.tsx
└── index.ts
```

**Features:** Public rider profile, statistics, achievements

### Schedule
```
schedule/
├── Schedule.tsx
├── ScheduleDay.tsx
├── ScheduleEvent.tsx
├── ScheduleFilter.tsx
└── index.ts
```

**Features:** Event schedule, filtering, day view

### Results
```
results/
├── Results.tsx
├── ResultsTable.tsx
├── ResultsFilter.tsx
├── ResultsExport.tsx
└── index.ts
```

**Features:** Results display, filtering, export

### QR Code
```
qr-code/
├── QRCode.tsx
├── QRScanner.tsx
└── index.ts
```

**Features:** QR code generation, scanning

---

## LAYOUT COMPONENTS (apps/web/src/components/layout)

### Header
```
header/
├── Header.tsx
├── HeaderLogo.tsx
├── HeaderNavigation.tsx
├── HeaderUser.tsx
├── HeaderSearch.tsx
└── index.ts
```

**Features:** Logo, navigation, user menu, search

### Sidebar
```
sidebar/
├── Sidebar.tsx
├── SidebarItem.tsx
├── SidebarGroup.tsx
├── SidebarToggle.tsx
└── index.ts
```

**Features:** Navigation items, grouping, collapsible

### Footer
```
footer/
├── Footer.tsx
├── FooterLinks.tsx
├── FooterCopyright.tsx
├── FooterSocial.tsx
└── index.ts
```

**Features:** Links, copyright, social media

### Navigation
```
navigation/
├── Navigation.tsx
├── Breadcrumb.tsx
├── BreadcrumbItem.tsx
├── TabNavigation.tsx
└── index.ts
```

**Features:** Breadcrumbs, tabs, navigation

### Container
```
container/
├── Container.tsx
├── PageContainer.tsx
├── ContentContainer.tsx
└── index.ts
```

**Features:** Layout containers, responsive sizing

---

## SHARED COMPONENTS (apps/web/src/components/shared)

### Error Boundary
```
error-boundary/
├── ErrorBoundary.tsx
├── ErrorFallback.tsx
├── ErrorReport.tsx
└── index.ts
```

**Features:** Error catching, fallback UI, error reporting

### Loading Skeleton
```
loading-skeleton/
├── LoadingSkeleton.tsx
├── SkeletonCard.tsx
├── SkeletonTable.tsx
├── SkeletonText.tsx
└── index.ts
```

**Features:** Loading states, skeleton screens

### Empty State
```
empty-state/
├── EmptyState.tsx
├── EmptyStateIcon.tsx
├── EmptyStateAction.tsx
└── index.ts
```

**Features:** Empty state display, icons, actions

### Notification
```
notification/
├── Notification.tsx
├── NotificationContainer.tsx
├── NotificationItem.tsx
└── index.ts
```

**Features:** In-app notifications, toast messages

### Confirmation
```
confirmation/
├── Confirmation.tsx
├── ConfirmationDialog.tsx
└── index.ts
```

**Features:** Confirmation dialogs, destructive actions

### Search
```
search/
├── Search.tsx
├── SearchInput.tsx
├── SearchResults.tsx
├── SearchFilter.tsx
└── index.ts
```

**Features:** Search input, results display, filtering

### Filter
```
filter/
├── Filter.tsx
├── FilterPanel.tsx
├── FilterGroup.tsx
├── FilterItem.tsx
└── index.ts
```

**Features:** Filter panel, groups, items

### Sort
```
sort/
├── Sort.tsx
├── SortButton.tsx
├── SortMenu.tsx
└── index.ts
```

**Features:** Sort controls, menu, multi-column sorting

### Pagination
```
pagination/
├── Pagination.tsx
├── PaginationInfo.tsx
├── PaginationControls.tsx
└── index.ts
```

**Features:** Pagination controls, info display

---

## CUSTOM HOOKS (apps/web/src/lib/hooks)

### useAuth
```typescript
useAuth()
useAuthLogin()
useAuthLogout()
useAuthRegister()
```

### useRealtime
```typescript
useRealtime(channel)
useRealtimeSubscription(channel, callback)
```

### useApi
```typescript
useApi(endpoint)
useApiMutation(endpoint)
useApiQuery(endpoint)
```

### useForm
```typescript
useForm(schema)
useFormValidation()
```

### useTable
```typescript
useTable(columns, data)
useTableSort()
useTableFilter()
useTablePagination()
```

### useModal
```typescript
useModal()
useModalState()
```

### useTimer
```typescript
useTimer()
useCountdown()
useStopwatch()
```

### useScore
```typescript
useScore()
useScoreCalculation()
useScoreHistory()
```

### useLeaderboard
```typescript
useLeaderboard(eventId)
useLeaderboardRealtime(eventId)
```

### useEvent
```typescript
useEvent(eventId)
useEventStatus(eventId)
useEventSchedule(eventId)
```

### useRider
```typescript
useRider(riderId)
useRiderHistory(riderId)
useRiderStats(riderId)
```

### useJudge
```typescript
useJudge(judgeId)
useJudgeAssignments(judgeId)
useJudgeQueue(judgeId)
```

### useOperator
```typescript
useOperator(operatorId)
useOperatorControls(operatorId)
```

### useDisplay
```typescript
useDisplay(eventId)
useDisplaySettings(eventId)
useDisplayMode()
```

### useOBS
```typescript
useOBS(eventId)
useOBSSettings(eventId)
useOBSCanvas()
```

### useNotification
```typescript
useNotification()
useNotificationToast()
useNotificationInApp()
```

### usePermission
```typescript
usePermission(permission)
usePermissions()
useRolePermissions(role)
```

### useTheme
```typescript
useTheme()
useThemeToggle()
useThemeCustom()
```

### useMediaQuery
```typescript
useMediaQuery(query)
useBreakpoint(breakpoint)
useResponsive()
```

### useLocalStorage
```typescript
useLocalStorage(key, defaultValue)
useSessionStorage(key, defaultValue)
```

### useDebounce
```typescript
useDebounce(value, delay)
useThrottle(value, delay)
```

### useClipboard
```typescript
useClipboard()
useCopyToClipboard()
```

### useDownload
```typescript
useDownload()
useExportToCSV()
useExportToPDF()
```

---

## COMPONENT PATTERNS

### Compound Components
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableCell>Name</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Render Props
```typescript
<Modal>
  {({ isOpen, onClose }) => (
    <div>
      <button onClick={onClose}>Close</button>
      {isOpen && <Content />}
    </div>
  )}
</Modal>
```

### Higher-Order Components
```typescript
withAuth(Component)
withPermission(Component, permission)
withRealtime(Component, channel)
```

### Custom Hooks Pattern
```typescript
function useCustomHook() {
  const [state, setState] = useState()
  const [loading, setLoading] = useState(false)
  
  const action = useCallback(async () => {
    setLoading(true)
    try {
      // logic
    } finally {
      setLoading(false)
    }
  }, [])
  
  return { state, loading, action }
}
```

---

## COMPONENT TESTING

### Unit Tests
```typescript
describe('Button', () => {
  it('renders correctly', () => {})
  it('handles click events', () => {})
  it('shows loading state', () => {})
})
```

### Integration Tests
```typescript
describe('ScoringPanel', () => {
  it('calculates score correctly', () => {})
  it('submits to API', () => {})
  it('handles errors', () => {})
})
```

### E2E Tests
```typescript
describe('Event Flow', () => {
  it('creates event through UI', () => {})
  it('assigns judges', () => {})
  it('scores attempts', () => {})
})
```

---

## PERFORMANCE OPTIMIZATION

### Code Splitting
```typescript
const LazyComponent = lazy(() => import('./Component'))
```

### Memoization
```typescript
const MemoComponent = memo(Component)
```

### Virtualization
```typescript
<VirtualList items={data} itemHeight={50} />
```

### Lazy Loading
```typescript
const LazyImage = lazy(() => import('./LazyImage'))
```

---

## ACCESSIBILITY

### ARIA Attributes
```typescript
<button aria-label="Close" aria-describedby="close-help">
  Close
</button>
```

### Keyboard Navigation
```typescript
useKeyboardNavigation()
useFocusTrap()
```

### Screen Reader Support
```typescript
<ScreenReaderOnly>Hidden text</ScreenReaderOnly>
```

---

**END OF COMPONENT STRUCTURE**
