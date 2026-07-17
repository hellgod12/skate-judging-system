# Skate Judging System

SLS-style skateboard street competition judging system with combo support.

## Features

- **SLS Scoring Format**: Best Trick (5 attempts, take top 4) with 0-9.9 scale
- **Combo Support**: Multi-trick attempts with combo multipliers (2→1.2, 3→1.35, 4→1.5, 5+→1.7)
- **Modifier System**: Execution, Style, Amplitude, Landing, Risk modifiers
- **Real-time Leaderboard**: Auto-refreshing MC view
- **Public Scoreboard**: Fullscreen display for spectators
- **Judge Panel**: Single trick and combo scoring interface
- **Database**: Supabase integration with PostgreSQL

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Supabase (PostgreSQL)
- **Scoring Logic**: TypeScript with comprehensive unit tests

## Project Structure

```
.
├── packages/
│   ├── scoring/          # Core scoring logic library
│   │   ├── src/
│   │   │   ├── index.ts         # Scoring functions
│   │   │   └── __tests__/       # Unit tests
│   │   └── package.json
│   └── web/              # Next.js frontend + API
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/         # API routes
│       │   │   ├── judge/       # Judge panel
│       │   │   ├── leaderboard/ # MC leaderboard
│       │   │   └── scoreboard/  # Public display
│       │   └── components/
│       └── package.json
├── database/
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Trick seed data
├── package.json          # Root package (Turbo monorepo)
└── turbo.json            # Turbo configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `database/schema.sql`
3. Run `database/seed.sql` to populate tricks
4. Get your credentials:
   - Project URL
   - Service Role Key (from Settings > API)
   - Anon Key (from Settings > API)

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_here
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Run Tests

```bash
npm run test
```

## API Endpoints

### POST /api/attempts
Submit a scoring attempt (single or combo)

**Single Trick Example:**
```json
{
  "rider_id": 1,
  "event_id": 1,
  "attempt_no": 1,
  "attempt": {
    "type": "single",
    "trick": "Treflip",
    "modifiers": {
      "execution": 1.1,
      "style": 1.05,
      "amplitude": 1.2,
      "landing": 1.1,
      "risk": 1.3
    }
  }
}
```

**Combo Example:**
```json
{
  "rider_id": 1,
  "event_id": 1,
  "attempt_no": 2,
  "attempt": {
    "type": "combo",
    "tricks": [
      {
        "name": "Kickflip",
        "modifiers": {"execution": 1.1, "style": 1.05, "amplitude": 1.1, "landing": 1.1, "risk": 1.0}
      },
      {
        "name": "Backside Lipslide",
        "modifiers": {"execution": 1.15, "style": 1.05, "amplitude": 1.2, "landing": 1.1, "risk": 1.2}
      }
    ]
  }
}
```

### GET /api/events/{id}/leaderboard
Get leaderboard for an event

### GET /api/riders/{id}/attempts
Get attempt history for a rider

### GET /api/tricks
Get all tricks with difficulty ratings

### GET /api/riders
Get all riders

### POST /api/riders
Create a new rider

### GET /api/events
Get all events

### POST /api/events
Create a new event

## Scoring Logic

### Trick Score Calculation
```
TrickScoreRaw = difficulty × execution × style × amplitude × landing × risk
```

### Combo Score Calculation
```
ComboRaw = sum(TrickScoreRaw_i) × ComboMultiplier
```

Combo Multipliers:
- 2 tricks: 1.2
- 3 tricks: 1.35
- 4 tricks: 1.5
- 5+ tricks: 1.7

### SLS Normalization
```
SLSScore = min(raw_score / 15, 9.9)
```

### Best Trick Total
Sum of top 4 SLS scores from all attempts

### Final Score
If run is used:
```
final_score = (run_score × 0.4) + (best_trick_total × 0.6)
```

If run is not used:
```
final_score = best_trick_total
```

## Modifier Ranges

- **Execution**: 0.8 - 1.2
- **Style**: 0.9 - 1.1
- **Amplitude**: 0.9 - 1.3
- **Landing**: 0.7 - 1.2
- **Risk**: 1.0 - 1.4

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Setup for Production

1. Enable Row Level Security (RLS) policies
2. Use service role key for server-side operations
3. Use anon key for client-side operations

## Pages

- **/** - Home page with navigation
- **/judge** - Judge scoring panel
- **/leaderboard** - MC leaderboard (auto-refresh)
- **/scoreboard** - Public scoreboard (fullscreen)

## Trick Database

The system includes 60 pre-seeded tricks with difficulty ratings (1-15). You can add/modify tricks via the Supabase dashboard or by editing `database/seed.sql`.

## License

MIT
