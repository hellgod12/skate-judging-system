import { supabase } from './supabase';
import type { Sponsor, CreateSponsorData, UpdateSponsorData } from './types/sponsor';

export class SponsorService {
  /**
   * Get all sponsors for an organization
   */
  static async getSponsors(organizationId?: string): Promise<Sponsor[]> {
    try {
      let query = supabase
        .from('sponsors')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.is('organization_id', null);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Sponsor[];
    } catch (error) {
      console.error('Get sponsors error:', error);
      throw error;
    }
  }

  /**
   * Get sponsors by tier
   */
  static async getSponsorsByTier(tier: string, organizationId?: string): Promise<Sponsor[]> {
    try {
      let query = supabase
        .from('sponsors')
        .select('*')
        .eq('tier', tier)
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.is('organization_id', null);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Sponsor[];
    } catch (error) {
      console.error('Get sponsors by tier error:', error);
      throw error;
    }
  }

  /**
   * Get sponsor by ID
   */
  static async getSponsorById(id: string): Promise<Sponsor> {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Sponsor;
    } catch (error) {
      console.error('Get sponsor error:', error);
      throw error;
    }
  }

  /**
   * Create new sponsor
   */
  static async createSponsor(data: CreateSponsorData): Promise<Sponsor> {
    try {
      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .insert({
          organization_id: data.organization_id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          logo_url: data.logo_url,
          website_url: data.website_url,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          tier: data.tier,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return sponsor as Sponsor;
    } catch (error) {
      console.error('Create sponsor error:', error);
      throw error;
    }
  }

  /**
   * Update sponsor
   */
  static async updateSponsor(id: string, data: UpdateSponsorData): Promise<Sponsor> {
    try {
      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return sponsor as Sponsor;
    } catch (error) {
      console.error('Update sponsor error:', error);
      throw error;
    }
  }

  /**
   * Delete sponsor (soft delete)
   */
  static async deleteSponsor(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete sponsor error:', error);
      throw error;
    }
  }


  /**
   * Get active sponsors for display
   */
  static async getActiveSponsors(organizationId?: string): Promise<Sponsor[]> {
    try {
      const sponsors = await this.getSponsors(organizationId);
      return sponsors.filter(s => s.is_active);
    } catch (error) {
      console.error('Get active sponsors error:', error);
      throw error;
    }
  }

  /**
   * Get sponsors for event display
   */
  static async getEventSponsors(eventId: string): Promise<Sponsor[]> {
    try {
      const { data, error } = await supabase
        .from('event_sponsors')
        .select('sponsors(*)')
        .eq('event_id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item: any) => item.sponsors) as Sponsor[];
    } catch (error) {
      console.error('Get event sponsors error:', error);
      throw error;
    }
  }

  /**
   * Add sponsor to event
   */
  static async addSponsorToEvent(eventId: string, sponsorId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('event_sponsors')
        .insert({
          event_id: eventId,
          sponsor_id: sponsorId,
        });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Add sponsor to event error:', error);
      throw error;
    }
  }

  /**
   * Remove sponsor from event
   */
  static async removeSponsorFromEvent(eventId: string, sponsorId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('event_sponsors')
        .delete()
        .eq('event_id', eventId)
        .eq('sponsor_id', sponsorId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Remove sponsor from event error:', error);
      throw error;
    }
  }
}
