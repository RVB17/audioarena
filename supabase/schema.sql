-- ==============================================================================
-- AUDIOARENA SUPABASE SCHEMA
-- Copy and paste this entire script into your Supabase SQL Editor and click "Run"
-- ==============================================================================

-- 1. Create custom Enums
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'pro');
CREATE TYPE session_phase AS ENUM ('lobby', 'brainstorm', 'compose', 'mix', 'published', 'archived');
CREATE TYPE match_status AS ENUM ('idle', 'queuing', 'match_found', 'match_accepted', 'match_declined', 'in_session');
CREATE TYPE role_type AS ENUM ('creator', 'member');

-- 2. Create Profiles table (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL CHECK (char_length(username) >= 3),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  instruments TEXT[] DEFAULT '{}',
  genres TEXT[] DEFAULT '{}',
  skill_level skill_level DEFAULT 'beginner',
  rating NUMERIC DEFAULT 0.0,
  sessions_played INTEGER DEFAULT 0,
  tracks_completed INTEGER DEFAULT 0,
  total_votes_received INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Sessions table
CREATE TABLE public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status session_phase DEFAULT 'lobby' NOT NULL,
  genre TEXT,
  bpm INTEGER DEFAULT 120,
  musical_key TEXT,
  scale TEXT,
  vibe_tags TEXT[] DEFAULT '{}',
  max_participants INTEGER DEFAULT 4,
  is_public BOOLEAN DEFAULT true,
  timer_seconds INTEGER,
  phase_started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  yjs_doc_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Session Participants table
CREATE TABLE public.session_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  instrument TEXT NOT NULL,
  role role_type DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(session_id, user_id) -- A user can only join a session once
);

-- 5. Create Matchmaking Queue table
CREATE TABLE public.matchmaking_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  instrument TEXT NOT NULL,
  genres TEXT[] DEFAULT '{}',
  bpm_min INTEGER DEFAULT 60,
  bpm_max INTEGER DEFAULT 200,
  vibe_tags TEXT[] DEFAULT '{}',
  skill_range TEXT[] DEFAULT '{}',
  queued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id) -- A user can only be in the queue once
);

-- 6. Create Chat Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Tracks table
CREATE TABLE public.tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  bpm INTEGER,
  audio_url TEXT,
  midi_url TEXT,
  cover_art_url TEXT,
  duration_seconds INTEGER,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- AUTOMATED TRIGGERS
-- ==============================================================================

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updating 'updated_at' timestamps
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER set_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, only the owner can update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Sessions: Anyone can view public sessions, members can view private, only creators can update
CREATE POLICY "Sessions are viewable by everyone" ON public.sessions FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update sessions" ON public.sessions FOR UPDATE USING (auth.uid() = creator_id);

-- Session Participants: Anyone can view, users can insert themselves, only users or creators can delete
CREATE POLICY "Participants are viewable by everyone" ON public.session_participants FOR SELECT USING (true);
CREATE POLICY "Users can join sessions" ON public.session_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave sessions" ON public.session_participants FOR DELETE USING (auth.uid() = user_id);

-- Matchmaking: Users can read all (for matching logic), but only insert/update/delete their own
CREATE POLICY "Queue is viewable by authenticated users" ON public.matchmaking_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join queue" ON public.matchmaking_queue FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own queue" ON public.matchmaking_queue FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can leave queue" ON public.matchmaking_queue FOR DELETE USING (auth.uid() = user_id);

-- Messages: Only participants can read and write to a session's chat
CREATE POLICY "Session participants can read messages" ON public.messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.session_participants WHERE session_id = messages.session_id AND user_id = auth.uid()));
CREATE POLICY "Session participants can insert messages" ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.session_participants WHERE session_id = messages.session_id AND user_id = auth.uid()));

-- Tracks: Anyone can view, authenticated can insert, creators can update
CREATE POLICY "Tracks are viewable by everyone" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tracks" ON public.tracks FOR INSERT TO authenticated WITH CHECK (true);

-- Enable Realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matchmaking_queue;
