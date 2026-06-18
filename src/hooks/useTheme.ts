'use client';

import { useEffect, useState } from 'react';
import { useUIStore, Theme } from '@/stores/uiStore';

export function useTheme() {
  const { theme, setTheme: setZustandTheme } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('audioarena-theme') as Theme;
    if (savedTheme && ['synthwave-dark', 'synthwave-light', 'studio-dark', 'studio-light'].includes(savedTheme)) {
      setZustandTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [setZustandTheme]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('audioarena-theme', theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setZustandTheme(newTheme);
  };

  return { theme, setTheme, mounted };
}
