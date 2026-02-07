import React from 'react';

interface BadgeProps {
  variant: 'playing' | 'next' | 'waiting' | 'team' | 'solo';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variantClass = 
    variant === 'playing' ? 'badge-playing' :
    variant === 'next' ? 'badge-next' :
    variant === 'waiting' ? 'badge-waiting' :
    variant === 'team' ? 'badge-team' :
    'badge-solo';

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
