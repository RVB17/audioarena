import { create } from 'zustand';
import type { MatchmakingStatus, MatchResult, QueueEntry } from '@/types';

interface MatchmakingState {
  status: MatchmakingStatus;
  queueEntry: QueueEntry | null;
  matchResult: MatchResult | null;
  queueStartTime: number | null; // timestamp
  queuedPlayers: QueueEntry[]; // other players in queue (for lobby display)
  openSessions: any[]; // browsable sessions
  
  // Actions
  setStatus: (status: MatchmakingStatus) => void;
  setQueueEntry: (entry: QueueEntry | null) => void;
  setMatchResult: (result: MatchResult | null) => void;
  setQueueStartTime: (time: number | null) => void;
  setQueuedPlayers: (players: QueueEntry[]) => void;
  setOpenSessions: (sessions: any[]) => void;
  joinQueue: (entry: QueueEntry) => void;
  leaveQueue: () => void;
  acceptMatch: () => void;
  declineMatch: () => void;
  reset: () => void;
}

export const useMatchmakingStore = create<MatchmakingState>((set) => ({
  status: 'idle',
  queueEntry: null,
  matchResult: null,
  queueStartTime: null,
  queuedPlayers: [],
  openSessions: [],
  
  setStatus: (status) => set({ status }),
  setQueueEntry: (entry) => set({ queueEntry: entry }),
  setMatchResult: (result) => set({ matchResult: result }),
  setQueueStartTime: (time) => set({ queueStartTime: time }),
  setQueuedPlayers: (players) => set({ queuedPlayers: players }),
  setOpenSessions: (sessions) => set({ openSessions: sessions }),
  
  joinQueue: (entry) => set({ 
    status: 'queuing', 
    queueEntry: entry, 
    queueStartTime: Date.now() 
  }),
  leaveQueue: () => set({ 
    status: 'idle', 
    queueEntry: null, 
    queueStartTime: null 
  }),
  acceptMatch: () => set({ status: 'match_accepted' }),
  declineMatch: () => set({ 
    status: 'idle', 
    matchResult: null,
    queueEntry: null,
    queueStartTime: null
  }),
  reset: () => set({
    status: 'idle',
    queueEntry: null,
    matchResult: null,
    queueStartTime: null,
    queuedPlayers: [],
    openSessions: []
  })
}));
