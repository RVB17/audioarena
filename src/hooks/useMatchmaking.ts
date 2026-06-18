'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useMatchmakingStore } from '@/stores/matchmakingStore';
import type { QueueEntry, MatchResult } from '@/types';

export function useMatchmaking(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [queueTime, setQueueTime] = useState(0);
  const supabase = createClient();
  const store = useMatchmakingStore();

  // Timer for queue
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (store.status === 'queuing' && store.queueStartTime) {
      interval = setInterval(() => {
        setQueueTime(Math.floor((Date.now() - store.queueStartTime!) / 1000));
      }, 1000);
    } else {
      setQueueTime(0);
    }
    return () => clearInterval(interval);
  }, [store.status, store.queueStartTime]);

  // Subscribe to own queue entry to get match results
  // For MVP, we might just poll or listen to a specific channel
  useEffect(() => {
    if (!userId || store.status !== 'queuing') return;

    const channel = supabase.channel(`queue:\${userId}`)
      .on('broadcast', { event: 'match_found' }, (payload) => {
        const result = payload.payload as MatchResult;
        store.setMatchResult(result);
        store.setStatus('match_found');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, store.status, supabase, store]);

  const joinQueue = async (entryData: Omit<QueueEntry, 'id' | 'queuedAt'>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('matchmaking_queue')
        .insert({
          user_id: entryData.userId,
          instrument: entryData.instrument,
          genres: entryData.genres,
          bpm_min: entryData.bpmMin,
          bpm_max: entryData.bpmMax,
          vibe_tags: entryData.vibeTags,
          skill_range: entryData.skillRange
        })
        .select()
        .single();

      if (error) throw error;
      
      store.joinQueue({
        id: data.id,
        userId: data.user_id,
        instrument: data.instrument,
        genres: data.genres,
        bpmMin: data.bpm_min,
        bpmMax: data.bpm_max,
        vibeTags: data.vibe_tags,
        skillRange: data.skill_range,
        queuedAt: data.queued_at
      });
    } catch (err: any) {
      console.error('Join queue error:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveQueue = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('matchmaking_queue')
        .delete()
        .eq('user_id', userId);
        
      if (error) throw error;
      store.leaveQueue();
    } catch (err: any) {
      console.error('Leave queue error:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    status: store.status,
    queueTime,
    matchResult: store.matchResult,
    queuedPlayers: store.queuedPlayers,
    isLoading,
    error,
    joinQueue,
    leaveQueue,
    acceptMatch: store.acceptMatch,
    declineMatch: store.declineMatch
  };
}
