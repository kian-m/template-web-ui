'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/app/store/root-store';
import { useParams } from 'next/navigation';

/**
 * Dashboard Debugger Component
 *
 * A development-only component that displays the current state of the dashboard
 * to help diagnose loading and rendering issues.
 */
export function DashboardDebugger() {
  const params = useParams<{ id: string }>();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get all relevant state from the store
  const dashboards = useAppStore((state) => state.dashboards);
  const activeDashboardId = useAppStore((state) => state.activeDashboardId);
  const isNavigating = useAppStore((state) => state.isNavigating);
  const currentDashboard = dashboards.find((d) => d.id === params.id);
  const widgets = currentDashboard?.widgets;

  // Only render on client and in development
  if (!isClient || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-20 z-50 w-96 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
        🔍 Dashboard Debugger
      </h3>

      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-semibold">URL Param ID:</div>
          <div className="font-mono text-blue-600">{params.id || 'undefined'}</div>

          <div className="font-semibold">Active Dashboard ID:</div>
          <div className="font-mono text-blue-600">{activeDashboardId || 'undefined'}</div>

          <div className="font-semibold">Is Navigating:</div>
          <div className={isNavigating ? 'text-yellow-600' : 'text-green-600'}>
            {isNavigating ? 'Yes' : 'No'}
          </div>

          <div className="font-semibold">Dashboards Count:</div>
          <div className="text-green-600">{dashboards.length}</div>

          <div className="font-semibold">Current Dashboard:</div>
          <div className={currentDashboard ? 'text-green-600' : 'text-red-600'}>
            {currentDashboard ? 'Found' : 'Not Found'}
          </div>

          <div className="font-semibold">Widgets:</div>
          <div className={widgets ? 'text-green-600' : 'text-red-600'}>
            {widgets ? `${widgets.length} widgets` : 'undefined'}
          </div>
        </div>

        {currentDashboard && (
          <div className="mt-2 border-t pt-2">
            <div className="font-semibold">Dashboard Details:</div>
            <div className="mt-1 rounded bg-gray-50 p-2 dark:bg-gray-900">
              <div>Name: {currentDashboard.name}</div>
              <div>ID: {currentDashboard.id}</div>
              <div>Widgets: {currentDashboard.widgets?.length || 0}</div>
            </div>
          </div>
        )}

        {widgets && widgets.length > 0 && (
          <div className="mt-2 border-t pt-2">
            <div className="font-semibold">Widget IDs:</div>
            <div className="mt-1 max-h-20 overflow-y-auto rounded bg-gray-50 p-2 dark:bg-gray-900">
              {widgets.map((w, i) => (
                <div key={w.id} className="truncate">
                  {i + 1}. {w.id}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 border-t pt-2">
          <div className="font-semibold">Loading Conditions:</div>
          <div className="mt-1 space-y-1">
            <div className="flex justify-between">
              <span>isNavigating:</span>
              <span className={isNavigating ? 'text-red-600' : 'text-green-600'}>
                {String(isNavigating)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>!dashboard:</span>
              <span className={!currentDashboard ? 'text-red-600' : 'text-green-600'}>
                {String(!currentDashboard)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>!widgets:</span>
              <span className={!widgets ? 'text-red-600' : 'text-green-600'}>
                {String(!widgets)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          console.log('Dashboard Debug Info:', {
            params,
            dashboards,
            activeDashboardId,
            currentDashboard,
            widgets,
            isNavigating,
          });
        }}
        className="mt-3 w-full rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
      >
        Log to Console
      </button>
    </div>
  );
}
