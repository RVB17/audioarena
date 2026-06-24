import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DAWContainer } from '@/components/session/DAWContainer';
import type { SessionWithDetails } from '@/types';

export const metadata = {
  title: 'Session Workspace — AudioArena',
};

export default async function SessionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const sessionId = params.id;

  // Fetch session data
  const { data: sessionData, error: sessionError } = await supabase
    .from('sessions')
    .select(`
      *,
      creator:profiles!sessions_creator_id_fkey(username, display_name, avatar_url)
    `)
    .eq('id', sessionId)
    .single();

  if (sessionError || !sessionData) {
    notFound();
  }

  // Fetch participants
  const { data: participantsData, error: participantsError } = await supabase
    .from('session_participants')
    .select(`
      *,
      profile:profiles(username, display_name, avatar_url)
    `)
    .eq('session_id', sessionId);

  // Note: For MVP mock purposes, if we don't have participants yet due to direct linking,
  // we could mock them, but since we have DB tables, we use the real data.
  
  const session: SessionWithDetails = {
    ...sessionData,
    status: sessionData.status as any, // Cast to SessionPhase
    participants: participantsData || [],
    slots: [], // Not fully implemented in MVP yet
  };

  return (
    <main className="h-screen w-full bg-bg-primary overflow-hidden">
      <DAWContainer session={session} />
    </main>
  );
}
