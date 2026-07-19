export interface Trick {
  id: string;
  name: string;
  slug: string;
  description?: string;
  difficulty: number;
  category_id?: string;
  base_score: number;
  is_combo: boolean;
  is_rotational: boolean;
  rotation_degrees?: number;
  stance?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface TrickCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTrickData {
  name: string;
  slug: string;
  description?: string;
  difficulty: number;
  category_id?: string;
  base_score: number;
  is_combo: boolean;
  is_rotational: boolean;
  rotation_degrees?: number;
  stance?: string;
}

export interface UpdateTrickData {
  name?: string;
  description?: string;
  difficulty?: number;
  category_id?: string;
  base_score?: number;
  is_combo?: boolean;
  is_rotational?: boolean;
  rotation_degrees?: number;
  stance?: string;
}
