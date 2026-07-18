import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
  
  const debugInfo = {
    supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
    supabaseServiceKey: supabaseServiceKey ? 'SET' : 'NOT SET',
    supabaseUrlLength: supabaseUrl.length,
    serviceKeyLength: supabaseServiceKey.length,
  };

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({
      status: 'error',
      message: 'Environment variables not set',
      debugInfo
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
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
