export interface CompetitionRound {
  id: string;
  event_id: string;
  name: string;
  round_type: string;
  order_index: number;
  start_time?: string;
  end_time?: string;
  status: string;
  scoring_config: Record<string, any>;
  advancement_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Heat {
  id: string;
  round_id: string;
  name: string;
  order_index: number;
  start_time?: string;
  end_time?: string;
  max_participants?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRoundData {
  event_id: string;
  name: string;
  round_type: string;
  order_index: number;
  start_time?: string;
  end_time?: string;
  scoring_config?: Record<string, any>;
  advancement_config?: Record<string, any>;
}

export interface UpdateRoundData {
  name?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  scoring_config?: Record<string, any>;
  advancement_config?: Record<string, any>;
}

export interface CreateHeatData {
  round_id: string;
  name: string;
  order_index: number;
  start_time?: string;
  end_time?: string;
  max_participants?: number;
}

export interface UpdateHeatData {
  name?: string;
  start_time?: string;
  end_time?: string;
  max_participants?: number;
  status?: string;
}
