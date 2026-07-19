# TESTING PLAN
## Skate Judging Platform Pro V2 - Comprehensive Testing Strategy

**Date:** July 19, 2026  
**Version:** 2.0

---

## OVERVIEW

This testing plan outlines the comprehensive testing strategy for the Skate Judging Platform Pro V2. It covers unit testing, integration testing, end-to-end testing, performance testing, security testing, and user acceptance testing.

**Testing Philosophy:** Shift-left testing, automated where possible, manual for UX  
**Test Coverage Target:** 80% code coverage  
**Automation Target:** 70% of tests automated

---

## TESTING TYPES

### Unit Testing
**Purpose:** Test individual components and functions in isolation

**Scope:**
- Business logic functions
- Utility functions
- Data transformations
- Validation functions
- Scoring calculations

**Tools:**
- Jest (JavaScript/TypeScript)
- Vitest (Vite projects)
- React Testing Library (React components)

**Coverage Goals:**
- Lines: 80%
- Branches: 75%
- Functions: 80%
- Statements: 80%

### Integration Testing
**Purpose:** Test interactions between components and services

**Scope:**
- API endpoints
- Database operations
- External service integrations
- Component interactions
- State management

**Tools:**
- Jest
- Supertest (API testing)
- Testcontainers (database testing)
- MSW (API mocking)

### End-to-End Testing
**Purpose:** Test complete user flows from start to finish

**Scope:**
- User registration and login
- Event creation and management
- Rider registration
- Judge scoring workflow
- Operator workflow
- Leaderboard display
- Real-time updates

**Tools:**
- Playwright
- Cypress
- Puppeteer

### Performance Testing
**Purpose:** Test system performance under load

**Scope:**
- API response times
- Database query performance
- Page load times
- Real-time subscription performance
- Concurrent user handling

**Tools:**
- k6
- Lighthouse
- WebPageTest
- Apache JMeter

### Security Testing
**Purpose:** Identify security vulnerabilities

**Scope:**
- Authentication and authorization
- SQL injection
- XSS vulnerabilities
- CSRF protection
- Rate limiting
- Data encryption

**Tools:**
- OWASP ZAP
- Burp Suite
- Snyk
- SonarQube

### Accessibility Testing
**Purpose:** Ensure accessibility compliance

**Scope:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

**Tools:**
- axe DevTools
- WAVE
- Lighthouse
- Screen readers (NVDA, JAWS)

### User Acceptance Testing
**Purpose:** Validate system meets user requirements

**Scope:**
- Admin CMS workflows
- Judge interface usability
- Operator interface usability
- Display interface clarity
- Public interface engagement

**Participants:**
- Admin users
- Judges
- Operators
- Spectators

---

## UNIT TESTING STRATEGY

### Scoring Module Tests

#### Trick Score Calculation
```typescript
describe('calculateTrickScore', () => {
  it('should calculate score for single trick', () => {
    const trick = { difficulty: 5, modifiers: { execution: 1.0, style: 1.0 } };
    const score = calculateTrickScore(trick);
    expect(score).toBeCloseTo(5.0);
  });

  it('should apply execution modifier correctly', () => {
    const trick = { difficulty: 5, modifiers: { execution: 1.2, style: 1.0 } };
    const score = calculateTrickScore(trick);
    expect(score).toBeCloseTo(6.0);
  });

  it('should handle max modifier values', () => {
    const trick = { difficulty: 5, modifiers: { execution: 1.2, style: 1.1, amplitude: 1.3 } };
    const score = calculateTrickScore(trick);
    expect(score).toBeCloseTo(7.15);
  });

  it('should handle min modifier values', () => {
    const trick = { difficulty: 5, modifiers: { execution: 0.8, style: 0.8, landing: 0.7 } };
    const score = calculateTrickScore(trick);
    expect(score).toBeCloseTo(2.8);
  });
});
```

