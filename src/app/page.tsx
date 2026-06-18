import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        {/* Abstract Background Visuals */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--bg-elevated)_0%,_var(--bg-primary)_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-primary/20 blur-[120px] rounded-full mix-blend-screen -z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-secondary/20 blur-[100px] rounded-full mix-blend-screen -z-10 pointer-events-none translate-x-[20%]"></div>
        
        {/* Content */}
        <div className="animate-slide-up max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-border-subtle bg-surface-glass backdrop-blur-md mb-4 shadow-sm text-sm font-medium text-accent-secondary">
            🎵 The first multiplayer DAW is here
          </div>
          
          <h1 className="text-display text-5xl md:text-7xl font-bold tracking-tight text-text-primary leading-tight">
            Make music together.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary drop-shadow-[0_0_15px_var(--accent-glow)]">
              Like a game.
            </span>
          </h1>
          
          <p className="text-body text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Queue up, match with musicians around the world, and build tracks in real-time. 
            A collaborative studio in your browser with competitive matchmaking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/lobby">
              <Button size="lg" className="text-lg px-8 py-4 shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent-glow)] transition-shadow">
                Enter the Arena
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" size="lg" className="text-lg">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 bg-bg-surface border-t border-border-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-heading text-3xl md:text-4xl font-bold mb-4">Everything you need to collaborate</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              AudioArena combines professional music production tools with the social dynamics of multiplayer gaming.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-bg-elevated p-8 rounded-2xl border border-border-subtle hover:-translate-y-1 transition-transform shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Role Matchmaking</h3>
              <p className="text-text-secondary leading-relaxed">
                Need a bassist? Queue up requesting one. Our engine matches you based on instrument, genre, skill, and vibe.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-bg-elevated p-8 rounded-2xl border border-border-subtle hover:-translate-y-1 transition-transform shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-accent-secondary/20 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                🎛️
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Real-time Studio</h3>
              <p className="text-text-secondary leading-relaxed">
                A full DAW in your browser. Edit MIDI, arrange tracks, and mix together in real-time with sub-second sync.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-bg-elevated p-8 rounded-2xl border border-border-subtle hover:-translate-y-1 transition-transform shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                🏆
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Crown Champions</h3>
              <p className="text-text-secondary leading-relaxed">
                Publish your finished tracks to the feed. Community votes crown daily, weekly, and monthly genre champions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border-subtle bg-bg-primary text-text-muted text-sm">
        <p>Built with openDAW • Next.js • Supabase</p>
      </footer>
    </div>
  );
}
