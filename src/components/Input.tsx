import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ 
  label, 
  error, 
  helperText,
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        className={`input-text ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-red-500 text-sm font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-gray-500 text-sm">{helperText}</p>
      )}
    </div>
  );
}
