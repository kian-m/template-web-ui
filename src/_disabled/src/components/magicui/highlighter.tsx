'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { annotate } from 'rough-notation';
import type React from 'react';

// Define available annotation actions
type AnnotationAction =
  | 'highlight'
  | 'underline'
  | 'box'
  | 'circle'
  | 'strike-through'
  | 'crossed-off'
  | 'bracket';

// Custom TypeScript interface for supported props
interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  lightColor?: string;
  darkColor?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
}

export function Highlighter({
  children,
  action = 'highlight',
  color = '#ffd1dc', // Default pink color (fallback)
  lightColor,
  darkColor,
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const { theme, systemTheme } = useTheme();

  // Determine the current theme (accounting for system theme)
  const currentTheme = theme === 'system' ? systemTheme : theme;

  // Determine the color to use based on theme
  const getThemeAwareColor = () => {
    if (lightColor && darkColor) {
      return currentTheme === 'dark' ? darkColor : lightColor;
    }
    return color; // Fallback to original color prop
  };

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const themeAwareColor = getThemeAwareColor();
      const annotation = annotate(element, {
        type: action,
        color: themeAwareColor,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });

      annotation.show();

      // Store the current element in closure for cleanup
      return () => {
        if (element) {
          annotate(element, { type: action }).remove();
        }
      };
    }
  }, [
    action,
    lightColor,
    darkColor,
    color,
    currentTheme,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ]);

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  );
}