#### Combo Score Calculation
```typescript
describe('calculateComboScore', () => {
  it('should calculate 2-trick combo with 1.2 multiplier', () => {
    const trickScores = [5.0, 4.5];
    const score = calculateComboScore(trickScores);
    expect(score).toBeCloseTo(11.4); // (5 + 4.5) * 1.2
  });

  it('should calculate 3-trick combo with 1.35 multiplier', () => {
    const trickScores = [5.0, 4.5, 4.0];
    const score = calculateComboScore(trickScores);
    expect(score).toBeCloseTo(18.225); // (5 + 4.5 + 4) * 1.35
  });

  it('should calculate 5-trick combo with 1.7 multiplier', () => {
    const trickScores = [5.0, 4.5, 4.0, 3.5, 3.0];
    const score = calculateComboScore(trickScores);
    expect(score).toBeCloseTo(34.0); // (5 + 4.5 + 4 + 3.5 + 3) * 1.7
  });
});
```

#### Normalization Tests
```typescript
describe('normalizeScore', () => {
  it('should normalize score to SLS 9.9 scale', () => {
    const rawScore = 15;
    const normalized = normalizeScore(rawScore);
    expect(normalized).toBeCloseTo(9.9);
  });

  it('should handle zero score', () => {
    const rawScore = 0;
    const normalized = normalizeScore(rawScore);
    expect(normalized).toBe(0);
  });

  it('should handle max score', () => {
    const rawScore = 15;
    const normalized = normalizeScore(rawScore);
    expect(normalized).toBeLessThanOrEqual(9.9);
  });
});
```

### API Module Tests

#### Authentication Tests
```typescript
describe('POST /auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.email).toBe('test@example.com');
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  it('should validate email format', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email', password: 'password123' });
    
    expect(response.status).toBe(400);
  });
});
```

#### Event API Tests
```typescript
describe('POST /events', () => {
  it('should create event with valid data', async () => {
    const eventData = {
      name: 'Test Event',
      event_type: 'street',
      start_date: '2024-08-15T09:00:00Z',
      end_date: '2024-08-17T18:00:00Z',
    };
    
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(eventData);
    
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('Test Event');
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/events')
      .send({ name: 'Test Event' });
    
    expect(response.status).toBe(401);
  });
});
```

### Component Tests

