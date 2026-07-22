import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
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
        { success: false, error: 'Failed to fetch attempts', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(attempts || []);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
