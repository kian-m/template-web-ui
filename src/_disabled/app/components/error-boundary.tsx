'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'widget' | 'page' | 'app';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service (e.g., Sentry, LogRocket)
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        level: this.props.level || 'unknown',
      });
    }

    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level = 'app' } = this.props;
      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <div
          className={`flex flex-col items-center justify-center p-6 ${
            level === 'widget' ? 'min-h-[200px]' : 'min-h-[400px]'
          } bg-gray-50 dark:bg-gray-900`}
        >
          <div className="max-w-md text-center">
            <div
              className={`mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 ${
                level === 'widget' ? 'h-12 w-12' : 'h-16 w-16'
              }`}
            >
              <AlertTriangle
                className={`text-red-600 dark:text-red-400 ${
                  level === 'widget' ? 'h-6 w-6' : 'h-8 w-8'
                }`}
              />
            </div>

            <h3
              className={`mb-2 font-semibold text-gray-900 dark:text-white ${
                level === 'widget' ? 'text-sm' : 'text-lg'
              }`}
            >
              {level === 'widget' ? 'Widget Error' : 'Something went wrong'}
            </h3>

            <p
              className={`mb-4 text-gray-600 dark:text-gray-400 ${
                level === 'widget' ? 'text-xs' : 'text-sm'
              }`}
            >
              {level === 'widget'
                ? 'This widget encountered an error and cannot be displayed.'
                : 'An unexpected error occurred. Please try refreshing the page.'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="mb-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                  Error Details
                </summary>
                <pre className="max-h-40 overflow-auto rounded bg-gray-100 p-3 text-xs dark:bg-gray-800">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div
              className={`flex gap-2 ${level === 'widget' ? 'justify-center' : 'justify-center'}`}
            >
              {canRetry && (
                <Button
                  variant="outline"
                  size={'default'}
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again ({this.maxRetries - this.state.retryCount} left)
                </Button>
              )}

              {(level === 'page' || level === 'app') && (
                <Button
                  variant="default"
                  size={'default'}
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              )}

              <Button
                variant="ghost"
                size={level === 'widget' ? 'sm' : 'default'}
                onClick={this.handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Specialized error boundaries for different contexts
export const WidgetErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="widget">{children}</ErrorBoundary>
);

export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="page">{children}</ErrorBoundary>
);

export const AppErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="app">{children}</ErrorBoundary>
);
