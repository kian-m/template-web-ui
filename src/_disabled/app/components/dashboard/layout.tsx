// app/components/dashboard/layout.tsx
'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import TopLine from './top-line';
import ChatInterface from './chat-interface';
import { AvatarLogger } from '@/app/components/ui/avatar-logger';
import { useAppStore } from '@/app/store/root-store';

import { useAuth } from '@/app/hooks/use-auth';
import { fetchDashboards } from '@/app/services/dashboard-api';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Two-part layout:
 *  1. Header + sidebar + scrollable <main>
 *  2. Fixed chat bar anchored at the very bottom (outside the scroll area)
 *
 * <main> gets a generous `pb-40` (≈ 160 px) so the last row of widgets
 * never hides behind the chat bar on any viewport height.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { activeDashboardId, dashboards, syncDashboards, hasSyncedWithBackend } = useAppStore();
  const { user } = useAuth();

  // Pick the name for the header
  const currentDashboard = useMemo(
    () => dashboards.find((d) => d.id === activeDashboardId) || dashboards[0],
    [dashboards, activeDashboardId],
  );

  // Hydrate dashboards from API on mount / user change
  useEffect(() => {
    if (!user) return;
    
    // Only fetch if dashboards have not been synced with backend
    if (!hasSyncedWithBackend) {
      (async () => {
        try {
          const dashboards = await fetchDashboards();
          syncDashboards(dashboards);
        } catch (error) {
          console.error('Failed to fetch dashboards:', error);
          // If fetching fails, create a default dashboard
          if (dashboards.length === 0) {
            syncDashboards([{
              id: 'default-' + Date.now(),
              name: 'Main Dashboard',
              position: 0,
              widgets: []
            }]);
          }
        }
      })();
    }
  }, [user, hasSyncedWithBackend, syncDashboards, dashboards.length]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* top bar */}
      <TopLine title={currentDashboard?.name || 'Dashboard'} />

      {/* main content area */}
      <div className="flex w-full flex-1 overflow-hidden">
        {/* main scroll area - with padding for chat */}
        <main className="w-full flex-1 overflow-y-auto bg-white p-0 pb-40 md:p-4 md:pb-40 dark:bg-gray-900">
          {children}
        </main>
      </div>

      {/* Chat Interface - Full width */}
      <div className="fixed right-0 bottom-0 left-0 z-50">
        <ChatInterface />
      </div>

      <AvatarLogger position="bottom-left" maxEntries={3} autoHideDuration={4000} />
    </div>
  );
}
