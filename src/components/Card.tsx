import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hover' | 'active';
  className?: string;
  onClick?: () => void;
}

export function Card({ 
  children, 
  variant = 'default',
  className = '',
  onClick 
}: CardProps) {
  const baseClass = 
    variant === 'hover' ? 'card-hover' :
    variant === 'active' ? 'card-active' :
    'card';

  return (
    <div 
      className={`${baseClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
