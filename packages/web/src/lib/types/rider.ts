export interface Rider {
  id: string;
  organization_id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  date_of_birth?: string;
  nationality_code?: string;
  residence_country_code?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  stance?: string;
  sponsor_team?: string;
  profile_image_url?: string;
  bio?: string;
  social_media?: Record<string, any>;
  is_active: boolean;
  is_professional: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface RiderProfile {
  id: string;
  rider_id: string;
  category_id?: string;
  division_id?: string;
  ranking?: number;
  points: number;
  wins: number;
  podiums: number;
  total_competitions: number;
  best_trick?: string;
  signature_tricks: string[];
  equipment: Record<string, any>;
  achievements: any[];
  statistics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateRiderData {
  organization_id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  date_of_birth?: string;
  nationality_code?: string;
  residence_country_code?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  stance?: string;
  sponsor_team?: string;
  profile_image_url?: string;
  bio?: string;
  social_media?: Record<string, any>;
  is_professional?: boolean;
}

export interface UpdateRiderData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  date_of_birth?: string;
  nationality_code?: string;
  residence_country_code?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  stance?: string;
  sponsor_team?: string;
  profile_image_url?: string;
  bio?: string;
  social_media?: Record<string, any>;
  is_active?: boolean;
  is_professional?: boolean;
}
