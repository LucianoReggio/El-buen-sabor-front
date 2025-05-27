import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'default', 
  size = 'md',
  children,
  ...props 
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        
        // Variants
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'danger',
          'bg-blue-100 text-blue-800': variant === 'info',
        },
        
        // Sizes
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-2.5 py-1.5 text-sm': size === 'md',
          'px-3 py-2 text-base': size === 'lg',
        },
        
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};