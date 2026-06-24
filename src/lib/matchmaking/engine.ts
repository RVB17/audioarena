import { createClient } from '@/lib/supabase/server';
import type { QueueEntry, Session, MatchResult } from '@/types';

// Constants for scoring
const WEIGHTS = {
  GENRE: 0.4,
  BPM: 0.3,
  SKILL: 0.2,
  TIME_IN_QUEUE: 0.1
};

export async function processMatchmakingQueue() {
  const supabase = await createClient();
  
  // 1. Fetch all users currently in queue, ordered by time queued
  const { data: queueData, error: queueError } = await supabase
    .from('matchmaking_queue')
    .select('*, profile:profiles(username)')
    .order('queued_at', { ascending: true });
    
  if (queueError || !queueData || queueData.length < 2) {
    return { status: 'idle', matched: 0 };
  }
  
  const entries = queueData as any[];
  const matchedUserIds = new Set<string>();
  let matchesCreated = 0;

  // 2. Simple grouping logic (MVP version)
  // We'll try to find pairs/groups that have compatible instruments and overlapping BPM
  for (let i = 0; i < entries.length; i++) {
    const primary = entries[i];
    if (matchedUserIds.has(primary.user_id)) continue;
    
    // Find compatible partners for primary user
    const team = [primary];
    const teamInstruments = new Set([primary.instrument]);
    
    for (let j = i + 1; j < entries.length; j++) {
      const candidate = entries[j];
      if (matchedUserIds.has(candidate.user_id)) continue;
      
      // Rule 1: Don't match duplicate instruments unless it's vocals or generic
      if (teamInstruments.has(candidate.instrument) && !['vocals', 'other', 'producer'].includes(candidate.instrument)) {
        continue;
      }
      
      // Rule 2: Overlapping BPM range
      const bpmOverlap = Math.max(0, Math.min(primary.bpm_max, candidate.bpm_max) - Math.max(primary.bpm_min, candidate.bpm_min));
      if (bpmOverlap < 0) continue; // No overlapping BPM
      
      // Candidate accepted into team
      team.push(candidate);
      teamInstruments.add(candidate.instrument);
      
      // Stop if team is full (e.g., 3 members for MVP)
      if (team.length >= 3) break;
    }
    
    // 3. If we formed a valid team (at least 2 people)
    if (team.length >= 2) {
      const targetBpm = Math.floor((Math.max(...team.map(t => t.bpm_min)) + Math.min(...team.map(t => t.bpm_max))) / 2);
      
      // Figure out a genre based on overlap or default
      const allGenres = team.flatMap(t => t.genres || []);
      const mostCommonGenre = allGenres.sort((a,b) =>
        allGenres.filter(v => v===a).length - allGenres.filter(v => v===b).length
      ).pop() || 'electronic';

      // Create the Session
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          name: `${mostCommonGenre.toUpperCase()} Jam`,
          creator_id: primary.user_id, // Primary is creator
          status: 'lobby',
          genre: mostCommonGenre,
          bpm: targetBpm,
          is_public: true
        })
        .select()
        .single();
        
      if (sessionError) {
        console.error('Failed to create session:', sessionError);
        continue;
      }
      
      // Add participants
      const participantInserts = team.map(t => ({
        session_id: sessionData.id,
        user_id: t.user_id,
        instrument: t.instrument,
        role: t.user_id === primary.user_id ? 'creator' : 'member'
      }));
      
      await supabase.from('session_participants').insert(participantInserts);
      
      // Remove from queue
      const teamUserIds = team.map(t => t.user_id);
      await supabase.from('matchmaking_queue').delete().in('user_id', teamUserIds);
      
      teamUserIds.forEach(id => matchedUserIds.add(id));
      matchesCreated++;
      
      // Broadcast match to each user via realtime
      // (For MVP, we rely on the users listening to their queue row deletion, 
      // or we can use Supabase Edge Functions / DB Triggers to broadcast)
      
      // Trigger a direct broadcast via pg_notify or just relying on standard supabase channels
      const matchResult: MatchResult = {
        sessionId: sessionData.id,
        sessionName: sessionData.name,
        genre: sessionData.genre,
        bpm: sessionData.bpm,
        participants: team.map(t => ({
          userId: t.user_id,
          username: t.profile?.username || 'User',
          instrument: t.instrument
        }))
      };
      
      // For each user, send a realtime message to their personal queue channel
      for (const t of team) {
        await supabase.channel(`queue:${t.user_id}`).send({
          type: 'broadcast',
          event: 'match_found',
          payload: matchResult
        });
      }
    }
  }

  return { status: 'success', matched: matchesCreated };
}
