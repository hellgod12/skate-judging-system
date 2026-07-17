# Supabase Setup Helper Script for Windows
# This script helps you set up Supabase for the Skate Judging System

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Skate Judging System - Supabase Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists. Backing up to .env.backup" -ForegroundColor Yellow
    Copy-Item .env .env.backup
}

Write-Host "Please enter your Supabase credentials:"
Write-Host "(You can find these in your Supabase project > Settings > API)"
Write-Host ""

$SUPABASE_URL = Read-Host "Supabase Project URL"
$SUPABASE_ANON_KEY = Read-Host "Supabase Anon Key"
$SUPABASE_SERVICE_KEY = Read-Host "Supabase Service Role Key"

# Generate JWT secret
$JWT_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Create .env file
@"
# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# JWT Secret for authentication
JWT_SECRET=$JWT_SECRET
"@ | Out-File -FilePath .env -Encoding utf8

Write-Host ""
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Go to your Supabase dashboard > SQL Editor"
Write-Host "2. Run the SQL from database/schema.sql"
Write-Host "3. Run the SQL from database/seed.sql"
Write-Host "4. (Optional) Run RLS policies from DEPLOYMENT.md"
Write-Host ""
Write-Host "⚠️  IMPORTANT: Never commit .env to GitHub!" -ForegroundColor Red
