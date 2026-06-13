'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ModernNumberCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: 'activity' | 'zap' | 'users' | 'dollar' | 'cart' | 'eye';
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
  sparkline?: number[];
  live?: boolean;
  pulse?: boolean;
  className?: string;
}

const icons = {
  activity: Activity,
  zap: Zap,
  users: Users,
  dollar: DollarSign,
  cart: ShoppingCart,
  eye: Eye,
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-purple-600',
    glow: 'shadow-purple-500/20',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/20',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-orange-600',
    glow: 'shadow-orange-500/20',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500 to-pink-600',
    glow: 'shadow-pink-500/20',
  },
};

function AnimatedNumber({ value, format = true }: { value: number; format?: boolean }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) =>
    format ? Math.floor(current).toLocaleString() : Math.floor(current).toString(),
  );

  useEffect(() => {
    spring.set(typeof value === 'number' ? value : parseFloat(value as any) || 0);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

function Sparkline({ data, color = 'blue' }: { data: number[]; color: string }) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const path = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg className="h-12 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            className={colorClasses[color as keyof typeof colorClasses].text}
            stopOpacity="0.3"
          />
          <stop
            offset="100%"
            className={colorClasses[color as keyof typeof colorClasses].text}
            stopOpacity="0.05"
          />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        className={colorClasses[color as keyof typeof colorClasses].text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={`${path} L 100 100 L 0 100 Z`} fill={`url(#gradient-${color})`} />
    </svg>
  );
}

export default function ModernNumberCard({
  title,
  value,
  change,
  changeLabel = 'from last period',
  icon = 'activity',
  color = 'blue',
  sparkline,
  live = false,
  pulse = false,
  className = '',
}: ModernNumberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [liveValue, setLiveValue] = useState(value);
  const IconComponent = icons[icon];
  const colorScheme = colorClasses[color];

  // Simulate live updates
  useEffect(() => {
    if (!live) return;

    const interval = setInterval(() => {
      const baseValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
      const variation = baseValue * 0.05; // 5% variation
      const newValue = baseValue + (Math.random() - 0.5) * variation;
      setLiveValue(Math.round(newValue));
    }, 3000);

    return () => clearInterval(interval);
  }, [live, value]);

  const displayValue = live ? liveValue : value;
  const numericValue =
    typeof displayValue === 'number' ? displayValue : parseFloat(displayValue as string) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-2xl border backdrop-blur-xl',
        'bg-white/50 dark:bg-gray-900/50',
        'border-gray-200/50 dark:border-gray-800/50',
        'transition-all duration-500',
        isHovered && `shadow-2xl ${colorScheme.glow}`,
        pulse && 'animate-pulse',
        className,
      )}
    >
      {/* Gradient overlay */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-5', colorScheme.gradient)} />

      {/* Live indicator */}
      {live && (
        <motion.div
          className="absolute top-3 right-3"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </motion.div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn('rounded-xl p-2', colorScheme.bg, colorScheme.border)}
              animate={{
                rotate: isHovered ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <IconComponent className={cn('h-5 w-5', colorScheme.text)} />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            </div>
          </div>
        </div>

        {/* Value */}
        <div className="mb-4">
          <motion.div
            className="text-3xl font-bold text-gray-900 dark:text-white"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {typeof numericValue === 'number' ? (
              <AnimatedNumber value={numericValue} />
            ) : (
              displayValue
            )}
          </motion.div>

          {/* Change indicator */}
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 flex items-center gap-1"
            >
              {change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  change >= 0 ? 'text-green-500' : 'text-red-500',
                )}
              >
                {Math.abs(change)}%
              </span>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{changeLabel}</span>
            </motion.div>
          )}
        </div>

        {/* Sparkline */}
        {sparkline && sparkline.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="-mx-2 mt-4"
          >
            <Sparkline data={sparkline} color={color} />
          </motion.div>
        )}
      </div>

      {/* Hover effect gradient */}
      <motion.div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0',
          'bg-gradient-to-t from-transparent via-transparent',
          `to-${color}-500/5`,
        )}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
