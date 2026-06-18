export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  content: string;
  createdAt: string;
  sender?: {
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}
