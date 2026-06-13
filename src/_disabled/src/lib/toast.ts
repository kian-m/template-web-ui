import { toast as sonnerToast } from 'sonner';
import posthog from 'posthog-js';
import { errorEventName } from './posthog-event';

// Custom toast utilities with enhanced functionality
const toastMethods = {
  success: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
    });
  },

  error: (
    message: string,
    options?: {
      description?: string;
      duration?: number;
      event?: string;
    },
  ) => {
    const eventName = errorEventName(options?.event || 'toast_error');
    posthog?.capture(eventName, { message, description: options?.description });
    return sonnerToast.error(message, {
      duration: options?.duration || 6000,
      description: options?.description,
    });
  },

  info: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
    });
  },

  warning: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.warning(message, {
      duration: options?.duration || 5000,
      description: options?.description,
    });
  },

  // Loading toast
  loading: (message: string) => {
    return sonnerToast.loading(message, {
      duration: Infinity,
    });
  },

  // Promise wrapper
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
};

export const toast = {
  ...toastMethods,
  // Custom convenience methods
  quickSuccess: (message: string) => toastMethods.success(message, { duration: 2000 }),
  quickError: (message: string) => toastMethods.error(message, { duration: 3000 }),
};

export default toast;
