import React from 'react';
import type { PublicProfile, UserProfile } from '@/types';

interface StatsGridProps {
  profile: PublicProfile | UserProfile;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ profile }) => {
  const stats = [
    { label: 'Sessions Played', value: profile.sessionsPlayed || 0, icon: '🎮' },
    { label: 'Tracks Completed', value: profile.tracksCompleted || 0, icon: '💿' },
    { label: 'Total Votes', value: profile.totalVotesReceived || 0, icon: '🔥' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-bg-elevated p-6 rounded-xl border border-border-subtle flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-surface-glass flex items-center justify-center text-2xl border border-border-subtle">
            {stat.icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-muted uppercase tracking-wider">{stat.label}</div>
            <div className="text-2xl font-bold text-text-primary">{stat.value.toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
