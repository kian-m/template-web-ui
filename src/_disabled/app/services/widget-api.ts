import { apiClient } from './api-client';
import { createWidget as createWidgetApi, query as queryWidget, refreshWidget } from '@/client';
import { getAuthHeaders } from './token-cache';
import type { Widget } from '@/app/store/dashboard-store';
import { withAuthErrorHandling } from '@/app/lib/api-error-interceptor';
import { useAppStore } from '@/app/store/root-store';

const isOfflineMode = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true' || true;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mockDataForType(type: Widget['type']) {
  switch (type) {
    case 'number-card':
      return { value: randomInt(1000, 10000), change: Math.round((Math.random() * 20 - 10) * 10) / 10, isPositive: Math.random() > 0.5 };
    case 'line-chart':
      return { series: Array.from({ length: 8 }, (_, i) => ({ name: `P${i + 1}`, value: randomInt(100, 1000) })) };
    case 'bar-chart':
      return { series: Array.from({ length: 6 }, (_, i) => ({ name: `C${i + 1}`, value: randomInt(100, 2000) })) };
    case 'data-table':
      return { items: Array.from({ length: 5 }, (_, i) => ({ id: `${i + 1}`, name: `Item ${i + 1}`, value: randomInt(10, 100) })) };
    case 'pie-chart':
      return { series: Array.from({ length: 4 }, (_, i) => ({ name: `S${i + 1}`, value: randomInt(5, 35) })) };
    case 'funnel':
      return { stages: [
        { name: 'Visited', value: randomInt(1000, 5000) },
        { name: 'Signed Up', value: randomInt(300, 1500) },
        { name: 'Activated', value: randomInt(100, 800) },
        { name: 'Paid', value: randomInt(50, 300) },
      ] };
    default:
      return {};
  }
}

const formatQuery = (query: string) => {
  let formattedQuery = query;
  //remove new lines
  formattedQuery = formattedQuery.replace(/\n/g, ' ').trim();

  return formattedQuery;
};
export const widgetApi = {
  query: async (queryString: string) => {
    if (isOfflineMode) {
      // Return a minimal, plausible response
      return { success: true, data: { reply: 'Local analysis complete', suggestions: [] } } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return queryWidget({
        client: apiClient,
        body: { query: formatQuery(queryString) },
        ...(headers ? { headers } : {}),
      });
    });
  },
  create: async (
    dashboardId: string,
    widget: { type: Widget['type']; title: string; size?: Widget['size']; query: string },
  ) => {
    if (isOfflineMode) {
      const id = `w-${Date.now()}`;
      const { addWidget } = useAppStore.getState();
      addWidget(dashboardId, {
        id,
        type: widget.type,
        title: widget.title,
        size: widget.size || 'small',
        query: formatQuery(widget.query),
        data: mockDataForType(widget.type),
      });
      return { success: true, data: { widgetId: id, remainingCredits: 999 } } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return createWidgetApi({
        client: apiClient,
        body: {
          dashboardId,
          type: widget.type as 'line-chart' | 'number-card' | 'bar-chart' | 'data-table' | 'pie-chart' | 'funnel',
          title: widget.title,
          size: widget.size,
          query: formatQuery(widget.query),
        },
        ...(headers ? { headers } : {}),
      });
    });
  },
  refresh: async (widgetId: string) => {
    if (isOfflineMode) {
      const { dashboards, updateWidgetData } = useAppStore.getState();
      const dash = dashboards.find((d) => d.widgets.some((w) => w.id === widgetId));
      const w = dash?.widgets.find((x) => x.id === widgetId);
      if (dash && w) {
        const newData = mockDataForType(w.type);
        updateWidgetData(dash.id, widgetId, newData);
        return { success: true, data: { data: newData } } as any;
      }
      return { success: true, data: { data: {} } } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return refreshWidget({
        client: apiClient,
        path: { widgetId },
        ...(headers ? { headers } : {}),
      });
    });
  },
  updateWidget: async (
    widgetId: string,
    updates: {
      query?: string;
      title?: string;
      type?: string;
      size?: 'small' | 'medium' | 'large';
      position?: number;
    },
  ) => {
    if (isOfflineMode) {
      const { dashboards, updateWidget: updateWidgetStore } = useAppStore.getState();
      const dash = dashboards.find((d) => d.widgets.some((w) => w.id === widgetId));
      if (dash) {
        const clean: any = { ...updates };
        if (clean.query) clean.query = formatQuery(clean.query);
        updateWidgetStore(dash.id, widgetId, clean);
      }
      return { success: true } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      const body = {
        ...updates,
        ...(updates.query ? { query: formatQuery(updates.query) } : {}),
      };
      if (updates.query !== undefined) body.query = formatQuery(updates.query);
      if (updates.title !== undefined) body.title = updates.title;
      if (updates.type !== undefined) body.type = updates.type;
      if (updates.size !== undefined) body.size = updates.size;
      if (updates.position !== undefined) body.position = updates.position;
      return apiClient.put({
        url: `/widget/${widgetId}`,
        body,
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
      });
    });
  },
  edit: async (dashboardId: string, widgetId: string, request: string) => {
    if (isOfflineMode) {
      // For local mode, treat edit as a rename or query update request and mutate store
      const { dashboards, updateWidget: updateWidgetStore } = useAppStore.getState();
      const dash = dashboards.find((d) => d.id === dashboardId);
      if (dash) {
        // naive: if request contains 'title:' or 'query:' try to extract
        const mTitle = request.match(/title\s*:\s*([^\n]+)/i);
        const mQuery = request.match(/query\s*:\s*([\s\S]+)/i);
        const updates: any = {};
        if (mTitle) updates.title = mTitle[1].trim();
        if (mQuery) updates.query = formatQuery(mQuery[1]);
        updateWidgetStore(dashboardId, widgetId, updates);
      }
      return { success: true } as any;
    }
    return withAuthErrorHandling(async () => {
      const headers = await getAuthHeaders();
      return apiClient.post({
        url: `/widget/${widgetId}/edit`,
        body: { dashboardId, request },
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
      });
    });
  },
};
