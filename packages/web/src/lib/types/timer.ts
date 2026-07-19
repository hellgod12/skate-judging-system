export interface Timer {
  id: string;
  event_id: string;
  timer_type: string;
  duration_seconds: number;
  remaining_seconds: number;
  status: string;
  start_time?: string;
  end_time?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateTimerData {
  event_id: string;
  timer_type: string;
  duration_seconds: number;
  metadata?: Record<string, any>;
}

export interface UpdateTimerData {
  remaining_seconds?: number;
  status?: string;
  start_time?: string;
  end_time?: string;
  metadata?: Record<string, any>;
}
