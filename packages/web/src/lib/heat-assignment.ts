import { createClient } from '@/utils/supabase/client';
import type { HeatAssignment, CreateHeatAssignmentData, UpdateHeatAssignmentData } from './types/heat-assignment';

export class HeatAssignmentService {
  /**
   * Get all assignments for a heat
   */
  static async getHeatAssignments(heatId: string): Promise<HeatAssignment[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('heat_assignments')
        .select('*, riders(*)')
        .eq('heat_id', heatId)
        .order('start_order', { ascending: true, nullsFirst: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as HeatAssignment[];
    } catch (error) {
      console.error('Get heat assignments error:', error);
      throw error;
    }
  }

  /**
   * Get assignment by ID
   */
  static async getHeatAssignmentById(id: string): Promise<HeatAssignment> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('heat_assignments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as HeatAssignment;
    } catch (error) {
      console.error('Get heat assignment error:', error);
      throw error;
    }
  }

  /**
   * Create new heat assignment
   */
  static async createHeatAssignment(data: CreateHeatAssignmentData): Promise<HeatAssignment> {
    try {
      const supabase = await createClient();
      const { data: assignment, error } = await supabase
        .from('heat_assignments')
        .insert({
          heat_id: data.heat_id,
          rider_id: data.rider_id,
          registration_id: data.registration_id,
          start_order: data.start_order,
          lane: data.lane,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return assignment as HeatAssignment;
    } catch (error) {
      console.error('Create heat assignment error:', error);
      throw error;
    }
  }

  /**
   * Update heat assignment
   */
  static async updateHeatAssignment(id: string, data: UpdateHeatAssignmentData): Promise<HeatAssignment> {
    try {
    const supabase = await createClient();
      const { data: assignment, error } = await supabase
        .from('heat_assignments')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return assignment as HeatAssignment;
    } catch (error) {
      console.error('Update heat assignment error:', error);
      throw error;
    }
  }

  /**
   * Delete heat assignment
   */
  static async deleteHeatAssignment(id: string): Promise<void> {
    try {
    const supabase = await createClient();
      const { error } = await supabase
        .from('heat_assignments')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete heat assignment error:', error);
      throw error;
    }
  }

  /**
   * Auto-assign riders to heat
   */
  static async autoAssignRiders(heatId: string, riderIds: string[], registrationIds: string[]): Promise<HeatAssignment[]> {
    try {
      const supabase = await createClient();
      const assignments = riderIds.map((riderId, index) => ({
        heat_id: heatId,
        rider_id: riderId,
        registration_id: registrationIds[index],
        start_order: index + 1,
        lane: index + 1,
      }));

      const { data, error } = await supabase
        .from('heat_assignments')
        .insert(assignments)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data as HeatAssignment[];
    } catch (error) {
      console.error('Auto assign riders error:', error);
      throw error;
    }
  }

  /**
   * Reorder assignments
   */
  static async reorderAssignments(heatId: string, assignmentIds: string[]): Promise<HeatAssignment[]> {
    try {
      const supabase = await createClient();
      const updates = assignmentIds.map((id, index) =>
        supabase
          .from('heat_assignments')
          .update({ start_order: index + 1 })
          .eq('id', id)
      );

      await Promise.all(updates);

      return await this.getHeatAssignments(heatId);
    } catch (error) {
      console.error('Reorder assignments error:', error);
      throw error;
    }
  }

  /**
   * Get rider's heat assignments
   */
  static async getRiderHeatAssignments(riderId: string, eventId: string): Promise<HeatAssignment[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('heat_assignments')
        .select('*, heats!inner(round_id), competition_rounds!inner(event_id)')
        .eq('rider_id', riderId)
        .eq('competition_rounds.event_id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      return data as HeatAssignment[];
    } catch (error) {
      console.error('Get rider heat assignments error:', error);
      throw error;
    }
  }

  /**
   * Remove all assignments from heat
   */
  static async clearHeatAssignments(heatId: string): Promise<void> {
    try {
    const supabase = await createClient();
      const { error } = await supabase
        .from('heat_assignments')
        .delete()
        .eq('heat_id', heatId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Clear heat assignments error:', error);
      throw error;
    }
  }
}
