// app/store/dashboard-store.ts

// Interface definitions
export interface Dashboard {
  id: string;
  name: string;
  position: number;
  widgets: Widget[];
}

export interface Widget {
  id: string;
  type: 'number-card' | 'line-chart' | 'bar-chart' | 'data-table' | 'pie-chart' | 'funnel';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  query: string;
  data: any;
}

export interface DashboardSlice {
  dashboards: Dashboard[];
  activeDashboardId: string;
  isNavigating: boolean;
  hasSyncedWithBackend: boolean;
  setActiveDashboard: (id: string) => void;
  addDashboard: (id: string, name: string) => void;
  updateDashboard: (id: string, newTitle: string) => void;
  deleteDashboard: (id: string) => void;
  addWidget: (
    dashboardId: string,
    widget: Omit<Widget, 'id' | 'position'> & { id?: string },
  ) => boolean;
  removeWidget: (dashboardId: string, widgetId: string) => void;
  updateWidgetData: (dashboardId: string, widgetId: string, data: any) => void;
  updateWidgetQuery: (dashboardId: string, widgetId: string, query: string) => void;
  updateWidget: (
    dashboardId: string,
    widgetId: string,
    updates: Partial<Omit<Widget, 'id' | 'position'>>,
  ) => void;
  getDashboard: (id: string) => Dashboard | undefined;
  getWidgetsForDashboard: (id: string) => Widget[];
  setNavigationState: (isNavigating: boolean) => void;
  syncDashboards: (dashboards: Dashboard[]) => void;
  setWidgetsForDashboard: (dashboardId: string, widgets: Widget[]) => void;
  reorderDashboards: (from: number, to: number) => void;
  reorderWidget: (dashboardId: string, from: number, to: number) => void;
}

// Sample data for initial state
const initialWidgets: Widget[] = [
  {
    id: 'total-users',
    type: 'number-card',
    title: 'Total Users',
    size: 'small',
    position: 0,
    query: '',
    data: {
      value: 24582,
      change: 12.3,
      isPositive: true,
    },
  },
  {
    id: 'revenue-trend',
    type: 'line-chart',
    title: 'Revenue Trend',
    size: 'small',
    position: 1,
    query: '',
    data: {
      series: [
        { name: 'Jan', value: 4200 },
        { name: 'Feb', value: 4900 },
        { name: 'Mar', value: 5600 },
        { name: 'Apr', value: 5400 },
        { name: 'May', value: 6100 },
        { name: 'Jun', value: 7500 },
        { name: 'Jul', value: 8200 },
        { name: 'Aug', value: 8600 },
      ],
    },
  },
  {
    id: 'monthly-signups',
    type: 'bar-chart',
    title: 'Monthly Signups',
    size: 'small',
    position: 2,
    query: '',
    data: {
      series: [
        { name: 'Apr', value: 2450 },
        { name: 'May', value: 3200 },
        { name: 'Jun', value: 2800 },
        { name: 'Jul', value: 3600 },
        { name: 'Aug', value: 3200 },
        { name: 'Sep', value: 3800 },
      ],
    },
  },
  {
    id: 'conversion-rate',
    type: 'number-card',
    title: 'Conversion Rate',
    size: 'small',
    position: 3,
    query: '',
    data: {
      value: 8.7,
      change: 1.2,
      isPositive: false,
      format: 'percentage',
    },
  },
  {
    id: 'top-performers',
    type: 'data-table',
    title: 'Top Performers',
    size: 'medium',
    position: 4,
    query: '',
    data: {
      items: [
        {
          id: '1',
          name: 'Sarah Johnson',
          revenue: 12458,
          conversions: 128,
          status: 'active',
        },
        {
          id: '2',
          name: 'Michael Chen',
          revenue: 9368,
          conversions: 97,
          status: 'active',
        },
        {
          id: '3',
          name: 'Alex Rodriguez',
          revenue: 8742,
          conversions: 86,
          status: 'pending',
        },
      ],
    },
  },
];

