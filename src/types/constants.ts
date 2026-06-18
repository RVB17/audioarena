export const INSTRUMENTS = [
  'vocals', 'guitar', 'bass', 'drums', 'keys', 'piano',
  'synth', 'strings', 'brass', 'woodwinds', 'percussion',
  'turntables', 'sampler', 'producer', 'other'
] as const;

export const GENRES = [
  'rock', 'pop', 'hip-hop', 'r&b', 'jazz', 'blues', 'electronic',
  'edm', 'house', 'techno', 'classical', 'country', 'folk',
  'metal', 'punk', 'indie', 'soul', 'funk', 'reggae', 'latin',
  'world', 'ambient', 'lo-fi', 'trap', 'drill', 'other'
] as const;

export const VIBE_TAGS = [
  'chill', 'energetic', 'dark', 'uplifting', 'melancholic',
  'aggressive', 'dreamy', 'funky', 'ethereal', 'groovy',
  'experimental', 'minimal', 'epic', 'intimate', 'psychedelic'
] as const;

export const SKILL_LEVELS = [
  'beginner', 'intermediate', 'advanced', 'pro'
] as const;

export const MUSICAL_KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const;

export const SCALES = ['major', 'minor', 'dorian', 'mixolydian', 'pentatonic', 'blues'] as const;

export const SESSION_PHASES = ['lobby', 'brainstorm', 'compose', 'mix', 'published', 'archived'] as const;

export type Instrument = typeof INSTRUMENTS[number];
export type Genre = typeof GENRES[number];
export type VibeTag = typeof VIBE_TAGS[number];
export type SkillLevel = typeof SKILL_LEVELS[number];
export type MusicalKey = typeof MUSICAL_KEYS[number];
export type Scale = typeof SCALES[number];
