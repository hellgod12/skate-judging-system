import { supabase } from './supabase';
import type { Category, CreateCategoryData, UpdateCategoryData } from './types/category';

export class CategoryService {
  /**
   * Get all categories for an organization
   */
  static async getCategories(organizationId?: string): Promise<Category[]> {
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true });

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.is('organization_id', null);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Category[];
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Category;
    } catch (error) {
      console.error('Get category error:', error);
      throw error;
    }
  }

  /**
   * Create new category
   */
  static async createCategory(data: CreateCategoryData): Promise<Category> {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .insert({
          organization_id: data.organization_id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          age_min: data.age_min,
          age_max: data.age_max,
          gender: data.gender,
          skill_level: data.skill_level,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return category as Category;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }

  /**
   * Update category
   */
  static async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return category as Category;
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }

  /**
   * Delete category (soft delete)
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }

  /**
   * Filter categories by age, gender, skill level
   */
  static async filterCategories(filters: {
    age?: number;
    gender?: string;
    skill_level?: string;
    organizationId?: string;
  }): Promise<Category[]> {
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .is('deleted_at', null)
        .eq('is_active', true);

      if (filters.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      } else {
        query = query.is('organization_id', null);
      }

      if (filters.age) {
        query = query.lte('age_min', filters.age).gte('age_max', filters.age);
      }

      if (filters.gender) {
        query = query.or(`gender.eq.${filters.gender},gender.is.null`);
      }

      if (filters.skill_level) {
        query = query.or(`skill_level.eq.${filters.skill_level},skill_level.is.null`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Category[];
    } catch (error) {
      console.error('Filter categories error:', error);
      throw error;
    }
  }
}
