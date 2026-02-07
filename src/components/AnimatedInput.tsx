import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

export function AnimatedInput({
  label,
  error,
  success,
  helperText,
  className = '',
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label
          className={`block text-sm font-semibold mb-2 uppercase tracking-wide transition-colors ${
            isFocused ? 'text-white' : hasError ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          className={`input ${hasError ? 'input-error' : ''} ${className} pr-10 transition-all ${
            isFocused ? 'border-white' : ''
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Success/Error Icons */}
        {(success || hasError) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {success && <Check className="w-5 h-5 text-green-500" />}
            {hasError && <AlertCircle className="w-5 h-5 text-red-500" />}
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !hasError && (
        <p className="text-gray-500 text-sm mt-2">
          {helperText}
        </p>
      )}
    </div>
  );
}
