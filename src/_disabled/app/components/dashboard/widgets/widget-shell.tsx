'use client';

import { ReactNode, useCallback, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GripVertical, MoreVertical, RefreshCcw, Share2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/app/store/root-store';
import { SimpleAlertDialog } from '@/app/components/ui/simple-alert-dialog';
import { dashboardApi } from '@/app/services/dashboard-api';
import EditWidgetModal from '@/app/components/modals/edit-widget-modal';
import { encodeWidgetShare } from '@/app/lib/widget-share';
import { usePostHog } from 'posthog-js/react';
import { safeAsync } from '@/app/lib/safe-async';
import { sanitizeString } from '@/app/lib/data-validation';

interface WidgetShellProps {
  title: string;
  children: ReactNode;
  className?: string;
  widgetId: string;
  onEdit?: () => void;
  onViewDetails?: () => void;
  onRefresh?: () => void;
  onDragStart?: () => void;
  /** When true the content area becomes scrollable */
  scrollContent?: boolean;
}

export default function WidgetShell({
  title,
  children,
  className = '',
  widgetId,
  onEdit,
  onViewDetails,
  onRefresh,
  onDragStart,
  scrollContent = false,
}: WidgetShellProps) {
  const { activeDashboardId, removeWidget, getDashboard } = useAppStore();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const posthog = usePostHog();
  const hasScrolled = useRef(false);

  const dashboard = getDashboard(activeDashboardId);
  const widget = dashboard?.widgets.find((w) => w.id === widgetId);

  // ───────────────────────── handlers ──────────────────────────
  const handleEdit = useCallback(() => (onEdit ? onEdit() : setShowEditModal(true)), [onEdit]);

  const handleRefresh = useCallback(() => {
    onRefresh ? onRefresh() : toast.success('Data refreshed successfully');
    posthog?.capture('widget_refreshed', {
      widget_id: widgetId,
      dashboard_id: activeDashboardId,
    });
  }, [onRefresh, posthog, widgetId, activeDashboardId]);

  const handleShare = useCallback(async () => {
    try {
      if (!widget) {
        toast.error('Widget not found');
        return;
      }

      const sanitizedTitle = sanitizeString(widget.title) || 'Untitled Widget';
      const code = encodeWidgetShare(widget.type, widget.query, sanitizedTitle);

      const result = await safeAsync(
        () => navigator.clipboard.writeText(code),
        'Failed to copy widget share code',
      );

      if (result.success) {
        toast.success('Widget share code copied to clipboard');
        posthog?.capture('widget_shared', {
          widget_id: widgetId,
          dashboard_id: activeDashboardId,
        });
      } else {
        toast.error('Failed to copy widget share code', {
          event: 'widget_share_copy_failed',
        });
      }
    } catch (error) {
      console.error('Widget share error:', error);
      toast.error('Failed to share widget');
    }
  }, [widget, widgetId, activeDashboardId, posthog]);

  const confirmRemove = useCallback(async () => {
    setShowRemoveDialog(false); // Close dialog immediately for better UX

    const result = await safeAsync(
      () => dashboardApi.deleteWidget(widgetId),
      'Failed to remove widget',
    );

    if (result.success) {
      try {
        removeWidget(activeDashboardId, widgetId);
        toast.success('Widget removed successfully');
        posthog?.capture('widget_deleted', {
          widget_id: widgetId,
          dashboard_id: activeDashboardId,
        });
      } catch (storeError) {
        console.error('Error updating store after widget removal:', storeError);
        toast.error('Widget was removed but dashboard may need refresh');
      }
    } else {
      console.error('Error removing widget:', result.error);
      toast.error(result.message, { event: 'widget_remove_failed' });
    }
  }, [removeWidget, activeDashboardId, widgetId, posthog]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!hasScrolled.current && e.currentTarget.scrollTop > 0) {
        hasScrolled.current = true;
        posthog?.capture('widget_scrolled', {
          widget_id: widgetId,
          scroll_top: e.currentTarget.scrollTop,
        });
      }
    },
    [posthog, widgetId],
  );

  // ───────────────────────── render ────────────────────────────
  return (
    <>
      {/* Sleek floating label */}
      <div className="group relative h-full w-full">
        <div
          className={`relative flex h-full w-full flex-col overflow-visible rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-200 group-hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 ${className}`}
        >
          {/* Floating label that appears on hover (always visible on mobile) */}
          <div
            className="absolute -top-3 left-4 z-20 transform opacity-100 transition-all duration-200"
            role="banner"
            aria-label={`Widget title: ${title}`}
          >
            <div className="rounded-md bg-gray-900 px-3 py-1 shadow-lg dark:bg-gray-100">
              <h3
                className="text-xs font-medium text-white dark:text-gray-900"
                title={title}
                id={`widget-title-${widgetId}`}
              >
                <ReactMarkdown components={{ p: 'span' }} className="inline">
                  {title}
                </ReactMarkdown>
              </h3>
            </div>
          </div>

          {/* Widget controls - only visible on hover */}
          <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 opacity-100 transition-opacity duration-200">
            <button
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 p-0 text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800/90 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="Refresh widget"
              onClick={handleRefresh}
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 p-0 text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800/90 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  aria-label="Widget options"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <DropdownMenuItem onClick={handleEdit}>Edit Widget</DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Widget
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={() => setShowRemoveDialog(true)}
                >
                  Remove Widget
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {onDragStart && (
              <div
                className="cursor-grab rounded-md bg-white/90 p-1 text-gray-400 shadow-sm hover:text-gray-600 dark:bg-gray-800/90 dark:hover:text-gray-300"
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  onDragStart();
                }}
                aria-label="Drag widget"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          <div
            onScroll={handleScroll}
            data-testid="widget-content"
            className={`h-full w-full overflow-y-auto ${
              scrollContent ? 'p-4' : 'flex items-center justify-center p-4'
            }`}
            role="main"
            aria-labelledby={`widget-title-${widgetId}`}
            tabIndex={0}
          >
            {children}
          </div>
        </div>
      </div>

      {showRemoveDialog && (
        <SimpleAlertDialog
          isOpen
          onClose={() => setShowRemoveDialog(false)}
          title="Remove Widget"
          description={`Are you sure you want to remove "${title}"? This action cannot be undone.`}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          onConfirm={confirmRemove}
        />
      )}

      {showEditModal && widget && (
        <EditWidgetModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          widget={widget}
        />
      )}
    </>
  );
}