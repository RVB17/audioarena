import { create } from 'zustand';
import type { Session, SessionParticipant, SessionSlot, SessionPhase } from '@/types';

interface SessionState {
  // Current session data
  currentSession: Session | null;
  participants: SessionParticipant[];
  slots: SessionSlot[];
  
  // Workspace
  activeWorkspace: 'shared' | 'private';
  splitScreenEnabled: boolean;
  
  // Phase & Timer
  currentPhase: SessionPhase;
  timerRemaining: number | null; // seconds
  timerActive: boolean;
  
  // Actions
  setSession: (session: Session | null) => void;
  setParticipants: (participants: SessionParticipant[]) => void;
  addParticipant: (participant: SessionParticipant) => void;
  removeParticipant: (userId: string) => void;
  setSlots: (slots: SessionSlot[]) => void;
  setActiveWorkspace: (workspace: 'shared' | 'private') => void;
  toggleSplitScreen: () => void;
  setPhase: (phase: SessionPhase) => void;
  setTimerRemaining: (seconds: number | null) => void;
  setTimerActive: (active: boolean) => void;
  tickTimer: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  participants: [],
  slots: [],
  
  activeWorkspace: 'shared',
  splitScreenEnabled: false,
  
  currentPhase: 'lobby',
  timerRemaining: null,
  timerActive: false,
  
  setSession: (session) => set({ currentSession: session }),
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) => set((state) => ({ participants: [...state.participants, participant] })),
  removeParticipant: (userId) => set((state) => ({ participants: state.participants.filter(p => p.userId !== userId) })),
  setSlots: (slots) => set({ slots }),
  
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  toggleSplitScreen: () => set((state) => ({ splitScreenEnabled: !state.splitScreenEnabled })),
  
  setPhase: (phase) => set({ currentPhase: phase }),
  setTimerRemaining: (seconds) => set({ timerRemaining: seconds }),
  setTimerActive: (active) => set({ timerActive: active }),
  tickTimer: () => set((state) => {
    if (state.timerRemaining !== null && state.timerActive && state.timerRemaining > 0) {
      return { timerRemaining: state.timerRemaining - 1 };
    }
    return state;
  }),
  
  reset: () => set({
    currentSession: null,
    participants: [],
    slots: [],
    activeWorkspace: 'shared',
    splitScreenEnabled: false,
    currentPhase: 'lobby',
    timerRemaining: null,
    timerActive: false,
  })
}));
