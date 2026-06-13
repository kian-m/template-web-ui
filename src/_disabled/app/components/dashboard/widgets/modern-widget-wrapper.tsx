'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/app/lib/utils';
import { MoreVertical, Maximize2, Download, RefreshCw, Sparkles } from 'lucide-react';

interface ModernWidgetWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExport?: () => void;
  sparkle?: boolean;
  pulse?: boolean;
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}

export default function ModernWidgetWrapper({
  title,
  subtitle,
  children,
  className = '',
  isLoading = false,
  error = null,
  onRefresh,
  onExport,
  sparkle = false,
  pulse = false,
  gradient = 'blue',
}: ModernWidgetWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const gradientClasses = {
    blue: 'from-blue-500/10 via-transparent to-transparent',
    purple: 'from-purple-500/10 via-transparent to-transparent',
    green: 'from-emerald-500/10 via-transparent to-transparent',
    orange: 'from-orange-500/10 via-transparent to-transparent',
    pink: 'from-pink-500/10 via-transparent to-transparent',
  };

  const borderGradients = {
    blue: 'from-blue-500/20 to-transparent',
    purple: 'from-purple-500/20 to-transparent',
    green: 'from-emerald-500/20 to-transparent',
    orange: 'from-orange-500/20 to-transparent',
    pink: 'from-pink-500/20 to-transparent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative bg-white backdrop-blur-xl dark:bg-gray-900/50',
        'border border-gray-200/50 dark:border-gray-800/50',
        'overflow-hidden rounded-2xl',
        'transition-all duration-500 ease-out',
        isHovered && 'scale-[1.01] shadow-2xl shadow-gray-900/5 dark:shadow-black/20',
        pulse && 'animate-pulse',
        className,
      )}
    >
      {/* Gradient background effect */}
      <div
        className={cn('absolute inset-0 bg-gradient-to-br opacity-50', gradientClasses[gradient])}
      />

      {/* Animated border gradient on hover */}
      <motion.div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl opacity-0',
          'bg-gradient-to-br',
          borderGradients[gradient],
        )}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Sparkle effect */}
      {sparkle && (
        <motion.div
          className="absolute top-4 right-4"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </motion.div>
      )}

      {/* Header */}
      <div className="relative border-b border-gray-100 px-6 pt-6 pb-4 dark:border-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <motion.h3
              className="text-lg font-semibold text-gray-900 dark:text-white"
              animate={{ opacity: isHovered ? 1 : 0.9 }}
            >
              {title}
            </motion.h3>
            {subtitle && (
              <motion.p
                className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Actions */}
          <AnimatePresence>
            {(isHovered || showActions) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2"
              >
                {onRefresh && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRefresh}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <RefreshCw className="h-4 w-4 text-gray-500" />
                  </motion.button>
                )}
                {onExport && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onExport}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Download className="h-4 w-4 text-gray-500" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowActions(!showActions)}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live update indicator */}
        <motion.div
          className="absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-48 items-center justify-center"
            >
              <div className="relative">
                <motion.div
                  className="h-12 w-12 rounded-full border-4 border-gray-200 dark:border-gray-700"
                  style={{ borderTopColor: 'transparent' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent"
                  style={{
                    borderTopColor:
                      gradient === 'blue'
                        ? '#3b82f6'
                        : gradient === 'purple'
                          ? '#8b5cf6'
                          : '#10b981',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-48 flex-col items-center justify-center text-red-500"
            >
              <p className="text-sm">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer with live timestamp */}
      <div className="border-t border-gray-100 px-6 py-3 dark:border-gray-800/50">
        <motion.p className="text-xs text-gray-400" animate={{ opacity: isHovered ? 1 : 0.5 }}>
          Updated {Math.floor((Date.now() - lastUpdate.getTime()) / 60000)} min ago
        </motion.p>
      </div>
    </motion.div>
  );
}
