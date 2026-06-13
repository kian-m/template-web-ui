/**
 * Mock Data for Offline Mode
 * This provides realistic mock data when running without a backend
 */

import type { Dashboard } from '@/app/store/dashboard-store';

const isOfflineMode = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true';

// Mock dashboards
export const mockDashboards: Dashboard[] = [
  {
    id: 'mock-dashboard-1',
    name: 'Analytics Overview',
    position: 0,
    widgets: [
      {
        id: 'mock-widget-1',
        type: 'number-card',
        title: 'Total Revenue',
        size: 'small',
        position: 0,
        query: 'SELECT SUM(revenue) FROM sales',
        data: {
          value: 125432,
          change: 12.5,
          isPositive: true,
          format: 'currency',
        },
      },
      {
        id: 'mock-widget-2',
        type: 'line-chart',
        title: 'Daily Active Users',
        size: 'medium',
        position: 1,
        query: 'SELECT date, COUNT(DISTINCT user_id) FROM events GROUP BY date',
        data: {
          series: [
            {
              data: [
                { date: '2024-01-01', users: 1200 },
                { date: '2024-01-02', users: 1350 },
                { date: '2024-01-03', users: 1280 },
                { date: '2024-01-04', users: 1420 },
                { date: '2024-01-05', users: 1580 },
                { date: '2024-01-06', users: 1490 },
                { date: '2024-01-07', users: 1650 },
              ],
            },
          ],
        },
      },
      {
        id: 'mock-widget-3',
        type: 'bar-chart',
        title: 'Top Events',
        size: 'medium',
        position: 2,
        query: 'SELECT event_name, COUNT(*) FROM events GROUP BY event_name',
        data: {
          series: [
            {
              data: [
                { event: 'Page View', count: 4532 },
                { event: 'Button Click', count: 2341 },
                { event: 'Form Submit', count: 892 },
                { event: 'Video Play', count: 567 },
                { event: 'Download', count: 234 },
              ],
            },
          ],
        },
      },
      {
        id: 'mock-widget-4',
        type: 'pie-chart',
        title: 'Traffic Sources',
        size: 'small',
        position: 3,
        query: 'SELECT source, COUNT(*) FROM sessions GROUP BY source',
        data: {
          series: [
            { name: 'Direct', value: 45, color: '#1d4aff' },
            { name: 'Organic Search', value: 30, color: '#f9bd2b' },
            { name: 'Social Media', value: 15, color: '#f54e00' },
            { name: 'Referral', value: 10, color: '#00d4ff' },
          ],
        },
      },
      {
        id: 'mock-widget-5',
        type: 'number-card',
        title: 'Conversion Rate',
        size: 'small',
        position: 4,
        query: 'SELECT conversion_rate FROM metrics',
        data: {
          value: 3.2,
          change: 0.5,
          isPositive: true,
          format: 'percentage',
        },
      },
      {
        id: 'mock-widget-6',
        type: 'data-table',
        title: 'Recent Transactions',
        size: 'large',
        position: 5,
        query: 'SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10',
        data: {
          columns: ['ID', 'Customer', 'Amount', 'Status', 'Date'],
          rows: [
            ['TXN-001', 'John Doe', '$1,234.56', 'Completed', '2024-01-07'],
            ['TXN-002', 'Jane Smith', '$892.34', 'Completed', '2024-01-07'],
            ['TXN-003', 'Bob Johnson', '$456.78', 'Pending', '2024-01-06'],
            ['TXN-004', 'Alice Brown', '$2,345.67', 'Completed', '2024-01-06'],
            ['TXN-005', 'Charlie Wilson', '$678.90', 'Failed', '2024-01-05'],
          ],
        },
      },
    ],
  },
  {
    id: 'mock-dashboard-2',
    name: 'Sales Dashboard',
    position: 1,
    widgets: [
      {
        id: 'mock-widget-7',
        type: 'number-card',
        title: 'Total Sales',
        size: 'small',
        position: 0,
        query: 'SELECT COUNT(*) FROM orders',
        data: {
          value: 8934,
          change: 8.2,
          isPositive: true,
          format: 'number',
        },
      },
      {
        id: 'mock-widget-8',
        type: 'funnel',
        title: 'Sales Funnel',
        size: 'large',
        position: 1,
        query: 'SELECT step, count FROM funnel_data',
        data: {
          steps: [
            { name: 'Visitors', value: 10000, color: '#1d4aff' },
            { name: 'Leads', value: 3500, color: '#f9bd2b' },
            { name: 'Opportunities', value: 1200, color: '#f54e00' },
            { name: 'Customers', value: 450, color: '#00d4ff' },
          ],
        },
      },
    ],
  },
];

