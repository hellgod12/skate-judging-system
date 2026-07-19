# FOLDER STRUCTURE DESIGN
## Skate Judging Platform Pro v2 - New Architecture

**Date:** July 19, 2026  
**Version:** 2.0

---

## ROOT STRUCTURE

```
skate-judging-platform-v2/
├── apps/                          # Application packages
│   ├── web/                       # Next.js web application
│   ├── admin/                     # Admin CMS (separate Next.js app)
│   ├── mobile/                    # React Native mobile app
│   └── api/                      # API gateway (Node.js/Express)
├── packages/                      # Shared packages
│   ├── database/                  # Database utilities and migrations
│   ├── auth/                      # Authentication & authorization
│   ├── scoring/                   # Scoring engine
│   ├── realtime/                  # Real-time subscriptions
│   ├── ui/                        # Shared UI components
│   ├── utils/                     # Shared utilities
│   ├── types/                     # TypeScript types
│   ├── config/                    # Configuration management
│   └── testing/                   # Testing utilities
├── services/                      # Microservices
│   ├── scoring-service/           # Scoring calculation service
│   ├── notification-service/     # Notification service
│   ├── media-service/            # Media processing service
│   └── analytics-service/        # Analytics service
├── infrastructure/                # Infrastructure as code
│   ├── docker/                    # Docker configurations
│   ├── kubernetes/               # Kubernetes manifests
│   ├── terraform/                 # Terraform configurations
│   └── ci-cd/                     # CI/CD pipelines
├── scripts/                       # Utility scripts
├── docs/                          # Documentation
├── database/                      # Database files
└── tools/                         # Development tools
```

---

## WEB APPLICATION STRUCTURE (apps/web)

