'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { StatsGrid } from '@/components/profile/StatsGrid';
import { Button } from '@/components/ui/Button';

export default function MyProfilePage() {
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="container py-20 flex-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-bg-elevated rounded-full"></div>
          <div className="w-48 h-8 bg-bg-elevated rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-display text-3xl">My Studio</h1>
        <Button variant="ghost" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      {profile ? (
        <>
          <ProfileCard profile={profile} isEditable />
          <StatsGrid profile={profile} />
          
          {/* Tracks Section Placeholder */}
          <div className="mt-12">
            <h2 className="text-heading text-2xl mb-4 border-b border-border-subtle pb-2">My Tracks</h2>
            <div className="bg-bg-elevated border border-border-subtle rounded-xl p-12 text-center text-muted">
              You haven't completed any tracks yet. Jump into the lobby to get started!
              <div className="mt-4">
                <Button onClick={() => router.push('/lobby')}>Find a Session</Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-bg-elevated border border-border-subtle rounded-xl p-12 text-center">
          <h2 className="text-heading text-xl mb-2">Complete Your Profile</h2>
          <p className="text-muted mb-4">Set up your username and instruments to start matchmaking.</p>
          <Button>Setup Profile</Button>
        </div>
      )}
    </div>
  );
}
