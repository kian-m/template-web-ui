'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { Check, Edit, Plus, RefreshCcw, X, Zap, Settings, HelpCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { errorEventName } from '@/lib/posthog-event';
import { useAppStore } from '@/app/store/root-store';
import { dashboardApi } from '@/app/services/dashboard-api';
import { SimpleDropdownMenu, SimpleMenuItem } from '@/app/components/ui/simple-dropdown-menu';
import AddSharedWidgetModal from '@/app/components/modals/add-shared-widget-modal';
import ColorPicker from '@/app/components/ui/color-picker';
import DashboardSelector from './dashboard-selector';
import UserMenu from './user-menu';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { activeDashboardId, updateDashboard } = useAppStore();
  const remainingCredits = useAppStore((state) => state.remainingCredits);
  const posthog = usePostHog();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showSharedModal, setShowSharedModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local title when dashboard changes
  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditStart = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditedTitle(title); // Reset to original title
  }, [title]);

  const handleEditSave = useCallback(async () => {
    if (editedTitle.trim() === '') {
      toast.error('Dashboard title cannot be empty', {
        event: 'dashboard_title_empty',
      });
      return;
    }

    try {
      await dashboardApi.updateDashboard(activeDashboardId, { name: editedTitle.trim() });
      updateDashboard(activeDashboardId, editedTitle.trim());
      setIsEditing(false);
      toast.success('Dashboard title has been updated successfully');
    } catch (err) {
      console.error('Failed to update dashboard', err);
      toast.error('Failed to update dashboard', { event: 'dashboard_update_failed' });
    }
  }, [editedTitle, activeDashboardId, updateDashboard, title]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleEditSave();
      } else if (e.key === 'Escape') {
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel],
  );

  const handleRefreshDashboard = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('dashboard-refresh', { detail: { dashboardId: activeDashboardId } }),
    );
    posthog?.capture('dashboard_refresh_click', { dashboard_id: activeDashboardId });
  }, [activeDashboardId, posthog]);

  return (
    <header className="flex-1 px-3 py-3 md:px-4">
      <div className="flex max-w-full items-center justify-between">
        <div className="flex min-w-0 flex-1 items-center space-x-3 md:space-x-4">
          {/* Hamburger Menu for Dashboard Selector */}
          <DashboardSelector />
        </div>

        {/* Professional Top-Right Corner - Mobile Responsive */}
        <div className="flex flex-shrink-0 items-center space-x-1 md:space-x-3">
          {/* Quick Actions */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleRefreshDashboard}
              className="posthog-icon-button posthog-tooltip"
              data-tooltip="Refresh dashboard"
              aria-label="Refresh dashboard"
            >
              <RefreshCcw className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>

          {/* Credits Badge */}
          <div className="flex items-center space-x-2">
            <div className="professional-badge flex items-center space-x-1 rounded-full px-2 py-1 md:px-2.5">
              <Zap className="h-3 w-3" />
              <span className="text-xs font-semibold">{remainingCredits}</span>
            </div>
          </div>

          {/* Primary Action */}
          <SimpleDropdownMenu
            trigger={
              <button className="posthog-button-ghost compact-dashboard-item flex items-center space-x-1">
                <Plus className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden text-xs sm:inline">Add Widget</span>
              </button>
            }
          >
            <SimpleMenuItem
              onClick={() => {
                if (remainingCredits > 0) {
                  window.dispatchEvent(new Event('open-chat'));
                } else {
                  toast.error('You have no remaining widget credits.', {
                    event: 'no_widget_credits',
                  });
                  posthog?.capture(errorEventName('widget_add_blocked'), {
                    location: 'header',
                  });
                }
              }}
            >
              With Agent
            </SimpleMenuItem>
            <SimpleMenuItem onClick={() => setShowSharedModal(true)}>From Share</SimpleMenuItem>
          </SimpleDropdownMenu>

          {/* Settings & Help */}
          <button
            onClick={() => router.push('/settings')}
            className="posthog-icon-button posthog-tooltip"
            data-tooltip="Settings"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={() => router.push('/help')}
            className="posthog-icon-button posthog-tooltip"
            data-tooltip="Help"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Color Picker */}
          <ColorPicker />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {showSharedModal && (
        <AddSharedWidgetModal isOpen={showSharedModal} onClose={() => setShowSharedModal(false)} />
      )}
    </header>
  );
}
