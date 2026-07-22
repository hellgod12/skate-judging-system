import { createClient } from '@/utils/supabase/client';
import type { Rider, RiderProfile, CreateRiderData, UpdateRiderData } from './types/rider';

export class RiderService {
  /**
   * Get all riders for an organization
   */
  static async getRiders(organizationId?: string): Promise<Rider[]> {
    try {
    const supabase = await createClient();
      let query = supabase
        .from('riders')
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

      return data as Rider[];
    } catch (error) {
      console.error('Get riders error:', error);
      throw error;
    }
  }

  /**
   * Get rider by ID
   */
  static async getRiderById(id: string): Promise<Rider> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('riders')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Rider;
    } catch (error) {
      console.error('Get rider error:', error);
      throw error;
    }
  }

  /**
   * Create new rider
   */
  static async createRider(data: CreateRiderData): Promise<Rider> {
    try {
    const supabase = await createClient();
      const { data: rider, error } = await supabase
        .from('riders')
        .insert({
          organization_id: data.organization_id,
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          display_name: data.display_name,
          date_of_birth: data.date_of_birth,
          nationality_code: data.nationality_code,
          residence_country_code: data.residence_country_code,
          gender: data.gender,
          height_cm: data.height_cm,
          weight_kg: data.weight_kg,
          stance: data.stance,
          sponsor_team: data.sponsor_team,
          profile_image_url: data.profile_image_url,
          bio: data.bio,
          social_media: data.social_media || {},
          is_active: true,
          is_professional: data.is_professional || false,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return rider as Rider;
    } catch (error) {
      console.error('Create rider error:', error);
      throw error;
    }
  }

  /**
   * Update rider
   */
  static async updateRider(id: string, data: UpdateRiderData): Promise<Rider> {
    try {
    const supabase = await createClient();
      const { data: rider, error } = await supabase
        .from('riders')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return rider as Rider;
    } catch (error) {
      console.error('Update rider error:', error);
      throw error;
    }
  }

  /**
   * Delete rider (soft delete)
   */
  static async deleteRider(id: string): Promise<void> {
    try {
    const supabase = await createClient();
      const { error } = await supabase
        .from('riders')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete rider error:', error);
      throw error;
    }
  }

  /**
   * Get rider profile
   */
  static async getRiderProfile(riderId: string): Promise<RiderProfile> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('rider_profiles')
        .select('*')
        .eq('rider_id', riderId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as RiderProfile;
    } catch (error) {
      console.error('Get rider profile error:', error);
      throw error;
    }
  }

  /**
   * Update rider profile
   */
  static async updateRiderProfile(riderId: string, data: Partial<RiderProfile>): Promise<RiderProfile> {
    try {
    const supabase = await createClient();
      const { data: profile, error } = await supabase
        .from('rider_profiles')
        .update(data)
        .eq('rider_id', riderId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return profile as RiderProfile;
    } catch (error) {
      console.error('Update rider profile error:', error);
      throw error;
    }
  }

  /**
   * Get rider statistics
   */
  static async getRiderStatistics(riderId: string): Promise<Record<string, any>> {
    try {
      const profile = await this.getRiderProfile(riderId);
      return profile.statistics;
    } catch (error) {
      console.error('Get rider statistics error:', error);
      throw error;
    }
  }

  /**
   * Search riders by name
   */
  static async searchRiders(query: string, organizationId?: string): Promise<Rider[]> {
    try {
    const supabase = await createClient();
      let dbQuery = supabase
        .from('riders')
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

      return data as Rider[];
    } catch (error) {
      console.error('Search riders error:', error);
      throw error;
    }
  }

  /**
   * Get riders by category
   */
  static async getRidersByCategory(categoryId: string): Promise<Rider[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('rider_profiles')
        .select('riders(*)')
        .eq('category_id', categoryId);

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item: any) => item.riders) as Rider[];
    } catch (error) {
      console.error('Get riders by category error:', error);
      throw error;
    }
  }

  /**
   * Get riders by division
   */
  static async getRidersByDivision(divisionId: string): Promise<Rider[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('rider_profiles')
        .select('riders(*)')
        .eq('division_id', divisionId);

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item: any) => item.riders) as Rider[];
    } catch (error) {
      console.error('Get riders by division error:', error);
      throw error;
    }
  }
}