#### Button Component
```typescript
describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## INTEGRATION TESTING STRATEGY

### Database Integration Tests

#### User Creation Flow
```typescript
describe('User Creation Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should create user and assign role', async () => {
    const user = await createUser({
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
    });
    
    const role = await assignRole(user.id, 'admin');
    
    expect(user.id).toBeDefined();
    expect(role.role_id).toBeDefined();
    
    const userWithRoles = await getUserWithRoles(user.id);
    expect(userWithRoles.roles).toHaveLength(1);
  });
});
```

#### Event Creation Flow
```typescript
describe('Event Creation Integration', () => {
  it('should create event with rounds and heats', async () => {
    const event = await createEvent({
      name: 'Test Event',
      event_type: 'street',
      start_date: new Date('2024-08-15'),
      end_date: new Date('2024-08-17'),
    });
    
    const round = await createRound({
      event_id: event.id,
      name: 'Qualifiers',
      round_type: 'qualification',
    });
    
    const heat = await createHeat({
      round_id: round.id,
      name: 'Heat 1',
    });
    
    expect(event.id).toBeDefined();
    expect(round.event_id).toBe(event.id);
    expect(heat.round_id).toBe(round.id);
  });
});
```

### API Integration Tests

#### Scoring Flow
```typescript
describe('Scoring Flow Integration', () => {
  it('should submit attempt and calculate score', async () => {
    const attempt = {
      event_id: 'event-uuid',
      rider_id: 'rider-uuid',
      attempt_type: 'single_trick',
      raw_json: {
        type: 'single',
        trick: 'Kickflip',
        modifiers: {
          execution: 1.0,
          style: 1.0,
          amplitude: 1.0,
          landing: 1.0,
          risk: 1.0,
        },
      },
    };
    
    const response = await request(app)
      .post('/api/attempts')
      .set('Authorization', `Bearer ${token}`)
      .send(attempt);
    
    expect(response.status).toBe(201);
    expect(response.body.data.calculated_score).toBeGreaterThan(0);
  });
});
```

---

## END-TO-END TESTING STRATEGY

### User Registration Flow
```typescript
test('User registration flow', async ({ page }) => {
  await page.goto('https://skatejudging.com/register');
  
  await page.fill('[name="email"]', 'newuser@example.com');
  await page.fill('[name="password"]', 'SecurePassword123!');
  await page.fill('[name="first_name"]', 'John');
  await page.fill('[name="last_name"]', 'Doe');
  await page.click('[type="submit"]');
  
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('text=Welcome, John')).toBeVisible();
});
```

### Event Creation Flow
```typescript
test('Event creation flow', async ({ page }) => {
  // Login as admin
  await page.goto('https://admin.skatejudging.com/login');
  await page.fill('[name="email"]', 'admin@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('[type="submit"]');
  
  // Navigate to events
  await page.click('text=Events');
  await page.click('text=Create Event');
  
  // Fill event form
  await page.fill('[name="name"]', 'New Event');
  await page.selectOption('[name="event_type"]', 'street');
  await page.fill('[name="start_date"]', '2024-08-15');
  await page.fill('[name="end_date"]', '2024-08-17');
  await page.click('text=Create');
  
  // Verify event created
  await expect(page.locator('text=New Event')).toBeVisible();
});
```

### Judge Scoring Flow
```typescript
test('Judge scoring flow', async ({ page }) => {
  // Login as judge
  await page.goto('https://judge.skatejudging.com/login');
  await page.fill('[name="email"]', 'judge@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('[type="submit"]');
  
  // Select trick
  await page.click('[data-testid="trick-selector"]');
  await page.click('text=Kickflip');
  
  // Adjust modifiers
  await page.fill('[name="execution"]', '1.0');
  await page.fill('[name="style"]', '1.0');
  await page.fill('[name="amplitude"]', '1.0');
  await page.fill('[name="landing"]', '1.0');
  await page.fill('[name="risk"]', '1.0');
  
  // Submit score
  await page.click('text=Submit Score');
  
  // Verify score submitted
  await expect(page.locator('text=Score submitted')).toBeVisible();
});
```

---

## PERFORMANCE TESTING STRATEGY

### Load Testing

#### API Load Test
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
};

export default function () {
  let response = http.get('https://api.skatejudging.com/v2/events');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

#### WebSocket Load Test
```javascript
import ws from 'k6/ws';
import { check } from 'k6';

export default function () {
  const url = 'wss://api.skatejudging.com/v2/realtime';
  const response = ws.connect(url, {}, function (socket) {
    socket.on('open', () => {
      socket.send(JSON.stringify({
        action: 'subscribe',
        channels: ['event:test-event:scores'],
      }));
    });
    
    socket.on('message', (message) => {
      check(message, {
        'message received': (m) => m !== null,
      });
    });
    
    socket.setTimeout(() => {
      socket.close();
    }, 30000);
  });
}
```

### Performance Benchmarks

#### API Response Times
- GET /events: < 200ms
- GET /events/:id: < 300ms
- POST /attempts: < 500ms
- GET /events/:id/leaderboard: < 400ms
- WebSocket message: < 100ms

#### Page Load Times
- Home page: < 2s
- Event page: < 3s
- Leaderboard: < 1.5s
- Judge panel: < 2s

---

## SECURITY TESTING STRATEGY

### Authentication Security

#### SQL Injection Tests
```typescript
describe('SQL Injection Protection', () => {
  it('should prevent SQL injection in login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: "admin'--", 
        password: 'anything' 
      });
    
    expect(response.status).toBe(400);
  });
});
```

#### XSS Prevention Tests
```typescript
describe('XSS Prevention', () => {
  it('should sanitize user input', async () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: maliciousInput });
    
    expect(response.body.data.name).not.toContain('<script>');
  });
});
```

### Authorization Tests

#### Role-Based Access Control
```typescript
describe('RBAC', () => {
  it('should allow admin to create events', async () => {
    const adminToken = await loginAsAdmin();
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Event' });
    
    expect(response.status).toBe(201);
  });

  it('should deny regular user from creating events', async () => {
    const userToken = await loginAsUser();
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Test Event' });
    
    expect(response.status).toBe(403);
  });
});
```

---

## ACCESSIBILITY TESTING STRATEGY

### Automated Accessibility Tests

#### Axe DevTools Tests
```typescript
describe('Accessibility', () => {
  it('should have no axe violations', async () => {
    const page = await browser.newPage();
    await page.goto('https://skatejudging.com');
    
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
```

### Manual Accessibility Tests

#### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Escape key closes modals
- [ ] Enter/Space activates buttons

#### Screen Reader Tests
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Headings are properly nested
- [ ] ARIA labels are used where needed
- [ ] Dynamic content is announced

---

## USER ACCEPTANCE TESTING

### UAT Test Cases

#### Admin CMS
- [ ] Create organization
- [ ] Create event from template
- [ ] Assign judges to event
- [ ] Configure scoring settings
- [ ] Generate reports
- [ ] Manage users and roles

#### Judge Interface
- [ ] Login and select event
- [ ] Select trick from list
- [ ] Adjust modifiers
- [ ] Submit score
- [ ] View score history
- [ ] Request replay

#### Operator Interface
- [ ] Start/stop timer
- [ ] Manage rider queue
- [ ] Call next rider
- [ ] View run status
- [ ] Create announcements

#### Display Interface
- [ ] View leaderboard
- [ ] View scoreboard
- [ ] View timer
- [ ] View rider info
- [ ] Real-time updates

---

## TEST DATA MANAGEMENT

### Test Data Strategy
- **Unit Tests:** Mock data
- **Integration Tests:** Test database with seed data
- **E2E Tests:** Dedicated test environment with sample data
- **Performance Tests:** Synthetic data generation

### Data Cleanup
- After each test: Clean up created data
- After test suite: Reset database to initial state
- Before test run: Ensure clean state

---

## CONTINUOUS INTEGRATION

### CI Pipeline

#### GitHub Actions Workflow
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Test Execution
- **On every commit:** Unit tests, linter
- **On pull request:** Unit tests, integration tests, E2E tests
- **On merge to main:** Full test suite, performance tests, security tests

---

## TEST REPORTING

### Coverage Reports
- **Tool:** Jest coverage, Istanbul
- **Format:** HTML, JSON, LCOV
- **Threshold:** 80% minimum
- **Location:** Coverage directory

### Test Results
- **Tool:** Jest reporters, Allure
- **Format:** HTML, JSON, JUnit XML
- **Location:** Test results directory
- **Retention:** 30 days

### Performance Reports
- **Tool:** k6 reports, Lighthouse CI
- **Format:** HTML, JSON
- **Location:** Performance reports directory
- **Baseline:** Established from previous runs

---

## TEST ENVIRONMENTS

### Local Development
- **Purpose:** Fast feedback during development
- **Database:** Local PostgreSQL
- **Data:** Sample data
- **Execution:** On-demand

### CI/CD
- **Purpose:** Automated testing in pipeline
- **Database:** Testcontainers
- **Data:** Seed data
- **Execution:** On every commit/PR

### Staging
- **Purpose:** Pre-production validation
- **Database:** Staging PostgreSQL
- **Data:** Sample production-like data
- **Execution:** Before production deployment

### Production
- **Purpose:** Smoke tests only
- **Database:** Production PostgreSQL
- **Data:** Real data (read-only)
- **Execution:** After deployment

---

## BUG TRACKING

### Bug Reporting
- **Tool:** GitHub Issues, Jira
- **Template:** Bug report template with steps to reproduce
- **Priority:** Based on severity and impact
- **Assignment:** Automatic based on component

### Bug Triage
- **Frequency:** Daily
- **Participants:** QA team, developers
- **Criteria:** Reproducibility, severity, impact

---

## TEST MAINTENANCE

### Test Review
- **Frequency:** Monthly
- **Participants:** QA team, developers
- **Focus:** Flaky tests, outdated tests, missing coverage

### Test Updates
- **Update tests when features change
- **Remove obsolete tests
- **Add tests for new features
- **Refactor test code for maintainability

---

## SUCCESS CRITERIA

### Test Coverage
- [ ] 80% code coverage achieved
- [ ] All critical paths tested
- [ ] All API endpoints tested
- [ ] All user flows tested

### Test Quality
- [ ] No flaky tests
- [ ] Fast test execution (< 10 minutes for unit tests)
- [ ] Clear test documentation
- [ ] Maintained test suite

### Automation
- [ ] 70% of tests automated
- [ ] CI/CD pipeline integrated
- [ ] Automated test reporting
- [ ] Automated coverage reporting

---

**END OF TESTING PLAN**
