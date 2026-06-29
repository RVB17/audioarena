'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

// Mock types until we integrate full Yjs/Tone.js states
interface TrackState {
  id: string;
  name: string;
  instrument: string;
  muted: boolean;
  solo: boolean;
  volume: number; // 0 to 100
  color: string;
}

interface TrackListProps {
  tracks?: TrackState[];
}

const MOCK_TRACKS: TrackState[] = [
  { id: '1', name: 'Main Synth', instrument: 'synth', muted: false, solo: false, volume: 80, color: '#ff2d95' },
  { id: '2', name: 'Drum Bus', instrument: 'drums', muted: false, solo: false, volume: 90, color: '#00f0ff' },
  { id: '3', name: 'Bassline', instrument: 'bass', muted: true, solo: false, volume: 75, color: '#00e676' },
];

export const TrackList: React.FC<TrackListProps> = ({ tracks = MOCK_TRACKS }) => {
  const [localTracks, setLocalTracks] = useState(tracks);

  const toggleMute = (id: string) => {
    setLocalTracks(prev => prev.map(t => t.id === id ? { ...t, muted: !t.muted } : t));
  };

  const toggleSolo = (id: string) => {
    setLocalTracks(prev => prev.map(t => t.id === id ? { ...t, solo: !t.solo } : t));
  };

  return (
    <div className="flex flex-col h-full bg-bg-primary overflow-hidden">
      {/* Timeline Header (Ruler) */}
      <div className="h-10 bg-bg-elevated border-b border-border-subtle flex">
        <div className="w-64 shrink-0 border-r border-border-subtle bg-bg-surface flex items-center px-4">
          <span className="text-xs font-mono text-muted">TRACKS</span>
        </div>
        <div className="flex-1 relative overflow-hidden">
          {/* Simple mock ruler */}
          <div className="absolute inset-0 flex items-end">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="flex-1 h-full border-l border-border-subtle/30 relative">
                <span className="absolute bottom-1 left-1 text-[10px] text-muted font-mono">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tracks Container */}
      <div className="flex-1 overflow-y-auto">
        {localTracks.map((track) => (
          <div key={track.id} className="flex h-24 border-b border-border-subtle group">
            {/* Track Header (Controls) */}
            <div className="w-64 shrink-0 bg-bg-surface border-r border-border-subtle p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: track.color }}></div>
                  <span className="font-semibold text-sm truncate">{track.name}</span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => toggleMute(track.id)}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-colors ${track.muted ? 'bg-error text-white' : 'bg-surface-glass text-muted hover:text-text-primary'}`}
                  >
                    M
                  </button>
                  <button 
                    onClick={() => toggleSolo(track.id)}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-colors ${track.solo ? 'bg-warning text-bg-primary' : 'bg-surface-glass text-muted hover:text-text-primary'}`}
                  >
                    S
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase text-muted tracking-wider">{track.instrument}</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={track.volume} 
                  readOnly
                  className="flex-1 h-1.5 accent-accent-secondary bg-surface-glass rounded-full appearance-none" 
                />
              </div>
            </div>
            
            {/* Track Lane (Arrangement area) */}
            <div className="flex-1 relative bg-bg-primary group-hover:bg-bg-secondary/30 transition-colors">
              {/* Grid lines */}
              <div className="absolute inset-0 flex pointer-events-none">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="flex-1 h-full border-l border-border-subtle/10"></div>
                ))}
              </div>
              
              {/* Mock MIDI Clip */}
              <div 
                className="absolute top-2 bottom-2 rounded border border-white/20 overflow-hidden"
                style={{ 
                  left: '12.5%', // Start at measure 5
                  width: '25%',  // 8 measures long
                  backgroundColor: `${track.color}40`, // 25% opacity
                  borderColor: track.color
                }}
              >
                {/* Mock MIDI notes */}
                <div className="absolute inset-0 p-1">
                  <div className="w-1/4 h-1/5 bg-white/50 rounded-sm absolute top-1/4 left-[5%]"></div>
                  <div className="w-1/4 h-1/5 bg-white/50 rounded-sm absolute top-2/4 left-[35%]"></div>
                  <div className="w-1/4 h-1/5 bg-white/50 rounded-sm absolute top-1/3 left-[65%]"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="p-4 flex justify-center">
          <Button variant="ghost" size="sm" className="opacity-50 hover:opacity-100">
            + Add Track
          </Button>
        </div>
      </div>
    </div>
  );
};
