export interface LeaderboardEntry {
  rank: number;
  rider_id: string;
  rider_name: string;
  total_score: number;
  best_trick_score: number;
  run_score: number;
  average_score: number;
  attempts_count: number;
  last_updated: string;
}

export interface Leaderboard {
  event_id: string;
  entries: LeaderboardEntry[];
  last_updated: string;
  scoring_config: Record<string, any>;
}

export interface CreateLeaderboardData {
  event_id: string;
  entries: LeaderboardEntry[];
  scoring_config: Record<string, any>;
}
