export interface ArchivedEvent {
  id: string;
  original_event_id: string;
  event_name: string;
  organization_id?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  status: string;
  participant_count: number;
  total_scores: number;
  leaderboard_data: Record<string, any>;
  archived_by: string;
  archived_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateArchiveData {
  original_event_id: string;
  event_name: string;
  organization_id?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  status: string;
  participant_count: number;
  total_scores: number;
  leaderboard_data: Record<string, any>;
  archived_by: string;
}

export interface ArchiveSearchParams {
  organization_id?: string;
  event_type?: string;
  date_range?: {
    start: string;
    end: string;
  };
  status?: string;
  search_query?: string;
  limit?: number;
  offset?: number;
}
