export interface JudgeScore {
  id: string;
  event_id: string;
  heat_id?: string;
  rider_id: string;
  judge_id: string;
  attempt_type: string;
  attempt_number: number;
  trick_id?: string;
  combo_tricks?: string[];
  modifiers: Record<string, number>;
  base_score: number;
  modifier_score: number;
  final_score: number;
  is_locked: boolean;
  is_overridden: boolean;
  overridden_by?: string;
  overridden_at?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJudgeScoreData {
  event_id: string;
  heat_id?: string;
  rider_id: string;
  judge_id: string;
  attempt_type: string;
  attempt_number: number;
  trick_id?: string;
  combo_tricks?: string[];
  modifiers: Record<string, number>;
  base_score: number;
  modifier_score: number;
  final_score: number;
}

export interface UpdateJudgeScoreData {
  modifiers?: Record<string, number>;
  base_score?: number;
  modifier_score?: number;
  final_score?: number;
  is_locked?: boolean;
  is_overridden?: boolean;
  overridden_by?: string;
  overridden_at?: string;
}

export interface ScoreValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
