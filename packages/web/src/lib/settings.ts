import { supabase } from './supabase';
import type { SystemSettings, CreateSettingsData, UpdateSettingsData, DEFAULT_SETTINGS } from './types/settings';

export class SettingsService {
  /**
   * Get all settings
   */
  static async getAllSettings(): Promise<SystemSettings[]> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as SystemSettings[];
    } catch (error) {
      console.error('Get all settings error:', error);
      throw error;
    }
  }

  /**
   * Get settings by category
   */
  static async getSettingsByCategory(category: string): Promise<SystemSettings[]> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key', { ascending: true });

      // Filter by category in memory since it's not in schema
      const filtered = data?.filter((s: any) => s.setting_key.startsWith(category + '.')) || [];

      if (error) {
        throw new Error(error.message);
      }

      return filtered as SystemSettings[];
    } catch (error) {
      console.error('Get settings by category error:', error);
      throw error;
    }
  }

  /**
   * Get public settings
   */
  static async getPublicSettings(): Promise<SystemSettings[]> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('is_public', true)
        .order('setting_key', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as SystemSettings[];
    } catch (error) {
      console.error('Get public settings error:', error);
      throw error;
    }
  }

  /**
   * Get setting by key
   */
  static async getSettingByKey(key: string): Promise<SystemSettings | null> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('setting_key', key)
        .single();

      if (error) {
        return null;
      }

      return data as SystemSettings;
    } catch (error) {
      console.error('Get setting by key error:', error);
      return null;
    }
  }

  /**
   * Get setting value
   */
  static async getSettingValue(key: string, defaultValue?: any): Promise<any> {
    try {
      const setting = await this.getSettingByKey(key);
      return setting?.setting_value ?? defaultValue;
    } catch (error) {
      console.error('Get setting value error:', error);
      return defaultValue;
    }
  }

  /**
   * Create setting
   */
  static async createSetting(data: CreateSettingsData): Promise<SystemSettings> {
    try {
      const { data: setting, error } = await supabase
        .from('system_settings')
        .insert({
          setting_key: data.key,
          setting_value: data.value,
          setting_type: data.setting_type || 'string',
          description: data.description,
          is_public: data.is_public ?? false,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return setting as SystemSettings;
    } catch (error) {
      console.error('Create setting error:', error);
      throw error;
    }
  }

  /**
   * Update setting
   */
  static async updateSetting(key: string, data: UpdateSettingsData): Promise<SystemSettings> {
    try {
      const { data: setting, error } = await supabase
        .from('system_settings')
        .update(data)
        .eq('setting_key', key)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return setting as SystemSettings;
    } catch (error) {
      console.error('Update setting error:', error);
      throw error;
    }
  }

  /**
   * Delete setting
   */
  static async deleteSetting(key: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .delete()
        .eq('setting_key', key);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete setting error:', error);
      throw error;
    }
  }

  /**
   * Initialize default settings
   */
  static async initializeDefaultSettings(): Promise<void> {
    try {
      const existingSettings = await this.getAllSettings();
      const existingKeys = new Set(existingSettings.map(s => s.setting_key));

      const defaultSettings = [
        // Scoring settings
        { key: 'scoring.normalizer', value: 15, setting_type: 'number', description: 'Score normalizer value' },
        { key: 'scoring.decimal_places', value: 2, setting_type: 'number', description: 'Number of decimal places for scores' },
        { key: 'scoring.max_score', value: 100, setting_type: 'number', description: 'Maximum possible score' },
        
        // Timer settings
        { key: 'timer.default_run_duration', value: 45, setting_type: 'number', description: 'Default run duration in seconds' },
        { key: 'timer.default_jam_duration', value: 300, setting_type: 'number', description: 'Default jam duration in seconds' },
        { key: 'timer.countdown_duration', value: 10, setting_type: 'number', description: 'Countdown duration in seconds' },
        { key: 'timer.warning_duration', value: 10, setting_type: 'number', description: 'Warning duration in seconds' },
        
        // Competition settings
        { key: 'competition.max_participants_per_heat', value: 10, setting_type: 'number', description: 'Maximum participants per heat' },
        { key: 'competition.default_number_of_runs', value: 2, setting_type: 'number', description: 'Default number of runs per rider' },
        { key: 'competition.default_number_of_jams', value: 1, setting_type: 'number', description: 'Default number of jams' },
        
        // Display settings
        { key: 'display.auto_refresh_interval', value: 5000, setting_type: 'number', description: 'Auto refresh interval in milliseconds', is_public: true },
        { key: 'display.show_judge_names', value: true, setting_type: 'boolean', description: 'Show judge names on display', is_public: true },
        { key: 'display.show_score_breakdown', value: true, setting_type: 'boolean', description: 'Show score breakdown on display', is_public: true },
      ];

      for (const setting of defaultSettings) {
        if (!existingKeys.has(setting.key)) {
          await this.createSetting(setting);
        }
      }
    } catch (error) {
      console.error('Initialize default settings error:', error);
      throw error;
    }
  }

  /**
   * Get settings as object
   */
  static async getSettingsAsObject(): Promise<Record<string, any>> {
    try {
      const settings = await this.getAllSettings();
      const settingsObject: Record<string, any> = {};

      settings.forEach(setting => {
        settingsObject[setting.setting_key] = setting.setting_value;
      });

      return settingsObject;
    } catch (error) {
      console.error('Get settings as object error:', error);
      throw error;
    }
  }

  /**
   * Batch update settings
   */
  static async batchUpdateSettings(updates: Record<string, any>): Promise<void> {
    try {
      const operations = Object.entries(updates).map(([key, value]) =>
        supabase
          .from('system_settings')
          .update({ setting_value: value })
          .eq('setting_key', key)
      );

      await Promise.all(operations);
    } catch (error) {
      console.error('Batch update settings error:', error);
      throw error;
    }
  }
}
