import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { StatsGrid } from '@/components/profile/StatsGrid';
import type { PublicProfile } from '@/types';

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `${params.username}'s Profile — AudioArena`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const supabase = await createClient();
  const username = params.username;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio, instruments, genres, skill_level, rating, sessions_played, tracks_completed, total_votes_received')
    .eq('username', username)
    .single();

  if (error || !data) {
    notFound();
  }

  const profile: PublicProfile = {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    instruments: data.instruments || [],
    genres: data.genres || [],
    skillLevel: data.skill_level,
    rating: data.rating || 0,
    sessionsPlayed: data.sessions_played || 0,
    tracksCompleted: data.tracks_completed || 0,
    totalVotesReceived: data.total_votes_received || 0,
  };

  return (
    <div className="container max-w-4xl py-12 space-y-8">
      <ProfileCard profile={profile} />
      <StatsGrid profile={profile} />
      
      {/* Tracks Section Placeholder */}
      <div className="mt-12">
        <h2 className="text-heading text-2xl mb-4 border-b border-border-subtle pb-2">Completed Tracks</h2>
        <div className="bg-bg-elevated border border-border-subtle rounded-xl p-12 text-center text-muted">
          @{profile.username} hasn't published any tracks yet.
        </div>
      </div>
    </div>
  );
}
