import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export const metadata = {
  title: 'Leaderboard — AudioArena',
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  
  // Fetch top users by rating
  const { data: topUsers, error } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url, rating, skill_level')
    .order('rating', { ascending: false })
    .limit(50);

  return (
    <div className="container max-w-4xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-display text-4xl mb-4">Global Leaderboard</h1>
        <p className="text-muted text-lg">The most prolific creators in the Arena.</p>
      </div>

      <Card variant="glass">
        <CardBody className="p-0">
          <div className="divide-y divide-border-subtle">
            {error || !topUsers || topUsers.length === 0 ? (
              <div className="p-12 text-center text-muted">
                No rankings available yet. Be the first to play a session!
              </div>
            ) : (
              topUsers.map((user, index) => (
                <div key={user.username} className="flex items-center gap-4 p-4 hover:bg-bg-elevated transition-colors">
                  <div className="w-8 text-center font-bold text-muted text-xl">
                    {index + 1}
                  </div>
                  <Avatar src={user.avatar_url} fallback={user.username} size="md" />
                  
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${user.username}`} className="font-bold text-lg hover:text-accent-secondary truncate block">
                      {user.display_name || user.username}
                    </Link>
                    <div className="text-sm text-muted">
                      @{user.username}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-accent-primary font-bold text-lg">{user.rating} Elo</div>
                    <Badge variant="secondary" size="sm" className="capitalize">{user.skill_level}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
