import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { get_best_trick_total, calculate_final_score } from '@/lib/scoring';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const eventId = parseInt(params.id);

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('use_run')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, error: 'Event not found', details: eventError?.message },
        { status: 404 }
      );
    }

    // Get all riders in the event
    const { data: riders, error: ridersError } = await supabase
      .from('riders')
      .select('*')
      .order('name');

    if (ridersError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch riders', details: ridersError.message },
        { status: 500 }
      );
    }

    const ridersArray = riders || [];

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

    return NextResponse.json(leaderboard);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
