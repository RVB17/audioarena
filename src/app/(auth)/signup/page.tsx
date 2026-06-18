'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Profile is typically created via a database trigger on auth.users insert,
      // but we can also insert the username here if the trigger just creates a blank profile.
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username, display_name: username })
          .eq('id', authData.user.id);
          
        if (profileError) {
          console.error("Error setting username:", profileError);
          // Don't throw, they are signed up
        }
      }

      router.push('/lobby');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
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
      setError(err.message || \`Failed to sign up with \${provider}\`);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Card variant="glass" className="w-full max-w-md animate-slide-up">
        <CardHeader>
          <h1 className="text-display text-center mb-2">Join the Arena</h1>
          <p className="text-muted text-center">Create your AudioArena account</p>
        </CardHeader>
        
        <CardBody>
          {error && (
            <div className="bg-error/10 border border-error text-error p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="input-group">
              <label htmlFor="username" className="text-sm font-medium mb-1 block text-secondary">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="coolproducer99"
                required
                minLength={3}
                maxLength={24}
                pattern="^[a-zA-Z0-9_]+$"
                title="Only letters, numbers, and underscores allowed"
              />
            </div>

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
                minLength={6}
              />
            </div>

            <Button type="submit" fullWidth loading={isLoading} className="mt-2">
              Create Account
            </Button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex-center">
              <div className="w-full border-t border-border-subtle"></div>
            </div>
            <span className="relative bg-surface px-4 text-xs text-muted uppercase tracking-wider">
              Or sign up with
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
          Already have an account?{' '}
          <Link href="/login" className="text-accent-primary hover:underline font-medium">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
