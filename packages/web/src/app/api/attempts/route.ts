import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  calculate_trick_score,
  calculate_combo_score,
  normalize_to_sls,
  TrickModifiers
} from '@/lib/scoring';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
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
  console.log('[attempts] Starting POST request');
  
  if (!supabase) {
    console.error('[attempts] Supabase not configured');
    return NextResponse.json(
      { success: false, error: 'Supabase not configured', file: 'attempts/route.ts', line: 31 },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log('[attempts] Request body:', JSON.stringify(body));
    const { rider_id, event_id, attempt_no, attempt } = body;

    if (!rider_id || !event_id || !attempt_no || !attempt) {
      console.error('[attempts] Missing required fields:', { rider_id, event_id, attempt_no, attempt });
      return NextResponse.json(
        { success: false, error: 'Missing required fields', body, file: 'attempts/route.ts', line: 44 },
        { status: 400 }
      );
    }

    let score: number;

    if (attempt.type === 'single') {
      console.log('[attempts] Processing single trick');
      const singleAttempt = attempt as SingleAttemptInput;
      
      // Get trick difficulty from database
      const { data: trick, error: trickError } = await supabase
        .from('tricks')
        .select('difficulty')
        .eq('name', singleAttempt.trick)
        .single();

      if (trickError || !trick) {
        console.error('[attempts] Trick not found:', { trickName: singleAttempt.trick, trickError });
        return NextResponse.json(
          { success: false, error: 'Trick not found', trickName: singleAttempt.trick, trickError, file: 'attempts/route.ts', line: 66 },
          { status: 404 }
        );
      }

      console.log('[attempts] Trick found, calculating score');
      const rawScore = calculate_trick_score(
        trick.difficulty,
        singleAttempt.modifiers.execution,
        singleAttempt.modifiers.style,
        singleAttempt.modifiers.amplitude,
        singleAttempt.modifiers.landing,
        singleAttempt.modifiers.risk
      );

      console.log('[attempts] Raw score calculated:', rawScore);
      score = normalize_to_sls(rawScore);
      console.log('[attempts] Normalized score:', score);
    } else if (attempt.type === 'combo') {
      console.log('[attempts] Processing combo');
      const comboAttempt = attempt as ComboAttemptInput;
      
      const trickScores: number[] = [];
      
      for (const trick of comboAttempt.tricks) {
        const { data: trickData, error: trickError } = await supabase
          .from('tricks')
          .select('difficulty')
          .eq('name', trick.name)
          .single();

        if (trickError || !trickData) {
          console.error('[attempts] Trick not found in combo:', { trickName: trick.name, trickError });
          return NextResponse.json(
            { success: false, error: `Trick not found: ${trick.name}`, trickError, file: 'attempts/route.ts', line: 100 },
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
      console.error('[attempts] Invalid attempt type:', attempt.type);
      return NextResponse.json(
        { success: false, error: 'Invalid attempt type', attemptType: attempt.type, file: 'attempts/route.ts', line: 122 },
        { status: 400 }
      );
    }

    console.log('[attempts] Saving attempt to database');
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
      console.error('[attempts] Failed to save attempt:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to save attempt', insertError: insertError.message, file: 'attempts/route.ts', line: 145 },
        { status: 500 }
      );
    }

    console.log('[attempts] Attempt saved successfully');
    return NextResponse.json({
      attempt_id: attemptData.id,
      score
    });
  } catch (error: any) {
    console.error('[attempts] Exception occurred:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        stack: error.stack, 
        file: 'attempts/route.ts',
        cause: error.cause
      },
      { status: 500 }
    );
  }
}
