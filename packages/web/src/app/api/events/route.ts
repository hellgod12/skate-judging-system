import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function GET() {
  console.log('[events GET] Entering handler');
  
  if (!supabase) {
    console.error('[events GET] Supabase not configured');
    return NextResponse.json(
      { success: false, error: 'Supabase not configured', file: 'events/route.ts', line: 13 },
      { status: 500 }
    );
  }

  try {
    console.log('[events GET] Creating Supabase client');
    console.log('[events GET] Reading database');
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[events GET] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch events', details: error.message, file: 'events/route.ts', line: 26 },
        { status: 500 }
      );
    }

    console.log('[events GET] Returning response');
    return NextResponse.json(events || []);
  } catch (error: any) {
    console.error('[events GET] Exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        stack: error.stack, 
        file: 'events/route.ts',
        cause: error.cause
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('[events POST] Entering handler');
  
  if (!supabase) {
    console.error('[events POST] Supabase not configured');
    return NextResponse.json(
      { success: false, error: 'Supabase not configured', file: 'events/route.ts', line: 43 },
      { status: 500 }
    );
  }

  try {
    console.log('[events POST] Reading request body');
    const body = await request.json();
    const { name, use_run } = body;

    console.log('[events POST] Validating payload');
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required', file: 'events/route.ts', line: 55 },
        { status: 400 }
      );
    }

    console.log('[events POST] Writing database');
    const { data: event, error } = await supabase
      .from('events')
      .insert({ name, use_run: use_run || false })
      .select()
      .single();

    if (error) {
      console.error('[events POST] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create event', details: error.message, file: 'events/route.ts', line: 68 },
        { status: 500 }
      );
    }

    console.log('[events POST] Returning response');
    return NextResponse.json(event || {});
  } catch (error: any) {
    console.error('[events POST] Exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        stack: error.stack, 
        file: 'events/route.ts',
        cause: error.cause
      },
      { status: 500 }
    );
  }
}
