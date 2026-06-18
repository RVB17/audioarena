'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const pathname = usePathname();

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
        <Link href="/login" className="btn btn-primary btn-sm">
          Sign In
        </Link>
      </div>
    </nav>
  );
};
