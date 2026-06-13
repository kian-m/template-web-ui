'use client';

import { ReactNode, useState } from 'react';
import { MoreVertical, RefreshCcw, Maximize2, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ThemeAwareWidgetShellProps {
  title: string;
  widgetId: string;
  children: ReactNode;
  onEdit?: () => void;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onDragStart?: () => void;
  className?: string;
}

export default function ThemeAwareWidgetShell({
  title,
  widgetId,
  children,
  onEdit,
  onRefresh,
  onViewDetails,
  onDragStart,
  className = '',
}: ThemeAwareWidgetShellProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        'group relative h-full w-full overflow-hidden rounded-xl transition-all duration-200',
        // Dynamic border and shadow based on theme
        'border border-gray-200 dark:border-gray-700/50',
        'bg-white dark:bg-gray-800/50',
        'shadow-sm hover:shadow-lg dark:shadow-lg dark:shadow-black/20',
        'hover:border-gray-300 dark:hover:border-gray-600',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Refresh widget"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </button>
          )}

          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="View details"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Widget options"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(widgetId);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Copy className="h-3 w-3" />
                  Copy ID
                </button>
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Maximize2 className="h-3 w-3" />
                    Edit Query
                  </button>
                )}
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-3.5rem)] w-full p-4">{children}</div>
    </div>
  );
}
