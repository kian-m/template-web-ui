/**
 * API Response Types
 * Unified types for both mock and real API responses
 */

// Dashboard creation response can have either dashboardId (real API) or id (mock)
export interface CreateDashboardResponse {
  dashboardId?: string;
  id?: string;
  name?: string;
  position?: number;
  widgets?: any[];
}

// Wrapper for API responses
export interface ApiResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

// Dashboard list item
export interface DashboardListItem {
  dashboardId: string;
  ownerUserId?: string;
  name: string;
  description?: string;
  position: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  widgetIds?: string[];
}

// Dashboard details response
export interface DashboardDetailsResponse {
  dashboardId: string;
  ownerUserId?: string;
  name: string;
  description?: string;
  position: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  widgetIds?: string[];
  widgets?: WidgetResponse[];
}

// Widget response
export interface WidgetResponse {
  widgetId: string;
  dashboardId?: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  query: string;
  config?: any;
  data?: any;
  createdAt?: string;
  updatedAt?: string;
}

// List dashboards response
export interface ListDashboardsResponse {
  dashboards: DashboardListItem[];
}

// Login response
export interface LoginResponse {
  isPosthogValid: boolean;
  remainingCredits: number;
}

// PostHog check response
export interface PostHogCheckResponse {
  isValid: boolean;
  error?: string;
}

// Widget refresh response
export interface WidgetRefreshResponse extends WidgetResponse {
  data: any;
}

// Helper function to normalize dashboard ID from response
export function getDashboardId(response: CreateDashboardResponse): string | undefined {
  return response.dashboardId || response.id;
}

// Helper function to check if response has valid dashboard ID
export function hasValidDashboardId(response: any): boolean {
  return !!(response?.dashboardId || response?.id);
}