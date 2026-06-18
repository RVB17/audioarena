import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, icon, fullWidth, children, disabled, ...props }, ref) => {
    
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'md' ? `btn-${size}` : '';
    const widthClass = fullWidth ? 'w-full' : '';
    const loadingClass = loading ? 'loading' : '';
    
    const classes = [baseClass, variantClass, sizeClass, widthClass, loadingClass, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button 
        ref={ref} 
        className={classes} 
        disabled={disabled || loading} 
        {...props}
      >
        {loading && (
          <svg className="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeLinecap="round" />
          </svg>
        )}
        {!loading && icon && <span className="btn-icon">{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
