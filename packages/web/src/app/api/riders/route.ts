import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function GET() {
  console.log('[riders GET] Entering handler');
  
  if (!supabase) {
    console.error('[riders GET] Supabase not configured');
    return NextResponse.json(
      { success: false, error: 'Supabase not configured', file: 'riders/route.ts', line: 13 },
      { status: 500 }
    );
  }

  try {
    console.log('[riders GET] Creating Supabase client');
    console.log('[riders GET] Reading database');
    const { data: riders, error } = await supabase
      .from('riders')
      .select('*')
      .order('name');

    if (error) {
      console.error('[riders GET] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch riders', details: error.message, file: 'riders/route.ts', line: 26 },
        { status: 500 }
      );
    }

    console.log('[riders GET] Returning response');
    return NextResponse.json(riders || []);
  } catch (error: any) {
    console.error('[riders GET] Exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        stack: error.stack, 
        file: 'riders/route.ts',
        cause: error.cause
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('[riders POST] Entering handler');
  
  if (!supabase) {
    console.error('[riders POST] Supabase not configured');
    return NextResponse.json(
      { success: false, error: 'Supabase not configured', file: 'riders/route.ts', line: 43 },
      { status: 500 }
    );
  }

  try {
    console.log('[riders POST] Reading request body');
    const body = await request.json();
    const { name, team } = body;

    console.log('[riders POST] Validating payload');
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required', file: 'riders/route.ts', line: 55 },
        { status: 400 }
      );
    }

    console.log('[riders POST] Writing database');
    const { data: riders, error } = await supabase
      .from('riders')
      .insert({ name, team })
      .select()
      .single();

    if (error) {
      console.error('[riders POST] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create rider', details: error.message, file: 'riders/route.ts', line: 68 },
        { status: 500 }
      );
    }

    console.log('[riders POST] Returning response');
    return NextResponse.json(riders || {});
  } catch (error: any) {
    console.error('[riders POST] Exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        stack: error.stack, 
        file: 'riders/route.ts',
        cause: error.cause
      },
      { status: 500 }
    );
  }
}
