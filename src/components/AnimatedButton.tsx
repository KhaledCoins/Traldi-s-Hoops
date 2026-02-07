import React from 'react';
import { Check } from 'lucide-react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  isLoading?: boolean;
  success?: boolean;
  successText?: string;
  children: React.ReactNode;
}

export function AnimatedButton({ 
  variant = 'primary', 
  isLoading = false,
  success = false,
  successText,
  children, 
  disabled,
  className = '',
  ...props 
}: AnimatedButtonProps) {
  const baseClass = variant === 'primary' 
    ? 'btn-primary' 
    : variant === 'secondary' 
    ? 'btn-secondary'
    : variant === 'accent'
    ? 'btn-accent'
    : 'btn-ghost';

  return (
    <button
      className={`${baseClass} ${className} transition-all hover:scale-105 active:scale-95`}
      disabled={disabled || isLoading || success}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && (
          <span className="loading-spinner" />
        )}
        
        {success && (
          <Check className="w-5 h-5" />
        )}
        
        <span>
          {success && successText ? successText : isLoading ? 'Carregando...' : children}
        </span>
      </span>
    </button>
  );
}
