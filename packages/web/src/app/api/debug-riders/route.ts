import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  console.log('[debug-riders GET] Entering handler');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const debugInfo = {
    supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
    supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET',
    supabaseUrlLength: supabaseUrl.length,
    anonKeyLength: supabaseAnonKey.length,
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[debug-riders GET] Environment variables not set');
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Environment variables not set',
      debugInfo,
      file: 'debug-riders/route.ts',
      line: 15
    });
  }

  try {
    console.log('[debug-riders GET] Creating Supabase client');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('[debug-riders GET] Reading database');
    const { data: riders, error } = await supabase
      .from('riders')
      .select('*')
      .order('name');

    console.log('[debug-riders GET] Returning response');
    return NextResponse.json({
      success: true,
      status: 'success',
      debugInfo,
      ridersCount: riders?.length || 0,
      error: error ? error.message : null,
      sampleData: riders?.slice(0, 2) || []
    });
  } catch (error: any) {
    console.error('[debug-riders GET] Exception:', error);
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Exception occurred',
      error: error.message,
      stack: error.stack,
      debugInfo,
      file: 'debug-riders/route.ts',
      cause: error.cause
    });
  }
}
