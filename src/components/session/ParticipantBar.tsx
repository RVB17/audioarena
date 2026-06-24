import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { SessionParticipant } from '@/types';

interface ParticipantBarProps {
  participants: SessionParticipant[];
  onlineUserIds: string[];
}

export const ParticipantBar: React.FC<ParticipantBarProps> = ({ 
  participants, 
  onlineUserIds 
}) => {
  return (
    <div className="flex flex-col w-64 bg-bg-surface border-r border-border-subtle shrink-0 hidden md:flex">
      <div className="p-4 border-b border-border-subtle bg-bg-elevated sticky top-0">
        <h3 className="font-bold text-sm text-muted uppercase tracking-wider">Collaborators</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {participants.map((p) => {
          const isOnline = onlineUserIds.includes(p.userId);
          const username = p.profile?.username || 'Unknown User';
          
          return (
            <div key={p.id} className="flex items-center gap-3 group">
              <Avatar 
                src={p.profile?.avatarUrl || undefined}
                fallback={username.substring(0, 2)}
                size="md"
                isOnline={isOnline}
                className={!isOnline ? "opacity-50" : ""}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={\`font-semibold text-sm truncate \${!isOnline ? 'text-muted' : 'text-text-primary'}\`}>
                    {username}
                  </span>
                  {p.role === 'creator' && (
                    <span title="Session Creator" className="text-accent-secondary text-xs">👑</span>
                  )}
                </div>
                <Badge variant="instrument" size="sm" className="w-max mt-1 text-[10px]">
                  {p.instrument}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mini chat preview / quick actions could go here */}
      <div className="p-4 border-t border-border-subtle bg-bg-elevated mt-auto">
        <button className="w-full py-2 bg-surface-glass border border-border-subtle rounded-md text-xs font-semibold text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-2">
          <span>💬</span> Open Chat
        </button>
      </div>
    </div>
  );
};
