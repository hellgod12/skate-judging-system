import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { get_best_trick_total, calculate_final_score } from '@/lib/scoring';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[events/[id]/leaderboard GET] Entering handler');
  
  if (!supabase) {
    console.error('[events/[id]/leaderboard GET] Supabase not configured');
    return NextResponse.json(
      { success: false, error: 'Supabase not configured', file: 'events/[id]/leaderboard/route.ts', line: 17 },
      { status: 500 }
    );
  }

  try {
    console.log('[events/[id]/leaderboard GET] Creating Supabase client');
    const eventId = parseInt(params.id);

    console.log('[events/[id]/leaderboard GET] Reading database (event)');
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('use_run')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      console.error('[events/[id]/leaderboard GET] Event not found:', { eventId, eventError });
      return NextResponse.json(
        { success: false, error: 'Event not found', details: eventError?.message, file: 'events/[id]/leaderboard/route.ts', line: 34 },
        { status: 404 }
      );
    }

    console.log('[events/[id]/leaderboard GET] Reading database (riders)');
    // Get all riders in the event
    const { data: riders, error: ridersError } = await supabase
      .from('riders')
      .select('*')
      .order('name');

    if (ridersError) {
      console.error('[events/[id]/leaderboard GET] Failed to fetch riders:', ridersError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch riders', details: ridersError.message, file: 'events/[id]/leaderboard/route.ts', line: 48 },
        { status: 500 }
      );
    }

    const ridersArray = riders || [];

    console.log('[events/[id]/leaderboard GET] Running scoring calculation');
    // Calculate leaderboard for each rider
    const leaderboard = await Promise.all(
      ridersArray.map(async (rider) => {
        // Get all attempts for this rider in this event
        const { data: attempts, error: attemptsError } = await supabase
          .from('attempts')
          .select('score')
          .eq('rider_id', rider.id)
          .eq('event_id', eventId);

        if (attemptsError || !attempts) {
          return {
            rider_id: rider.id,
            name: rider.name,
            best_trick: [0, 0, 0, 0],
            best_trick_total: 0,
            run_score: 0,
            final_score: 0
          };
        }

        const scores = attempts.map(a => a.score);
        const bestTrickTotal = get_best_trick_total(scores);
        
        // Sort scores to get top 4
        const sortedScores = [...scores].sort((a, b) => b - a);
        const bestTrick = [
          sortedScores[0] || 0,
          sortedScores[1] || 0,
          sortedScores[2] || 0,
          sortedScores[3] || 0
        ];

        // For now, run_score is 0 (run scoring would need separate logic)
        const runScore = 0;
        const finalScore = calculate_final_score(bestTrickTotal, runScore, event.use_run);

        return {
          rider_id: rider.id,
          name: rider.name,
          best_trick: bestTrick,
          best_trick_total: parseFloat(bestTrickTotal.toFixed(2)),
          run_score: parseFloat(runScore.toFixed(2)),
          final_score: parseFloat(finalScore.toFixed(2))
        };
      })
    );

    // Sort by final score descending
    leaderboard.sort((a, b) => b.final_score - a.final_score);

    console.log('[events/[id]/leaderboard GET] Returning response');
    return NextResponse.json(leaderboard);
  } catch (error: any) {
    console.error('[events/[id]/leaderboard GET] Exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        stack: error.stack, 
        file: 'events/[id]/leaderboard/route.ts',
        cause: error.cause
      },
      { status: 500 }
    );
  }
}
