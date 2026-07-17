import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  calculate_trick_score,
  calculate_combo_score,
  normalize_to_sls,
  TrickModifiers
} from '@skate-judging/scoring';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

interface SingleAttemptInput {
  type: 'single';
  trick: string;
  modifiers: TrickModifiers;
}

interface ComboAttemptInput {
  type: 'combo';
  tricks: Array<{ name: string; modifiers: TrickModifiers }>;
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
    const { rider_id, event_id, attempt_no, attempt } = body;

    if (!rider_id || !event_id || !attempt_no || !attempt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let score: number;

    if (attempt.type === 'single') {
      const singleAttempt = attempt as SingleAttemptInput;
      
      // Get trick difficulty from database
      const { data: trick, error: trickError } = await supabase
        .from('tricks')
        .select('difficulty')
        .eq('name', singleAttempt.trick)
        .single();

      if (trickError || !trick) {
        return NextResponse.json(
          { error: 'Trick not found' },
          { status: 404 }
        );
      }

      const rawScore = calculate_trick_score(
        trick.difficulty,
        singleAttempt.modifiers.execution,
        singleAttempt.modifiers.style,
        singleAttempt.modifiers.amplitude,
        singleAttempt.modifiers.landing,
        singleAttempt.modifiers.risk
      );

      score = normalize_to_sls(rawScore);
    } else if (attempt.type === 'combo') {
      const comboAttempt = attempt as ComboAttemptInput;
      
      const trickScores: number[] = [];
      
      for (const trick of comboAttempt.tricks) {
        const { data: trickData, error: trickError } = await supabase
          .from('tricks')
          .select('difficulty')
          .eq('name', trick.name)
          .single();

        if (trickError || !trickData) {
          return NextResponse.json(
            { error: `Trick not found: ${trick.name}` },
            { status: 404 }
          );
        }

        const rawScore = calculate_trick_score(
          trickData.difficulty,
          trick.modifiers.execution,
          trick.modifiers.style,
          trick.modifiers.amplitude,
          trick.modifiers.landing,
          trick.modifiers.risk
        );

        trickScores.push(rawScore);
      }

      const comboRaw = calculate_combo_score(trickScores);
      score = normalize_to_sls(comboRaw);
    } else {
      return NextResponse.json(
        { error: 'Invalid attempt type' },
        { status: 400 }
      );
    }

    // Save attempt to database
    const { data: attemptData, error: insertError } = await supabase
      .from('attempts')
      .insert({
        rider_id,
        event_id,
        attempt_no,
        type: attempt.type,
        raw_json: attempt,
        score
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to save attempt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      attempt_id: attemptData.id,
      score
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
