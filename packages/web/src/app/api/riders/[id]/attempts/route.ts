import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const riderId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

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
      return NextResponse.json(
        { error: 'Failed to fetch attempts' },
        { status: 500 }
      );
    }

    return NextResponse.json(attempts || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
