import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const { data: riders, error } = await supabase
      .from('riders')
      .select('*')
      .order('name');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch riders' },
        { status: 500 }
      );
    }

    return NextResponse.json(riders || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { name, team } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const { data: rider, error } = await supabase
      .from('riders')
      .insert({ name, team })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create rider' },
        { status: 500 }
      );
    }

    return NextResponse.json(rider);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
