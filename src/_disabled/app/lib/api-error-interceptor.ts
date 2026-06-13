import { toast } from '@/lib/toast';
import posthog from 'posthog-js';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface ApiError {
  status?: number;
  response?: { status?: number };
  error?: { status?: number; message?: string };
  statusCode?: number;
  message?: string;
}

class ApiErrorInterceptor {
  private static instance: ApiErrorInterceptor;
  private isRedirecting = false;
  private router?: AppRouterInstance;
  private redirectTimeout?: ReturnType<typeof setTimeout>;

  private constructor() {}

  static getInstance(): ApiErrorInterceptor {
    if (!ApiErrorInterceptor.instance) {
      ApiErrorInterceptor.instance = new ApiErrorInterceptor();
    }
    return ApiErrorInterceptor.instance;
  }

  init(router: AppRouterInstance) {
    this.router = router;
  }

  handleApiError(error: unknown): boolean {
    const err = error as ApiError;
    if (
      err?.status === 401 ||
      err?.response?.status === 401 ||
      err?.error?.status === 401 ||
      err?.statusCode === 401
    ) {
      this.handleUnauthorized();
      return true;
    }
    return false;
  }

  private handleUnauthorized() {
    if (this.isRedirecting) return;
    this.isRedirecting = true;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('auth-token');
      sessionStorage.removeItem('loginError');
      document.cookie = 'auth-token=; path=/; max-age=0';
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loginError', 'Login unsuccessful. Please try again.');
    }

    toast.error('Session expired. Redirecting to login...', {
      event: 'session_expired',
      duration: 2000,
    });

    posthog?.capture('session_expired_redirect');

    this.redirectTimeout = setTimeout(() => {
      if (this.router) {
        this.router.push('/login');
      } else if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }, 500);
  }

  reset() {
    this.isRedirecting = false;
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
      this.redirectTimeout = undefined;
    }
  }
}

export const apiErrorInterceptor = ApiErrorInterceptor.getInstance();

export async function withAuthErrorHandling<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (apiErrorInterceptor.handleApiError(error)) {
      throw new Error('Authentication required');
    }
    throw error;
  }
}
