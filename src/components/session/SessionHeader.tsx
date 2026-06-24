import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { SessionWithDetails } from '@/types';

interface SessionHeaderProps {
  session: SessionWithDetails;
  phaseTimeLeft?: number;
  onAdvancePhase?: () => void;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ 
  session, 
  phaseTimeLeft,
  onAdvancePhase 
}) => {
  const formatTime = (seconds?: number) => {
    if (seconds === undefined || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return \`\${m}:\${s.toString().padStart(2, '0')}\`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-bg-surface border-b border-border-subtle h-16 shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="font-bold text-lg leading-tight">{session.name}</h1>
          <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
            <span className="text-accent-secondary">{session.bpm} BPM</span>
            <span>•</span>
            <span className="uppercase tracking-wider">{session.genre || 'Mixed'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-bg-elevated px-4 py-1.5 rounded-full border border-border-subtle">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Phase</span>
          <Badge variant="primary" className="animate-pulse">
            {session.status}
          </Badge>
          
          {phaseTimeLeft !== undefined && (
            <div className="flex items-center gap-1 text-sm font-mono text-accent-secondary ml-2 border-l border-border-subtle pl-3">
              ⏱️ {formatTime(phaseTimeLeft)}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {onAdvancePhase && (
            <Button variant="secondary" size="sm" onClick={onAdvancePhase}>
              Vote Next Phase
            </Button>
          )}
          <Button variant="danger" size="sm">
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
};
