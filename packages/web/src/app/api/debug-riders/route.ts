import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const debugInfo = {
    supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
    supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET',
    supabaseUrlLength: supabaseUrl.length,
    anonKeyLength: supabaseAnonKey.length,
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      status: 'error',
      message: 'Environment variables not set',
      debugInfo
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: riders, error } = await supabase
      .from('riders')
      .select('*')
      .order('name');

    return NextResponse.json({
      status: 'success',
      debugInfo,
      ridersCount: riders?.length || 0,
      error: error ? error.message : null,
      sampleData: riders?.slice(0, 2) || []
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Exception occurred',
      error: error.message,
      debugInfo
    });
  }
}
