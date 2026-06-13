'use client';

import React from 'react';
import DashboardDropdown from './dashboard-dropdown';
import { Button } from '@/app/components/ui/button';
import { RefreshCcw, Plus, Settings, HelpCircle, Zap } from 'lucide-react';

interface ModernHeaderProps {
  onRefresh: () => void;
  onAddWidget: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  credits?: number;
}

export default function ModernHeader({
  onRefresh,
  onAddWidget,
  onOpenSettings,
  onOpenHelp,
  credits = 9678,
}: ModernHeaderProps) {
  return (
    <header className="modern-header bg-background relative border-b px-4 py-3 shadow-sm md:px-6">
      <div className="flex max-w-full items-center justify-between">
        {/* Left section - Logo and Dashboard Dropdown */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
              <span className="text-sm font-bold text-white">D</span>
            </div>
            <span className="text-foreground hidden text-lg font-semibold sm:inline">Debark</span>
          </div>

          {/* Dashboard Dropdown */}
          <DashboardDropdown />
        </div>

        {/* Right section - Actions */}
        <div className="flex flex-shrink-0 items-center space-x-2 md:space-x-3">
          {/* Refresh Button */}
          <button
            className="hover:bg-accent rounded-lg p-2 transition-colors"
            aria-label="Refresh dashboard"
            onClick={onRefresh}
          >
            <RefreshCcw className="text-foreground/70 h-4 w-4" />
          </button>

          {/* Add Widget Button */}
          <Button
            variant="default"
            size="sm"
            className="flex items-center space-x-1"
            onClick={onAddWidget}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Widget</span>
          </Button>

          {/* Credits Badge */}
          <div className="bg-primary/10 text-primary flex items-center space-x-1 rounded-full px-3 py-1.5">
            <Zap className="h-3 w-3" />
            <span className="text-xs font-semibold">{credits.toLocaleString()}</span>
          </div>

          {/* Divider */}
          <div className="bg-border mx-1 h-6 w-px" />

          {/* Help Button */}
          <button
            className="hover:bg-accent rounded-lg p-2 transition-colors"
            aria-label="Help"
            onClick={onOpenHelp}
          >
            <HelpCircle className="text-foreground/70 h-4 w-4" />
          </button>

          {/* Settings Button */}
          <button
            className="hover:bg-accent rounded-lg p-2 transition-colors"
            aria-label="Settings"
            onClick={onOpenSettings}
          >
            <Settings className="text-foreground/70 h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
