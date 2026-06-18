'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { QueuePanel } from '@/components/lobby/QueuePanel';
import { SessionBrowser } from '@/components/lobby/SessionBrowser';
import { Button } from '@/components/ui/Button';

export default function LobbyPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="container py-20 flex-center">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-display text-4xl mb-2">The Arena Lobby</h1>
          <p className="text-muted text-lg">
            Welcome back, <span className="text-accent-secondary font-semibold">@{profile?.username || 'musician'}</span>. Ready to jam?
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="secondary">Create Session</Button>
          <Button onClick={() => router.push('/profile')}>My Studio</Button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <QueuePanel />
          
          <div className="mt-8 bg-surface-glass border border-border-subtle p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              Online Friends
            </h3>
            <div className="text-muted text-sm text-center py-4">
              Connect Discord to see online friends.
            </div>
            <Button variant="ghost" fullWidth size="sm" className="mt-2 text-xs">Connect Discord</Button>
          </div>
        </div>
        
        <div className="lg:col-span-8">
          <SessionBrowser />
        </div>
      </div>
    </div>
  );
}
