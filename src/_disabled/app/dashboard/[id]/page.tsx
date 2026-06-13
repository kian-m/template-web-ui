'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useAppStore } from '@/app/store/root-store';
import { Widget } from '@/app/store/dashboard-store';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import DataSourceConfigurationModal from '@/app/components/modals/data-source-configuration-modal';
import { useAuth } from '@/app/hooks/use-auth';
import { toast } from '@/lib/toast';

import NumberCard from '@/app/components/dashboard/widgets/number-card';
import LineChart from '@/app/components/dashboard/widgets/line-chart';
import BarChart from '@/app/components/dashboard/widgets/bar-chart';
import DataTable from '@/app/components/dashboard/widgets/data-table';
import PieChart from '@/app/components/dashboard/widgets/pie-chart';
import FunnelChart from '@/app/components/dashboard/widgets/funnel-chart';
import WidgetShell from '@/app/components/dashboard/widgets/widget-shell';
import WidgetDetailsModal from '@/app/components/modals/widget-details-modal';
import EditWidgetModal from '@/app/components/modals/edit-widget-modal';
import { widgetApi } from '@/app/services/widget-api';
import { dashboardApi } from '@/app/services/dashboard-api';
import { useIsMobile } from '@/app/lib/use-is-mobile';
import { getColSpan, getRowHeight } from '@/app/lib/widget-layout';
import { PageErrorBoundary, WidgetErrorBoundary } from '@/app/components/error-boundary';
import { safeAsyncWithRetry } from '@/app/lib/safe-async';
import { validateWidgetData } from '@/app/lib/data-validation';

