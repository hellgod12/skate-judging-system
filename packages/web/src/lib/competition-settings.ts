import { createClient } from '@/utils/supabase/client';
import type { CompetitionSettings, UpdateCompetitionSettingsData, DEFAULT_SCORING_CONFIG, DEFAULT_RUN_CONFIG, DEFAULT_BEST_TRICK_CONFIG, DEFAULT_JAM_CONFIG, DEFAULT_TIMER_CONFIG } from './types/competition-settings';

export class CompetitionSettingsService {
  /**
   * Get competition settings for an event
   */
  static async getEventSettings(eventId: string): Promise<CompetitionSettings> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('scoring_config, run_config, best_trick_config, jam_config, timer_config')
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        scoring_config: data.scoring_config || {},
        run_config: data.run_config || {},
        best_trick_config: data.best_trick_config || {},
        jam_config: data.jam_config || {},
        timer_config: data.timer_config || {},
      };
    } catch (error) {
      console.error('Get event settings error:', error);
      throw error;
    }
  }

  /**
   * Update competition settings for an event
   */
  static async updateEventSettings(eventId: string, data: UpdateCompetitionSettingsData): Promise<CompetitionSettings> {
    try {
      const supabase = await createClient();
      const updates: any = {};
      if (data.scoring_config) updates.scoring_config = data.scoring_config;
      if (data.run_config) updates.run_config = data.run_config;
      if (data.best_trick_config) updates.best_trick_config = data.best_trick_config;
      if (data.jam_config) updates.jam_config = data.jam_config;
      if (data.timer_config) updates.timer_config = data.timer_config;

      const { data: event, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select('scoring_config, run_config, best_trick_config, jam_config, timer_config')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        scoring_config: event.scoring_config || {},
        run_config: event.run_config || {},
        best_trick_config: event.best_trick_config || {},
        jam_config: event.jam_config || {},
        timer_config: event.timer_config || {},
      };
    } catch (error) {
      console.error('Update event settings error:', error);
      throw error;
    }
  }

  /**
   * Get scoring config for an event
   */
  static async getScoringConfig(eventId: string): Promise<any> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('scoring_config')
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.scoring_config || {};
    } catch (error) {
      console.error('Get scoring config error:', error);
      throw error;
    }
  }

  /**
   * Update scoring config for an event
   */
  static async updateScoringConfig(eventId: string, scoringConfig: any): Promise<any> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .update({ scoring_config: scoringConfig })
        .eq('id', eventId)
        .select('scoring_config')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.scoring_config;
    } catch (error) {
      console.error('Update scoring config error:', error);
      throw error;
    }
  }

  /**
   * Get run config for an event
   */
  static async getRunConfig(eventId: string): Promise<any> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('run_config')
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.run_config || {};
    } catch (error) {
      console.error('Get run config error:', error);
      throw error;
    }
  }

  /**
   * Update run config for an event
   */
  static async updateRunConfig(eventId: string, runConfig: any): Promise<any> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .update({ run_config: runConfig })
        .eq('id', eventId)
        .select('run_config')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.run_config;
    } catch (error) {
      console.error('Update run config error:', error);
      throw error;
    }
  }

  /**
   * Get timer config for an event
   */
  static async getTimerConfig(eventId: string): Promise<any> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('timer_config')
        .eq('id', eventId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.timer_config || {};
    } catch (error) {
      console.error('Get timer config error:', error);
      throw error;
    }
  }

  /**
   * Update timer config for an event
   */
  static async updateTimerConfig(eventId: string, timerConfig: any): Promise<any> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .update({ timer_config: timerConfig })
        .eq('id', eventId)
        .select('timer_config')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.timer_config;
    } catch (error) {
      console.error('Update timer config error:', error);
      throw error;
    }
  }

  /**
   * Apply default settings to an event
   */
  static async applyDefaultSettings(eventId: string): Promise<CompetitionSettings> {
    try {
      const defaultSettings = {
        scoring_config: {
          normalizer: 15,
          combo_multipliers: {
            two_tricks: 1.2,
            three_tricks: 1.35,
            four_tricks: 1.5,
            five_plus_tricks: 1.7,
          },
          modifier_ranges: {
            landing: { min: 0.7, max: 1.1 },
            risk: { min: 1.0, max: 1.4 },
            amplitude: { min: 0.8, max: 1.3 },
            variety: { min: 0.8, max: 1.2 },
            execution: { min: 0.8, max: 1.2 },
          },
          score_weights: {
            best_trick: 0.6,
            run: 0.4,
          },
          decimal_places: 2,
        },
        run_config: {
          duration_seconds: 45,
          number_of_runs: 2,
          best_runs_count: 1,
          use_best_trick: true,
          use_jam: false,
        },
        best_trick_config: {
          attempts_per_rider: 5,
          time_per_attempt_seconds: 60,
          use_best_trick_score: true,
          allow_combo_tricks: false,
        },
        jam_config: {
          duration_seconds: 300,
          number_of_jams: 1,
          riders_per_jam: 5,
          scoring_method: 'cumulative',
        },
        timer_config: {
          countdown_duration_seconds: 10,
          warning_duration_seconds: 10,
          auto_stop: true,
          show_remaining: true,
          show_elapsed: false,
        },
      };

      return await this.updateEventSettings(eventId, defaultSettings);
    } catch (error) {
      console.error('Apply default settings error:', error);
      throw error;
    }
  }

  /**
   * Validate scoring config
   */
  static validateScoringConfig(config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.normalizer || config.normalizer < 1 || config.normalizer > 100) {
      errors.push('Normalizer must be between 1 and 100');
    }

    if (!config.combo_multipliers) {
      errors.push('Combo multipliers are required');
    } else {
      if (config.combo_multipliers.two_tricks < 1 || config.combo_multipliers.two_tricks > 2) {
        errors.push('Two tricks multiplier must be between 1 and 2');
      }
      if (config.combo_multipliers.three_tricks < 1 || config.combo_multipliers.three_tricks > 2) {
        errors.push('Three tricks multiplier must be between 1 and 2');
      }
      if (config.combo_multipliers.four_tricks < 1 || config.combo_multipliers.four_tricks > 2) {
        errors.push('Four tricks multiplier must be between 1 and 2');
      }
      if (config.combo_multipliers.five_plus_tricks < 1 || config.combo_multipliers.five_plus_tricks > 2) {
        errors.push('Five plus tricks multiplier must be between 1 and 2');
      }
    }

    if (!config.score_weights) {
      errors.push('Score weights are required');
    } else {
      const total = (config.score_weights.best_trick || 0) + (config.score_weights.run || 0);
      if (Math.abs(total - 1) > 0.01) {
        errors.push('Score weights must sum to 1');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
