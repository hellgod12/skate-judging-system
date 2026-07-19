export interface EventBranding {
  id: string;
  event_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  logo_url?: string;
  logo_position: string;
  banner_url?: string;
  favicon_url?: string;
  browser_title?: string;
  custom_css?: string;
  lower_third_config: Record<string, any>;
  winner_screen_config: Record<string, any>;
  animations_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateEventBrandingData {
  event_id: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  text_color?: string;
  font_family?: string;
  logo_url?: string;
  logo_position?: string;
  banner_url?: string;
  favicon_url?: string;
  browser_title?: string;
  custom_css?: string;
  lower_third_config?: Record<string, any>;
  winner_screen_config?: Record<string, any>;
  animations_config?: Record<string, any>;
}

export interface UpdateEventBrandingData {
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  text_color?: string;
  font_family?: string;
  logo_url?: string;
  logo_position?: string;
  banner_url?: string;
  favicon_url?: string;
  browser_title?: string;
  custom_css?: string;
  lower_third_config?: Record<string, any>;
  winner_screen_config?: Record<string, any>;
  animations_config?: Record<string, any>;
}
