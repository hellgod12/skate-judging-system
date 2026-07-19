import { supabase } from './supabase';
import type { Event, CompetitionTemplate, CreateEventData, UpdateEventData, CreateTemplateData } from './types/event';

export class EventService {
  /**
   * Get all events for an organization
   */
  static async getEvents(organizationId: string): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organization_id', organizationId)
        .is('deleted_at', null)
        .order('start_date', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Event[];
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  }

  /**
   * Get event by ID
   */
  static async getEventById(id: string): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Event;
    } catch (error) {
      console.error('Get event error:', error);
      throw error;
    }
  }

  /**
   * Create new event
   */
  static async createEvent(data: CreateEventData): Promise<Event> {
    try {
      const { data: event, error } = await supabase
        .from('events')
        .insert({
          organization_id: data.organization_id,
          venue_id: data.venue_id,
          template_id: data.template_id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          event_type: data.event_type,
          status: 'draft',
          start_date: data.start_date,
          end_date: data.end_date,
          registration_start_date: data.registration_start_date,
          registration_end_date: data.registration_end_date,
          max_participants: data.max_participants,
          entry_fee: data.entry_fee,
          prize_pool: data.prize_pool,
          scoring_config: data.scoring_config || {},
          run_config: data.run_config || {},
          best_trick_config: data.best_trick_config || {},
          jam_config: data.jam_config || {},
          timer_config: data.timer_config || {},
          is_public: data.is_public || false,
          is_featured: data.is_featured || false,
          image_url: data.image_url,
          banner_url: data.banner_url,
          created_by: data.organization_id, // Will be replaced with actual user ID
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return event as Event;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  /**
   * Update event
   */
  static async updateEvent(id: string, data: UpdateEventData): Promise<Event> {
    try {
      const { data: event, error } = await supabase
        .from('events')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return event as Event;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  }

  /**
   * Delete event (soft delete)
   */
  static async deleteEvent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('events')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }

  /**
   * Publish event
   */
  static async publishEvent(id: string): Promise<Event> {
    try {
      return await this.updateEvent(id, { status: 'published' });
    } catch (error) {
      console.error('Publish event error:', error);
      throw error;
    }
  }

  /**
   * Start event
   */
  static async startEvent(id: string): Promise<Event> {
    try {
      return await this.updateEvent(id, { status: 'in_progress' });
    } catch (error) {
      console.error('Start event error:', error);
      throw error;
    }
  }

  /**
   * Pause event
   */
  static async pauseEvent(id: string): Promise<Event> {
    try {
      return await this.updateEvent(id, { status: 'paused' });
    } catch (error) {
      console.error('Pause event error:', error);
      throw error;
    }
  }

  /**
   * Complete event
   */
  static async completeEvent(id: string): Promise<Event> {
    try {
      return await this.updateEvent(id, { status: 'completed' });
    } catch (error) {
      console.error('Complete event error:', error);
      throw error;
    }
  }

  /**
   * Get competition templates
   */
  static async getTemplates(organizationId?: string): Promise<CompetitionTemplate[]> {
    try {
      let query = supabase
        .from('competition_templates')
        .select('*')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (organizationId) {
        query = query.or(`organization_id.eq.${organizationId},is_public.eq.true`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as CompetitionTemplate[];
    } catch (error) {
      console.error('Get templates error:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(id: string): Promise<CompetitionTemplate> {
    try {
      const { data, error } = await supabase
        .from('competition_templates')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as CompetitionTemplate;
    } catch (error) {
      console.error('Get template error:', error);
      throw error;
    }
  }

  /**
   * Create competition template
   */
  static async createTemplate(data: CreateTemplateData): Promise<CompetitionTemplate> {
    try {
      const { data: template, error } = await supabase
        .from('competition_templates')
        .insert({
          organization_id: data.organization_id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          format_type: data.format_type,
          scoring_config: data.scoring_config,
          run_config: data.run_config,
          best_trick_config: data.best_trick_config,
          jam_config: data.jam_config,
          timer_config: data.timer_config,
          display_config: data.display_config,
          is_public: data.is_public || false,
          is_active: true,
          created_by: data.organization_id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return template as CompetitionTemplate;
    } catch (error) {
      console.error('Create template error:', error);
      throw error;
    }
  }

  /**
   * Update competition template
   */
  static async updateTemplate(id: string, data: Partial<CreateTemplateData>): Promise<CompetitionTemplate> {
    try {
      const { data: template, error } = await supabase
        .from('competition_templates')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return template as CompetitionTemplate;
    } catch (error) {
      console.error('Update template error:', error);
      throw error;
    }
  }

  /**
   * Delete competition template (soft delete)
   */
  static async deleteTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('competition_templates')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete template error:', error);
      throw error;
    }
  }

  /**
   * Get event registrations count
   */
  static async getEventRegistrationsCount(eventId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    } catch (error) {
      console.error('Get event registrations count error:', error);
      throw error;
    }
  }
}