```
apps/web/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── layout.tsx
│   │   ├── (admin)/               # Admin group
│   │   │   ├── dashboard/
│   │   │   ├── organizations/
│   │   │   ├── events/
│   │   │   ├── riders/
│   │   │   ├── judges/
│   │   │   ├── operators/
│   │   │   ├── sponsors/
│   │   │   ├── branding/
│   │   │   ├── scoring/
│   │   │   ├── templates/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   ├── permissions/
│   │   │   ├── settings/
│   │   │   ├── reports/
│   │   │   └── layout.tsx
│   │   ├── (judge)/               # Judge group
│   │   │   ├── dashboard/
│   │   │   ├── scoring/
│   │   │   ├── attempts/
│   │   │   ├── replays/
│   │   │   └── layout.tsx
│   │   ├── (operator)/            # Operator group
│   │   │   ├── dashboard/
│   │   │   ├── runs/
│   │   │   ├── timer/
│   │   │   ├── heats/
│   │   │   ├── riders/
│   │   │   └── layout.tsx
│   │   ├── (display)/             # Display group
│   │   │   ├── leaderboard/
│   │   │   ├── scoreboard/
│   │   │   ├── timer/
│   │   │   ├── rider-info/
│   │   │   └── layout.tsx
│   │   ├── (public)/              # Public group
│   │   │   ├── events/
│   │   │   ├── riders/
│   │   │   ├── results/
│   │   │   ├── schedule/
│   │   │   └── layout.tsx
│   │   ├── (obs)/                 # OBS group
│   │   │   ├── overlays/
│   │   │   ├── layouts/
│   │   │   ├── lower-thirds/
│   │   │   └── layout.tsx
│   │   ├── api/                   # API routes
│   │   │   ├── auth/
│   │   │   ├── organizations/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   ├── permissions/
│   │   │   ├── events/
│   │   │   ├── venues/
│   │   │   ├── templates/
│   │   │   ├── rounds/
│   │   │   ├── heats/
│   │   │   ├── categories/
│   │   │   ├── divisions/
│   │   │   ├── riders/
│   │   │   ├── judges/
│   │   │   ├── operators/
│   │   │   ├── sponsors/
│   │   │   ├── branding/
│   │   │   ├── tricks/
│   │   │   ├── attempts/
│   │   │   ├── runs/
│   │   │   ├── scores/
│   │   │   ├── leaderboards/
│   │   │   ├── results/
│   │   │   ├── penalties/
│   │   │   ├── announcements/
│   │   │   ├── notifications/
│   │   │   ├── display/
│   │   │   ├── obs/
│   │   │   ├── themes/
│   │   │   ├── settings/
│   │   │   ├── audit/
│   │   │   └── health/
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   ├── globals.css            # Global styles
│   │   └── error.tsx              # Error page
│   ├── components/                # React components
│   │   ├── ui/                    # Base UI components
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── select/
│   │   │   ├── table/
│   │   │   ├── modal/
│   │   │   ├── dropdown/
│   │   │   ├── tabs/
│   │   │   ├── card/
│   │   │   ├── badge/
│   │   │   ├── avatar/
│   │   │   ├── loading/
│   │   │   └── ...
│   │   ├── admin/                 # Admin components
│   │   │   ├── dashboard/
│   │   │   ├── organizations/
│   │   │   ├── events/
│   │   │   ├── riders/
│   │   │   ├── judges/
│   │   │   ├── operators/
│   │   │   ├── sponsors/
│   │   │   ├── branding/
│   │   │   ├── scoring/
│   │   │   ├── templates/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   ├── permissions/
│   │   │   ├── settings/
│   │   │   └── reports/
│   │   ├── judge/                 # Judge components
│   │   │   ├── scoring-panel/
│   │   │   ├── trick-selector/
│   │   │   ├── modifier-sliders/
│   │   │   ├── combo-builder/
│   │   │   ├── replay-viewer/
│   │   │   └── score-display/
│   │   ├── operator/              # Operator components
│   │   │   ├── run-manager/
│   │   │   ├── timer-control/
│   │   │   ├── heat-manager/
│   │   │   ├── rider-queue/
│   │   │   └── status-display/
│   │   ├── display/               # Display components
│   │   │   ├── leaderboard/
│   │   │   ├── scoreboard/
│   │   │   ├── timer/
│   │   │   ├── rider-card/
│   │   │   ├── score-ticker/
│   │   │   └── animations/
│   │   ├── obs/                   # OBS components
│   │   │   ├── overlays/
│   │   │   ├── lower-thirds/
│   │   │   ├── winner-screen/
│   │   │   └── graphics/
│   │   ├── public/                # Public components
│   │   │   ├── event-card/
│   │   │   ├── rider-profile/
│   │   │   ├── schedule/
│   │   │   ├── results/
│   │   │   └── qr-code/
│   │   ├── layout/                # Layout components
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   ├── footer/
│   │   │   ├── navigation/
│   │   │   └── breadcrumbs/
│   │   └── shared/                # Shared components
│   │       ├── error-boundary/
│   │       ├── loading-skeleton/
│   │       ├── empty-state/
│   │       └── notification/
│   ├── lib/                       # Library code
│   │   ├── auth/                  # Authentication utilities
│   │   ├── db/                    # Database utilities
│   │   ├── api/                   # API client
│   │   ├── realtime/              # Real-time subscriptions
│   │   ├── scoring/               # Scoring calculations
│   │   ├── validation/            # Validation schemas
│   │   ├── formatting/            # Formatting utilities
│   │   ├── hooks/                 # Custom React hooks
│   │   └── utils/                 # General utilities
│   ├── styles/                    # Styles
│   │   ├── globals.css
│   │   ├── themes/
│   │   └── components/
│   └── types/                     # TypeScript types
│       ├── api.ts
│       ├── models.ts
│       ├── components.ts
│       └── index.ts
├── public/                        # Static assets
│   ├── images/
│   ├── fonts/
│   ├── icons/
│   └── favicon.ico
├── tests/                         # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## ADMIN CMS STRUCTURE (apps/admin)

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── organizations/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   └── layout.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── layout.tsx
│   │   ├── riders/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── layout.tsx
│   │   ├── judges/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── layout.tsx
│   │   ├── operators/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── layout.tsx
│   │   ├── sponsors/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── layout.tsx
│   │   ├── branding/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   └── layout.tsx
│   │   ├── scoring/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── formulas/
│   │   │   └── layout.tsx
│   │   ├── templates/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── layout.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── layout.tsx
│   │   ├── roles/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── layout.tsx
│   │   ├── permissions/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   ├── organization/
│   │   │   ├── system/
│   │   │   └── layout.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── admin/
│   │   ├── forms/
│   │   ├── tables/
│   │   ├── charts/
│   │   └── layout/
│   ├── lib/
│   └── types/
├── public/
├── tests/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## SHARED PACKAGES STRUCTURE

### packages/database
```
packages/database/
├── src/
│   ├── client.ts                 # Database client
│   ├── migrations/              # Migration files
│   ├── seeds/                   # Seed files
│   ├── queries/                 # Database queries
│   └── schema.ts                # Schema definitions
├── package.json
└── tsconfig.json
```

### packages/auth
```
packages/auth/
├── src/
│   ├── index.ts
│   ├── session.ts
│   ├── middleware.ts
│   ├── permissions.ts
│   └── types.ts
├── package.json
└── tsconfig.json
```

### packages/scoring
```
packages/scoring/
├── src/
│   ├── index.ts
│   ├── calculations/
│   │   ├── trick-score.ts
│   │   ├── combo-score.ts
│   │   ├── run-score.ts
│   │   ├── best-trick-score.ts
│   │   └── final-score.ts
│   ├── formulas/
│   │   ├── sls.ts
│   │   ├── olympic.ts
│   │   └── custom.ts
│   ├── modifiers/
│   │   ├── execution.ts
│   │   ├── style.ts
│   │   ├── amplitude.ts
│   │   ├── landing.ts
│   │   └── risk.ts
│   └── types.ts
├── __tests__/
├── package.json
└── tsconfig.json
```

### packages/realtime
```
packages/realtime/
├── src/
│   ├── index.ts
│   ├── client.ts
│   ├── subscriptions/
│   │   ├── scores.ts
│   │   ├── leaderboards.ts
│   │   ├── runs.ts
│   │   └── announcements.ts
│   └── types.ts
├── package.json
└── tsconfig.json
```

### packages/ui
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   ├── input/
│   │   ├── select/
│   │   ├── table/
│   │   ├── modal/
│   │   ├── dropdown/
│   │   ├── tabs/
│   │   ├── card/
│   │   ├── badge/
│   │   ├── avatar/
│   │   ├── loading/
│   │   ├── slider/
│   │   ├── switch/
│   │   ├── checkbox/
│   │   ├── radio/
│   │   ├── date-picker/
│   │   ├── time-picker/
│   │   ├── file-upload/
│   │   ├── rich-text/
│   │   └── ...
│   ├── hooks/
│   │   ├── use-form.ts
│   │   ├── use-table.ts
│   │   ├── use-modal.ts
│   │   └── ...
│   ├── utils/
│   │   ├── cn.ts
│   │   └── ...
│   └── index.ts
├── package.json
└── tsconfig.json
```

