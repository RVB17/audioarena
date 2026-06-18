export interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  instruments: string[];
  genres: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  rating: number;
  sessionsPlayed: number;
  tracksCompleted: number;
  totalVotesReceived: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  instruments: string[];
  genres: string[];
  skillLevel: string;
  rating: number;
  sessionsPlayed: number;
  tracksCompleted: number;
}
