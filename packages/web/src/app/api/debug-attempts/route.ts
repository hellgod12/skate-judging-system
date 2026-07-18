import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { rider_id, event_id, attempt_no, attempt } = body;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test trick query
    if (attempt.type === 'single') {
      const { data: trick, error: trickError } = await supabase
        .from('tricks')
        .select('difficulty')
        .eq('name', attempt.trick)
        .single();

      return NextResponse.json({
        status: 'success',
        debugInfo,
        trickFound: !!trick,
        trickError: trickError ? trickError.message : null,
        trickData: trick,
        requestBody: body
      });
    }

    return NextResponse.json({
      status: 'error',
      message: 'Only single trick supported for debug',
      debugInfo,
      requestBody: body
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Exception occurred',
      error: error.message,
      stack: error.stack,
      debugInfo
    });
  }
}
