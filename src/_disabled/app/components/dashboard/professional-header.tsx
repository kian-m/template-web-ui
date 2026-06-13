'use client';

import React from 'react';
import { Button } from '@/app/components/ui/button';
import { RefreshCcw, Plus, Palette, SquarePen, Zap } from 'lucide-react';

interface ProfessionalHeaderProps {
  dashboardName: string;
  onRefresh: () => void;
  onAddWidget: () => void;
  onEditTitle: () => void;
  onThemeToggle: () => void;
  credits?: number;
}

export default function ProfessionalHeader({
  dashboardName,
  onRefresh,
  onAddWidget,
  onEditTitle,
  onThemeToggle,
  credits = 9678,
}: ProfessionalHeaderProps) {
  return (
    <header className="professional-header bg-background relative border-b px-4 py-3 shadow-sm md:px-6">
      <div className="flex max-w-full items-center justify-between">
        {/* Left section - Dashboard Title Only (Logo is in sidebar) */}
        <div className="flex min-w-0 flex-1 items-center space-x-2 md:space-x-4">
          {/* Dashboard Title */}
          <div className="flex min-w-0 flex-1 items-center space-x-1 md:space-x-2">
            <div className="flex min-w-0 items-center space-x-2">
              <h1 className="text-foreground truncate text-base font-semibold">{dashboardName}</h1>
              <button
                className="posthog-icon-button opacity-60 transition-opacity hover:opacity-100"
                aria-label="Edit dashboard title"
                onClick={onEditTitle}
              >
                <SquarePen className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex flex-shrink-0 items-center space-x-1 md:space-x-3">
          {/* Refresh Button */}
          <div className="flex items-center space-x-1">
            <button
              className="posthog-icon-button posthog-tooltip hover:bg-accent rounded-md p-2 transition-colors"
              data-tooltip="Refresh dashboard"
              aria-label="Refresh dashboard"
              onClick={onRefresh}
            >
              <RefreshCcw className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Credits Badge */}
          <div className="flex items-center space-x-2">
            <div className="professional-badge bg-primary/10 text-primary flex items-center space-x-1 rounded-full px-2 py-1 md:px-2.5">
              <Zap className="h-3 w-3" aria-hidden="true" />
              <span className="text-xs font-semibold">{credits.toLocaleString()}</span>
            </div>
          </div>

          {/* Add Widget Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="compact-dashboard-item flex items-center space-x-1"
              onClick={onAddWidget}
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
              <span className="hidden text-xs sm:inline">Add Widget</span>
            </Button>
          </div>

          {/* Theme Toggle */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="compact-dashboard-item flex items-center space-x-1"
              onClick={onThemeToggle}
            >
              <Palette className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
