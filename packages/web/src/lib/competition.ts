import { supabase } from './supabase';
import type { CompetitionRound, Heat, CreateRoundData, UpdateRoundData, CreateHeatData, UpdateHeatData } from './types/competition';

export class CompetitionService {
  /**
   * Get all rounds for an event
   */
  static async getRounds(eventId: string): Promise<CompetitionRound[]> {
    try {
      const { data, error } = await supabase
        .from('competition_rounds')
        .select('*')
        .eq('event_id', eventId)
        .order('order_index', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as CompetitionRound[];
    } catch (error) {
      console.error('Get rounds error:', error);
      throw error;
    }
  }

  /**
   * Get round by ID
   */
  static async getRoundById(id: string): Promise<CompetitionRound> {
    try {
      const { data, error } = await supabase
        .from('competition_rounds')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as CompetitionRound;
    } catch (error) {
      console.error('Get round error:', error);
      throw error;
    }
  }

  /**
   * Create new round
   */
  static async createRound(data: CreateRoundData): Promise<CompetitionRound> {
    try {
      const { data: round, error } = await supabase
        .from('competition_rounds')
        .insert({
          event_id: data.event_id,
          name: data.name,
          round_type: data.round_type,
          order_index: data.order_index,
          start_time: data.start_time,
          end_time: data.end_time,
          status: 'scheduled',
          scoring_config: data.scoring_config || {},
          advancement_config: data.advancement_config || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return round as CompetitionRound;
    } catch (error) {
      console.error('Create round error:', error);
      throw error;
    }
  }

  /**
   * Update round
   */
  static async updateRound(id: string, data: UpdateRoundData): Promise<CompetitionRound> {
    try {
      const { data: round, error } = await supabase
        .from('competition_rounds')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return round as CompetitionRound;
    } catch (error) {
      console.error('Update round error:', error);
      throw error;
    }
  }

  /**
   * Delete round
   */
  static async deleteRound(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('competition_rounds')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete round error:', error);
      throw error;
    }
  }

  /**
   * Start round
   */
  static async startRound(id: string): Promise<CompetitionRound> {
    try {
      return await this.updateRound(id, { status: 'in_progress' });
    } catch (error) {
      console.error('Start round error:', error);
      throw error;
    }
  }

  /**
   * Complete round
   */
  static async completeRound(id: string): Promise<CompetitionRound> {
    try {
      return await this.updateRound(id, { status: 'completed' });
    } catch (error) {
      console.error('Complete round error:', error);
      throw error;
    }
  }

  /**
   * Get all heats for a round
   */
  static async getHeats(roundId: string): Promise<Heat[]> {
    try {
      const { data, error } = await supabase
        .from('heats')
        .select('*')
        .eq('round_id', roundId)
        .order('order_index', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Heat[];
    } catch (error) {
      console.error('Get heats error:', error);
      throw error;
    }
  }

  /**
   * Get heat by ID
   */
  static async getHeatById(id: string): Promise<Heat> {
    try {
      const { data, error } = await supabase
        .from('heats')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Heat;
    } catch (error) {
      console.error('Get heat error:', error);
      throw error;
    }
  }

  /**
   * Create new heat
   */
  static async createHeat(data: CreateHeatData): Promise<Heat> {
    try {
      const { data: heat, error } = await supabase
        .from('heats')
        .insert({
          round_id: data.round_id,
          name: data.name,
          order_index: data.order_index,
          start_time: data.start_time,
          end_time: data.end_time,
          max_participants: data.max_participants,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return heat as Heat;
    } catch (error) {
      console.error('Create heat error:', error);
      throw error;
    }
  }

  /**
   * Update heat
   */
  static async updateHeat(id: string, data: UpdateHeatData): Promise<Heat> {
    try {
      const { data: heat, error } = await supabase
        .from('heats')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return heat as Heat;
    } catch (error) {
      console.error('Update heat error:', error);
      throw error;
    }
  }

  /**
   * Delete heat
   */
  static async deleteHeat(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('heats')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete heat error:', error);
      throw error;
    }
  }

  /**
   * Start heat
   */
  static async startHeat(id: string): Promise<Heat> {
    try {
      return await this.updateHeat(id, { status: 'in_progress' });
    } catch (error) {
      console.error('Start heat error:', error);
      throw error;
    }
  }

  /**
   * Complete heat
   */
  static async completeHeat(id: string): Promise<Heat> {
    try {
      return await this.updateHeat(id, { status: 'completed' });
    } catch (error) {
      console.error('Complete heat error:', error);
      throw error;
    }
  }

  /**
   * Get heat with assignments
   */
  static async getHeatWithAssignments(heatId: string): Promise<Heat & { assignments: any[] }> {
    try {
      const { data, error } = await supabase
        .from('heats')
        .select('*, heat_assignments(*)')
        .eq('id', heatId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Heat & { assignments: any[] };
    } catch (error) {
      console.error('Get heat with assignments error:', error);
      throw error;
    }
  }

  /**
   * Get event structure (rounds and heats)
   */
  static async getEventStructure(eventId: string): Promise<CompetitionRound[]> {
    try {
      const { data, error } = await supabase
        .from('competition_rounds')
        .select('*, heats(*)')
        .eq('event_id', eventId)
        .order('order_index', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as CompetitionRound[];
    } catch (error) {
      console.error('Get event structure error:', error);
      throw error;
    }
  }
}
