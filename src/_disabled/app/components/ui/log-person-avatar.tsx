'use client';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface DataBarkAvatarProps {
  size?: number;
  className?: string;
}

export default function DataBarkAvatar({ size = 32, className = "" }: DataBarkAvatarProps) {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.7 }}
    >
      🪵
    </div>
  );
}

// Avatar state types
export type AvatarState = 'idle' | 'listening' | 'thinking' | 'talking';

interface StatefulAvatarProps extends DataBarkAvatarProps {
  state?: AvatarState;
  onStateChange?: (state: AvatarState) => void;
}

// Main animated avatar with state-based animations
export function StatefulDataBarkAvatar({ 
  size = 32, 
  className = "",
  state = 'idle',
  onStateChange
}: StatefulAvatarProps) {
  const [blinkPhase, setBlinkPhase] = useState(0);
  
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Different animation configs for different states
  const stateAnimations = {
    idle: {
      y: [0, -1, 0],
      scale: 1,
      transition: { 
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.3 }
      }
    },
    listening: {
      y: 0,
      scale: [1, 1.05, 1],
      transition: { 
        scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 0.3 }
      }
    },
    thinking: {
      y: 0,
      scale: 1,
      rotate: [0, -2, 2, -1, 1, 0],
      transition: { 
        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.3 },
        y: { duration: 0.3 }
      }
    },
    talking: {
      y: [0, -0.5, 0],
      scale: 1,
      transition: { 
        y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.3 }
      }
    }
  };

  // Eye animation based on state
  const getEyeAnimation = (state: AvatarState) => {
    switch (state) {
      case 'thinking':
        return {
          scaleY: [1, 0.3, 1, 0.3, 1],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'listening':
        return {
          scaleY: [1, 0.8, 1],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'talking':
        return {
          scaleY: [1, 0.2, 1, 0.2, 1],
          transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {
          scaleY: [1, 0.1, 1],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }
        };
    }
  };

  // Mouth shape based on state
  const getMouthPath = (state: AvatarState) => {
    switch (state) {
      case 'talking':
        return "M14 17.5 Q16 16.5, 18 17.5"; // Open mouth
      case 'thinking':
        return "M14 18 Q16 17.5, 18 18"; // Slightly closed, concentrated
      case 'listening':
        return "M14 17.5 Q16 18, 18 17.5"; // Slight smile
      default:
        return "M14 17.5 Q16 18.5, 18 17.5"; // Normal smile
    }
  };

  // Mouth animation for talking
  const getMouthAnimation = (state: AvatarState) => {
    if (state === 'talking') {
      return {
        d: [
          "M14 17.5 Q16 18.5, 18 17.5",
          "M14 17.5 Q16 16.5, 18 17.5",
          "M14 17.5 Q16 18, 18 17.5",
          "M14 17.5 Q16 17, 18 17.5"
        ],
        transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
      };
    }
    return {};
  };

  // Get glow effect for different states
  const getGlowColor = (state: AvatarState) => {
    switch (state) {
      case 'thinking': return '0 0 10px rgba(59, 130, 246, 0.5)'; // Blue glow
      case 'listening': return '0 0 10px rgba(34, 197, 94, 0.5)'; // Green glow
      case 'talking': return '0 0 10px rgba(249, 115, 22, 0.5)'; // Orange glow
      default: return 'none';
    }
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        animate={stateAnimations[state] as any}
        style={{ 
          filter: `drop-shadow(${getGlowColor(state)})`,
          width: size,
          height: size
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Log body */}
          <rect
            x="6"
            y="12"
            width="20"
            height="8"
            rx="4"
            fill="hsl(25, 40%, 55%)"
          />
          
          {/* Log texture lines */}
          <line x1="8" y1="14" x2="24" y2="14" stroke="hsl(25, 30%, 45%)" strokeWidth="0.5" />
          <line x1="8" y1="16" x2="24" y2="16" stroke="hsl(25, 30%, 45%)" strokeWidth="0.5" />
          <line x1="8" y1="18" x2="24" y2="18" stroke="hsl(25, 30%, 45%)" strokeWidth="0.5" />
          
          {/* Animated eyes */}
          <motion.ellipse 
            cx="12" 
            cy="15" 
            rx="1.5" 
            ry="1.5" 
            fill="hsl(var(--foreground))"
            animate={getEyeAnimation(state) as any}
          />
          <motion.ellipse 
            cx="20" 
            cy="15" 
            rx="1.5" 
            ry="1.5" 
            fill="hsl(var(--foreground))"
            animate={getEyeAnimation(state) as any}
          />
          
          {/* Eye highlights */}
          <circle cx="12.5" cy="14.5" r="0.5" fill="white" />
          <circle cx="20.5" cy="14.5" r="0.5" fill="white" />
          
          {/* Animated mouth */}
          <motion.path
            d={getMouthPath(state)}
            stroke="hsl(25, 30%, 35%)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            animate={getMouthAnimation(state) as any}
          />
          
          {/* Log ends */}
          <circle cx="6" cy="16" r="4" fill="hsl(25, 35%, 50%)" stroke="hsl(25, 25%, 40%)" strokeWidth="1" />
          <circle cx="26" cy="16" r="4" fill="hsl(25, 35%, 50%)" stroke="hsl(25, 25%, 40%)" strokeWidth="1" />
          
          {/* Wood grain rings */}
          <circle cx="6" cy="16" r="2.5" fill="none" stroke="hsl(25, 20%, 35%)" strokeWidth="0.5" />
          <circle cx="6" cy="16" r="1.5" fill="none" stroke="hsl(25, 20%, 35%)" strokeWidth="0.5" />
          <circle cx="26" cy="16" r="2.5" fill="none" stroke="hsl(25, 20%, 35%)" strokeWidth="0.5" />
          <circle cx="26" cy="16" r="1.5" fill="none" stroke="hsl(25, 20%, 35%)" strokeWidth="0.5" />

          {/* Thinking bubbles for thinking state */}
          {state === 'thinking' && (
            <g>
              <motion.circle
                cx="24"
                cy="8"
                r="1.5"
                fill="hsl(var(--muted-foreground))"
                opacity="0.6"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.circle
                cx="27"
                cy="6"
                r="1"
                fill="hsl(var(--muted-foreground))"
                opacity="0.4"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <motion.circle
                cx="29"
                cy="4"
                r="0.5"
                fill="hsl(var(--muted-foreground))"
                opacity="0.3"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1
                }}
              />
            </g>
          )}

          {/* Sound waves for talking state */}
          {state === 'talking' && (
            <g>
              <motion.path
                d="M28 12 Q30 14, 28 16"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.path
                d="M30 10 Q33 14, 30 18"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: 0.2
                }}
              />
            </g>
          )}

          {/* Ear indicator for listening state */}
          {state === 'listening' && (
            <motion.path
              d="M4 14 Q2 16, 4 18"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
          )}
        </svg>
      </motion.div>
    </div>
  );
}

// Legacy animated version for backward compatibility
export function AnimatedDataBarkAvatar({ size = 32, className = "" }: DataBarkAvatarProps) {
  return <StatefulDataBarkAvatar size={size} className={className} state="idle" />;
}