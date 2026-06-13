// app/services/api.ts
import { Widget } from '@/app/store/dashboard-store';
import { apiClient } from './api-client';
import { chat } from '@/client';
import { getAuthHeaders } from './token-cache';
import { apiErrorInterceptor } from '@/app/lib/api-error-interceptor';

const isOfflineMode = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true' || true;

// Types for the API
export interface ChatRequest {
  message: string;
  dashboardId: string;
  threadId?: string;
  history?: Array<{ role: 'user' | 'bot'; message: string }>;
}

export interface ChatResponse {
  reply: string;
  threadId: string;
  action?: {
    type: 'add_widgets';
    widgets: Array<Omit<Widget, 'id' | 'position'>>;
  };
  remainingCredits?: number;
}

// Helper function to parse widget type from API response
function parseWidgetType(apiType: string): Widget['type'] {
  // Normalize to use dashes and handle both underscore and dash formats
  const normalizedType = apiType.replace(/_/g, '-');
  const typeMap: Record<string, Widget['type']> = {
    'number-card': 'number-card',
    'line-chart': 'line-chart',
    'bar-chart': 'bar-chart',
    'data-table': 'data-table',
    'pie-chart': 'pie-chart',
    'funnel': 'funnel'
  };
  return typeMap[normalizedType] || 'number-card';
}


/**
 * API service that communicates with the backend
 */
export const apiService = {
  /**
   * Process a chat message and return a response
   */
  sendChatMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    if (isOfflineMode) {
      // Very simple intent extraction to produce local widgets
      const msg = request.message.toLowerCase();
      const widgets: Array<Omit<Widget, 'id' | 'position'>> = [];
      const mk = (type: Widget['type'], title: string): Omit<Widget, 'id' | 'position'> => ({
        type,
        title,
        size: 'small',
        query: title,
        data: {},
      });
      if (msg.includes('revenue') || msg.includes('sales')) widgets.push(mk('line-chart', 'Revenue Trend'));
      if (msg.includes('users') || msg.includes('signups')) widgets.push(mk('number-card', 'Total Users'));
      if (msg.includes('conversion')) widgets.push(mk('number-card', 'Conversion Rate'));
      if (widgets.length === 0) widgets.push(mk('number-card', 'KPI'));
      const reply = `Added ${widgets.length} widget${widgets.length === 1 ? '' : 's'} locally.`;
      return { reply, threadId: request.threadId || crypto.randomUUID(), action: { type: 'add_widgets', widgets } };
    }
    try {
      // Call the real API endpoint using centralized token service
      const headers = await getAuthHeaders();

      const response = await chat({
        client: apiClient,
        // Cast to any because the generated types are outdated
        body: {
          dashboardId: request.dashboardId,
          request: request.message,
          threadId: request.threadId,
          history: request.history,
        } as any,
        ...(headers ? { headers } : {}),
      });

      // Parse the API response
      const apiResponse = response.data as any;
      console.log('API Response:', apiResponse);

      const reply = apiResponse.reply || "I'm not sure how to help with that.";
      const threadId = apiResponse.threadId || request.threadId || crypto.randomUUID();
      const remainingCredits = apiResponse.remainingCredits as number | undefined;
      if (Array.isArray(apiResponse.widgets)) {
        const widgets = (apiResponse.widgets as any[]).map((w) => ({
          type: parseWidgetType(w.type),
          title: w.title,
          size: w.size || 'small',
          data: w.data,
          query: w.query,
        }));
        return { reply, threadId, remainingCredits, action: { type: 'add_widgets', widgets } };
      }
      if (apiResponse.widget) {
        const w = apiResponse.widget as any;
        const widgets = [
          {
            type: parseWidgetType(w.type),
            title: w.title,
            size: w.size || 'small',
            data: w.data,
            query: w.query,
          },
        ];
        return { reply, threadId, remainingCredits, action: { type: 'add_widgets', widgets } };
      }
      return { reply, threadId, remainingCredits };
    } catch (error) {
      console.error('API Error:', error);

      // Check for authentication errors first
      if (apiErrorInterceptor.handleApiError(error)) {
        throw new Error('Authentication required');
      }

      // Handle different error types
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as any;

        // Handle validation errors
        if (apiError.error?.detail) {
          return {
            reply: "I couldn't process your request. Please try rephrasing it.",
            threadId: request.threadId || crypto.randomUUID(),
          };
        }
      }

      // Generic error response
      return {
        reply: "I'm having trouble connecting to the server. Please try again later.",
        threadId: request.threadId || crypto.randomUUID(),
      };
    }
  },
};