// Mock widget refresh data
export const mockWidgetRefreshData = {
  value: Math.floor(Math.random() * 10000) + 1000,
  change: (Math.random() * 20 - 10).toFixed(1),
  isPositive: Math.random() > 0.5,
};

// Helper to simulate API delay
export const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

// Mock API responses
export const mockApiResponses = {
  dashboards: {
    list: async () => {
      if (!isOfflineMode) return null;
      await mockDelay();
      return {
        data: mockDashboards.map(d => ({
          dashboardId: d.id,
          name: d.name,
          position: d.position,
        })),
        error: null,
      };
    },
    
    get: async (dashboardId: string) => {
      if (!isOfflineMode) return null;
      await mockDelay();
      const dashboard = mockDashboards.find(d => d.id === dashboardId);
      if (!dashboard) {
        return { data: null, error: { message: 'Dashboard not found' } };
      }
      return {
        data: {
          dashboardId: dashboard.id,
          name: dashboard.name,
          position: dashboard.position,
          widgets: dashboard.widgets.map(w => ({
            widgetId: w.id,
            type: w.type,
            title: w.title,
            size: w.size,
            position: w.position,
            query: w.query,
            data: w.data,
            config: w.data,
          })),
        },
        error: null,
      };
    },
    
    create: async (name: string) => {
      if (!isOfflineMode) return null;
      await mockDelay();
      const newDashboard = {
        id: `mock-dashboard-${Date.now()}`,
        dashboardId: `mock-dashboard-${Date.now()}`, // Include both for compatibility
        name,
        position: mockDashboards.length,
        widgets: [],
      };
      mockDashboards.push(newDashboard);
      return { data: newDashboard, error: null };
    },
    
    update: async (dashboardId: string, updates: any) => {
      if (!isOfflineMode) return null;
      await mockDelay();
      const dashboard = mockDashboards.find(d => d.id === dashboardId);
      if (dashboard && updates.name) {
        dashboard.name = updates.name;
      }
      return { data: dashboard, error: null };
    },
    
    delete: async (dashboardId: string) => {
      if (!isOfflineMode) return null;
      await mockDelay();
      const index = mockDashboards.findIndex(d => d.id === dashboardId);
      if (index > -1) {
        mockDashboards.splice(index, 1);
      }
      return { data: { success: true }, error: null };
    },
  },
  
  widgets: {
    refresh: async (widgetId: string) => {
      if (!isOfflineMode) return null;
      await mockDelay();
      // Find the widget and return updated data
      for (const dashboard of mockDashboards) {
        const widget = dashboard.widgets?.find(w => w.id === widgetId);
        if (widget) {
          // Generate slightly different data for refresh
          const newData = { ...widget.data };
          if (widget.type === 'number-card') {
            newData.value = Math.floor(Math.random() * 10000) + 1000;
            newData.change = (Math.random() * 20 - 10).toFixed(1);
            newData.isPositive = Math.random() > 0.5;
          }
          return { data: { ...widget, data: newData }, error: null };
        }
      }
      return { data: null, error: { message: 'Widget not found' } };
    },
    
    update: async (widgetId: string, updates: any) => {
      if (!isOfflineMode) return null;
      await mockDelay();
      for (const dashboard of mockDashboards) {
        const widget = dashboard.widgets?.find(w => w.id === widgetId);
        if (widget) {
          Object.assign(widget, updates);
          return { data: widget, error: null };
        }
      }
      return { data: null, error: { message: 'Widget not found' } };
    },
  },
};