### packages/utils
```
packages/utils/
├── src/
│   ├── index.ts
│   ├── format.ts
│   ├── date.ts
│   ├── number.ts
│   ├── string.ts
│   ├── validation.ts
│   ├── api.ts
│   └── storage.ts
├── package.json
└── tsconfig.json
```

### packages/types
```
packages/types/
├── src/
│   ├── index.ts
│   ├── api.ts
│   ├── models.ts
│   ├── components.ts
│   ├── database.ts
│   └── config.ts
├── package.json
└── tsconfig.json
```

### packages/config
```
packages/config/
├── src/
│   ├── index.ts
│   ├── env.ts
│   ├── constants.ts
│   ├── features.ts
│   └── validation.ts
├── package.json
└── tsconfig.json
```

---

## SERVICES STRUCTURE

### services/scoring-service
```
services/scoring-service/
├── src/
│   ├── index.ts
│   ├── handlers/
│   ├── calculators/
│   ├── validators/
│   └── types.ts
├── tests/
├── Dockerfile
├── package.json
└── tsconfig.json
```

### services/notification-service
```
services/notification-service/
├── src/
│   ├── index.ts
│   ├── handlers/
│   ├── channels/
│   │   ├── email/
│   │   ├── push/
│   │   └── in-app/
│   └── types.ts
├── tests/
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## DATABASE STRUCTURE

```
database/
├── schema-v1.sql                 # Original schema (for reference)
├── schema-v2.sql                 # New schema
├── seed-v2.sql                   # Seed data
├── migrations/                   # Migration files
│   ├── 001_initial_schema.sql
│   ├── 002_add_indexes.sql
│   ├── 003_add_functions.sql
│   └── ...
├── scripts/                      # Utility scripts
│   ├── backup.sh
│   ├── restore.sh
│   └── migrate.sh
└── docs/                         # Database documentation
    ├── schema.md
    ├── relationships.md
    └── queries.md
