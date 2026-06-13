import { apiClient } from './api-client';
import { createDashboard as apiCreateDashboard, deleteDashboard as apiDeleteDashboard, deleteWidget as apiDeleteWidget, getDashboard as apiGetDashboard, listDashboards as apiListDashboards } from '@/client';
import { getAuthHeaders } from './token-cache';
import type { Dashboard, Widget } from '@/app/store/dashboard-store';
import { withAuthErrorHandling } from '@/app/lib/api-error-interceptor';
import { useAppStore } from '@/app/store/root-store';

const isOfflineMode = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true' || true;

function getStore() {
  return useAppStore.getState();
}

export const dashboardApi = {
  listDashboards: async () => {
    if (isOfflineMode) {
      const dashboards = getStore().dashboards;
      return {
        success: true,
        data: {
          dashboards: dashboards.map((d) => ({
            dashboardId: d.id,
            name: d.name,
            position: d.position,
          })),
        },
      } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return apiListDashboards({
        client: apiClient,
        ...(headers ? { headers } : {}),
      });
    });
  },

  getDashboard: async (dashboardId: string) => {
    if (isOfflineMode) {
      const d = getStore().dashboards.find((x) => x.id === dashboardId);
      const widgets = (d?.widgets || []).map((w) => ({
        widgetId: w.id,
        type: w.type,
        title: w.title,
        size: w.size,
        position: w.position,
        query: w.query,
        data: w.data,
      }));
      return { success: true, data: { data: { dashboardId, name: d?.name || 'Dashboard', widgets } } } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return apiGetDashboard({
        client: apiClient,
        path: { dashboardId },
        ...(headers ? { headers } : {}),
      });
    });
  },

  createDashboard: async (name: string) => {
    if (isOfflineMode) {
      const id = `dash-${Date.now()}`;
      const { addDashboard } = getStore();
      addDashboard(id, name);
      return { success: true, data: { dashboardId: id } } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return apiCreateDashboard({
        client: apiClient,
        body: { name },
        ...(headers ? { headers } : {}),
      });
    });
  },

  updateDashboard: async (dashboardId: string, updates: { name?: string; position?: number }) => {
    if (isOfflineMode) {
      const { updateDashboard } = getStore();
      if (updates.name) updateDashboard(dashboardId, updates.name);
      // position handled via reorder elsewhere
      return { success: true } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return apiClient.put({
        url: `/dashboard/${dashboardId}`,
        body: updates,
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
      });
    });
  },

  deleteDashboard: async (dashboardId: string) => {
    if (isOfflineMode) {
      const { deleteDashboard } = getStore();
      deleteDashboard(dashboardId);
      return { success: true } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return apiDeleteDashboard({
        client: apiClient,
        path: { dashboardId },
        ...(headers ? { headers } : {}),
      });
    });
  },

  deleteWidget: async (widgetId: string) => {
    if (isOfflineMode) {
      // Find the widget and remove it from its dashboard
      const { dashboards, setWidgetsForDashboard } = getStore();
      const dash = dashboards.find((d) => d.widgets.some((w) => w.id === widgetId));
      if (dash) {
        const filtered = dash.widgets.filter((w) => w.id !== widgetId);
        setWidgetsForDashboard(dash.id, filtered);
      }
      return { success: true } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return apiDeleteWidget({
        client: apiClient,
        path: { widgetId },
        ...(headers ? { headers } : {}),
      });
    });
  },
};

export const fetchDashboards = async (): Promise<Dashboard[]> => {
  if (isOfflineMode) {
    // Return from local store
    const dashboards = getStore().dashboards.map((d) => ({
      id: d.id,
      name: d.name,
      position: d.position,
      widgets: [],
    }));
    return dashboards.sort((a, b) => a.position - b.position);
  }
  const list = await dashboardApi.listDashboards();
  const dashboardsData = (list.data?.dashboards as any[]) || [];
  dashboardsData.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const dashboards: Dashboard[] = dashboardsData.map((dash) => ({
    id: dash.dashboardId,
    name: dash.name,
    position: dash.position ?? 0,
    widgets: [],
  }));
  return dashboards.sort((a, b) => a.position - b.position);
};
