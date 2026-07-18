import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('[debug-attempts POST] Entering handler');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const debugInfo = {
    supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
    supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET',
    supabaseUrlLength: supabaseUrl.length,
    anonKeyLength: supabaseAnonKey.length,
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[debug-attempts POST] Environment variables not set');
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Environment variables not set',
      debugInfo,
      file: 'debug-attempts/route.ts',
      line: 15
    });
  }

  try {
    console.log('[debug-attempts POST] Reading request body');
    const body = await request.json();
    const { rider_id, event_id, attempt_no, attempt } = body;

    console.log('[debug-attempts POST] Creating Supabase client');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('[debug-attempts POST] Testing trick query');
    // Test trick query
    if (attempt.type === 'single') {
      const { data: trick, error: trickError } = await supabase
        .from('tricks')
        .select('difficulty')
        .eq('name', attempt.trick)
        .single();

      console.log('[debug-attempts POST] Returning response');
      return NextResponse.json({
        success: true,
        status: 'success',
        debugInfo,
        trickFound: !!trick,
        trickError: trickError ? trickError.message : null,
        trickData: trick,
        requestBody: body
      });
    }

    console.log('[debug-attempts POST] Only single trick supported for debug');
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Only single trick supported for debug',
      debugInfo,
      requestBody: body,
      file: 'debug-attempts/route.ts',
      line: 47
    });
  } catch (error: any) {
    console.error('[debug-attempts POST] Exception:', error);
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Exception occurred',
      error: error.message,
      stack: error.stack,
      debugInfo,
      file: 'debug-attempts/route.ts',
      cause: error.cause
    });
  }
}
