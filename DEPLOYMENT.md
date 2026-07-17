# Deployment Guide

This guide will help you deploy the Skate Judging System to production.

## Prerequisites

- Node.js 18+ installed
- GitHub account
- Supabase account (free tier works)
- Vercel account (free tier works)

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: skate-judging (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose a region closest to your users
4. Wait for the project to be created (2-3 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the contents of `database/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)

This will create the tables: `tricks`, `riders`, `events`, `attempts`

### 1.3 Seed Trick Data

1. In the SQL Editor, click "New Query"
2. Copy the contents of `database/seed.sql`
3. Paste it into the SQL Editor
4. Click **Run**

This will populate 60 tricks with difficulty ratings.

### 1.4 Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (under Project Configuration)
   - **anon public** key (under Project API keys)
   - **service_role** key (under Project API keys - ⚠️ keep this secret!)

### 1.5 (Optional) Configure Row Level Security

For production, you should enable RLS policies. Run this in SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;

-- Allow public read access for leaderboard
CREATE POLICY "Public read access for riders" ON riders FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for attempts" ON attempts FOR SELECT USING (true);

-- Allow service role to write (for API routes)
CREATE POLICY "Service role can insert riders" ON riders FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can insert attempts" ON attempts FOR INSERT WITH CHECK (true);
```

## Step 2: Set Up GitHub Repository

### 2.1 Initialize Git

```bash
cd "j:/app juri skate"
git init
git add .
git commit -m "Initial commit: Skate Judging System"
```

### 2.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `skate-judging-system` (or your preferred name)
3. Don't initialize with README (we already have one)
4. Click "Create repository"

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/skate-judging-system.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Vercel

### 3.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click "Add New" > "Project"
3. Import your `skate-judging-system` repository

### 3.2 Configure Project

1. **Framework Preset**: Next.js
2. **Root Directory**: `packages/web`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### 3.3 Add Environment Variables

In Vercel project settings, add these environment variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=generate_a_random_secret_here
```

To generate a JWT secret, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at `https://your-project.vercel.app`

## Step 4: Initial Data Setup

### 4.1 Create Your First Event

Using the API or Supabase dashboard, create an event:

```bash
curl -X POST https://your-project.vercel.app/api/events \
  -H "Content-Type: application/json" \
  -d '{"name":"Street Contest 2024","use_run":false}'
```

Or via Supabase dashboard:
1. Go to Table Editor
2. Open `events` table
3. Click "Insert row"
4. Add: name="Street Contest 2024", use_run=false

### 4.2 Add Riders

```bash
curl -X POST https://your-project.vercel.app/api/riders \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","team":"Element"}'
```

Or via Supabase dashboard in the `riders` table.

## Step 5: Testing

### 5.1 Test Judge Panel

1. Navigate to `https://your-project.vercel.app/judge`
2. Enter Rider ID and Event ID
3. Select a trick and adjust modifiers
4. Click "Calculate & Save Score"
5. Verify the score is calculated and saved

### 5.2 Test Leaderboard

1. Navigate to `https://your-project.vercel.app/leaderboard`
2. Enter your Event ID
3. Verify the leaderboard shows your rider's scores
4. The leaderboard should auto-refresh every 2 seconds

### 5.3 Test Scoreboard

1. Navigate to `https://your-project.vercel.app/scoreboard`
2. Verify the fullscreen display shows the current leader

## Step 6: Customization

### 6.1 Modify Trick Difficulties

To adjust trick difficulty ratings:

1. Go to Supabase Table Editor
2. Open `tricks` table
3. Edit the `difficulty` column for any trick
4. Changes take effect immediately

### 6.2 Add New Tricks

1. In Supabase SQL Editor:
```sql
INSERT INTO tricks (name, difficulty) VALUES ('Your New Trick', 8);
```

### 6.3 Adjust Scoring Normalizer

The `NORMALIZER` constant (default: 15) controls score scaling. To change it:

1. Edit `packages/scoring/src/index.ts`
2. Change `export const NORMALIZER = 15;` to your preferred value
3. Rebuild and redeploy

## Troubleshooting

### Build Fails

- Ensure all dependencies are installed: `npm install`
- Check that Supabase env vars are set in Vercel
- Check Vercel build logs for specific errors

### API Returns "Supabase not configured"

- Verify environment variables are set in Vercel
- Ensure you're using the correct Supabase URL and keys
- Try redeploying after adding env vars

### Leaderboard Not Updating

- Check browser console for errors
- Verify Event ID is correct
- Ensure attempts are being saved to the database
- Check Supabase logs for any errors

### Scores Seem Too High/Low

- Adjust the `NORMALIZER` constant in scoring logic
- Review trick difficulty ratings
- Check modifier ranges in the judge panel

## Production Checklist

- [ ] Supabase project created and configured
- [ ] Database schema applied
- [ ] Trick data seeded
- [ ] RLS policies configured (optional but recommended)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Environment variables set in Vercel
- [ ] Application deployed successfully
- [ ] Test event created
- [ ] Test riders added
- [ ] Judge panel tested
- [ ] Leaderboard tested
- [ ] Scoreboard tested
- [ ] Custom domain configured (optional)

## Security Notes

- **Never commit** `.env` file to GitHub
- **Never expose** `SUPABASE_SERVICE_KEY` on the client side
- Use `service_role` key only in server-side API routes
- Use `anon` key for client-side operations
- Enable RLS policies for production
- Use HTTPS in production (Vercel provides this automatically)

## Support

For issues:
1. Check the [README.md](README.md) for documentation
2. Review Supabase logs in the dashboard
3. Review Vercel deployment logs
4. Check browser console for client-side errors
