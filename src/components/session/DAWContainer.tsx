'use client';

import React from 'react';
import { SessionHeader } from './SessionHeader';
import { ParticipantBar } from './ParticipantBar';
import { TrackList } from './TrackList';
import type { SessionWithDetails } from '@/types';

interface DAWContainerProps {
  session: SessionWithDetails;
}

export const DAWContainer: React.FC<DAWContainerProps> = ({ session }) => {
  // In a real implementation, we would initialize Tone.js and Yjs here
  
  // Mock online users
  const onlineUserIds = session.participants.map(p => p.userId);

  return (
    <div className="flex flex-col h-screen w-full bg-bg-primary overflow-hidden">
      {/* Top Header */}
      <SessionHeader 
        session={session} 
        phaseTimeLeft={session.timerSeconds || 600} 
      />
      
      {/* Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Participants */}
        <ParticipantBar 
          participants={session.participants} 
          onlineUserIds={onlineUserIds} 
        />
        
        {/* Center - DAW Timeline & Tracks */}
        <div className="flex-1 flex flex-col min-w-0 bg-bg-primary relative">
          
          {/* Transport Controls (Play, Stop, Record, Tempo) */}
          <div className="h-14 bg-bg-surface border-b border-border-subtle flex items-center px-4 gap-6 shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-primary hover:bg-surface-glass transition-colors">
                ⏮
              </button>
              <button className="w-12 h-12 rounded-full bg-accent-primary text-text-inverse flex items-center justify-center shadow-glow hover:scale-105 transition-transform text-lg pl-1">
                ▶
              </button>
              <button className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-error hover:bg-error/20 transition-colors">
                ⏺
              </button>
            </div>
            
            <div className="h-8 border-l border-border-subtle mx-2"></div>
            
            <div className="flex flex-col font-mono text-center">
              <span className="text-[10px] text-muted tracking-widest uppercase">Time</span>
              <span className="text-accent-secondary font-bold">00:00.00</span>
            </div>
            
            <div className="flex flex-col font-mono text-center ml-4">
              <span className="text-[10px] text-muted tracking-widest uppercase">Bar.Beat</span>
              <span className="text-text-primary font-bold">1.1.00</span>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2 bg-bg-elevated px-3 py-1.5 rounded border border-border-subtle">
                <span className="text-xs text-muted">BPM</span>
                <span className="font-mono font-bold text-accent-secondary">{session.bpm}</span>
              </div>
              <div className="flex items-center gap-2 bg-bg-elevated px-3 py-1.5 rounded border border-border-subtle">
                <span className="text-xs text-muted">KEY</span>
                <span className="font-mono font-bold">{session.musicalKey} {session.scale}</span>
              </div>
            </div>
          </div>
          
          {/* The Tracks Area */}
          <div className="flex-1 relative overflow-hidden">
            <TrackList />
          </div>
          
          {/* Bottom Panel (Mixer / Piano Roll toggle) */}
          <div className="h-48 bg-bg-surface border-t border-border-subtle shrink-0">
            <div className="h-8 border-b border-border-subtle flex items-center px-4 gap-4 bg-bg-elevated">
              <button className="text-xs font-bold text-accent-primary border-b-2 border-accent-primary h-full px-2">PIANO ROLL</button>
              <button className="text-xs font-bold text-muted hover:text-text-primary h-full px-2">MIXER</button>
              <button className="text-xs font-bold text-muted hover:text-text-primary h-full px-2">EFFECTS</button>
            </div>
            <div className="p-4 flex items-center justify-center h-full text-muted text-sm italic">
              Select a track or clip to edit here...
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
