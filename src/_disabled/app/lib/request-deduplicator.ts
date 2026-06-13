// Request deduplication system to prevent duplicate API calls

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
  requestKey: string;
}

class RequestDeduplicator {
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly TIMEOUT = 30000; // 30 seconds timeout

  // Execute request only once for identical requests
  async dedupe<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // Check if identical request is already in progress
    const existing = this.pendingRequests.get(key);
    
    if (existing) {
      const age = Date.now() - existing.timestamp;
      
      // If request is fresh, reuse it
      if (age < this.TIMEOUT) {
        console.log(`🔄 Deduplicating request: ${key} (${age}ms old)`);
        return existing.promise as Promise<T>;
      } else {
        // Request is too old, remove it
        console.warn(`⏰ Removing stale request: ${key} (${age}ms old)`);
        this.pendingRequests.delete(key);
      }
    }

    // Create new request
    console.log(`🚀 New request: ${key}`);
    const promise = requestFn();
    
    const pendingRequest: PendingRequest = {
      promise,
      timestamp: Date.now(),
      requestKey: key,
    };
    
    this.pendingRequests.set(key, pendingRequest);
    
    // Clean up when request completes (success or failure)
    promise
      .then(() => {
        console.log(`✅ Request completed: ${key}`);
        this.pendingRequests.delete(key);
      })
      .catch((error) => {
        console.log(`❌ Request failed: ${key} -`, error.message);
        this.pendingRequests.delete(key);
      });

    return promise;
  }

  // Generate cache key for dashboard requests
  generateDashboardKey(operation: 'list' | 'get', dashboardId?: string): string {
    if (operation === 'list') {
      return 'dashboards:list';
    }
    return `dashboards:get:${dashboardId}`;
  }

  // Generate cache key for widget requests  
  generateWidgetKey(operation: string, widgetId?: string, query?: string): string {
    if (operation === 'refresh' && widgetId) {
      return `widgets:refresh:${widgetId}`;
    }
    if (operation === 'query' && query) {
      // Hash the query to create a stable key
      const queryHash = query.substring(0, 50); // Simple truncation for now
      return `widgets:query:${btoa(queryHash).substring(0, 20)}`;
    }
    return `widgets:${operation}:${widgetId || Date.now()}`;
  }

  // Get statistics about pending requests
  getStats(): {
    pendingCount: number;
    oldestRequest: number;
    requestTypes: Record<string, number>;
  } {
    const now = Date.now();
    let oldestTimestamp = now;
    const requestTypes: Record<string, number> = {};

    for (const [key, request] of this.pendingRequests.entries()) {
      if (request.timestamp < oldestTimestamp) {
        oldestTimestamp = request.timestamp;
      }

      const type = key.split(':')[0];
      requestTypes[type] = (requestTypes[type] || 0) + 1;
    }

    return {
      pendingCount: this.pendingRequests.size,
      oldestRequest: now - oldestTimestamp,
      requestTypes,
    };
  }

  // Clear all pending requests (useful for testing or error recovery)
  clear(): void {
    const count = this.pendingRequests.size;
    this.pendingRequests.clear();
    console.log(`🧹 Cleared ${count} pending requests`);
  }

  // Force cleanup of stale requests
  cleanup(): void {
    const now = Date.now();
    const staleRequests: string[] = [];

    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > this.TIMEOUT) {
        staleRequests.push(key);
      }
    }

    for (const key of staleRequests) {
      this.pendingRequests.delete(key);
    }

    if (staleRequests.length > 0) {
      console.log(`🧹 Cleaned up ${staleRequests.length} stale requests`);
    }
  }
}

// Global deduplicator instance
export const requestDeduplicator = new RequestDeduplicator();

// Utility functions for common use cases
export const dedupeDashboardList = <T>(requestFn: () => Promise<T>): Promise<T> =>
  requestDeduplicator.dedupe(
    requestDeduplicator.generateDashboardKey('list'),
    requestFn
  );

export const dedupeDashboardGet = <T>(dashboardId: string, requestFn: () => Promise<T>): Promise<T> =>
  requestDeduplicator.dedupe(
    requestDeduplicator.generateDashboardKey('get', dashboardId),
    requestFn
  );

export const dedupeWidgetRefresh = <T>(widgetId: string, requestFn: () => Promise<T>): Promise<T> =>
  requestDeduplicator.dedupe(
    requestDeduplicator.generateWidgetKey('refresh', widgetId),
    requestFn
  );

export const dedupeWidgetQuery = <T>(query: string, requestFn: () => Promise<T>): Promise<T> =>
  requestDeduplicator.dedupe(
    requestDeduplicator.generateWidgetKey('query', undefined, query),
    requestFn
  );

// Auto-cleanup every 60 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    requestDeduplicator.cleanup();
    
    const stats = requestDeduplicator.getStats();
    if (stats.pendingCount > 0) {
      console.log('🔄 Request deduplication stats:', stats);
    }
  }, 60000);
}