// Default dashboards shown before syncing with the backend
// Using empty array to ensure proper backend sync
const defaultDashboards: Dashboard[] = [];
export const createDashboardSlice = (
  set: (partial: Partial<DashboardSlice> | ((state: DashboardSlice) => void)) => void,
  get: () => DashboardSlice,
): DashboardSlice => ({
  dashboards: defaultDashboards,
  activeDashboardId: '',
  isNavigating: false,
  hasSyncedWithBackend: false,

  setNavigationState: (isNavigating) => {
    set((state) => {
      state.isNavigating = isNavigating;
    });
  },

  setActiveDashboard: (id) => {
    set((state) => {
      state.isNavigating = true;
      state.activeDashboardId = id;
    });
    setTimeout(() => {
      set((state) => {
        state.isNavigating = false;
      });
    }, 200);
  },

  addDashboard: (id, name) => {
    set((state) => {
      state.dashboards.unshift({ id, name, position: 0, widgets: [] });
      state.dashboards = state.dashboards.map((d, idx) => ({ ...d, position: idx }));
    });
  },

  updateDashboard: (id, newTitle) => {
    set((state) => {
      const dash = state.dashboards.find((d) => d.id === id);
      if (dash) {
        dash.name = newTitle;
      }
    });
  },

  deleteDashboard: (id) => {
    set((state) => {
      if (state.dashboards.length <= 1) {
        return;
      }

      if (id === state.activeDashboardId) {
        const remaining = state.dashboards.filter((d) => d.id !== id);
        state.activeDashboardId = remaining[0]?.id || '';
      }

      state.dashboards = state.dashboards
        .filter((dashboard) => dashboard.id !== id)
        .map((d, idx) => ({ ...d, position: idx }));
      state.isNavigating = true;
    });

    setTimeout(() => {
      set({ isNavigating: false });
    }, 200);
  },

  addWidget: (dashboardId, widget) => {
    let success = false;
    set((state) => {
      const dashboard = state.dashboards.find((d) => d.id === dashboardId);

      if (!dashboard) {
        success = false;
        return;
      }

      success = true;
      dashboard.widgets.push({
        ...widget,
        id: widget.id || `widget-${Date.now()}`,
        position: dashboard.widgets.length,
        query: widget.query ?? '',
      });
    });

    return success;
  },

  removeWidget: (dashboardId, widgetId) => {
    set((state) => {
      const dashboard = state.dashboards.find((d) => d.id === dashboardId);
      if (!dashboard) return;
      dashboard.widgets = dashboard.widgets
        .filter((w) => w.id !== widgetId)
        .map((w, index) => ({ ...w, position: index }));
    });
  },

  updateWidgetData: (dashboardId, widgetId, data) => {
    set((state) => {
      const dashboard = state.dashboards.find((d) => d.id === dashboardId);
      if (!dashboard) return;
      const widgetToUpdate = dashboard.widgets.find((w) => w.id === widgetId);
      if (widgetToUpdate) {
        widgetToUpdate.data = data;
      }
    });
  },

  updateWidgetQuery: (dashboardId, widgetId, query) => {
    set((state) => {
      const updatedState = {
        dashboards: state.dashboards.map((d) =>
          d.id === dashboardId
            ? {
                ...d,
                widgets: d.widgets.map((w) => (w.id === widgetId ? { ...w, query } : w)),
              }
            : d,
        ),
      };
      return updatedState;
    });
  },

  updateWidget: (dashboardId, widgetId, updates) => {
    set((state) => {
      const dashboard = state.dashboards.find((d) => d.id === dashboardId);
      if (!dashboard) return;

      const widgetIndex = dashboard.widgets.findIndex((w) => w.id === widgetId);
      if (widgetIndex === -1) return;

      dashboard.widgets[widgetIndex] = {
        ...dashboard.widgets[widgetIndex],
        ...updates,
      };
    });
  },

  reorderDashboards: (from, to) => {
    set((state) => {
      const [moved] = state.dashboards.splice(from, 1);
      state.dashboards.splice(to, 0, moved);
      state.dashboards = state.dashboards.map((d, idx) => ({ ...d, position: idx }));
    });
  },

  reorderWidget: (dashboardId, from, to) => {
    set((state) => {
      const dash = state.dashboards.find((d) => d.id === dashboardId);
      if (!dash) return;
      const [moved] = dash.widgets.splice(from, 1);
      dash.widgets.splice(to, 0, moved);
      dash.widgets = dash.widgets.map((w, idx) => ({ ...w, position: idx }));
    });
  },

  getDashboard: (id) => {
    return get().dashboards.find((d) => d.id === id);
  },

  getWidgetsForDashboard: (id) => {
    const dashboard = get().dashboards.find((d) => d.id === id);
    return dashboard ? dashboard.widgets : [];
  },

  syncDashboards: (dashboards) => {
    const currentId = get().activeDashboardId;
    const activeId = currentId && dashboards.some((d) => d.id === currentId)
      ? currentId
      : dashboards[0]?.id || '';

    set((state) => {
      state.dashboards = dashboards
        .sort((a, b) => a.position - b.position)
        .map((d, idx) => ({ ...d, position: idx }));
      state.activeDashboardId = activeId;
      state.hasSyncedWithBackend = true;
    });
  },

  setWidgetsForDashboard: (dashboardId, widgets) => {
    set((state) => {
      const dash = state.dashboards.find((d) => d.id === dashboardId);
      if (dash) {
        dash.widgets = widgets
          .sort((a, b) => a.position - b.position)
          .map((w, index) => ({ ...w, position: index }));
      }
    });
  },
});
