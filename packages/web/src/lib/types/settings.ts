export interface SystemSettings {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSettingsData {
  key: string;
  value: any;
  setting_type?: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdateSettingsData {
  setting_value?: any;
  setting_type?: string;
  description?: string;
  is_public?: boolean;
}

export const DEFAULT_SETTINGS = {
  scoring: {
    normalizer: 15,
    decimal_places: 2,
    max_score: 100,
  },
  timer: {
    default_run_duration: 45,
    default_jam_duration: 300,
    countdown_duration: 10,
    warning_duration: 10,
  },
  competition: {
    max_participants_per_heat: 10,
    default_number_of_runs: 2,
    default_number_of_jams: 1,
  },
  display: {
    auto_refresh_interval: 5000,
    show_judge_names: true,
    show_score_breakdown: true,
  },
};
