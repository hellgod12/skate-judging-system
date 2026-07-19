import { supabase } from './supabase';
import type { Organization, CreateOrganizationData, UpdateOrganizationData } from './types/organization';

export class OrganizationService {
  /**
   * Get all organizations
   */
  static async getOrganizations(): Promise<Organization[]> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Organization[];
    } catch (error) {
      console.error('Get organizations error:', error);
      throw error;
    }
  }

  /**
   * Get organization by ID
   */
  static async getOrganizationById(id: string): Promise<Organization> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Organization;
    } catch (error) {
      console.error('Get organization error:', error);
      throw error;
    }
  }

  /**
   * Get organization by slug
   */
  static async getOrganizationBySlug(slug: string): Promise<Organization> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Organization;
    } catch (error) {
      console.error('Get organization by slug error:', error);
      throw error;
    }
  }

  /**
   * Create new organization
   */
  static async createOrganization(data: CreateOrganizationData): Promise<Organization> {
    try {
      const { data: organization, error } = await supabase
        .from('organizations')
        .insert({
          name: data.name,
          slug: data.slug,
          description: data.description,
          logo_url: data.logo_url,
          website_url: data.website_url,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country_code: data.country_code,
          postal_code: data.postal_code,
          settings: data.settings || {},
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return organization as Organization;
    } catch (error) {
      console.error('Create organization error:', error);
      throw error;
    }
  }

  /**
   * Update organization
   */
  static async updateOrganization(id: string, data: UpdateOrganizationData): Promise<Organization> {
    try {
      const { data: organization, error } = await supabase
        .from('organizations')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return organization as Organization;
    } catch (error) {
      console.error('Update organization error:', error);
      throw error;
    }
  }

  /**
   * Delete organization (soft delete)
   */
  static async deleteOrganization(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete organization error:', error);
      throw error;
    }
  }

  /**
   * Get organization settings
   */
  static async getOrganizationSettings(id: string): Promise<Record<string, any>> {
    try {
      const org = await this.getOrganizationById(id);
      return org.settings;
    } catch (error) {
      console.error('Get organization settings error:', error);
      throw error;
    }
  }

  /**
   * Update organization settings
   */
  static async updateOrganizationSettings(id: string, settings: Record<string, any>): Promise<Organization> {
    try {
      return await this.updateOrganization(id, { settings });
    } catch (error) {
      console.error('Update organization settings error:', error);
      throw error;
    }
  }

  /**
   * Get organization members count
   */
  static async getOrganizationMembersCount(id: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', id);

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    } catch (error) {
      console.error('Get organization members count error:', error);
      throw error;
    }
  }

  /**
   * Get organization events count
   */
  static async getOrganizationEventsCount(id: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', id);

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    } catch (error) {
      console.error('Get organization events count error:', error);
      throw error;
    }
  }
}
