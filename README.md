# 🎵 AudioArena

**Collaborative DAW meets game-like matchmaking for musicians.**

AudioArena is a web-based music production platform where musicians matchmake by instrument, genre, and skill level to create tracks together in real-time sessions. Think multiplayer gaming lobby — but for making music.

---

## ✨ Features

### 🎮 Game-Like Matchmaking
- Queue by instrument, genre, BPM, vibe, and skill level
- Get matched into sessions with compatible musicians
- Accept/decline matches with a 30-second window
- Browse open sessions and join directly

### 🎹 Collaborative DAW
- Web-based MIDI editor and audio workspace
- Real-time collaboration via CRDT sync (Yjs)
- Private workspace + shared workspace (tab or split-screen view)
- Session phases: **Brainstorm** → **Compose** → **Mix** → **Publish**
- Optional timers per phase for competitive sessions

### 💬 Communication
- Built-in text chat per session
- WebRTC voice chat (push-to-talk or open mic)

### 🏆 Voting & Leaderboards
- Published tracks appear in a community feed
- Upvote/downvote system
- Daily, weekly, monthly champions
- Per-genre leaderboards

### 👤 Musician Profiles
- Instrument badges, genre preferences, skill level
- Track portfolio and collaboration stats
- Rating earned from community votes

### 🎨 Theming
- **Synthwave** (default) — retro-futuristic neon aesthetic
- **Studio** — clean, professional (Logic Pro / Ableton inspired)
- Both available in dark and light variants

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), TypeScript, React 18 |
| Audio | Tone.js, Web Audio API, Web MIDI API |
| Real-time Sync | Yjs (CRDT) + WebSocket |
| Voice Chat | WebRTC |
| Auth | Supabase Auth (email, Google, Discord, magic links) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| State | Zustand |
| Styling | Vanilla CSS with custom properties (design tokens) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm
- A free [Supabase](https://supabase.com) account

### Setup

```bash
# Clone the repo
git clone https://github.com/RVB17/audioarena.git
cd audioarena

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase project URL and anon key

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see AudioArena.

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your project URL and anon key
3. Paste them into `.env.local`
4. Run the database migration in the Supabase SQL editor (see `supabase/migrations/`)

---

## 🔒 Security

This is a **public repository**. Security measures in place:

- ✅ All secrets stored in `.env.local` (gitignored)
- ✅ Supabase Row Level Security (RLS) on all tables
- ✅ `NEXT_PUBLIC_` prefix only on browser-safe keys (anon key works with RLS)
- ✅ Service role key never exposed to the client
- ✅ Auth middleware on protected routes
- ✅ Input validation on all API endpoints
- ✅ Comprehensive `.gitignore` covering secrets, keys, and certificates

> ⚠️ **Never commit `.env.local` or any file containing API keys, service role keys, or passwords.**

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (auth)/             # Login / signup pages
│   ├── lobby/              # Matchmaking lobby
│   ├── session/[id]/       # Active collaboration session
│   ├── profile/            # User profiles
│   ├── leaderboard/        # Voting feed & charts
│   └── api/                # Backend API routes
├── components/             # React components
│   ├── ui/                 # Shared UI (Button, Card, Modal, etc.)
│   ├── lobby/              # Matchmaking components
│   ├── session/            # DAW & session components
│   ├── chat/               # Chat components
│   └── profile/            # Profile components
├── lib/                    # Core libraries
│   ├── supabase/           # Supabase client setup
│   ├── audio/              # Audio engine (Tone.js wrapper)
│   └── themes/             # Theme definitions
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand state stores
└── types/                  # TypeScript type definitions
```

---

## 🗺️ Roadmap

- **Phase 1** *(current)*: Core DAW + matchmaking + text chat + workspaces + profiles
- **Phase 2**: Voice chat + loop library + voting/leaderboard + session phases
- **Phase 3**: SoundFont rendering + themes + skill-based matchmaking
- **Phase 4**: Desktop companion app (VST bridge) + advanced features

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project builds on [openDAW](https://github.com/andremichelle/openDAW) (AGPL-3.0).  
See [LICENSE](LICENSE) for details.
