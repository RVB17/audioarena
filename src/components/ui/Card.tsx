import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'hover';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  padding = 'md',
  className = '' 
}) => {
  return (
    <div className={`${styles.card} ${variant !== 'default' ? styles[variant] : ''} ${styles[padding]} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <div className={`${styles.header} ${className}`}>{children}</div>
);

export const CardBody: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <div className={`${styles.body} ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <div className={`${styles.footer} ${className}`}>{children}</div>
);
