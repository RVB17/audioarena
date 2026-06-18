export type SessionPhase = 'lobby' | 'brainstorm' | 'compose' | 'mix' | 'published' | 'archived';

export interface Session {
  id: string;
  name: string;
  creatorId: string;
  status: SessionPhase;
  genre: string | null;
  bpm: number;
  musicalKey: string;
  scale: string;
  vibeTags: string[];
  maxParticipants: number;
  isPublic: boolean;
  timerSeconds: number | null;
  phaseStartedAt: string | null;
  yjsDocId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  instrument: string;
  role: 'creator' | 'member';
  joinedAt: string;
  profile?: import('./user').UserProfile;
}

export interface SessionSlot {
  id: string;
  sessionId: string;
  instrument: string;
  isFilled: boolean;
  filledBy: string | null;
}

export interface SessionWithDetails extends Session {
  participants: SessionParticipant[];
  slots: SessionSlot[];
  creator?: import('./user').PublicProfile;
}
