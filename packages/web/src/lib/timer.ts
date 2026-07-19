import { supabase } from './supabase';
import type { Timer, CreateTimerData, UpdateTimerData } from './types/timer';

export class TimerService {
  /**
   * Get active timer for an event
   */
  static async getActiveTimer(eventId: string, timerType?: string): Promise<Timer | null> {
    try {
      let query = supabase
        .from('timers')
        .select('*')
        .eq('event_id', eventId)
        .eq('status', 'running')
        .order('created_at', { ascending: false })
        .limit(1);

      if (timerType) {
        query = query.eq('timer_type', timerType);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data && data.length > 0 ? data[0] as Timer : null;
    } catch (error) {
      console.error('Get active timer error:', error);
      throw error;
    }
  }

  /**
   * Get timer by ID
   */
  static async getTimerById(id: string): Promise<Timer> {
    try {
      const { data, error } = await supabase
        .from('timers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Timer;
    } catch (error) {
      console.error('Get timer error:', error);
      throw error;
    }
  }

  /**
   * Create new timer
   */
  static async createTimer(data: CreateTimerData): Promise<Timer> {
    try {
      const { data: timer, error } = await supabase
        .from('timers')
        .insert({
          event_id: data.event_id,
          timer_type: data.timer_type,
          duration_seconds: data.duration_seconds,
          remaining_seconds: data.duration_seconds,
          status: 'idle',
          metadata: data.metadata || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return timer as Timer;
    } catch (error) {
      console.error('Create timer error:', error);
      throw error;
    }
  }

  /**
   * Update timer
   */
  static async updateTimer(id: string, data: UpdateTimerData): Promise<Timer> {
    try {
      const { data: timer, error } = await supabase
        .from('timers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return timer as Timer;
    } catch (error) {
      console.error('Update timer error:', error);
      throw error;
    }
  }

  /**
   * Start timer
   */
  static async startTimer(id: string): Promise<Timer> {
    try {
      return await this.updateTimer(id, {
        status: 'running',
        start_time: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Start timer error:', error);
      throw error;
    }
  }

  /**
   * Pause timer
   */
  static async pauseTimer(id: string): Promise<Timer> {
    try {
      return await this.updateTimer(id, {
        status: 'paused',
      });
    } catch (error) {
      console.error('Pause timer error:', error);
      throw error;
    }
  }

  /**
   * Resume timer
   */
  static async resumeTimer(id: string): Promise<Timer> {
    try {
      return await this.updateTimer(id, {
        status: 'running',
      });
    } catch (error) {
      console.error('Resume timer error:', error);
      throw error;
    }
  }

  /**
   * Stop timer
   */
  static async stopTimer(id: string): Promise<Timer> {
    try {
      return await this.updateTimer(id, {
        status: 'stopped',
        end_time: new Date().toISOString(),
        remaining_seconds: 0,
      });
    } catch (error) {
      console.error('Stop timer error:', error);
      throw error;
    }
  }

  /**
   * Reset timer
   */
  static async resetTimer(id: string): Promise<Timer> {
    try {
      const timer = await this.getTimerById(id);
      return await this.updateTimer(id, {
        remaining_seconds: timer.duration_seconds,
        status: 'idle',
      });
    } catch (error) {
      console.error('Reset timer error:', error);
      throw error;
    }
  }

  /**
   * Update timer remaining time
   */
  static async updateRemainingTime(id: string, remainingSeconds: number): Promise<Timer> {
    try {
      const timer = await this.updateTimer(id, { remaining_seconds: remainingSeconds });

      // Auto-stop if time is up
      if (remainingSeconds <= 0) {
        await this.stopTimer(id);
      }

      return timer;
    } catch (error) {
      console.error('Update remaining time error:', error);
      throw error;
    }
  }

  /**
   * Get all timers for an event
   */
  static async getEventTimers(eventId: string): Promise<Timer[]> {
    try {
      const { data, error } = await supabase
        .from('timers')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Timer[];
    } catch (error) {
      console.error('Get event timers error:', error);
      throw error;
    }
  }

  /**
   * Delete timer
   */
  static async deleteTimer(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('timers')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete timer error:', error);
      throw error;
    }
  }

  /**
   * Create countdown timer
   */
  static async createCountdownTimer(eventId: string, durationSeconds: number): Promise<Timer> {
    return await this.createTimer({
      event_id: eventId,
      timer_type: 'countdown',
      duration_seconds: durationSeconds,
      metadata: { type: 'countdown' },
    });
  }

  /**
   * Create run timer
   */
  static async createRunTimer(eventId: string, durationSeconds: number): Promise<Timer> {
    return await this.createTimer({
      event_id: eventId,
      timer_type: 'run',
      duration_seconds: durationSeconds,
      metadata: { type: 'run' },
    });
  }

  /**
   * Create jam timer
   */
  static async createJamTimer(eventId: string, durationSeconds: number): Promise<Timer> {
    return await this.createTimer({
      event_id: eventId,
      timer_type: 'jam',
      duration_seconds: durationSeconds,
      metadata: { type: 'jam' },
    });
  }
}
