export interface Judge {
  id: string;
  organization_id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  certification?: string;
  experience_years?: number;
  specialties: string[];
  bio?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface JudgeAssignment {
  id: string;
  event_id: string;
  judge_id: string;
  role: string;
  weight: number;
  assigned_at: string;
  assigned_by?: string;
}

export interface CreateJudgeData {
  organization_id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  certification?: string;
  experience_years?: number;
  specialties?: string[];
  bio?: string;
  profile_image_url?: string;
}

export interface UpdateJudgeData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  certification?: string;
  experience_years?: number;
  specialties?: string[];
  bio?: string;
  profile_image_url?: string;
  is_active?: boolean;
}

export interface AssignJudgeData {
  event_id: string;
  judge_id: string;
  role: string;
  weight?: number;
  assigned_by?: string;
}
