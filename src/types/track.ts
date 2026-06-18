export interface Track {
  id: string;
  sessionId: string;
  title: string;
  description: string | null;
  genre: string | null;
  bpm: number | null;
  audioUrl: string | null;
  midiUrl: string | null;
  coverArtUrl: string | null;
  durationSeconds: number | null;
  upvotes: number;
  downvotes: number;
  playCount: number;
  publishedAt: string;
  contributors?: TrackContributor[];
}

export interface TrackContributor {
  trackId: string;
  userId: string;
  instrument: string;
  profile?: import('./user').PublicProfile;
}

export interface Vote {
  id: string;
  trackId: string;
  userId: string;
  voteType: 'up' | 'down';
  createdAt: string;
}