```

---

## INFRASTRUCTURE STRUCTURE

### infrastructure/docker
```
infrastructure/docker/
├── web/
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   └── .dockerignore
├── admin/
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   └── .dockerignore
├── postgres/
│   ├── Dockerfile
│   └── init.sql
├── redis/
│   └── Dockerfile
└── docker-compose.yml
```

### infrastructure/kubernetes
```
infrastructure/kubernetes/
├── web/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── configmap.yaml
├── admin/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── postgres/
│   ├── statefulset.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── redis/
│   ├── deployment.yaml
│   └── service.yaml
└── namespace.yaml
```

### infrastructure/ci-cd
```
infrastructure/ci-cd/
├── github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd.yml
│   │   └── test.yml
│   └── actions/
├── docker/
│   └── build-push.yml
└── kubernetes/
    └── deploy.yml
```

---

## DOCUMENTATION STRUCTURE

```
docs/
├── architecture/
│   ├── overview.md
│   ├── database.md
│   ├── api.md
│   └── security.md
├── guides/
│   ├── installation.md
│   ├── configuration.md
│   ├── deployment.md
│   └── development.md
├── api/
│   ├── authentication.md
│   ├── organizations.md
│   ├── events.md
│   ├── riders.md
│   ├── judges.md
│   └── ...
├── components/
│   ├── admin/
│   ├── judge/
│   ├── operator/
│   └── display/
├── contributing/
│   ├── guidelines.md
│   ├── code-of-conduct.md
│   └── pull-requests.md
└── faq/
    ├── general.md
    ├── technical.md
    └── troubleshooting.md
```

---

## SCRIPTS STRUCTURE

```
scripts/
├── setup/
│   ├── install.sh
│   ├── setup-db.sh
│   └── init-env.sh
├── development/
│   ├── dev.sh
│   ├── test.sh
│   └── lint.sh
├── deployment/
│   ├── build.sh
│   ├── deploy.sh
│   └── rollback.sh
├── maintenance/
│   ├── backup.sh
│   ├── migrate.sh
│   └── seed.sh
└── utils/
    ├── clean.sh
    └── format.sh
```

---

## CONFIGURATION FILES

```
root/
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── turbo.json                    # Turborepo configuration
├── package.json                  # Root package.json
├── tsconfig.json                 # Root TypeScript config
├── docker-compose.yml            # Docker Compose
├── Dockerfile                    # Root Dockerfile
├── README.md                     # Main README
├── LICENSE                       # License file
└── CHANGELOG.md                  # Changelog
```

---

## KEY DESIGN PRINCIPLES

### 1. Monorepo Structure
- Use Turborepo for efficient monorepo management
- Shared packages for common functionality
- Separate apps for different interfaces

### 2. Clear Separation
- Admin CMS separate from main web app
- API routes organized by domain
- Components organized by feature

### 3. Scalability
- Microservices for heavy computations
- Separate packages for shared logic
- Infrastructure as code

### 4. Maintainability
- Consistent naming conventions
- Clear folder structure
- Comprehensive documentation

### 5. Type Safety
- TypeScript throughout
- Shared type definitions
- Strict type checking

---

**END OF FOLDER STRUCTURE DESIGN**
