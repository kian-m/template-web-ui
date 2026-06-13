'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { StatefulDataBarkAvatar, AvatarState } from './log-person-avatar';

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
  avatarState?: AvatarState;
}

interface AvatarLoggerProps {
  entries: LogEntry[];
  maxEntries?: number;
  autoHideDuration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

// Global state for managing log entries
class LogManager {
  private static instance: LogManager;
  private listeners: Set<(entries: LogEntry[]) => void> = new Set();
  private entries: LogEntry[] = [];
  private maxEntries = 5;

  static getInstance(): LogManager {
    if (!LogManager.instance) {
      LogManager.instance = new LogManager();
    }
    return LogManager.instance;
  }

  subscribe(callback: (entries: LogEntry[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.entries);
    return () => this.listeners.delete(callback);
  }

  addEntry(entry: Omit<LogEntry, 'id' | 'timestamp'>): void {
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    this.entries = [newEntry, ...this.entries].slice(0, this.maxEntries);
    this.notifyListeners();
  }

  removeEntry(id: string): void {
    this.entries = this.entries.filter((entry) => entry.id !== id);
    this.notifyListeners();
  }

  clear(): void {
    this.entries = [];
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback([...this.entries]));
  }
}

// Enhanced avatar logger component
export function AvatarLogger({
  maxEntries = 3,
  autoHideDuration = 5000,
  position = 'bottom-right',
  className = '',
}: Omit<AvatarLoggerProps, 'entries'>) {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    const logManager = LogManager.getInstance();
    return logManager.subscribe(setEntries);
  }, []);

  useEffect(() => {
    if (autoHideDuration > 0) {
      entries.forEach((entry) => {
        const timer = setTimeout(() => {
          LogManager.getInstance().removeEntry(entry.id);
        }, autoHideDuration);

        return () => clearTimeout(timer);
      });
    }
  }, [entries, autoHideDuration]);

  const getAvatarState = (type: LogEntry['type']): AvatarState => {
    switch (type) {
      case 'info':
        return 'listening';
      case 'success':
        return 'idle';
      case 'error':
        return 'thinking';
      case 'warning':
        return 'talking';
      default:
        return 'idle';
    }
  };

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-500/90 border-blue-400';
      case 'success':
        return 'bg-green-500/90 border-green-400';
      case 'error':
        return 'bg-red-500/90 border-red-400';
      case 'warning':
        return 'bg-orange-500/90 border-orange-400';
      default:
        return 'bg-gray-500/90 border-gray-400';
    }
  };

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const displayedEntries = entries.slice(0, maxEntries);

  return (
    <div className={`pointer-events-none fixed z-50 ${getPositionClasses(position)} ${className}`}>
      <AnimatePresence mode="popLayout">
        {displayedEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              transition: { delay: index * 0.1 },
            }}
            exit={{
              opacity: 0,
              x: position.includes('right') ? 100 : -100,
              scale: 0.8,
              transition: { duration: 0.2 },
            }}
            className={`pointer-events-auto mb-2 flex items-center space-x-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md ${getTypeColor(entry.type)} cursor-pointer text-sm font-medium text-white transition-transform hover:scale-105`}
            onClick={() => LogManager.getInstance().removeEntry(entry.id)}
            layout
          >
            <div className="flex-shrink-0">
              <StatefulDataBarkAvatar
                size={24}
                state={entry.avatarState || getAvatarState(entry.type)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate">{entry.message}</p>
              <p className="text-xs opacity-75">{entry.timestamp.toLocaleTimeString()}</p>
            </div>
            <button
              className="flex-shrink-0 text-lg leading-none opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                LogManager.getInstance().removeEntry(entry.id);
              }}
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Utility functions for easy logging
export const avatarLog = {
  info: (message: string, avatarState?: AvatarState) => {
    LogManager.getInstance().addEntry({ message, type: 'info', avatarState });
  },
  success: (message: string, avatarState?: AvatarState) => {
    LogManager.getInstance().addEntry({ message, type: 'success', avatarState });
  },
  error: (message: string, avatarState?: AvatarState) => {
    LogManager.getInstance().addEntry({ message, type: 'error', avatarState });
  },
  warning: (message: string, avatarState?: AvatarState) => {
    LogManager.getInstance().addEntry({ message, type: 'warning', avatarState });
  },
  clear: () => {
    LogManager.getInstance().clear();
  },
};

// Hook for using avatar logs
export function useAvatarLog() {
  return avatarLog;
}
