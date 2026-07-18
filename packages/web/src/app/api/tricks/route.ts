import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function GET() {
  console.log('[tricks GET] Entering handler');
  
  if (!supabase) {
    console.error('[tricks GET] Supabase not configured');
    return NextResponse.json(
      { success: false, error: 'Supabase not configured', file: 'tricks/route.ts', line: 13 },
      { status: 500 }
    );
  }

  try {
    console.log('[tricks GET] Creating Supabase client');
    console.log('[tricks GET] Reading database');
    const { data: tricks, error } = await supabase
      .from('tricks')
      .select('*')
      .order('name');

    if (error) {
      console.error('[tricks GET] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch tricks', details: error.message, file: 'tricks/route.ts', line: 26 },
        { status: 500 }
      );
    }

    console.log('[tricks GET] Returning response');
    return NextResponse.json(tricks || []);
  } catch (error: any) {
    console.error('[tricks GET] Exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        stack: error.stack, 
        file: 'tricks/route.ts',
        cause: error.cause
      },
      { status: 500 }
    );
  }
}
