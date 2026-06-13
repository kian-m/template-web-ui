'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Edit2, Trash2, Check, X, LayoutDashboard } from 'lucide-react';
import { useAppStore } from '@/app/store/root-store';
import { dashboardApi } from '@/app/services/dashboard-api';
import { cn } from '@/app/lib/utils';
import { generateUniqueDashboardName } from '@/app/lib/dashboard-name';

export default function DashboardDropdown() {
  const {
    dashboards,
    activeDashboardId,
    setActiveDashboard,
    deleteDashboard,
    updateDashboard,
    addDashboard,
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);

  const handleSelectDashboard = async (id: string) => {
    setActiveDashboard(id);
    setIsOpen(false);
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = async () => {
    if (editingId && editingName.trim()) {
      await dashboardApi.updateDashboard(editingId, { name: editingName.trim() });
      updateDashboard(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (id: string) => {
    if (dashboards.length > 1) {
      await dashboardApi.deleteDashboard(id);
      deleteDashboard(id);
    }
  };

  const handleCreateNew = async () => {
    if (isCreating && newName.trim()) {
      const id = `dash-${Date.now()}`;
      await dashboardApi.createDashboard(newName.trim());
      addDashboard(id, newName.trim());
      setActiveDashboard(id);
      setNewName('');
      setIsCreating(false);
      setIsOpen(false);
    } else if (!isCreating) {
      const suggestedName = generateUniqueDashboardName(dashboards.map((d) => d.name));
      setNewName(suggestedName);
      setIsCreating(true);
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewName('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dashboard-dropdown')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="dashboard-dropdown relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2',
          'border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
          'dark:hover:bg-gray-750 transition-colors hover:bg-gray-50',
          'text-foreground text-sm font-medium',
          'max-w-[300px] min-w-[200px]',
        )}
      >
        <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 truncate text-left">
          {activeDashboard?.name || 'Select Dashboard'}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 flex-shrink-0 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-2 w-72',
            'rounded-lg bg-white shadow-xl dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'z-50 overflow-hidden',
          )}
        >
          {/* Dashboard list */}
          <div className="max-h-64 overflow-y-auto">
            {dashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className="border-b border-gray-100 last:border-0 dark:border-gray-700"
              >
                {editingId === dashboard.id ? (
                  // Edit mode
                  <div className="flex items-center gap-2 p-3">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="text-foreground flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : (
                  // Normal mode
                  <div
                    className={cn(
                      'group flex items-center justify-between p-3',
                      'dark:hover:bg-gray-750 cursor-pointer hover:bg-gray-50',
                      dashboard.id === activeDashboardId && 'bg-blue-50 dark:bg-blue-900/20',
                    )}
                  >
                    <button
                      onClick={() => handleSelectDashboard(dashboard.id)}
                      className="flex flex-1 items-center gap-2 text-left"
                    >
                      <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                      <span className="text-foreground truncate text-sm">{dashboard.name}</span>
                      {dashboard.id === activeDashboardId && (
                        <Check className="ml-auto h-4 w-4 text-blue-500" />
                      )}
                    </button>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleStartEdit(dashboard.id, dashboard.name)}
                        className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      {dashboards.length > 1 && (
                        <button
                          onClick={() => handleDelete(dashboard.id)}
                          className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create new dashboard */}
          <div className="border-t border-gray-200 p-3 dark:border-gray-700">
            {isCreating ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateNew();
                    if (e.key === 'Escape') handleCancelCreate();
                  }}
                  placeholder="Dashboard name..."
                  className="text-foreground flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                  autoFocus
                />
                <button
                  onClick={handleCreateNew}
                  className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </button>
                <button
                  onClick={handleCancelCreate}
                  className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCreateNew}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Plus className="h-4 w-4" />
                <span>New Dashboard</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
