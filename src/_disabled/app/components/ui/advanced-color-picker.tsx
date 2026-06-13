'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface AdvancedColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function AdvancedColorPicker({
  label,
  value,
  onChange,
  className,
}: AdvancedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Convert hex to HSL
  useEffect(() => {
    const hexToHsl = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return;

      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0,
        l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }

      setHue(Math.round(h * 360));
      setSaturation(Math.round(s * 100));
      setLightness(Math.round(l * 100));
    };

    hexToHsl(value);
  }, [value]);

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = Math.round(x * 255).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  };

  const handleColorChange = () => {
    const newColor = hslToHex(hue, saturation, lightness);
    setTempColor(newColor);
    onChange(newColor);

    // Update CSS variable immediately for live preview
    document.documentElement.style.setProperty(
      `--${label.toLowerCase().replace(/\s+/g, '-')}`,
      newColor,
    );
  };

  useEffect(() => {
    handleColorChange();
  }, [hue, saturation, lightness]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={cn('relative', className)}>
      {/* Color square button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-lg border-2 border-gray-300 shadow-sm transition-all hover:scale-105 hover:border-gray-400 hover:shadow-md dark:border-gray-600 dark:hover:border-gray-500"
        style={{ backgroundColor: value }}
        aria-label={`Pick color for ${label}`}
      >
        {isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="pointer-events-none absolute inset-0 rounded-lg border-2 border-blue-500"
          />
        )}
      </button>

      {/* Color picker popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={pickerRef}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            style={{ minWidth: '280px' }}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Color preview */}
            <div className="mb-4">
              <div
                className="h-20 w-full rounded-lg shadow-inner"
                style={{ backgroundColor: tempColor }}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                  {tempColor.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  HSL({hue}, {saturation}%, {lightness}%)
                </span>
              </div>
            </div>

            {/* Hue slider */}
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Hue
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), 
                    hsl(60, 100%, 50%), 
                    hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), 
                    hsl(240, 100%, 50%), 
                    hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%)
                  )`,
                }}
              />
            </div>

            {/* Saturation slider */}
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Saturation
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, 0%, ${lightness}%), 
                    hsl(${hue}, 100%, ${lightness}%)
                  )`,
                }}
              />
            </div>

            {/* Lightness slider */}
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Lightness
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => setLightness(Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, ${saturation}%, 0%), 
                    hsl(${hue}, ${saturation}%, 50%), 
                    hsl(${hue}, ${saturation}%, 100%)
                  )`,
                }}
              />
            </div>

            {/* Preset colors */}
            <div className="grid grid-cols-8 gap-1">
              {[
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#ec4899',
                '#14b8a6',
                '#f97316',
                '#06b6d4',
                '#84cc16',
                '#eab308',
                '#dc2626',
                '#a855f7',
                '#f43f5e',
                '#0ea5e9',
                '#22c55e',
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setTempColor(color);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'h-7 w-7 rounded border-2 transition-all hover:scale-110',
                    tempColor === color
                      ? 'border-blue-500'
                      : 'border-gray-300 dark:border-gray-600',
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
