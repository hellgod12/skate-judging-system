export interface JudgeSession {
  id: string;
  event_id: string;
  judge_id: string;
  session_type: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OperatorSession {
  id: string;
  event_id: string;
  operator_id: string;
  session_type: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateJudgeSessionData {
  event_id: string;
  judge_id: string;
  session_type: string;
  metadata?: Record<string, any>;
}

export interface CreateOperatorSessionData {
  event_id: string;
  operator_id: string;
  session_type: string;
  metadata?: Record<string, any>;
}

export interface UpdateSessionData {
  is_active?: boolean;
  end_time?: string;
  metadata?: Record<string, any>;
}
