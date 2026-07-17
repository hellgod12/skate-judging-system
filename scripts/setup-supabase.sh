#!/bin/bash

# Supabase Setup Helper Script
# This script helps you set up Supabase for the Skate Judging System

echo "=========================================="
echo "  Skate Judging System - Supabase Setup"
echo "=========================================="
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

echo "Please enter your Supabase credentials:"
echo "(You can find these in your Supabase project > Settings > API)"
echo ""

read -p "Supabase Project URL: " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Supabase Service Role Key: " SUPABASE_SERVICE_KEY

# Generate JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Create .env file
cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# JWT Secret for authentication
JWT_SECRET=$JWT_SECRET
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "Next steps:"
echo "1. Go to your Supabase dashboard > SQL Editor"
echo "2. Run the SQL from database/schema.sql"
echo "3. Run the SQL from database/seed.sql"
echo "4. (Optional) Run RLS policies from DEPLOYMENT.md"
echo ""
echo "⚠️  IMPORTANT: Never commit .env to GitHub!"
