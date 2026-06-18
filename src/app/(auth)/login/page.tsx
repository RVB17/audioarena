'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/lobby');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'discord') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: \`\${window.location.origin}/auth/callback\`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || \`Failed to sign in with \${provider}\`);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Card variant="glass" className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <h1 className="text-display text-center mb-2">Welcome Back</h1>
          <p className="text-muted text-center">Sign in to your AudioArena account</p>
        </CardHeader>
        
        <CardBody>
          {error && (
            <div className="bg-error/10 border border-error text-error p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="input-group">
              <label htmlFor="email" className="text-sm font-medium mb-1 block text-secondary">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="text-sm font-medium mb-1 block text-secondary">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" fullWidth loading={isLoading} className="mt-2">
              Sign In
            </Button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex-center">
              <div className="w-full border-t border-border-subtle"></div>
            </div>
            <span className="relative bg-surface px-4 text-xs text-muted uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => handleOAuthLogin('google')}
            >
              Google
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => handleOAuthLogin('discord')}
            >
              Discord
            </Button>
          </div>
        </CardBody>

        <CardFooter className="text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link href="/signup" className="text-accent-primary hover:underline font-medium">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
