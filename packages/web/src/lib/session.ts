import { supabase } from './supabase';
import type { JudgeSession, OperatorSession, CreateJudgeSessionData, CreateOperatorSessionData, UpdateSessionData } from './types/session';

export class SessionService {
  /**
   * Get all judge sessions for an event
   */
  static async getJudgeSessions(eventId: string): Promise<JudgeSession[]> {
    try {
      const { data, error } = await supabase
        .from('judge_sessions')
        .select('*')
        .eq('event_id', eventId)
        .order('start_time', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as JudgeSession[];
    } catch (error) {
      console.error('Get judge sessions error:', error);
      throw error;
    }
  }

  /**
   * Get active judge session for an event
   */
  static async getActiveJudgeSession(eventId: string, judgeId: string): Promise<JudgeSession | null> {
    try {
      const { data, error } = await supabase
        .from('judge_sessions')
        .select('*')
        .eq('event_id', eventId)
        .eq('judge_id', judgeId)
        .eq('is_active', true)
        .single();

      if (error) {
        return null;
      }

      return data as JudgeSession;
    } catch (error) {
      console.error('Get active judge session error:', error);
      return null;
    }
  }

  /**
   * Create new judge session
   */
  static async createJudgeSession(data: CreateJudgeSessionData): Promise<JudgeSession> {
    try {
      // End any existing active session for this judge
      const existingSession = await this.getActiveJudgeSession(data.event_id, data.judge_id);
      if (existingSession) {
        await this.endSession(existingSession.id);
      }

      const { data: session, error } = await supabase
        .from('judge_sessions')
        .insert({
          event_id: data.event_id,
          judge_id: data.judge_id,
          session_type: data.session_type,
          start_time: new Date().toISOString(),
          is_active: true,
          metadata: data.metadata || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return session as JudgeSession;
    } catch (error) {
      console.error('Create judge session error:', error);
      throw error;
    }
  }

  /**
   * Update session
   */
  static async updateSession(sessionId: string, data: UpdateSessionData): Promise<JudgeSession | OperatorSession> {
    try {
      // Determine which table to update
      const { data: judgeSession } = await supabase
        .from('judge_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (judgeSession) {
        const { data: updated, error } = await supabase
          .from('judge_sessions')
          .update(data)
          .eq('id', sessionId)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return updated as JudgeSession;
      }

      const { data: operatorSession } = await supabase
        .from('operator_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (operatorSession) {
        const { data: updated, error } = await supabase
          .from('operator_sessions')
          .update(data)
          .eq('id', sessionId)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return updated as OperatorSession;
      }

      throw new Error('Session not found');
    } catch (error) {
      console.error('Update session error:', error);
      throw error;
    }
  }

  /**
   * End session
   */
  static async endSession(sessionId: string): Promise<void> {
    try {
      await this.updateSession(sessionId, {
        is_active: false,
        end_time: new Date().toISOString(),
      });
    } catch (error) {
      console.error('End session error:', error);
      throw error;
    }
  }

  /**
   * Get all operator sessions for an event
   */
  static async getOperatorSessions(eventId: string): Promise<OperatorSession[]> {
    try {
      const { data, error } = await supabase
        .from('operator_sessions')
        .select('*')
        .eq('event_id', eventId)
        .order('start_time', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as OperatorSession[];
    } catch (error) {
      console.error('Get operator sessions error:', error);
      throw error;
    }
  }

  /**
   * Get active operator session for an event
   */
  static async getActiveOperatorSession(eventId: string, operatorId: string): Promise<OperatorSession | null> {
    try {
      const { data, error } = await supabase
        .from('operator_sessions')
        .select('*')
        .eq('event_id', eventId)
        .eq('operator_id', operatorId)
        .eq('is_active', true)
        .single();

      if (error) {
        return null;
      }

      return data as OperatorSession;
    } catch (error) {
      console.error('Get active operator session error:', error);
      return null;
    }
  }

  /**
   * Create new operator session
   */
  static async createOperatorSession(data: CreateOperatorSessionData): Promise<OperatorSession> {
    try {
      // End any existing active session for this operator
      const existingSession = await this.getActiveOperatorSession(data.event_id, data.operator_id);
      if (existingSession) {
        await this.endSession(existingSession.id);
      }

      const { data: session, error } = await supabase
        .from('operator_sessions')
        .insert({
          event_id: data.event_id,
          operator_id: data.operator_id,
          session_type: data.session_type,
          start_time: new Date().toISOString(),
          is_active: true,
          metadata: data.metadata || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return session as OperatorSession;
    } catch (error) {
      console.error('Create operator session error:', error);
      throw error;
    }
  }

  /**
   * Get session by ID
   */
  static async getSessionById(sessionId: string): Promise<JudgeSession | OperatorSession | null> {
    try {
      const { data: judgeSession } = await supabase
        .from('judge_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (judgeSession) {
        return judgeSession as JudgeSession;
      }

      const { data: operatorSession } = await supabase
        .from('operator_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (operatorSession) {
        return operatorSession as OperatorSession;
      }

      return null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Get all active sessions for an event
   */
  static async getActiveSessions(eventId: string): Promise<(JudgeSession | OperatorSession)[]> {
    try {
      const [judgeSessions, operatorSessions] = await Promise.all([
        supabase
          .from('judge_sessions')
          .select('*')
          .eq('event_id', eventId)
          .eq('is_active', true),
        supabase
          .from('operator_sessions')
          .select('*')
          .eq('event_id', eventId)
          .eq('is_active', true),
      ]);

      return [...(judgeSessions.data || []), ...(operatorSessions.data || [])];
    } catch (error) {
      console.error('Get active sessions error:', error);
      throw error;
    }
  }

  /**
   * End all sessions for an event
   */
  static async endAllEventSessions(eventId: string): Promise<void> {
    try {
      const sessions = await this.getActiveSessions(eventId);

      await Promise.all(
        sessions.map(session => this.endSession(session.id))
      );
    } catch (error) {
      console.error('End all event sessions error:', error);
      throw error;
    }
  }
}
