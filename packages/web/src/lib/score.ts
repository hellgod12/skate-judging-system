import { createClient } from '@/utils/supabase/client';
import type { JudgeScore, CreateJudgeScoreData, UpdateJudgeScoreData, ScoreValidation } from './types/score';

export class ScoreService {
  /**
   * Validate score data
   */
  static validateScore(data: CreateJudgeScoreData): ScoreValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.event_id) errors.push('Event ID is required');
    if (!data.rider_id) errors.push('Rider ID is required');
    if (!data.judge_id) errors.push('Judge ID is required');
    if (!data.attempt_type) errors.push('Attempt type is required');
    if (data.attempt_number < 1) errors.push('Attempt number must be at least 1');

    if (data.final_score < 0) errors.push('Final score cannot be negative');
    if (data.final_score > 100) warnings.push('Final score exceeds 100');

    if (data.attempt_type === 'single' && !data.trick_id) {
      errors.push('Trick ID is required for single attempt');
    }

    if (data.attempt_type === 'combo' && (!data.combo_tricks || data.combo_tricks.length === 0)) {
      errors.push('Combo tricks are required for combo attempt');
    }

    if (data.attempt_type === 'combo' && data.combo_tricks && data.combo_tricks.length > 5) {
      warnings.push('Combo has more than 5 tricks');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Submit judge score
   */
  static async submitScore(data: CreateJudgeScoreData): Promise<JudgeScore> {
    try {
      const supabase = await createClient();
      const validation = this.validateScore(data);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data: score, error } = await supabase
        .from('judge_scores')
        .insert({
          event_id: data.event_id,
          heat_id: data.heat_id,
          rider_id: data.rider_id,
          judge_id: data.judge_id,
          attempt_type: data.attempt_type,
          attempt_number: data.attempt_number,
          trick_id: data.trick_id,
          combo_tricks: data.combo_tricks || [],
          modifiers: data.modifiers,
          base_score: data.base_score,
          modifier_score: data.modifier_score,
          final_score: data.final_score,
          is_locked: false,
          is_overridden: false,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return score as JudgeScore;
    } catch (error) {
      console.error('Submit score error:', error);
      throw error;
    }
  }

  /**
   * Get scores for an event
   */
  static async getEventScores(eventId: string): Promise<JudgeScore[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('judge_scores')
        .select('*')
        .eq('event_id', eventId)
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as JudgeScore[];
    } catch (error) {
      console.error('Get event scores error:', error);
      throw error;
    }
  }

  /**
   * Get scores for a rider in an event
   */
  static async getRiderScores(eventId: string, riderId: string): Promise<JudgeScore[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('judge_scores')
        .select('*')
        .eq('event_id', eventId)
        .eq('rider_id', riderId)
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as JudgeScore[];
    } catch (error) {
      console.error('Get rider scores error:', error);
      throw error;
    }
  }

  /**
   * Get scores for a heat
   */
  static async getHeatScores(heatId: string): Promise<JudgeScore[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('judge_scores')
        .select('*')
        .eq('heat_id', heatId)
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as JudgeScore[];
    } catch (error) {
      console.error('Get heat scores error:', error);
      throw error;
    }
  }

  /**
   * Get score by ID
   */
  static async getScoreById(id: string): Promise<JudgeScore> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('judge_scores')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as JudgeScore;
    } catch (error) {
      console.error('Get score error:', error);
      throw error;
    }
  }

  /**
   * Update score
   */
  static async updateScore(id: string, data: UpdateJudgeScoreData): Promise<JudgeScore> {
    try {
      const supabase = await createClient();
      const score = await this.getScoreById(id);

      if (score.is_locked) {
        throw new Error('Cannot update locked score');
      }

      const { data: updatedScore, error } = await supabase
        .from('judge_scores')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return updatedScore as JudgeScore;
    } catch (error) {
      console.error('Update score error:', error);
      throw error;
    }
  }

  /**
   * Lock score
   */
  static async lockScore(id: string): Promise<JudgeScore> {
    try {
      return await this.updateScore(id, { is_locked: true });
    } catch (error) {
      console.error('Lock score error:', error);
      throw error;
    }
  }

  /**
   * Unlock score
   */
  static async unlockScore(id: string): Promise<JudgeScore> {
    try {
      return await this.updateScore(id, { is_locked: false });
    } catch (error) {
      console.error('Unlock score error:', error);
      throw error;
    }
  }

  /**
   * Override score (chief judge)
   */
  static async overrideScore(id: string, data: UpdateJudgeScoreData, overriddenBy: string): Promise<JudgeScore> {
    try {
      const supabase = await createClient();
      const score = await this.getScoreById(id);

      if (score.is_locked && !score.is_overridden) {
        throw new Error('Cannot override locked score without override permission');
      }

      const { data: updatedScore, error } = await supabase
        .from('judge_scores')
        .update({
          ...data,
          is_overridden: true,
          overridden_by: overriddenBy,
          overridden_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return updatedScore as JudgeScore;
    } catch (error) {
      console.error('Override score error:', error);
      throw error;
    }
  }

  /**
   * Get scores by judge
   */
  static async getJudgeScores(judgeId: string, eventId?: string): Promise<JudgeScore[]> {
    try {
    const supabase = await createClient();
      let query = supabase
        .from('judge_scores')
        .select('*')
        .eq('judge_id', judgeId)
        .order('submitted_at', { ascending: false });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as JudgeScore[];
    } catch (error) {
      console.error('Get judge scores error:', error);
      throw error;
    }
  }

  /**
   * Calculate average score for a rider
   */
  static async calculateAverageScore(eventId: string, riderId: string): Promise<number> {
    try {
      const scores = await this.getRiderScores(eventId, riderId);
      
      if (scores.length === 0) return 0;

      const sum = scores.reduce((total, score) => total + score.final_score, 0);
      return sum / scores.length;
    } catch (error) {
      console.error('Calculate average score error:', error);
      throw error;
    }
  }

  /**
   * Get latest scores for real-time leaderboard
   */
  static async getLatestScores(eventId: string, limit: number = 50): Promise<JudgeScore[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('judge_scores')
        .select('*')
        .eq('event_id', eventId)
        .order('submitted_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return data as JudgeScore[];
    } catch (error) {
      console.error('Get latest scores error:', error);
      throw error;
    }
  }
}
