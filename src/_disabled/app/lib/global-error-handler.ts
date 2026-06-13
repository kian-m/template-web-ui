// Global error handling for unhandled errors and promise rejections

interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: ErrorInfo[] = [];
  private maxQueueSize = 50;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  initialize() {
    if (this.isInitialized) return;
    
    if (typeof window === 'undefined') return; // Server-side rendering

    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message || 'Unknown error',
        stack: event.error?.stack,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });

      // Prevent the default behavior (logging to console)
      event.preventDefault();
    });

    // Handle React errors (for cases not caught by error boundaries)
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Check if it's a React error
      const errorMessage = args.join(' ');
      if (errorMessage.includes('React') || errorMessage.includes('Warning:')) {
        this.handleError({
          message: `React Console Error: ${errorMessage}`,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        });
      }
      
      // Call original console.error
      originalConsoleError.apply(console, args);
    };

    this.isInitialized = true;
    console.info('Global error handler initialized');
  }

  private handleError(errorInfo: ErrorInfo) {
    // Add to queue
    this.errorQueue.push(errorInfo);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Log error for development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Global Error Handler');
      console.error('Error:', errorInfo.message);
      if (errorInfo.stack) {
        console.error('Stack:', errorInfo.stack);
      }
      console.error('Details:', errorInfo);
      console.groupEnd();
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorInfo);
    }

    // Show user notification for critical errors
    this.notifyUser(errorInfo);
  }

  private reportError(errorInfo: ErrorInfo) {
    // In a real app, you would send this to a service like:
    // - Sentry
    // - LogRocket
    // - Rollbar
    // - Custom analytics endpoint
    
    // For now, we'll just log it
    try {
      // Example: Send to analytics
      // analytics.track('error', errorInfo);
      
      // Example: Send to error reporting service
      // errorReporting.captureException(errorInfo);
      
      console.warn('Error would be reported to external service:', errorInfo);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private notifyUser(errorInfo: ErrorInfo) {
    // Only show user notification for critical errors
    const isCritical = this.isCriticalError(errorInfo);
    
    if (!isCritical) return;

    // Import toast dynamically to avoid circular dependencies
    import('@/lib/toast').then(({ toast }) => {
      toast.error('Something went wrong. Please refresh the page if the problem persists.', {
        event: 'global_error',
        duration: 0, // Keep error visible
      });
    }).catch(() => {
      // Fallback notification if toast fails
      if (window.confirm('An error occurred. Would you like to refresh the page?')) {
        window.location.reload();
      }
    });
  }

  private isCriticalError(errorInfo: ErrorInfo): boolean {
    const criticalPatterns = [
      /chunk.*failed/i,
      /loading.*failed/i,
      /network.*error/i,
      /fetch.*failed/i,
      /cors/i,
      /unauthorized/i,
    ];

    return criticalPatterns.some(pattern => 
      pattern.test(errorInfo.message)
    );
  }

  // Public methods for manual error reporting
  reportCustomError(error: Error, context?: Record<string, any>) {
    this.handleError({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      userAgent: navigator?.userAgent || 'Unknown',
      ...context,
    });
  }

  getRecentErrors(): ErrorInfo[] {
    return [...this.errorQueue];
  }

  clearErrors() {
    this.errorQueue = [];
  }
}

// Export singleton instance
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// Utility function for manual error reporting
export function reportError(error: Error, context?: Record<string, any>) {
  globalErrorHandler.reportCustomError(error, context);
}

// Hook for React components to report errors
export function useErrorReporting() {
  return {
    reportError: (error: Error, context?: Record<string, any>) => {
      globalErrorHandler.reportCustomError(error, context);
    },
    getRecentErrors: () => globalErrorHandler.getRecentErrors(),
  };
}