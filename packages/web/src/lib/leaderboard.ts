import { createClient } from '@/utils/supabase/client';
import { ScoreService } from './score';
import { RiderService } from './rider';
import { CompetitionSettingsService } from './competition-settings';
import type { Leaderboard, LeaderboardEntry, CreateLeaderboardData } from './types/leaderboard';

export class LeaderboardService {
  /**
   * Calculate leaderboard for an event
   */
  static async calculateLeaderboard(eventId: string): Promise<Leaderboard> {
    try {
      const scores = await ScoreService.getEventScores(eventId);
      const settings = await CompetitionSettingsService.getEventSettings(eventId);
      
      // Group scores by rider
      const riderScores = new Map<string, any[]>();
      scores.forEach(score => {
        if (!riderScores.has(score.rider_id)) {
          riderScores.set(score.rider_id, []);
        }
        riderScores.get(score.rider_id)!.push(score);
      });

      // Calculate rider statistics
      const entries: LeaderboardEntry[] = [];
      const scoringConfig = settings.scoring_config || {};

      for (const [riderId, riderScoreList] of riderScores.entries()) {
        const rider = await RiderService.getRiderById(riderId);
        
        const bestTrickScores = riderScoreList
          .filter(s => s.attempt_type === 'single')
          .map(s => s.final_score)
          .sort((a, b) => b - a)
          .slice(0, 5);

        const runScores = riderScoreList
          .filter(s => s.attempt_type === 'run')
          .map(s => s.final_score)
          .sort((a, b) => b - a);

        const bestTrickTotal = bestTrickScores.reduce((sum, score) => sum + score, 0);
        const bestRunScore = runScores.length > 0 ? runScores[0] : 0;

        const scoreWeights = scoringConfig.score_weights || { best_trick: 0.6, run: 0.4 };
        const totalScore = (bestTrickTotal * scoreWeights.best_trick) + (bestRunScore * scoreWeights.run);
        const averageScore = riderScoreList.length > 0 
          ? riderScoreList.reduce((sum, s) => sum + s.final_score, 0) / riderScoreList.length 
          : 0;

        entries.push({
          rank: 0, // Will be calculated after sorting
          rider_id: riderId,
          rider_name: `${rider.first_name} ${rider.last_name}`,
          total_score: totalScore,
          best_trick_score: bestTrickTotal,
          run_score: bestRunScore,
          average_score: averageScore,
          attempts_count: riderScoreList.length,
          last_updated: new Date().toISOString(),
        });
      }

      // Sort by total score and assign ranks
      entries.sort((a, b) => b.total_score - a.total_score);
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      return {
        event_id: eventId,
        entries,
        last_updated: new Date().toISOString(),
        scoring_config: scoringConfig,
      };
    } catch (error) {
      console.error('Calculate leaderboard error:', error);
      throw error;
    }
  }

  /**
   * Get current leaderboard for an event
   */
  static async getLeaderboard(eventId: string): Promise<Leaderboard> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('event_id', eventId)
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no leaderboard exists, calculate it
        return await this.calculateLeaderboard(eventId);
      }

      return data as Leaderboard;
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  /**
   * Save leaderboard
   */
  static async saveLeaderboard(data: CreateLeaderboardData): Promise<Leaderboard> {
    try {
    const supabase = await createClient();
      const { data: leaderboard, error } = await supabase
        .from('leaderboards')
        .insert({
          event_id: data.event_id,
          entries: data.entries,
          scoring_config: data.scoring_config,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return leaderboard as Leaderboard;
    } catch (error) {
      console.error('Save leaderboard error:', error);
      throw error;
    }
  }

  /**
   * Update leaderboard
   */
  static async updateLeaderboard(eventId: string): Promise<Leaderboard> {
    try {
      const supabase = await createClient();
      const leaderboard = await this.calculateLeaderboard(eventId);

      // Delete existing leaderboard
      await supabase
        .from('leaderboards')
        .delete()
        .eq('event_id', eventId);

      // Save new leaderboard
      return await this.saveLeaderboard(leaderboard);
    } catch (error) {
      console.error('Update leaderboard error:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard entry for a rider
   */
  static async getRiderLeaderboardEntry(eventId: string, riderId: string): Promise<LeaderboardEntry | null> {
    try {
      const leaderboard = await this.getLeaderboard(eventId);
      return leaderboard.entries.find(e => e.rider_id === riderId) || null;
    } catch (error) {
      console.error('Get rider leaderboard entry error:', error);
      throw error;
    }
  }

  /**
   * Get top N riders
   */
  static async getTopRiders(eventId: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const leaderboard = await this.getLeaderboard(eventId);
      return leaderboard.entries.slice(0, limit);
    } catch (error) {
      console.error('Get top riders error:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time leaderboard updates
   */
  static subscribeToLeaderboard(eventId: string, callback: (leaderboard: Leaderboard) => void) {
    const supabase = createClient();
    return supabase
      .channel(`leaderboard:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboards',
          filter: `event_id=eq.${eventId}`,
        },
        async (payload: any) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            callback(payload.new as Leaderboard);
          }
        }
      )
      .subscribe();
  }

  /**
   * Unsubscribe from leaderboard updates
   */
  static unsubscribeFromLeaderboard(eventId: string) {
    const supabase = createClient();
    supabase.channel(`leaderboard:${eventId}`).unsubscribe();
  }

  /**
   * Get leaderboard history for an event
   */
  static async getLeaderboardHistory(eventId: string, limit: number = 10): Promise<Leaderboard[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('event_id', eventId)
        .order('last_updated', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return data as Leaderboard[];
    } catch (error) {
      console.error('Get leaderboard history error:', error);
      throw error;
    }
  }
}
