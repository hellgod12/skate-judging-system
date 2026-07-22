import { createClient } from '@/utils/supabase/client';
import { LeaderboardService } from './leaderboard';
import { ScoreService } from './score';
import { RiderService } from './rider';
import type { Report, CreateReportData, ReportParameters } from './types/report';

export class ReportService {
  /**
   * Generate event report
   */
  static async generateReport(data: CreateReportData): Promise<Report> {
    try {
    const supabase = await createClient();
      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          event_id: data.event_id,
          report_type: data.report_type,
          format: data.format,
          title: data.title,
          description: data.description,
          generated_by: data.generated_by,
          parameters: data.parameters,
          status: 'generating',
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Generate the actual report content based on type
      const reportContent = await this.generateReportContent(data);

      // Update report with file URL
      const { data: updatedReport, error: updateError } = await supabase
        .from('reports')
        .update({
          file_url: reportContent.file_url,
          status: 'completed',
        })
        .eq('id', report.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      return updatedReport as Report;
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    }
  }

  /**
   * Generate report content based on type
   */
  private static async generateReportContent(data: CreateReportData): Promise<{ file_url: string }> {
    try {
      const { event_id, report_type, format, parameters } = data;

      const reportParams: ReportParameters = {
        event_id,
        ...parameters,
      };

      switch (report_type) {
        case 'leaderboard':
          return await this.generateLeaderboardReport(event_id, format, reportParams);
        case 'scores':
          return await this.generateScoresReport(event_id, format, reportParams);
        case 'judge_details':
          return await this.generateJudgeDetailsReport(event_id, format, reportParams);
        case 'rider_statistics':
          return await this.generateRiderStatisticsReport(event_id, format, reportParams);
        default:
          throw new Error(`Unknown report type: ${report_type}`);
      }
    } catch (error) {
      console.error('Generate report content error:', error);
      throw error;
    }
  }

  /**
   * Generate leaderboard report
   */
  private static async generateLeaderboardReport(
    eventId: string,
    format: string,
    parameters: ReportParameters
  ): Promise<{ file_url: string }> {
    try {
      const leaderboard = await LeaderboardService.getLeaderboard(eventId);
      
      const content = {
        event_id: eventId,
        report_type: 'leaderboard',
        format,
        data: leaderboard,
        generated_at: new Date().toISOString(),
      };

      // In a real implementation, this would generate actual PDF/Excel/CSV files
      // For now, we'll return a placeholder URL
      return {
        file_url: `/reports/${eventId}-leaderboard-${Date.now()}.${format}`,
      };
    } catch (error) {
      console.error('Generate leaderboard report error:', error);
      throw error;
    }
  }

  /**
   * Generate scores report
   */
  private static async generateScoresReport(
    eventId: string,
    format: string,
    parameters: ReportParameters
  ): Promise<{ file_url: string }> {
    try {
      const scores = await ScoreService.getEventScores(eventId);
      
      const content = {
        event_id: eventId,
        report_type: 'scores',
        format,
        data: scores,
        generated_at: new Date().toISOString(),
      };

      return {
        file_url: `/reports/${eventId}-scores-${Date.now()}.${format}`,
      };
    } catch (error) {
      console.error('Generate scores report error:', error);
      throw error;
    }
  }

  /**
   * Generate judge details report
   */
  private static async generateJudgeDetailsReport(
    eventId: string,
    format: string,
    parameters: ReportParameters
  ): Promise<{ file_url: string }> {
    try {
      const scores = await ScoreService.getEventScores(eventId);
      
      // Group scores by judge
      const judgeScores = new Map<string, any[]>();
      scores.forEach(score => {
        if (!judgeScores.has(score.judge_id)) {
          judgeScores.set(score.judge_id, []);
        }
        judgeScores.get(score.judge_id)!.push(score);
      });

      const content = {
        event_id: eventId,
        report_type: 'judge_details',
        format,
        data: Object.fromEntries(judgeScores),
        generated_at: new Date().toISOString(),
      };

      return {
        file_url: `/reports/${eventId}-judge-details-${Date.now()}.${format}`,
      };
    } catch (error) {
      console.error('Generate judge details report error:', error);
      throw error;
    }
  }

  /**
   * Generate rider statistics report
   */
  private static async generateRiderStatisticsReport(
    eventId: string,
    format: string,
    parameters: ReportParameters
  ): Promise<{ file_url: string }> {
    try {
      const leaderboard = await LeaderboardService.getLeaderboard(eventId);
      
      const riderStats = leaderboard.entries.map(entry => ({
        rider_id: entry.rider_id,
        rider_name: entry.rider_name,
        total_score: entry.total_score,
        best_trick_score: entry.best_trick_score,
        run_score: entry.run_score,
        average_score: entry.average_score,
        attempts_count: entry.attempts_count,
      }));

      const content = {
        event_id: eventId,
        report_type: 'rider_statistics',
        format,
        data: riderStats,
        generated_at: new Date().toISOString(),
      };

      return {
        file_url: `/reports/${eventId}-rider-stats-${Date.now()}.${format}`,
      };
    } catch (error) {
      console.error('Generate rider statistics report error:', error);
      throw error;
    }
  }

  /**
   * Get reports for an event
   */
  static async getEventReports(eventId: string): Promise<Report[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Report[];
    } catch (error) {
      console.error('Get event reports error:', error);
      throw error;
    }
  }

  /**
   * Get report by ID
   */
  static async getReportById(id: string): Promise<Report> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Report;
    } catch (error) {
      console.error('Get report error:', error);
      throw error;
    }
  }

  /**
   * Delete report
   */
  static async deleteReport(id: string): Promise<void> {
    try {
    const supabase = await createClient();
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete report error:', error);
      throw error;
    }
  }

  /**
   * Export data as CSV
   */
  static exportToCSV(data: any[], filename: string): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Export data as JSON
   */
  static exportToJSON(data: any[], filename: string): string {
    return JSON.stringify(data, null, 2);
  }
}
