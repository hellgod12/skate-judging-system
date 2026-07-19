import { supabase } from './supabase';
import type { EventBranding, CreateEventBrandingData, UpdateEventBrandingData } from './types/branding';

export class BrandingService {
  /**
   * Get event branding by event ID
   */
  static async getEventBranding(eventId: string): Promise<EventBranding | null> {
    try {
      const { data, error } = await supabase
        .from('event_branding')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new Error(error.message);
      }

      return data as EventBranding;
    } catch (error) {
      console.error('Get event branding error:', error);
      throw error;
    }
  }

  /**
   * Get branding by ID
   */
  static async getBrandingById(id: string): Promise<EventBranding> {
    try {
      const { data, error } = await supabase
        .from('event_branding')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as EventBranding;
    } catch (error) {
      console.error('Get branding error:', error);
      throw error;
    }
  }

  /**
   * Create or update event branding
   */
  static async upsertEventBranding(data: CreateEventBrandingData): Promise<EventBranding> {
    try {
      const { data: branding, error } = await supabase
        .from('event_branding')
        .upsert({
          event_id: data.event_id,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
          background_color: data.background_color,
          text_color: data.text_color,
          font_family: data.font_family,
          logo_url: data.logo_url,
          logo_position: data.logo_position,
          banner_url: data.banner_url,
          favicon_url: data.favicon_url,
          browser_title: data.browser_title,
          custom_css: data.custom_css,
          lower_third_config: data.lower_third_config,
          winner_screen_config: data.winner_screen_config,
          animations_config: data.animations_config,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return branding as EventBranding;
    } catch (error) {
      console.error('Upsert event branding error:', error);
      throw error;
    }
  }

  /**
   * Update event branding
   */
  static async updateBranding(id: string, data: UpdateEventBrandingData): Promise<EventBranding> {
    try {
      const { data: branding, error } = await supabase
        .from('event_branding')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return branding as EventBranding;
    } catch (error) {
      console.error('Update branding error:', error);
      throw error;
    }
  }

  /**
   * Delete event branding
   */
  static async deleteBranding(eventId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('event_branding')
        .delete()
        .eq('event_id', eventId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete branding error:', error);
      throw error;
    }
  }

  /**
   * Get CSS variables from branding
   */
  static getCSSVariables(branding: EventBranding): Record<string, string> {
    return {
      '--primary-color': branding.primary_color,
      '--secondary-color': branding.secondary_color,
      '--accent-color': branding.accent_color,
      '--background-color': branding.background_color,
      '--text-color': branding.text_color,
      '--font-family': branding.font_family || 'Inter',
    };
  }

  /**
   * Apply branding to document
   */
  static applyBranding(branding: EventBranding): void {
    const variables = this.getCSSVariables(branding);
    const root = document.documentElement;
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (branding.custom_css) {
      const style = document.createElement('style');
      style.textContent = branding.custom_css;
      document.head.appendChild(style);
    }

    if (branding.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = branding.favicon_url;
      }
    }

    if (branding.browser_title) {
      document.title = branding.browser_title;
    }
  }
}
