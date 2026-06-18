'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Mock data for MVP
const MOCK_SESSIONS = [
  { id: '1', name: 'Late Night Synthwave', genre: 'electronic', bpm: 110, slots: [{ inst: 'drums', filled: true }, { inst: 'synth', filled: true }, { inst: 'bass', filled: false }] },
  { id: '2', name: 'Jazz Hop Collab', genre: 'lo-fi', bpm: 85, slots: [{ inst: 'keys', filled: true }, { inst: 'drums', filled: false }, { inst: 'bass', filled: false }] },
  { id: '3', name: 'Heavy Riffs', genre: 'metal', bpm: 160, slots: [{ inst: 'guitar', filled: true }, { inst: 'drums', filled: true }, { inst: 'vocals', filled: false }] },
];

export const SessionBrowser = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Open Sessions</h2>
        <div className="flex gap-2">
          <select className="input text-sm py-1">
            <option>All Genres</option>
            <option>Electronic</option>
            <option>Lo-Fi</option>
            <option>Metal</option>
          </select>
        </div>
      </div>
      
      <div className="grid gap-4">
        {MOCK_SESSIONS.map(session => (
          <Card key={session.id} variant="hover" padding="sm" className="flex flex-col sm:flex-row items-center gap-4 border border-border-subtle bg-bg-elevated">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{session.name}</h3>
                <Badge variant="genre">{session.genre}</Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="flex items-center gap-1"><span className="text-accent-secondary">⏱️</span> {session.bpm} BPM</span>
                
                <div className="flex gap-1 ml-2 pl-2 border-l border-border-subtle">
                  {session.slots.map((slot, i) => (
                    <div 
                      key={i} 
                      className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs \${
                        slot.filled ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/50' : 'bg-surface-glass border border-dashed border-muted text-muted'
                      }\`}
                      title={slot.inst}
                    >
                      {slot.inst[0].toUpperCase()}
                    </div>
                  ))}
                </div>
                <span className="text-xs">
                  {session.slots.filter(s => s.filled).length} / {session.slots.length} filled
                </span>
              </div>
            </div>
            
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <Button variant="secondary" size="sm" fullWidth>Join Session</Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <Button variant="ghost" size="sm">Load More Sessions</Button>
      </div>
    </div>
  );
};
