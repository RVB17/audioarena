'use client';

import { useTheme } from '@/hooks/useTheme';
import styles from './ThemeSwitcher.module.css';

export const ThemeSwitcher = () => {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        data-active={theme === 'synthwave-dark'}
        onClick={() => setTheme('synthwave-dark')}
        aria-label="Synthwave Dark"
      >
        <span className={styles.icon}>🌆</span>
        <span className={styles.label}>Neon</span>
      </button>
      
      <button
        className={styles.button}
        data-active={theme === 'synthwave-light'}
        onClick={() => setTheme('synthwave-light')}
        aria-label="Synthwave Light"
      >
        <span className={styles.icon}>🌅</span>
        <span className={styles.label}>Dawn</span>
      </button>
      
      <button
        className={styles.button}
        data-active={theme === 'studio-dark'}
        onClick={() => setTheme('studio-dark')}
        aria-label="Studio Dark"
      >
        <span className={styles.icon}>🎛️</span>
        <span className={styles.label}>Pro</span>
      </button>

      <button
        className={styles.button}
        data-active={theme === 'studio-light'}
        onClick={() => setTheme('studio-light')}
        aria-label="Studio Light"
      >
        <span className={styles.icon}>☀️</span>
        <span className={styles.label}>Clean</span>
      </button>
    </div>
  );
};
