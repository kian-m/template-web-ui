'use client';

interface SailboatLogoProps {
  size?: number;
  className?: string;
}

export default function SailboatLogo({ size = 32, className = "" }: SailboatLogoProps) {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Main sail - large triangular sail */}
        <path
          d="M16 2 L16 22 L6 22 L16 2 Z"
          fill="hsl(var(--accent))"
        />
        
        {/* Jib sail - smaller front sail */}
        <path
          d="M16 6 L16 20 L24 13 L16 6 Z"
          fill="hsl(var(--primary))"
          opacity="0.9"
        />
        
        {/* Mast */}
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="22"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Hull - simplified and cleaner */}
        <path
          d="M8 22 L24 22 C25 22, 25.5 23, 25 24 L23 26 L9 26 C8 26, 7.5 25, 8 24 L8 22 Z"
          fill="hsl(var(--foreground))"
        />
        
        {/* Boom (horizontal sail support) */}
        <line
          x1="6"
          y1="22"
          x2="16"
          y2="22"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Animated version for special moments
export function AnimatedSailboatLogo({ size = 32, className = "" }: SailboatLogoProps) {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Main sail with subtle animation */}
        <path
          d="M16 2 L16 22 L6 22 L16 2 Z"
          fill="hsl(var(--accent))"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 16 12; 2 16 12; 0 16 12"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Jib sail with animation */}
        <path
          d="M16 6 L16 20 L24 13 L16 6 Z"
          fill="hsl(var(--primary))"
          opacity="0.9"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 16 13; -1 16 13; 0 16 13"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Mast */}
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="22"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Hull with subtle bob */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 1; 0 0"
            dur="2s"
            repeatCount="indefinite"
          />
          <path
            d="M8 22 L24 22 C25 22, 25.5 23, 25 24 L23 26 L9 26 C8 26, 7.5 25, 8 24 L8 22 Z"
            fill="hsl(var(--foreground))"
          />
        </g>
        
        {/* Boom */}
        <line
          x1="6"
          y1="22"
          x2="16"
          y2="22"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}