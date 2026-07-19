import { supabase } from './supabase';
import type { Judge, JudgeAssignment, CreateJudgeData, UpdateJudgeData, AssignJudgeData } from './types/judge';

export class JudgeService {
  /**
   * Get all judges for an organization
   */
  static async getJudges(organizationId?: string): Promise<Judge[]> {
    try {
      let query = supabase
        .from('judges')
        .select('*')
        .is('deleted_at', null)
        .order('last_name', { ascending: true });

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.is('organization_id', null);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Judge[];
    } catch (error) {
      console.error('Get judges error:', error);
      throw error;
    }
  }

  /**
   * Get judge by ID
   */
  static async getJudgeById(id: string): Promise<Judge> {
    try {
      const { data, error } = await supabase
        .from('judges')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Judge;
    } catch (error) {
      console.error('Get judge error:', error);
      throw error;
    }
  }

  /**
   * Create new judge
   */
  static async createJudge(data: CreateJudgeData): Promise<Judge> {
    try {
      const { data: judge, error } = await supabase
        .from('judges')
        .insert({
          organization_id: data.organization_id,
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          display_name: data.display_name,
          certification: data.certification,
          experience_years: data.experience_years,
          specialties: data.specialties || [],
          bio: data.bio,
          profile_image_url: data.profile_image_url,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return judge as Judge;
    } catch (error) {
      console.error('Create judge error:', error);
      throw error;
    }
  }

  /**
   * Update judge
   */
  static async updateJudge(id: string, data: UpdateJudgeData): Promise<Judge> {
    try {
      const { data: judge, error } = await supabase
        .from('judges')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return judge as Judge;
    } catch (error) {
      console.error('Update judge error:', error);
      throw error;
    }
  }

  /**
   * Delete judge (soft delete)
   */
  static async deleteJudge(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('judges')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete judge error:', error);
      throw error;
    }
  }

  /**
   * Get judge assignments for an event
   */
  static async getJudgeAssignments(eventId: string): Promise<JudgeAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('judge_assignments')
        .select('*, judges(*)')
        .eq('event_id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      return data as JudgeAssignment[];
    } catch (error) {
      console.error('Get judge assignments error:', error);
      throw error;
    }
  }

  /**
   * Assign judge to event
   */
  static async assignJudge(data: AssignJudgeData): Promise<JudgeAssignment> {
    try {
      const { data: assignment, error } = await supabase
        .from('judge_assignments')
        .insert({
          event_id: data.event_id,
          judge_id: data.judge_id,
          role: data.role,
          weight: data.weight || 1.0,
          assigned_by: data.assigned_by,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return assignment as JudgeAssignment;
    } catch (error) {
      console.error('Assign judge error:', error);
      throw error;
    }
  }

  /**
   * Remove judge assignment
   */
  static async removeJudgeAssignment(assignmentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('judge_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Remove judge assignment error:', error);
      throw error;
    }
  }

  /**
   * Update judge assignment
   */
  static async updateJudgeAssignment(assignmentId: string, data: Partial<AssignJudgeData>): Promise<JudgeAssignment> {
    try {
      const updates: any = {};
      if (data.role) updates.role = data.role;
      if (data.weight !== undefined) updates.weight = data.weight;

      const { data: assignment, error } = await supabase
        .from('judge_assignments')
        .update(updates)
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return assignment as JudgeAssignment;
    } catch (error) {
      console.error('Update judge assignment error:', error);
      throw error;
    }
  }

  /**
   * Get judges by certification
   */
  static async getJudgesByCertification(certification: string, organizationId?: string): Promise<Judge[]> {
    try {
      let query = supabase
        .from('judges')
        .select('*')
        .is('deleted_at', null)
        .eq('certification', certification);

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.is('organization_id', null);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Judge[];
    } catch (error) {
      console.error('Get judges by certification error:', error);
      throw error;
    }
  }

  /**
   * Get judges by specialty
   */
  static async getJudgesBySpecialty(specialty: string, organizationId?: string): Promise<Judge[]> {
    try {
      let query = supabase
        .from('judges')
        .select('*')
        .is('deleted_at', null)
        .contains('specialties', [specialty]);

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.is('organization_id', null);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Judge[];
    } catch (error) {
      console.error('Get judges by specialty error:', error);
      throw error;
    }
  }

  /**
   * Search judges by name
   */
  static async searchJudges(query: string, organizationId?: string): Promise<Judge[]> {
    try {
      let dbQuery = supabase
        .from('judges')
        .select('*')
        .is('deleted_at', null)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,display_name.ilike.%${query}%`);

      if (organizationId) {
        dbQuery = dbQuery.eq('organization_id', organizationId);
      } else {
        dbQuery = dbQuery.is('organization_id', null);
      }

      const { data, error } = await dbQuery;

      if (error) {
        throw new Error(error.message);
      }

      return data as Judge[];
    } catch (error) {
      console.error('Search judges error:', error);
      throw error;
    }
  }
}
