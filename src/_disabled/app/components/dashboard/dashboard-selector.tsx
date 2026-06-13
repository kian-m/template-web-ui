'use client';

import { useState, useCallback, useRef } from 'react';
import { ChevronDown, Plus, Check, Edit, Trash2, X } from 'lucide-react';
import { useAppStore } from '@/app/store/root-store';
import { useRouter } from 'next/navigation';
import {
  SimpleDropdownMenu,
  SimpleMenuItem,
  SimpleMenuSeparator,
} from '@/app/components/ui/simple-dropdown-menu';
import { SimpleAlertDialog } from '@/app/components/ui/simple-alert-dialog';
import { toast } from '@/lib/toast';
import { dashboardApi, fetchDashboards } from '@/app/services/dashboard-api';
import { useIsMobile } from '@/app/lib/use-is-mobile';

export default function DashboardSelector() {
  const router = useRouter();
  const { dashboards, activeDashboardId, setActiveDashboard, addDashboard, updateDashboard, syncDashboards } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [dashboardToDelete, setDashboardToDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const currentDashboard = dashboards.find((d) => d.id === activeDashboardId);

  const handleDashboardSwitch = useCallback(
    (dashboardId: string) => {
      setActiveDashboard(dashboardId);
      router.push(`/dashboard/${dashboardId}`);
    },
    [setActiveDashboard, router],
  );

  const handleCreateDashboard = useCallback(async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const dashboardName = `Dashboard ${dashboards.length + 1}`;
      const response = await dashboardApi.createDashboard(dashboardName);
      const newId = response.data?.dashboardId;
      if (!newId) throw new Error('Failed to create dashboard');

      addDashboard(newId, dashboardName);
      handleDashboardSwitch(newId);
      toast.success('New dashboard created');
    } catch (error) {
      console.error('Failed to create dashboard:', error);
      toast.error('Failed to create dashboard');
    } finally {
      setIsCreating(false);
    }
  }, [dashboards.length, addDashboard, handleDashboardSwitch, isCreating]);

  const startEditing = useCallback((e: React.MouseEvent, dashboardId: string, currentName: string) => {
    e.stopPropagation();
    setEditingDashboardId(dashboardId);
    setEditedTitle(currentName);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 10);
  }, []);

  const saveEditing = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingDashboardId || !editedTitle.trim()) return;

    try {
      await dashboardApi.updateDashboard(editingDashboardId, { name: editedTitle.trim() });
      updateDashboard(editingDashboardId, editedTitle.trim());
      setEditingDashboardId(null);
      toast.success('Dashboard renamed successfully');
    } catch (error) {
      console.error('Failed to update dashboard:', error);
      toast.error('Failed to update dashboard');
    }
  }, [editingDashboardId, editedTitle, updateDashboard]);

  const cancelEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDashboardId(null);
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent, dashboardId: string) => {
    e.stopPropagation();
    if (dashboards.length <= 1) {
      toast.error('You must have at least one dashboard');
      return;
    }
    setDashboardToDelete(dashboardId);
  }, [dashboards.length]);

  const confirmDelete = useCallback(async () => {
    if (!dashboardToDelete) return;
    setDashboardToDelete(null);

    // Determine which dashboard to navigate to after deletion
    const isCurrentDashboard = dashboardToDelete === activeDashboardId;
    let nextDashboardId: string | null = null;
    
    if (isCurrentDashboard) {
      const currentIndex = dashboards.findIndex(d => d.id === dashboardToDelete);
      // Try previous dashboard first, then next, then first
      if (currentIndex > 0) {
        nextDashboardId = dashboards[currentIndex - 1].id;
      } else if (currentIndex < dashboards.length - 1) {
        nextDashboardId = dashboards[currentIndex + 1].id;
      } else {
        // This should not happen since we check for minimum dashboards
        nextDashboardId = dashboards.find(d => d.id !== dashboardToDelete)?.id || null;
      }
    }

    try {
      await dashboardApi.deleteDashboard(dashboardToDelete);
      const updated = await fetchDashboards();
      syncDashboards(updated);
      
      // Navigate to the next dashboard if we deleted the current one
      if (isCurrentDashboard && nextDashboardId) {
        setActiveDashboard(nextDashboardId);
        router.push(`/dashboard/${nextDashboardId}`);
      }
      
      toast.success('Dashboard deleted successfully');
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
      toast.error('Failed to delete dashboard');
    }
  }, [dashboardToDelete, dashboards, activeDashboardId, syncDashboards, setActiveDashboard, router]);

  return (
    <>
      {/* Mobile: Show edit/delete buttons for current dashboard in top bar */}
      {isMobile && currentDashboard && (
        <div className="flex items-center gap-2">
          {editingDashboardId === currentDashboard.id ? (
            <div className="flex items-center space-x-1">
              <input
                ref={inputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditing(e as any);
                  else if (e.key === 'Escape') cancelEditing(e as any);
                }}
                className="w-32 rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={saveEditing}
                className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Check className="h-4 w-4 text-green-600" />
              </button>
              <button
                onClick={cancelEditing}
                className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ) : (
            <>
              <SimpleDropdownMenu
                trigger={
                  <button
                    className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Dashboard selector"
                  >
                    <span className="text-foreground text-lg font-semibold">
                      {currentDashboard.name}
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </button>
                }
              >
                <div className="max-h-[400px] w-[280px] overflow-y-auto">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    DASHBOARDS
                  </div>
                  {dashboards.map((dashboard) => (
                    <SimpleMenuItem 
                      key={dashboard.id} 
                      onClick={() => handleDashboardSwitch(dashboard.id)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="truncate">{dashboard.name}</span>
                        {dashboard.id === activeDashboardId && <Check className="h-4 w-4 text-gray-500" />}
                      </div>
                    </SimpleMenuItem>
                  ))}
                  <SimpleMenuSeparator />
                  <SimpleMenuItem onClick={handleCreateDashboard}>
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>{isCreating ? 'Creating...' : 'Create New Dashboard'}</span>
                    </div>
                  </SimpleMenuItem>
                </div>
              </SimpleDropdownMenu>
              <button
                onClick={(e) => startEditing(e, currentDashboard.id, currentDashboard.name)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Edit dashboard name"
              >
                <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={(e) => handleDelete(e, currentDashboard.id)}
                className="rounded-lg p-2 hover:bg-red-100 dark:hover:bg-red-900/30"
                title="Delete dashboard"
              >
                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Desktop: Regular dropdown with inline edit/delete */}
      {!isMobile && (
        <SimpleDropdownMenu
          trigger={
            <button
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Dashboard selector"
            >
              <span className="text-foreground text-lg font-semibold md:text-xl">
                {currentDashboard?.name || 'Select Dashboard'}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </button>
          }
        >
          <div className="max-h-[400px] w-[280px] overflow-y-auto">
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
              DASHBOARDS
            </div>

            {dashboards.map((dashboard) => (
            <div key={dashboard.id} className="group">
              {editingDashboardId === dashboard.id ? (
                <div className="flex items-center space-x-1 px-2 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing(e as any);
                      else if (e.key === 'Escape') cancelEditing(e as any);
                    }}
                    className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={saveEditing}
                    className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Check className="h-3 w-3 text-green-600" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              ) : (
                <SimpleMenuItem 
                  onClick={() => handleDashboardSwitch(dashboard.id)}
                  className="group relative"
                >
                  <div className="flex w-full items-center justify-between pr-16">
                    <span className="truncate">{dashboard.name}</span>
                    {dashboard.id === activeDashboardId && <Check className="h-4 w-4 text-gray-500" />}
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => startEditing(e, dashboard.id, dashboard.name)}
                      className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Edit name"
                    >
                      <Edit className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, dashboard.id)}
                      className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Delete dashboard"
                    >
                      <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </SimpleMenuItem>
              )}
            </div>
          ))}

            <SimpleMenuSeparator />

            <SimpleMenuItem onClick={handleCreateDashboard}>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>{isCreating ? 'Creating...' : 'Create New Dashboard'}</span>
              </div>
            </SimpleMenuItem>
          </div>
        </SimpleDropdownMenu>
      )}

      {/* Delete confirmation dialog */}
      {dashboardToDelete && (
        <SimpleAlertDialog
          isOpen={true}
          onClose={() => setDashboardToDelete(null)}
          title="Delete Dashboard"
          description={`Are you sure you want to delete "${dashboards.find(d => d.id === dashboardToDelete)?.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
