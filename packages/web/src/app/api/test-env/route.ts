import { NextResponse } from 'next/server';

export async function GET() {
  const envStatus = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
