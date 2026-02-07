import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Zap, ZapOff } from 'lucide-react';

export function MotionToggle() {
  const systemPrefersReducedMotion = useReducedMotion();
  const [isMotionEnabled, setIsMotionEnabled] = useState(!systemPrefersReducedMotion);

  useEffect(() => {
    // Check localStorage for user preference
    const savedPreference = localStorage.getItem('motion-preference');
    if (savedPreference !== null) {
      setIsMotionEnabled(savedPreference === 'enabled');
    }
  }, []);

  const toggleMotion = () => {
    const newValue = !isMotionEnabled;
    setIsMotionEnabled(newValue);
    localStorage.setItem('motion-preference', newValue ? 'enabled' : 'disabled');
    
    // Reload page to apply changes
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-gray-400">
        {isMotionEnabled ? (
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Animações ativadas</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ZapOff className="w-4 h-4" />
            <span>Animações reduzidas</span>
          </div>
        )}
      </div>
      
      <button
        onClick={toggleMotion}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
        style={{ backgroundColor: isMotionEnabled ? '#ffffff' : '#4b5563' }}
        aria-label={isMotionEnabled ? 'Desativar animações' : 'Ativar animações'}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-black transition-transform"
          style={{ transform: isMotionEnabled ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
        />
      </button>
    </div>
  );
}
