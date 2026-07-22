import { createClient } from '@/utils/supabase/client';
import type { Trick, TrickCategory, CreateTrickData, UpdateTrickData } from './types/trick';

export class TrickService {
  /**
   * Get all tricks
   */
  static async getTricks(): Promise<Trick[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('tricks')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Trick[];
    } catch (error) {
      console.error('Get tricks error:', error);
      throw error;
    }
  }

  /**
   * Get trick by ID
   */
  static async getTrickById(id: string): Promise<Trick> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('tricks')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Trick;
    } catch (error) {
      console.error('Get trick error:', error);
      throw error;
    }
  }

  /**
   * Get tricks by category
   */
  static async getTricksByCategory(categoryId: string): Promise<Trick[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('tricks')
        .select('*')
        .eq('category_id', categoryId)
        .is('deleted_at', null)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Trick[];
    } catch (error) {
      console.error('Get tricks by category error:', error);
      throw error;
    }
  }

  /**
   * Search tricks by name
   */
  static async searchTricks(query: string): Promise<Trick[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('tricks')
        .select('*')
        .is('deleted_at', null)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Trick[];
    } catch (error) {
      console.error('Search tricks error:', error);
      throw error;
    }
  }

  /**
   * Get trick categories
   */
  static async getTrickCategories(): Promise<TrickCategory[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('trick_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as TrickCategory[];
    } catch (error) {
      console.error('Get trick categories error:', error);
      throw error;
    }
  }

  /**
   * Create new trick
   */
  static async createTrick(data: CreateTrickData): Promise<Trick> {
    try {
      const supabase = await createClient();
      const { data: trick, error } = await supabase
        .from('tricks')
        .insert({
          name: data.name,
          slug: data.slug,
          description: data.description,
          difficulty: data.difficulty,
          category_id: data.category_id,
          base_score: data.base_score,
          is_combo: data.is_combo,
          is_rotational: data.is_rotational,
          rotation_degrees: data.rotation_degrees,
          stance: data.stance,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return trick as Trick;
    } catch (error) {
      console.error('Create trick error:', error);
      throw error;
    }
  }

  /**
   * Update trick
   */
  static async updateTrick(id: string, data: UpdateTrickData): Promise<Trick> {
    try {
      const supabase = await createClient();
      const { data: trick, error } = await supabase
        .from('tricks')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return trick as Trick;
    } catch (error) {
      console.error('Update trick error:', error);
      throw error;
    }
  }

  /**
   * Delete trick (soft delete)
   */
  static async deleteTrick(id: string): Promise<void> {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('tricks')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete trick error:', error);
      throw error;
    }
  }
}