const DASHBOARD_REFRESH_INTERVAL = 15 * 60 * 1000;

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const mounted = useRef(false);
  const fetchInProgress = useRef(false);
  const lastFetchTime = useRef(0);
  
  const setActiveDashboard = useAppStore((state) => state.setActiveDashboard);
  const dashboard = useAppStore((state) => state.dashboards.find((d) => d.id === id));
  const widgets = dashboard?.widgets || [];
  const posthog = usePostHog();
  
  // Track widget state changes
  useEffect(() => {
    posthog?.capture('dashboard_widget_state_changed', {
      dashboard_id: id,
      dashboard_exists: !!dashboard,
      widget_count: widgets.length,
      widget_summary: widgets.map(w => ({ id: w.id, type: w.type, has_data: !!w.data }))
    });
  }, [widgets, id, dashboard, posthog]);
  const isNavigating = useAppStore((state) => state.isNavigating);
  const activeDashboardId = useAppStore((state) => state.activeDashboardId);
  const setWidgetsForDashboard = useAppStore((state) => state.setWidgetsForDashboard);
  const updateWidgetData = useAppStore((state) => state.updateWidgetData);
  const updateWidgetQuery = useAppStore((state) => state.updateWidgetQuery);
  const updateWidget = useAppStore((state) => state.updateWidget);
  const reorderWidget = useAppStore((state) => state.reorderWidget);
  const getIsDataSourceConfigured = useAppStore((state) => state.isDataSourceConfigured);
  const setRemainingCredits = useAppStore((state) => state.setRemainingCredits);

  const [isDataSourceConfigured, setIsDataSourceConfigured] = useState(false);
  const [showDataSourceModal, setShowDataSourceModal] = useState(false);
  const [detailsQuery, setDetailsQuery] = useState<string | null>(null);
  const [editWidget, setEditWidget] = useState<{ id: string; query: string } | null>(null);
  const [widgetStates, setWidgetStates] = useState<Record<string, 'idle' | 'loading' | 'error'>>({});
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const isMobile = useIsMobile();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      posthog?.capture('dashboard_auth_redirect', {
        dashboard_id: id,
        from: 'dashboard_page'
      });
      router.push('/login');
    }
  }, [user, authLoading, router, id, posthog]);

  const isLoading = isNavigating || (isRefreshing && !initialLoadComplete) || !dashboard || authLoading;

  useEffect(() => {
    setIsDataSourceConfigured(getIsDataSourceConfigured());
  }, [getIsDataSourceConfigured]);

  useEffect(() => {
    if (!id) return;
    if (id !== activeDashboardId) {
      setActiveDashboard(id);
    }
  }, [id, activeDashboardId, setActiveDashboard]);

  useEffect(() => {
    if (!isLoading && !initialLoadComplete) {
      setShowDataSourceModal(!isDataSourceConfigured);
    }
  }, [isLoading, isDataSourceConfigured, initialLoadComplete]);

  const fetchDashboard = useCallback(
    async (dashboardId: string, force = false, trigger: 'load' | 'manual' | 'interval' = 'load') => {
      if (!dashboardId || fetchInProgress.current) {
        return;
      }

      const now = Date.now();
      if (!force && lastFetchTime.current && (now - lastFetchTime.current < 5000)) {
        return;
      }

      const existingWidgets = useAppStore.getState().getWidgetsForDashboard(dashboardId);

      if (!force && existingWidgets && existingWidgets.length > 0 && (now - lastFetchTime.current < DASHBOARD_REFRESH_INTERVAL)) {
        setInitialLoadComplete(true);
        return;
      }

      fetchInProgress.current = true;
      lastFetchTime.current = now;

      posthog?.capture('dashboard_fetch_started', {
        dashboard_id: dashboardId,
        trigger,
        existing_widget_count: existingWidgets?.length || 0
      });

      setIsRefreshing(true);

      try {
        const result = await safeAsyncWithRetry(
          () => dashboardApi.getDashboard(dashboardId),
          {
            maxRetries: 2,
            baseDelay: 1000,
            errorMessage: `Failed to load dashboard ${dashboardId}`,
            onRetry: (attempt, error) => {
              posthog?.capture('dashboard_fetch_retry', {
                dashboard_id: dashboardId,
                attempt,
                error_message: error.message
              });
            },
          }
        );

        posthog?.capture('dashboard_api_response', {
          dashboard_id: dashboardId,
          success: result.success,
          has_data: result.success ? !!result.data?.data : false,
          widget_count: result.success ? result.data?.data?.widgets?.length || 0 : 0
        });

        if (result.success && result.data?.data?.widgets && Array.isArray(result.data.data.widgets)) {
          const mappedWidgets = result.data.data.widgets
            .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
            .map((w: any) => {
              // Normalize widget type from underscore to dash format
              const normalizedType = (w.type || 'number-card').replace(/_/g, '-');
              
              return {
                id: w.widgetId,
                type: normalizedType as Widget['type'],
                title: w.title,
                size: w.size as Widget['size'],
                position: w.position ?? 0,
                query: w.query,
                data: w.data ?? w.config ?? {},
              };
            });

          posthog?.capture('dashboard_widgets_mapped', {
            dashboard_id: dashboardId,
            mapped_count: mappedWidgets.length,
            updating_store: mappedWidgets.length > 0 || !existingWidgets || existingWidgets.length === 0
          });

          if (mappedWidgets.length > 0 || !existingWidgets || existingWidgets.length === 0) {
            setWidgetsForDashboard(dashboardId, mappedWidgets);
            
            // Always refresh all widget data on initial load or manual refresh
            if ((trigger === 'load' || trigger === 'manual') && mappedWidgets.length > 0) {
              posthog?.capture('dashboard_widget_refresh_initiated', {
                dashboard_id: dashboardId,
                trigger_type: trigger === 'load' ? 'initial_load' : 'manual_refresh',
                widget_count: mappedWidgets.filter(w => w.query).length
              });
              
              // Set all widgets to loading state during refresh
              const loadingStates: Record<string, 'loading'> = {};
              mappedWidgets.forEach(w => {
                if (w.query) {
                  loadingStates[w.id] = 'loading';
                }
              });
              setWidgetStates(loadingStates);
              
              // Refresh each widget's data
              const refreshPromises = mappedWidgets
                .filter(w => w.query)
                .map(async (widget) => {
                  try {
                    const res = await widgetApi.refresh(widget.id);
                    if (res.data) {
                      updateWidgetData(dashboardId, widget.id, res.data.data ?? {});
                      setWidgetStates(prev => ({ ...prev, [widget.id]: 'idle' }));
                    }
                  } catch (err) {
                    posthog?.capture('widget_refresh_error', {
                      dashboard_id: dashboardId,
                      widget_id: widget.id,
                      error_message: err instanceof Error ? err.message : 'Unknown error'
                    });
                    setWidgetStates(prev => ({ ...prev, [widget.id]: 'error' }));
                  }
                });
              
              // Wait for all refreshes to complete
              await Promise.all(refreshPromises);
              
              posthog?.capture('dashboard_widgets_refreshed', {
                dashboard_id: dashboardId,
                widget_count: mappedWidgets.filter(w => w.query).length,
                trigger
              });
            }
          }

          if (trigger !== 'interval') {
            posthog?.capture('dashboard_loaded', {
              dashboard_id: dashboardId,
              widget_count: mappedWidgets.length,
              trigger,
            });
          }

          setInitialLoadComplete(true);
        }
      } catch (error) {
        posthog?.capture('dashboard_fetch_error', {
          dashboard_id: dashboardId,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          trigger
        });
      } finally {
        fetchInProgress.current = false;
        setIsRefreshing(false);
      }
    },
    [id, posthog, setWidgetsForDashboard, updateWidgetData]
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted.current || !id) return;

    const timer = setTimeout(() => {
      if (!fetchInProgress.current) {
        posthog?.capture('dashboard_initial_load', {
          dashboard_id: id
        });
        // Force refresh on initial load to get fresh data
        fetchDashboard(id, true, 'load');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [id, fetchDashboard]);

  useEffect(() => {
    if (!id || !initialLoadComplete) return;
    const interval = setInterval(() => {
      if (!fetchInProgress.current) {
        fetchDashboard(id, false, 'interval');
      }
    }, DASHBOARD_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [id, fetchDashboard, initialLoadComplete]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ dashboardId: string }>).detail;
      if (detail?.dashboardId === id && !fetchInProgress.current) {
        fetchDashboard(id as string, true, 'manual');
      }
    };
    window.addEventListener('dashboard-refresh', handler);
    return () => window.removeEventListener('dashboard-refresh', handler);
  }, [id, fetchDashboard]);

  const refreshWidget = useCallback(
    async (widget: Widget) => {
      setWidgetStates((s) => ({ ...s, [widget.id]: 'loading' }));
      try {
        const res = await widgetApi.refresh(widget.id);
        const w = res.data;
        if (w) {
          updateWidgetData(id as string, widget.id, w.data ?? {});
        }
        setWidgetStates((s) => ({ ...s, [widget.id]: 'idle' }));
        posthog?.capture('widget_refreshed', {
          widget_id: widget.id,
          dashboard_id: id,
        });
      } catch (err) {
        posthog?.capture('widget_refresh_error', {
          widget_id: widget.id,
          widget_type: widget.type,
          dashboard_id: id,
          error_message: err instanceof Error ? err.message : 'Refresh failed',
          has_query: !!widget.query
        });
        setWidgetStates((s) => ({ ...s, [widget.id]: 'error' }));
      }
    },
    [id, updateWidgetData, posthog]
  );

  useEffect(() => {
    if (id !== activeDashboardId) return;
    
    widgets.forEach((w) => {
      if (
        w.query &&
        (!w.data || Object.keys(w.data).length === 0) &&
        widgetStates[w.id] !== 'loading' &&
        widgetStates[w.id] !== 'error'
      ) {
        refreshWidget(w);
      }
    });
  }, [widgets, widgetStates, refreshWidget, id, activeDashboardId]);

  const renderWidget = (widget: Widget) => {
    if (!widget || !widget.id || !widget.type) {
      posthog?.capture('widget_validation_error', {
        dashboard_id: id,
        error_type: 'invalid_structure',
        missing_fields: [
          !widget ? 'widget' : null,
          widget && !widget.id ? 'id' : null,
          widget && !widget.type ? 'type' : null
        ].filter(Boolean)
      });
      return (
        <WidgetErrorBoundary>
          <WidgetShell
            title="Error"
            widgetId="unknown"
            onEdit={() => {}}
            onRefresh={() => {}}
            onViewDetails={() => {}}
            onDragStart={() => {}}
          >
            <div className="flex h-full w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400">
              <p className="text-sm font-semibold">Invalid widget configuration</p>
            </div>
          </WidgetShell>
        </WidgetErrorBoundary>
      );
    }

    const state = widgetStates[widget.id] || 'idle';
    const hasData = widget.data && Object.keys(widget.data).length > 0;

    const baseProps = {
      title: widget.title || 'Untitled Widget',
      widgetId: widget.id,
      onEdit: (state === 'loading' || state === 'error' || !hasData)
        ? undefined
        : () => setEditWidget({ id: widget.id, query: widget.query || '' }),
      onRefresh: () => refreshWidget(widget),
      onViewDetails: (state === 'loading' || state === 'error' || !hasData || !widget.query)
        ? undefined
        : () => setDetailsQuery(widget.query || ''),
      onDragStart: () => handleWidgetDragStart(widget.id),
    };

    if (state === 'loading' || (!hasData && state !== 'error')) {
      return (
        <WidgetErrorBoundary>
          <WidgetShell {...baseProps}>
            <div className="flex h-full items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-gray-500">Loading...</span>
            </div>
          </WidgetShell>
        </WidgetErrorBoundary>
      );
    }

    if (state === 'error') {
      return (
        <WidgetErrorBoundary>
          <WidgetShell {...baseProps}>
            <div className="flex flex-col items-center justify-center gap-2 p-4">
              <p className="text-sm text-red-600 dark:text-red-400">Failed to load data</p>
              <Button size="sm" onClick={() => refreshWidget(widget)}>
                Retry
              </Button>
            </div>
          </WidgetShell>
        </WidgetErrorBoundary>
      );
    }

    const validation = validateWidgetData(widget.data, widget.type);
    const safeData = validation.isValid ? widget.data : validation.sanitizedData;

    if (!validation.isValid) {
      posthog?.capture('widget_data_validation_warning', {
        widget_id: widget.id,
        widget_type: widget.type,
        dashboard_id: id,
        validation_errors: validation.errors,
        data_keys: widget.data ? Object.keys(widget.data) : []
      });
    }

    try {
      let widgetComponent: React.ReactElement;

      switch (widget.type) {
        case 'number-card':
          widgetComponent = (
            <NumberCard
              {...baseProps}
              value={safeData.value ?? 0}
              change={safeData.change}
              isPositive={safeData.isPositive ?? true}
              format={(safeData.format as 'number' | 'percentage' | 'currency') || 'number'}
            />
          );
          break;
        case 'line-chart':
          let lineData = [];
          if (safeData.series && Array.isArray(safeData.series) && safeData.series[0]?.data) {
            lineData = safeData.series[0].data.map((item: any) => ({
              name: item.date || item.name || item.x || Object.keys(item)[0],
              value: item.users || item.value || item.y || Object.values(item)[1] || 0
            }));
          } else if (Array.isArray(safeData.series)) {
            lineData = safeData.series;
          }
          widgetComponent = <LineChart {...baseProps} data={lineData} />;
          break;
        case 'bar-chart':
          let barData = [];
          if (safeData.series && Array.isArray(safeData.series) && safeData.series[0]?.data) {
            barData = safeData.series[0].data.map((item: any) => ({
              name: item.event || item.name || item.x || Object.keys(item)[0],
              value: item.count || item.value || item.y || Object.values(item)[1] || 0
            }));
          } else if (Array.isArray(safeData.series)) {
            barData = safeData.series;
          }
          widgetComponent = <BarChart {...baseProps} data={barData} />;
          break;
        case 'pie-chart':
          let pieData = [];
          if (safeData.series && Array.isArray(safeData.series)) {
            pieData = safeData.series.map((item: any) => ({
              name: item.name || item.source || item.device_type || item.category || item.label || Object.keys(item).find(k => k !== 'color' && k !== 'value' && k !== 'sessions' && k !== 'users' && k !== 'count') || 'Unknown',
              value: item.value || item.sessions || item.users || item.count || Object.values(item).find(v => typeof v === 'number') || 0,
              color: item.color
            }));
          } else if (safeData.data && Array.isArray(safeData.data)) {
            pieData = safeData.data;
          }
          widgetComponent = <PieChart {...baseProps} data={pieData} />;
          break;
        case 'funnel':
          let funnelData = [];
          if (safeData.steps && Array.isArray(safeData.steps)) {
            funnelData = safeData.steps.map((step: any) => ({
              name: step.name || 'Unknown Step',
              value: step.value || 0,
              color: step.color
            }));
          } else if (safeData.stages && Array.isArray(safeData.stages)) {
            funnelData = safeData.stages.map((stage: any) => ({
              name: stage.name || 'Unknown Stage',
              value: stage.value || 0,
              color: stage.color
            }));
          } else if (safeData.series && Array.isArray(safeData.series)) {
            funnelData = safeData.series.map((item: any) => ({
              name: item.name || item.step || item.label || 'Unknown',
              value: item.value || item.count || item.users || 0,
              color: item.color
            }));
          } else if (safeData.data && Array.isArray(safeData.data)) {
            funnelData = safeData.data.map((item: any) => ({
              name: item.name || 'Unknown',
              value: item.value || 0,
              color: item.color
            }));
          } else if (safeData.items && Array.isArray(safeData.items)) {
            funnelData = safeData.items.map((item: any) => ({
              name: item.event || item.name || item.step || item.label || 'Unknown',
              value: item.users || item.value || item.count || 0,
              color: item.color
            }));
          }
          widgetComponent = <FunnelChart {...baseProps} data={funnelData} />;
          break;
        case 'data-table':
          let tableData = [];
          if (safeData.rows && Array.isArray(safeData.rows)) {
            tableData = safeData.rows;
          } else if (safeData.items && Array.isArray(safeData.items)) {
            tableData = safeData.items;
          } else if (safeData.data && Array.isArray(safeData.data)) {
            tableData = safeData.data;
          }
          widgetComponent = <DataTable {...baseProps} data={tableData} columns={safeData.columns} />;
          break;
        default:
          widgetComponent = (
            <WidgetShell {...baseProps}>
              <div className="flex h-full w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400">
                <p className="text-sm font-semibold">Unknown widget type: {widget.type}</p>
              </div>
            </WidgetShell>
          );
      }

      return (
        <WidgetErrorBoundary key={`widget-${widget.id}`}>
          {widgetComponent}
        </WidgetErrorBoundary>
      );
    } catch (error) {
      posthog?.capture('widget_render_error', {
        widget_id: widget.id,
        widget_type: widget.type,
        dashboard_id: id,
        error_type: 'render_failed',
        error_message: error instanceof Error ? error.message : 'Render failed',
        has_data: !!widget.data && Object.keys(widget.data).length > 0
      });
      return (
        <WidgetErrorBoundary>
          <WidgetShell {...baseProps}>
            <div className="flex h-full w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400">
              <p className="text-sm font-semibold">Widget rendering error</p>
            </div>
          </WidgetShell>
        </WidgetErrorBoundary>
      );
    }
  };

  const handleWidgetDragStart = useCallback((widgetId: string) => {
    setDraggedWidgetId(widgetId);
  }, []);

  const handleWidgetDrop = useCallback(
    async (targetId: string, e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedWidgetId || !widgets) return;
      const from = widgets.findIndex((w) => w.id === draggedWidgetId);
      const to = widgets.findIndex((w) => w.id === targetId);
      if (from === -1 || to === -1 || from === to) {
        setDraggedWidgetId(null);
        return;
      }
      reorderWidget(id as string, from, to);
      setDraggedWidgetId(null);
      const current = useAppStore.getState().getWidgetsForDashboard(id as string);
      await Promise.all(
        current.map((w, index) => widgetApi.updateWidget(w.id, { position: index })),
      );
    },
    [draggedWidgetId, widgets, reorderWidget, id],
  );

  if (isLoading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="mt-4 text-lg">{authLoading ? 'Authenticating...' : 'Loading dashboard...'}</p>
        </div>
      </div>
    );
  }

  return (
    <PageErrorBoundary>
      <DataSourceConfigurationModal
        isOpen={showDataSourceModal}
        onClose={() => setShowDataSourceModal(false)}
        canClose
      />
      {widgets.length === 0 ? (
        <div className="flex h-full items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="mb-4 inline-block rounded-full bg-gray-100 p-6 dark:bg-gray-800">
              <PlusCircle className="h-12 w-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">This dashboard is empty</h2>
            <p className="mb-6">
              Use the chat assistant to add widgets to this dashboard by typing commands like
              &quot;Add a revenue widget&quot;.
            </p>
            <Button
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              disabled={showDataSourceModal}
            >
              Open Chat Assistant
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid auto-rows-auto grid-cols-1 gap-6 p-0 pb-24 pt-4 md:grid-cols-2 md:p-6 lg:grid-cols-3">
          {widgets.map((widget: Widget) => (
            <div
              key={widget.id}
              className={`${getColSpan(widget.size, isMobile)} ${getRowHeight(widget, isMobile)} flex widget-container widget-max-constraint ${isMobile ? 'widget-mobile-spacing' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleWidgetDrop(widget.id, e)}
            >
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      )}

      {editWidget && (
        <EditWidgetModal
          isOpen={editWidget !== null}
          onClose={() => setEditWidget(null)}
          widget={widgets.find(w => w.id === editWidget.id)!}
        />
      )}

      <WidgetDetailsModal
        isOpen={detailsQuery !== null}
        widgetId="view"
        query={detailsQuery || ''}
        onSave={() => {}}
        onClose={() => setDetailsQuery(null)}
      />
      <div className="p-5" />
    </PageErrorBoundary>
  );
}