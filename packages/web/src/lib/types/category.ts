export interface Category {
  id: string;
  organization_id?: string;
  name: string;
  slug: string;
  description?: string;
  age_min?: number;
  age_max?: number;
  gender?: string;
  skill_level?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateCategoryData {
  organization_id?: string;
  name: string;
  slug: string;
  description?: string;
  age_min?: number;
  age_max?: number;
  gender?: string;
  skill_level?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  age_min?: number;
  age_max?: number;
  gender?: string;
  skill_level?: string;
  is_active?: boolean;
}
