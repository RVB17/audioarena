import React from 'react';
import Image from 'next/image';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  fallback = '?', 
  online 
}) => {
  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      {src ? (
        <img src={src} alt={alt} className={styles.image} />
      ) : (
        <span className={styles.fallback}>{fallback.substring(0, 2)}</span>
      )}
      {online !== undefined && (
        <span className={`${styles.statusIndicator} ${online ? styles.online : styles.offline}`} />
      )}
    </div>
  );
};
