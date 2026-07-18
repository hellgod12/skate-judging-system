import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[riders/[id]/attempts GET] Entering handler');
  
  if (!supabase) {
    console.error('[riders/[id]/attempts GET] Supabase not configured');
    return NextResponse.json(
      { success: false, error: 'Supabase not configured', file: 'riders/[id]/attempts/route.ts', line: 15 },
      { status: 500 }
    );
  }

  try {
    console.log('[riders/[id]/attempts GET] Creating Supabase client');
    const riderId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    console.log('[riders/[id]/attempts GET] Reading database');
    let query = supabase
      .from('attempts')
      .select('*')
      .eq('rider_id', riderId);

    if (eventId) {
      query = query.eq('event_id', parseInt(eventId));
    }

    query = query.order('created_at', { ascending: false });

    const { data: attempts, error } = await query;

    if (error) {
      console.error('[riders/[id]/attempts GET] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch attempts', details: error.message, file: 'riders/[id]/attempts/route.ts', line: 42 },
        { status: 500 }
      );
    }

    console.log('[riders/[id]/attempts GET] Returning response');
    return NextResponse.json(attempts || []);
  } catch (error: any) {
    console.error('[riders/[id]/attempts GET] Exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        stack: error.stack, 
        file: 'riders/[id]/attempts/route.ts',
        cause: error.cause
      },
      { status: 500 }
    );
  }
}
