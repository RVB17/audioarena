'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { useAuth } from '@/hooks/useAuth';
import { INSTRUMENTS, GENRES, VIBE_TAGS } from '@/types/constants';

export const QueuePanel = () => {
  const { user } = useAuth();
  const { status, queueTime, joinQueue, leaveQueue, matchResult, acceptMatch, declineMatch } = useMatchmaking(user?.id);
  
  const [instrument, setInstrument] = useState(INSTRUMENTS[0]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [bpmMin, setBpmMin] = useState(80);
  const [bpmMax, setBpmMax] = useState(140);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleQueue = () => {
    if (!user) return; // Should not happen as page is protected
    
    if (status === 'queuing') {
      leaveQueue();
    } else {
      joinQueue({
        userId: user.id,
        instrument,
        genres: selectedGenres,
        bpmMin,
        bpmMax,
        vibeTags: [],
        skillRange: ['beginner', 'intermediate', 'advanced', 'pro']
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card variant="glass" className="w-full relative overflow-hidden">
      {status === 'queuing' && (
        <div className="absolute inset-0 bg-accent-primary/5 animate-pulse z-0 pointer-events-none" />
      )}
      
      <CardHeader className="relative z-10 border-b border-border-subtle pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Find a Match</h2>
          {status === 'queuing' && (
            <Badge variant="primary" className="animate-pulse">Searching...</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardBody className="relative z-10 space-y-6">
        {status === 'match_found' && matchResult ? (
          <div className="bg-bg-elevated p-6 rounded-xl border border-accent-primary text-center animate-matchFound shadow-[0_0_30px_var(--accent-glow)]">
            <h3 className="text-2xl font-bold text-accent-primary mb-2">Match Found!</h3>
            <p className="text-muted mb-4">A session is ready for you.</p>
            
            <div className="flex flex-col gap-2 mb-6 text-sm">
              <div className="flex justify-between p-2 bg-surface-glass rounded">
                <span className="text-muted">Genre</span>
                <span className="font-semibold text-accent-secondary">{matchResult.genre || 'Mixed'}</span>
              </div>
              <div className="flex justify-between p-2 bg-surface-glass rounded">
                <span className="text-muted">BPM</span>
                <span className="font-semibold text-accent-secondary">{matchResult.bpm}</span>
              </div>
              <div className="mt-4 text-left">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Squad</span>
                <div className="flex flex-wrap gap-2">
                  {matchResult.participants.map(p => (
                    <Badge key={p.userId} variant="secondary">
                      {p.username} ({p.instrument})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={declineMatch} variant="danger" fullWidth>Decline</Button>
              <Button onClick={acceptMatch} fullWidth>Accept Match</Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-semibold text-muted uppercase tracking-wider mb-2 block">I want to play</label>
              <select 
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="input w-full bg-bg-elevated capitalize"
                disabled={status === 'queuing'}
              >
                {INSTRUMENTS.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-muted uppercase tracking-wider mb-2 block flex justify-between">
                <span>Preferred Genres</span>
                <span className="text-xs lowercase normal-case opacity-70">Optional</span>
              </label>
              <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-1 custom-scrollbar">
                {GENRES.slice(0, 15).map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    disabled={status === 'queuing'}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                      selectedGenres.includes(genre) 
                        ? 'border-accent-secondary bg-accent-secondary/20 text-text-primary' 
                        : 'border-border-subtle bg-bg-elevated text-text-muted hover:border-accent-secondary/50'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-muted uppercase tracking-wider mb-2 block">
                BPM Range: <span className="text-accent-secondary">{bpmMin} - {bpmMax}</span>
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="60" max="200" step="5"
                  value={bpmMin} 
                  onChange={e => setBpmMin(Math.min(Number(e.target.value), bpmMax))}
                  disabled={status === 'queuing'}
                  className="w-full accent-accent-primary"
                />
                <input 
                  type="range" 
                  min="60" max="200" step="5"
                  value={bpmMax} 
                  onChange={e => setBpmMax(Math.max(Number(e.target.value), bpmMin))}
                  disabled={status === 'queuing'}
                  className="w-full accent-accent-primary"
                />
              </div>
            </div>
          </>
        )}
      </CardBody>
      
      <CardFooter className="relative z-10 pt-4 border-t border-border-subtle">
        {status !== 'match_found' && (
          <Button 
            fullWidth 
            size="lg"
            variant={status === 'queuing' ? 'danger' : 'primary'}
            onClick={handleQueue}
            className={status === 'queuing' ? 'animate-pulse' : ''}
          >
            {status === 'queuing' ? `Cancel Search (${formatTime(queueTime)})` : 'Start Matchmaking'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
