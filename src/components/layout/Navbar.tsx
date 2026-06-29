'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import styles from './Navbar.module.css';

import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, profile, isLoading } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" className={styles.brand}>
          Audio<span>Arena</span>
        </Link>
        <div className={styles.navLinks}>
          <Link 
            href="/lobby" 
            className={styles.navLink}
            data-active={pathname === '/lobby'}
          >
            Lobby
          </Link>
          <Link 
            href="/leaderboard" 
            className={styles.navLink}
            data-active={pathname === '/leaderboard'}
          >
            Leaderboard
          </Link>
        </div>
      </div>
      
      <div className={styles.actions}>
        <ThemeSwitcher />
        
        {!isLoading && (
          user ? (
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar 
                src={profile?.avatarUrl || user.user_metadata?.avatar_url} 
                fallback={profile?.username || user.email || '?'} 
                size="sm" 
              />
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )
        )}
      </div>
    </nav>
  );
};
