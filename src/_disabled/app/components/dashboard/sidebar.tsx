// app/components/dashboard/sidebar.tsx
'use client';
import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import {
  Check,
  Edit,
  HelpCircle,
  LayoutDashboard,
  MoreVertical,
  PlusCircle,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import { dashboardApi, fetchDashboards } from '@/app/services/dashboard-api';
import { generateUniqueDashboardName } from '@/app/lib/dashboard-name';
import { useAppStore } from '@/app/store/root-store';
import { Button } from '@/app/components/ui/button';
import {
  SimpleDropdownMenu,
  SimpleMenuItem,
  SimpleMenuSeparator,
} from '@/app/components/ui/simple-dropdown-menu';
import { SimpleAlertDialog } from '@/app/components/ui/simple-alert-dialog';
import UserProfileSection from './user-profile-section';
import AddSharedDashboardModal from '@/app/components/modals/add-shared-dashboard-modal';
import { usePostHog } from 'posthog-js/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const {
    dashboards,
    activeDashboardId,
    addDashboard,
    setActiveDashboard,
    updateDashboard,
    syncDashboards,
    reorderDashboards,
  } = useAppStore();
  const router = useRouter();
  const posthog = usePostHog();
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [dashboardToDelete, setDashboardToDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [showSharedModal, setShowSharedModal] = useState(false);

  const handleAddDashboard = useCallback(async () => {
    const dashboardName = generateUniqueDashboardName(dashboards.map((d) => d.name));
    try {
      const res = await dashboardApi.createDashboard(dashboardName);
      const newId = res.data?.dashboardId;
      if (!newId) throw new Error('Missing dashboard id');
      addDashboard(newId, dashboardName);

      // persist new positions
      useAppStore.getState().dashboards.forEach((d, idx) => {
        dashboardApi.updateDashboard(d.id, { position: idx });
      });

      // set active and navigate
      setActiveDashboard(newId);
      router.push(`/dashboard/${newId}`);

      toast.success('New dashboard has been created successfully');
    } catch (err) {
      posthog?.capture('dashboard_create_error', {
        error_type: 'creation_failed',
        error_message: err instanceof Error ? err.message : 'Creation failed',
        dashboard_count: dashboards.length
      });
      toast.error('Failed to create dashboard', {
        event: 'dashboard_create_failed',
      });
    }
  }, [dashboards, addDashboard, setActiveDashboard, router, posthog]);

  const startEditing = useCallback((id: string, currentName: string) => {
    setEditingDashboardId(id);
    setEditedTitle(currentName);
    // We need to wait a tick for the input to be rendered
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 10);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingDashboardId(null);
  }, []);

  const saveEditing = useCallback(async () => {
    if (!editingDashboardId) return;

    if (editedTitle.trim() === '') {
      toast.error('Dashboard title cannot be empty', {
        event: 'dashboard_title_empty',
      });
      return;
    }

    try {
      await dashboardApi.updateDashboard(editingDashboardId, { name: editedTitle.trim() });
      updateDashboard(editingDashboardId, editedTitle.trim());
      setEditingDashboardId(null);
      toast.success('Dashboard title has been updated successfully');
    } catch (err) {
      posthog?.capture('dashboard_update_error', {
        dashboard_id: editingDashboardId,
        error_type: 'title_update_failed',
        error_message: err instanceof Error ? err.message : 'Update failed'
      });
      toast.error('Failed to update dashboard', { event: 'dashboard_update_failed' });
    }
  }, [editingDashboardId, editedTitle, updateDashboard, posthog]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        saveEditing();
      } else if (e.key === 'Escape') {
        cancelEditing();
      }
    },
    [saveEditing, cancelEditing],
  );

  const handleDragStartDashboard = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDropDashboard = useCallback(
    (id: string, e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedId) return;
      const from = dashboards.findIndex((d) => d.id === draggedId);
      const to = dashboards.findIndex((d) => d.id === id);
      if (from === -1 || to === -1 || from === to) {
        setDraggedId(null);
        return;
      }
      reorderDashboards(from, to);
      setDraggedId(null);
      useAppStore.getState().dashboards.forEach((d, idx) => {
        dashboardApi.updateDashboard(d.id, { position: idx });
      });
    },
    [dashboards, draggedId, reorderDashboards],
  );

  const confirmDeleteDashboard = useCallback(async () => {
    if (!dashboardToDelete) return;

    // Close the dialog immediately
    setDashboardToDelete(null);

    // Check if this is the last dashboard
    if (dashboards.length <= 1) {
      toast.error('You must have at least one dashboard', {
        event: 'min_dashboards',
      });
      return;
    }

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
      
      useAppStore.getState().dashboards.forEach((d, idx) => {
        dashboardApi.updateDashboard(d.id, { position: idx });
      });
      toast.success('Dashboard has been deleted successfully');
    } catch (err) {
      posthog?.capture('dashboard_delete_error', {
        dashboard_id: dashboardToDelete,
        error_type: 'deletion_failed',
        error_message: err instanceof Error ? err.message : 'Deletion failed',
        remaining_dashboards: dashboards.length
      });
      toast.error('Failed to delete dashboard', {
        event: 'dashboard_delete_failed',
      });
    }
  }, [dashboardToDelete, dashboards, activeDashboardId, syncDashboards, setActiveDashboard, router, posthog]);

  return (
    <>
      <div
        className={`bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      />
      <aside
        className={`compact-sidebar border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-50 flex transform flex-col border-r shadow-sm transition-transform md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        role="navigation"
        aria-label="Dashboard navigation"
      >
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="mb-4 px-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Dashboards
              </p>
              <SimpleDropdownMenu
                trigger={
                  <button
                    className="posthog-icon-button posthog-tooltip"
                    data-tooltip="Add dashboard"
                    aria-label="Add new dashboard"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                }
                align="end"
              >
                <SimpleMenuItem onClick={handleAddDashboard}>
                  <div className="flex items-center">
                    <span className="text-sm">📊 New Dashboard</span>
                  </div>
                </SimpleMenuItem>
                <SimpleMenuItem onClick={() => setShowSharedModal(true)}>
                  <div className="flex items-center">
                    <span className="text-sm">📋 From Share Code</span>
                  </div>
                </SimpleMenuItem>
              </SimpleDropdownMenu>
            </div>

            <nav className="space-y-1 md:space-y-0">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className="group relative"
                  draggable
                  onDragStart={() => handleDragStartDashboard(dashboard.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropDashboard(dashboard.id, e)}
                >
                  {editingDashboardId === dashboard.id ? (
                    <div className="bg-secondary mx-2 flex items-center space-x-1 rounded-lg p-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        className="border-border bg-background text-foreground focus:ring-primary focus:border-primary flex-1 rounded border px-2 py-1 text-sm focus:ring-1 focus:outline-none"
                        aria-label="Dashboard title"
                      />
                      <button
                        onClick={saveEditing}
                        className="posthog-icon-button h-6 w-6 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        aria-label="Save dashboard title"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="posthog-icon-button h-6 w-6 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        aria-label="Cancel editing"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Link
                        href={`/dashboard/${dashboard.id}`}
                        onClick={(e) => {
                          if (editingDashboardId !== null) {
                            e.preventDefault();
                            return;
                          }
                          setActiveDashboard(dashboard.id);
                        }}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          startEditing(dashboard.id, dashboard.name);
                        }}
                        className={`compact-dashboard-item mx-2 flex w-full flex-1 items-center rounded-lg transition-all duration-200 ${
                          dashboard.id === activeDashboardId
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                        }`}
                        title={`${dashboard.name} - Double-click to rename or use menu`}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-sm">{dashboard.name}</span>
                      </Link>

                      <SimpleDropdownMenu
                        trigger={
                          <button
                            className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 transition-colors"
                            aria-label="Dashboard options"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        }
                        align="end"
                      >
                        <SimpleMenuItem
                          onClick={() => {
                            startEditing(dashboard.id, dashboard.name);
                          }}
                          className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span className="text-sm font-medium">Edit Name</span>
                          </div>
                        </SimpleMenuItem>
                        <SimpleMenuSeparator />
                        <SimpleMenuItem
                          onClick={() => {
                            if (dashboards.length <= 1) {
                              toast.error('You must have at least one dashboard', {
                                event: 'min_dashboards',
                              });
                              return;
                            }
                            setDashboardToDelete(dashboard.id);
                          }}
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <div className="flex items-center">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span className="text-sm font-medium">Delete Dashboard</span>
                          </div>
                        </SimpleMenuItem>
                      </SimpleDropdownMenu>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="border-sidebar-border mb-20 space-y-1 border-t px-4 pt-3 md:mb-0">
          <button
            onClick={() => router.push('/settings')}
            className="compact-dashboard-item text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center rounded-lg transition-colors"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="text-sm">Settings</span>
          </button>
          <button
            onClick={() => router.push('/help')}
            className="compact-dashboard-item text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center rounded-lg transition-colors"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span className="text-sm">Help</span>
          </button>

          {/* User Profile with Logout Button */}
          <UserProfileSection />
        </div>

        {/* Delete Dashboard Dialog */}
        {dashboardToDelete && (
          <SimpleAlertDialog
            isOpen={true}
            onClose={() => setDashboardToDelete(null)}
            title="Delete Dashboard"
            description={`Are you sure you want to delete "${dashboards.find((d) => d.id === dashboardToDelete)?.name}"? This action cannot be undone.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={confirmDeleteDashboard}
          />
        )}
      </aside>
      {showSharedModal && (
        <AddSharedDashboardModal
          isOpen={showSharedModal}
          onClose={() => setShowSharedModal(false)}
        />
      )}
    </>
  );
}
