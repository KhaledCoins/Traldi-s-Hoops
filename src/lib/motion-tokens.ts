/**
 * Motion Design System - Traldi's Hoops
 * Inspirado em práticas de grandes marcas (Apple, etc.)
 * Princípios: precisão, propósito, performance
 */

export const motionTokens = {
  // Durations (ms)
  duration: {
    short: 80,
    default: 160,
    long: 300,
    tvCrossfade: 300,
  },

  // Easing functions
  easing: {
    default: 'cubic-bezier(0.215, 0.61, 0.355, 1)', // ease-out-quad-like
    subtle: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // subtle bounce
  },

  // Transform values
  scale: {
    hover: 1.02,
    press: 0.98,
    disabled: 1,
  },

  // Translate values (px)
  translate: {
    cardHover: -6,
    slideIn: 20,
  },

  // Stagger delays (ms)
  stagger: {
    list: 40,
    cards: 60,
  },

  // Opacity values
  opacity: {
    disabled: 0.5,
    ghost: 0.7,
  },
} as const;

// Framer Motion variants library
export const motionVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Slide up + fade (for cards, sections)
  slideUp: {
    initial: { opacity: 0, y: motionTokens.translate.slideIn },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: motionTokens.duration.default / 1000,
        ease: motionTokens.easing.default,
      }
    },
    exit: { opacity: 0, y: motionTokens.translate.slideIn },
  },

  // Scale + fade (for modals)
  scaleIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: motionTokens.duration.default / 1000,
        ease: motionTokens.easing.default,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: {
        duration: motionTokens.duration.short / 1000,
      }
    },
  },

  // Slide from bottom (for toasts)
  slideFromBottom: {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: motionTokens.duration.default / 1000,
        ease: motionTokens.easing.default,
      }
    },
    exit: { opacity: 0, y: 20 },
  },

  // Stagger children animation
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: motionTokens.stagger.list / 1000,
      }
    }
  },

  // Button press
  buttonTap: {
    scale: motionTokens.scale.press,
    transition: {
      duration: motionTokens.duration.short / 1000,
      ease: motionTokens.easing.default,
    }
  },

  // Shake (for errors)
  shake: {
    x: [-4, 4, -4, 4, 0],
    transition: {
      duration: 0.2,
    }
  },

  // Pulse (for highlights)
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.3,
      ease: motionTokens.easing.default,
    }
  },

  // TV crossfade
  tvCrossfade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: motionTokens.duration.tvCrossfade / 1000,
        ease: motionTokens.easing.subtle,
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: motionTokens.duration.tvCrossfade / 1000,
        ease: motionTokens.easing.subtle,
      }
    },
  },
} as const;

// Accessibility: check for reduced motion preference
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Helper: get transition config with reduced motion support
export const getTransition = (duration: keyof typeof motionTokens.duration, ease?: string) => {
  if (shouldReduceMotion()) {
    return { duration: 0 };
  }
  
  return {
    duration: motionTokens.duration[duration] / 1000,
    ease: ease || motionTokens.easing.default,
  };
};

// Export motion tokens as JSON (for design handoff)
export const exportMotionTokensJSON = () => {
  return JSON.stringify(motionTokens, null, 2);
};
