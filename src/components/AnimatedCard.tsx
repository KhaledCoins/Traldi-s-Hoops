import React, { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function AnimatedCard({ 
  children, 
  className = '', 
  hoverable = false,
  delay = 0,
  onClick 
}: AnimatedCardProps) {
  return (
    <div
      className={`card ${className} ${onClick ? 'cursor-pointer' : ''} ${hoverable ? 'hover:-translate-y-1 transition-transform duration-200' : ''}`}
      style={{
        animationDelay: `${delay}ms`
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
