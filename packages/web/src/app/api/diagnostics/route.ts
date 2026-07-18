import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  calculate_trick_score,
  calculate_combo_score,
  normalize_to_sls,
  TrickModifiers
} from '@/lib/scoring';

interface TestResult {
  step: string;
  success: boolean;
  result?: any;
  error?: string;
  stack?: string;
  duration: string;
}

interface DiagnosticsResponse {
  overall: boolean;
  tests: TestResult[];
  timestamp: string;
}

function measureTime<T>(fn: () => T): { result: T; duration: number } {
  const start = Date.now();
  const result = fn();
  return { result, duration: Date.now() - start };
}

async function measureAsyncTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  return { result, duration: Date.now() - start };
}

export async function GET() {
  const tests: TestResult[] = [];
  const timestamp = new Date().toISOString();

  // Test 1: Environment variables
  try {
    const { result, duration } = measureTime(() => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      return {
        supabaseUrlSet: !!supabaseUrl,
        supabaseAnonKeySet: !!supabaseAnonKey,
        supabaseUrlLength: supabaseUrl.length,
        anonKeyLength: supabaseAnonKey.length
      };
    });

    tests.push({
      step: 'Environment variables',
      success: result.supabaseUrlSet && result.supabaseAnonKeySet,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Environment variables',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  let supabase: any = null;

  // Test 2: Create Supabase client
  try {
    const { result, duration } = measureTime(() => {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Environment variables not set');
      }
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      return { clientCreated: true };
    });

    tests.push({
      step: 'Create Supabase client',
      success: true,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Create Supabase client',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Test 3: Connect to Supabase (simple query)
  try {
    const { result, duration } = await measureAsyncTime(async () => {
      if (!supabase) {
        throw new Error('Supabase client not created');
      }
      const { data, error } = await supabase.from('tricks').select('count').limit(1);
      if (error) throw error;
      return { connected: true, count: data };
    });

    tests.push({
      step: 'Connect to Supabase',
      success: true,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Connect to Supabase',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Test 4: Select from tricks table
  try {
    const { result, duration } = await measureAsyncTime(async () => {
      if (!supabase) {
        throw new Error('Supabase client not created');
      }
      const { data, error } = await supabase.from('tricks').select('*').limit(1);
      if (error) throw error;
      return { tricksFound: data?.length || 0, sample: data?.[0] || null };
    });

    tests.push({
      step: 'Select from tricks table',
      success: true,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Select from tricks table',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Test 5: Select from riders table
  try {
    const { result, duration } = await measureAsyncTime(async () => {
      if (!supabase) {
        throw new Error('Supabase client not created');
      }
      const { data, error } = await supabase.from('riders').select('*').limit(1);
      if (error) throw error;
      return { ridersFound: data?.length || 0, sample: data?.[0] || null };
    });

    tests.push({
      step: 'Select from riders table',
      success: true,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Select from riders table',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Test 6: Select from events table
  try {
    const { result, duration } = await measureAsyncTime(async () => {
      if (!supabase) {
        throw new Error('Supabase client not created');
      }
      const { data, error } = await supabase.from('events').select('*').limit(1);
      if (error) throw error;
      return { eventsFound: data?.length || 0, sample: data?.[0] || null };
    });

    tests.push({
      step: 'Select from events table',
      success: true,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Select from events table',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Test 7: Validate payload schema
  try {
    const { result, duration } = measureTime(() => {
      const payload = {
        rider_id: 1,
        event_id: 1,
        attempt_no: 1,
        attempt: {
          type: 'single',
          trick: 'Kickflip',
          modifiers: {
            execution: 1.0,
            style: 1.0,
            amplitude: 1.0,
            landing: 1.0,
            risk: 1.0
          }
        }
      };

      const { rider_id, event_id, attempt_no, attempt } = payload;
      const valid = !!rider_id && !!event_id && !!attempt_no && !!attempt;
      return { valid, payload };
    });

    tests.push({
      step: 'Validate payload schema',
      success: result.valid,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Validate payload schema',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Test 8: Execute scoring logic
  try {
    const { result, duration } = measureTime(() => {
      const difficulty = 5.0;
      const modifiers: TrickModifiers = {
        execution: 1.0,
        style: 1.0,
        amplitude: 1.0,
        landing: 1.0,
        risk: 1.0
      };

      const rawScore = calculate_trick_score(
        difficulty,
        modifiers.execution,
        modifiers.style,
        modifiers.amplitude,
        modifiers.landing,
        modifiers.risk
      );

      const normalizedScore = normalize_to_sls(rawScore);

      // Test combo scoring
      const comboScores = [5.0, 6.0, 7.0];
      const comboRaw = calculate_combo_score(comboScores);
      const comboNormalized = normalize_to_sls(comboRaw);

      return {
        trickScore: rawScore,
        trickNormalized: normalizedScore,
        comboRaw: comboRaw,
        comboNormalized: comboNormalized
      };
    });

    tests.push({
      step: 'Execute scoring logic',
      success: true,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Execute scoring logic',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Test 9: Insert into attempts (dry run - we'll delete it after)
  let insertedId: number | null = null;
  try {
    const { result, duration } = await measureAsyncTime(async () => {
      if (!supabase) {
        throw new Error('Supabase client not created');
      }

      const testAttempt = {
        rider_id: 1,
        event_id: 1,
        attempt_no: 999999,
        type: 'single',
        raw_json: {
          type: 'single',
          trick: 'Diagnostic Test',
          modifiers: {
            execution: 1.0,
            style: 1.0,
            amplitude: 1.0,
            landing: 1.0,
            risk: 1.0
          }
        },
        score: 5.0
      };

      const { data, error } = await supabase
        .from('attempts')
        .insert(testAttempt)
        .select()
        .single();

      if (error) throw error;
      insertedId = data?.id || null;
      return { inserted: true, id: data?.id, data };
    });

    tests.push({
      step: 'Insert into attempts',
      success: true,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Insert into attempts',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Test 10: Read inserted row
  try {
    const { result, duration } = await measureAsyncTime(async () => {
      if (!supabase) {
        throw new Error('Supabase client not created');
      }
      if (!insertedId) {
        throw new Error('No inserted ID available');
      }

      const { data, error } = await supabase
        .from('attempts')
        .select('*')
        .eq('id', insertedId)
        .single();

      if (error) throw error;
      return { read: true, data };
    });

    tests.push({
      step: 'Read inserted row',
      success: true,
      result,
      duration: `${duration}ms`
    });
  } catch (error: any) {
    tests.push({
      step: 'Read inserted row',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  // Cleanup: Delete the test attempt
  if (insertedId && supabase) {
    try {
      await supabase.from('attempts').delete().eq('id', insertedId);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  // Test 11: Return final result
  try {
    const allPassed = tests.every(t => t.success);
    const failedTests = tests.filter(t => !t.success);

    tests.push({
      step: 'Return final result',
      success: true,
      result: {
        allPassed,
        failedCount: failedTests.length,
        failedTests: failedTests.map(t => t.step)
      },
      duration: '0ms'
    });
  } catch (error: any) {
    tests.push({
      step: 'Return final result',
      success: false,
      error: error.message,
      stack: error.stack,
      duration: '0ms'
    });
  }

  const overall = tests.every(t => t.success);

  return NextResponse.json({
    overall,
    tests,
    timestamp
  });
}
