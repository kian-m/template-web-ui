// Safe async utilities to prevent unhandled promise rejections

export type SafeResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: Error;
  message: string;
};

/**
 * Safely execute an async operation with automatic error handling
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string
): Promise<SafeResult<T>> {
  try {
    const data = await asyncFn();
    return { success: true, data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('SafeAsync error:', err);
    
    return {
      success: false,
      error: err,
      message: errorMessage || err.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Safely execute multiple async operations with partial success handling
 */
export async function safeAsyncBatch<T>(
  operations: Array<() => Promise<T>>,
  options: {
    failFast?: boolean; // Stop on first error
    errorMessage?: string;
  } = {}
): Promise<{
  successes: T[];
  failures: Array<{ index: number; error: Error }>;
  hasAnySuccess: boolean;
  hasAnyFailure: boolean;
}> {
  const successes: T[] = [];
  const failures: Array<{ index: number; error: Error }> = [];

  for (let i = 0; i < operations.length; i++) {
    const result = await safeAsync(operations[i], options.errorMessage);
    
    if (result.success) {
      successes.push(result.data);
    } else {
      failures.push({ index: i, error: result.error });
      
      if (options.failFast) {
        break;
      }
    }
  }

  return {
    successes,
    failures,
    hasAnySuccess: successes.length > 0,
    hasAnyFailure: failures.length > 0,
  };
}

/**
 * Retry an async operation with exponential backoff
 */
export async function safeAsyncWithRetry<T>(
  asyncFn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number; // milliseconds
    maxDelay?: number; // milliseconds
    errorMessage?: string;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<SafeResult<T>> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    errorMessage,
    onRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await safeAsync(asyncFn, errorMessage);
    
    if (result.success) {
      return result;
    }

    lastError = result.error;

    if (attempt < maxRetries) {
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      onRetry?.(attempt + 1, result.error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: lastError || new Error('Unknown error'),
    message: errorMessage || 'Operation failed after retries',
  };
}

/**
 * Timeout wrapper for async operations
 */
export async function safeAsyncWithTimeout<T>(
  asyncFn: () => Promise<T>,
  timeoutMs: number,
  errorMessage?: string
): Promise<SafeResult<T>> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const data = await Promise.race([asyncFn(), timeoutPromise]);
    return { success: true, data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return {
      success: false,
      error: err,
      message: errorMessage || err.message,
    };
  }
}

/**
 * Debounced async operation to prevent rapid successive calls
 */
export function createDebouncedAsync<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  delayMs: number
) {
  let timeoutId: NodeJS.Timeout | null = null;
  let currentPromise: Promise<SafeResult<T>> | null = null;

  return (...args: Args): Promise<SafeResult<T>> => {
    // Cancel any pending operation
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // If there's an ongoing operation, return it
    if (currentPromise) {
      return currentPromise;
    }

    currentPromise = new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        const result = await safeAsync(() => asyncFn(...args));
        currentPromise = null;
        timeoutId = null;
        resolve(result);
      }, delayMs);
    });

    return currentPromise;
  };
}