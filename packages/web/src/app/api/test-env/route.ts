import { NextResponse } from 'next/server';

export async function GET() {
  const envStatus = {
    supabaseUrl: !!process.env.SUPABASE_URL,
    supabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    publicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    jwtSecret: !!process.env.JWT_SECRET,
  };

  const allSet = Object.values(envStatus).every(status => status === true);

  return NextResponse.json({
    status: allSet ? 'success' : 'error',
    environment: process.env.NODE_ENV || 'unknown',
    envStatus,
    message: allSet 
      ? 'All required environment variables are set' 
      : 'Some environment variables are missing'
  });
}
