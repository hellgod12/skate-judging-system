export interface Event {
  id: string;
  organization_id: string;
  venue_id?: string;
  template_id?: string;
  name: string;
  slug: string;
  description?: string;
  event_type: string;
  status: string;
  start_date: string;
  end_date: string;
  registration_start_date?: string;
  registration_end_date?: string;
  max_participants?: number;
  entry_fee?: number;
  prize_pool?: Record<string, any>;
  scoring_config: Record<string, any>;
  run_config: Record<string, any>;
  best_trick_config: Record<string, any>;
  jam_config: Record<string, any>;
  timer_config: Record<string, any>;
  is_public: boolean;
  is_featured: boolean;
  image_url?: string;
  banner_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CompetitionTemplate {
  id: string;
  organization_id?: string;
  name: string;
  slug: string;
  description?: string;
  format_type: string;
  scoring_config: Record<string, any>;
  run_config: Record<string, any>;
  best_trick_config: Record<string, any>;
  jam_config: Record<string, any>;
  timer_config: Record<string, any>;
  display_config: Record<string, any>;
  is_public: boolean;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateEventData {
  organization_id: string;
  venue_id?: string;
  template_id?: string;
  name: string;
  slug: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  registration_start_date?: string;
  registration_end_date?: string;
  max_participants?: number;
  entry_fee?: number;
  prize_pool?: Record<string, any>;
  scoring_config?: Record<string, any>;
  run_config?: Record<string, any>;
  best_trick_config?: Record<string, any>;
  jam_config?: Record<string, any>;
  timer_config?: Record<string, any>;
  is_public?: boolean;
  is_featured?: boolean;
  image_url?: string;
  banner_url?: string;
}

export interface UpdateEventData {
  venue_id?: string;
  template_id?: string;
  name?: string;
  description?: string;
  event_type?: string;
  start_date?: string;
  end_date?: string;
  registration_start_date?: string;
  registration_end_date?: string;
  max_participants?: number;
  entry_fee?: number;
  prize_pool?: Record<string, any>;
  scoring_config?: Record<string, any>;
  run_config?: Record<string, any>;
  best_trick_config?: Record<string, any>;
  jam_config?: Record<string, any>;
  timer_config?: Record<string, any>;
  status?: string;
  is_public?: boolean;
  is_featured?: boolean;
  image_url?: string;
  banner_url?: string;
}

export interface CreateTemplateData {
  organization_id?: string;
  name: string;
  slug: string;
  description?: string;
  format_type: string;
  scoring_config: Record<string, any>;
  run_config: Record<string, any>;
  best_trick_config: Record<string, any>;
  jam_config: Record<string, any>;
  timer_config: Record<string, any>;
  display_config: Record<string, any>;
  is_public?: boolean;
}
