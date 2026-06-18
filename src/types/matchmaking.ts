export interface QueueEntry {
  id: string;
  userId: string;
  instrument: string;
  genres: string[];
  bpmMin: number;
  bpmMax: number;
  vibeTags: string[];
  skillRange: string[];
  queuedAt: string;
  profile?: import('./user').PublicProfile;
}

export interface MatchResult {
  sessionId: string;
  sessionName: string;
  participants: {
    userId: string;
    username: string;
    instrument: string;
  }[];
  genre: string;
  bpm: number;
}

export type MatchmakingStatus = 'idle' | 'queuing' | 'match_found' | 'match_accepted' | 'match_declined' | 'in_session';
