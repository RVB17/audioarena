'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSessionStore } from '@/stores/sessionStore';
import type { Session, SessionPhase } from '@/types';

export function useSession(sessionId?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();
  const { currentSession, setSession, participants, setParticipants, setPhase } = useSessionStore();

  const fetchSession = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .single();
        
      if (sessionError) throw sessionError;
      setSession(sessionData);

      const { data: participantsData, error: participantsError } = await supabase
        .from('session_participants')
        .select('*, profile:profiles(*)')
        .eq('session_id', id);

      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);
      
    } catch (err: any) {
      console.error('Error fetching session:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, setSession, setParticipants]);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    fetchSession(sessionId);

    const channel = supabase.channel(`session:\${sessionId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'sessions',
        filter: \`id=eq.\${sessionId}\`
      }, (payload) => {
        const updatedSession = payload.new as Session;
        setSession(updatedSession);
        if (updatedSession.status) {
          setPhase(updatedSession.status as SessionPhase);
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'session_participants',
        filter: \`session_id=eq.\${sessionId}\`
      }, () => {
        // Simple approach: re-fetch participants on any change
        fetchSession(sessionId);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, supabase, fetchSession, setSession, setPhase]);

  const joinSession = async (userId: string, instrument: string) => {
    if (!sessionId) return;
    try {
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          user_id: userId,
          instrument,
          role: 'member'
        });
      if (error) throw error;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const leaveSession = async (userId: string) => {
    if (!sessionId) return;
    try {
      const { error } = await supabase
        .from('session_participants')
        .delete()
        .match({ session_id: sessionId, user_id: userId });
      if (error) throw error;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const updatePhase = async (phase: SessionPhase) => {
    if (!sessionId) return;
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: phase, phase_started_at: new Date().toISOString() })
        .eq('id', sessionId);
      if (error) throw error;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return {
    session: currentSession,
    participants,
    isLoading,
    error,
    joinSession,
    leaveSession,
    updatePhase
  };
}
