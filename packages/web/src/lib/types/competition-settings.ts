export interface ScoringConfig {
  normalizer: number;
  combo_multipliers: {
    two_tricks: number;
    three_tricks: number;
    four_tricks: number;
    five_plus_tricks: number;
  };
  modifier_ranges: {
    landing: { min: number; max: number };
    risk: { min: number; max: number };
    amplitude: { min: number; max: number };
    variety: { min: number; max: number };
    execution: { min: number; max: number };
  };
  score_weights: {
    best_trick: number;
    run: number;
  };
  decimal_places: number;
}

export interface RunConfig {
  duration_seconds: number;
  number_of_runs: number;
  best_runs_count: number;
  use_best_trick: boolean;
  use_jam: boolean;
}

export interface BestTrickConfig {
  attempts_per_rider: number;
  time_per_attempt_seconds: number;
  use_best_trick_score: boolean;
  allow_combo_tricks: boolean;
}

export interface JamConfig {
  duration_seconds: number;
  number_of_jams: number;
  riders_per_jam: number;
  scoring_method: string;
}

export interface TimerConfig {
  countdown_duration_seconds: number;
  warning_duration_seconds: number;
  auto_stop: boolean;
  show_remaining: boolean;
  show_elapsed: boolean;
}

export interface CompetitionSettings {
  scoring_config: ScoringConfig;
  run_config: RunConfig;
  best_trick_config: BestTrickConfig;
  jam_config: JamConfig;
  timer_config: TimerConfig;
}

export interface UpdateCompetitionSettingsData {
  scoring_config?: Partial<ScoringConfig>;
  run_config?: Partial<RunConfig>;
  best_trick_config?: Partial<BestTrickConfig>;
  jam_config?: Partial<JamConfig>;
  timer_config?: Partial<TimerConfig>;
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  normalizer: 15,
  combo_multipliers: {
    two_tricks: 1.2,
    three_tricks: 1.35,
    four_tricks: 1.5,
    five_plus_tricks: 1.7,
  },
  modifier_ranges: {
    landing: { min: 0.7, max: 1.1 },
    risk: { min: 1.0, max: 1.4 },
    amplitude: { min: 0.8, max: 1.3 },
    variety: { min: 0.8, max: 1.2 },
    execution: { min: 0.8, max: 1.2 },
  },
  score_weights: {
    best_trick: 0.6,
    run: 0.4,
  },
  decimal_places: 2,
};

export const DEFAULT_RUN_CONFIG: RunConfig = {
  duration_seconds: 45,
  number_of_runs: 2,
  best_runs_count: 1,
  use_best_trick: true,
  use_jam: false,
};

export const DEFAULT_BEST_TRICK_CONFIG: BestTrickConfig = {
  attempts_per_rider: 5,
  time_per_attempt_seconds: 60,
  use_best_trick_score: true,
  allow_combo_tricks: false,
};

export const DEFAULT_JAM_CONFIG: JamConfig = {
  duration_seconds: 300,
  number_of_jams: 1,
  riders_per_jam: 5,
  scoring_method: 'cumulative',
};

export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  countdown_duration_seconds: 10,
  warning_duration_seconds: 10,
  auto_stop: true,
  show_remaining: true,
  show_elapsed: false,
};
