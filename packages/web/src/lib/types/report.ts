export interface Report {
  id: string;
  event_id: string;
  report_type: string;
  format: string;
  title: string;
  description?: string;
  generated_by: string;
  file_url?: string;
  parameters: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReportData {
  event_id: string;
  report_type: string;
  format: string;
  title: string;
  description?: string;
  generated_by: string;
  parameters: Record<string, any>;
}

export interface ReportParameters {
  event_id: string;
  include_scores?: boolean;
  include_leaderboard?: boolean;
  include_judge_details?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
  rider_ids?: string[];
  category_ids?: string[];
}
