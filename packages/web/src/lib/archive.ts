import { createClient } from '@/utils/supabase/client';
import { LeaderboardService } from './leaderboard';
import { ScoreService } from './score';
import type { ArchivedEvent, CreateArchiveData, ArchiveSearchParams } from './types/archive';

export class ArchiveService {
  /**
   * Archive an event
   */
  static async archiveEvent(data: CreateArchiveData): Promise<ArchivedEvent> {
    try {
    const supabase = await createClient();
      const { data: archivedEvent, error } = await supabase
        .from('archived_events')
        .insert({
          original_event_id: data.original_event_id,
          event_name: data.event_name,
          organization_id: data.organization_id,
          event_type: data.event_type,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
          participant_count: data.participant_count,
          total_scores: data.total_scores,
          leaderboard_data: data.leaderboard_data,
          archived_by: data.archived_by,
          archived_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return archivedEvent as ArchivedEvent;
    } catch (error) {
      console.error('Archive event error:', error);
      throw error;
    }
  }

  /**
   * Get archived event by ID
   */
  static async getArchivedEventById(id: string): Promise<ArchivedEvent> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('archived_events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as ArchivedEvent;
    } catch (error) {
      console.error('Get archived event error:', error);
      throw error;
    }
  }

  /**
   * Get archived event by original event ID
   */
  static async getArchivedEventByOriginalId(originalEventId: string): Promise<ArchivedEvent | null> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('archived_events')
        .select('*')
        .eq('original_event_id', originalEventId)
        .single();

      if (error) {
        return null;
      }

      return data as ArchivedEvent;
    } catch (error) {
      console.error('Get archived event by original ID error:', error);
      return null;
    }
  }

  /**
   * Search archived events
   */
  static async searchArchivedEvents(params: ArchiveSearchParams): Promise<ArchivedEvent[]> {
    try {
    const supabase = await createClient();
      let query = supabase
        .from('archived_events')
        .select('*')
        .order('archived_at', { ascending: false });

      if (params.organization_id) {
        query = query.eq('organization_id', params.organization_id);
      }

      if (params.event_type) {
        query = query.eq('event_type', params.event_type);
      }

      if (params.status) {
        query = query.eq('status', params.status);
      }

      if (params.date_range) {
        query = query.gte('start_date', params.date_range.start).lte('end_date', params.date_range.end);
      }

      if (params.search_query) {
        query = query.or(`event_name.ilike.%${params.search_query}%,event_type.ilike.%${params.search_query}%`);
      }

      if (params.limit) {
        query = query.limit(params.limit);
      }

      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as ArchivedEvent[];
    } catch (error) {
      console.error('Search archived events error:', error);
      throw error;
    }
  }

  /**
   * Get all archived events for an organization
   */
  static async getOrganizationArchivedEvents(organizationId: string): Promise<ArchivedEvent[]> {
    try {
    const supabase = await createClient();
      const { data, error } = await supabase
        .from('archived_events')
        .select('*')
        .eq('organization_id', organizationId)
        .order('archived_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as ArchivedEvent[];
    } catch (error) {
      console.error('Get organization archived events error:', error);
      throw error;
    }
  }

  /**
   * Restore archived event
   */
  static async restoreArchivedEvent(archivedEventId: string): Promise<void> {
    try {
      const supabase = await createClient();
      const archivedEvent = await this.getArchivedEventById(archivedEventId);
      
      // This would typically create a new event based on the archived data
      // For now, we'll just mark it as restored
      const { error } = await supabase
        .from('archived_events')
        .update({ status: 'restored' })
        .eq('id', archivedEventId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Restore archived event error:', error);
      throw error;
    }
  }

  /**
   * Delete archived event
   */
  static async deleteArchivedEvent(id: string): Promise<void> {
    try {
    const supabase = await createClient();
      const { error } = await supabase
        .from('archived_events')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete archived event error:', error);
      throw error;
    }
  }

  /**
   * Get archived event statistics
   */
  static async getArchiveStatistics(organizationId?: string): Promise<{
    total_events: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    by_year: Record<string, number>;
  }> {
    try {
    const supabase = await createClient();
      let query = supabase
        .from('archived_events')
        .select('*');

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const events = data as ArchivedEvent[];

      const byType: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      const byYear: Record<string, number> = {};

      events.forEach(event => {
        byType[event.event_type] = (byType[event.event_type] || 0) + 1;
        byStatus[event.status] = (byStatus[event.status] || 0) + 1;
        const year = new Date(event.start_date).getFullYear();
        byYear[year.toString()] = (byYear[year.toString()] || 0) + 1;
      });

      return {
        total_events: events.length,
        by_type: byType,
        by_status: byStatus,
        by_year: byYear,
      };
    } catch (error) {
      console.error('Get archive statistics error:', error);
      throw error;
    }
  }

  /**
   * Auto-archive completed events
   */
  static async autoArchiveCompletedEvents(): Promise<number> {
    try {
    const supabase = await createClient();
      // Get events that are completed but not archived
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'completed')
        .order('end_date', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      let archivedCount = 0;

      for (const event of events) {
        const existingArchive = await this.getArchivedEventByOriginalId(event.id);
        
        if (!existingArchive) {
          // Get leaderboard data
          const leaderboard = await LeaderboardService.getLeaderboard(event.id);
          const scores = await ScoreService.getEventScores(event.id);

          await this.archiveEvent({
            original_event_id: event.id,
            event_name: event.name,
            organization_id: event.organization_id,
            event_type: event.event_type,
            start_date: event.start_date,
            end_date: event.end_date,
            status: event.status,
            participant_count: leaderboard.entries.length,
            total_scores: scores.length,
            leaderboard_data: leaderboard,
            archived_by: 'system',
          });

          archivedCount++;
        }
      }

      return archivedCount;
    } catch (error) {
      console.error('Auto archive completed events error:', error);
      throw error;
    }
  }
}
