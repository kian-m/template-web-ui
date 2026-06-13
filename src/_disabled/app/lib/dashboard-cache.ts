// Aggressive dashboard caching system to minimize API calls
import { avatarLog } from '@/app/components/ui/avatar-logger';

interface CachedDashboard {
  data: any;
  timestamp: number;
  lastModified?: string;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache entries
  staleWhileRevalidate: boolean; // Serve stale data while fetching fresh
}

class DashboardCache {
  private cache = new Map<string, CachedDashboard>();
  private pendingRequests = new Map<string, Promise<any>>();
  private config: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 50,
    staleWhileRevalidate: true,
  };

  // Get dashboard from cache or fetch if needed
  async getDashboard(dashboardId: string, fetchFn: () => Promise<any>): Promise<any> {
    const cacheKey = `dashboard_${dashboardId}`;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    // Return fresh cached data
    if (cached && (now - cached.timestamp) < this.config.ttl) {
      avatarLog.success(`Cache HIT for dashboard ${dashboardId} (${((now - cached.timestamp) / 1000).toFixed(1)}s old)`, 'idle');
      return cached.data;
    }

    // Check for pending request to avoid duplicate API calls
    if (this.pendingRequests.has(cacheKey)) {
      avatarLog.info(`Waiting for pending request for dashboard ${dashboardId}`, 'listening');
      return this.pendingRequests.get(cacheKey);
    }

    // Serve stale data while revalidating in background
    if (cached && this.config.staleWhileRevalidate) {
      avatarLog.warning(`Serving stale data for dashboard ${dashboardId}, revalidating in background`, 'thinking');
      
      // Start background revalidation
      this.revalidateInBackground(cacheKey, dashboardId, fetchFn);
      
      return cached.data;
    }

    // No cache, fetch fresh data
    avatarLog.info(`Cache MISS for dashboard ${dashboardId}, fetching fresh data`, 'thinking');
    const promise = this.fetchAndCache(cacheKey, dashboardId, fetchFn);
    this.pendingRequests.set(cacheKey, promise);

    try {
      const result = await promise;
      this.pendingRequests.delete(cacheKey);
      return result;
    } catch (error) {
      this.pendingRequests.delete(cacheKey);
      
      // Return stale data if available on error
      if (cached) {
        avatarLog.error(`Fetch failed for dashboard ${dashboardId}, serving stale data`, 'thinking');
        return cached.data;
      }
      
      throw error;
    }
  }

  // Fetch dashboard list with aggressive caching
  async getDashboardList(fetchFn: () => Promise<any>): Promise<any> {
    const cacheKey = 'dashboard_list';
    return this.getDashboard('list', fetchFn);
  }

  private async fetchAndCache(cacheKey: string, dashboardId: string, fetchFn: () => Promise<any>): Promise<any> {
    const startTime = performance.now();
    
    try {
      const data = await fetchFn();
      const fetchTime = performance.now() - startTime;
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      
      // Cleanup old entries if cache is too large
      this.cleanup();
      
      avatarLog.success(`Cached dashboard ${dashboardId} (${fetchTime.toFixed(2)}ms)`, 'idle');
      return data;
    } catch (error) {
      console.error(`❌ Failed to fetch dashboard ${dashboardId}:`, error);
      throw error;
    }
  }

  private async revalidateInBackground(cacheKey: string, dashboardId: string, fetchFn: () => Promise<any>): Promise<void> {
    try {
      // Don't await this - it's background revalidation
      this.fetchAndCache(cacheKey, dashboardId, fetchFn);
    } catch (error) {
      console.warn(`Background revalidation failed for dashboard ${dashboardId}:`, error);
    }
  }

  private cleanup(): void {
    if (this.cache.size <= this.config.maxSize) return;

    // Remove oldest entries
    const entries = Array.from(this.cache.entries());
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    const toRemove = entries.slice(0, entries.length - this.config.maxSize);
    for (const [key] of toRemove) {
      this.cache.delete(key);
    }
    
    avatarLog.info(`Cleaned up ${toRemove.length} old cache entries`, 'idle');
  }

  // Invalidate specific dashboard
  invalidate(dashboardId: string): void {
    const cacheKey = `dashboard_${dashboardId}`;
    this.cache.delete(cacheKey);
    console.log(`🗑️ Invalidated cache for dashboard ${dashboardId}`);
  }

  // Invalidate all dashboards
  invalidateAll(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.pendingRequests.clear();
    console.log(`🗑️ Invalidated all ${size} cache entries`);
  }

  // Preload dashboard data
  async preload(dashboardId: string, fetchFn: () => Promise<any>): Promise<void> {
    const cacheKey = `dashboard_${dashboardId}`;
    
    // Don't preload if already cached
    if (this.cache.has(cacheKey)) return;
    
    // Don't preload if already fetching
    if (this.pendingRequests.has(cacheKey)) return;
    
    avatarLog.info(`Preloading dashboard ${dashboardId}`, 'thinking');
    try {
      await this.fetchAndCache(cacheKey, dashboardId, fetchFn);
    } catch (error) {
      console.warn(`Preload failed for dashboard ${dashboardId}:`, error);
    }
  }

  // Get cache statistics
  getStats(): {
    size: number;
    hitRate: number;
    pendingRequests: number;
    oldestEntry: number;
  } {
    const now = Date.now();
    let oldestTimestamp = now;
    
    for (const [, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
    }

    return {
      size: this.cache.size,
      hitRate: 0, // TODO: Track hits vs misses
      pendingRequests: this.pendingRequests.size,
      oldestEntry: now - oldestTimestamp,
    };
  }

  // Update cache configuration
  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
    console.log(`⚙️ Updated cache config:`, this.config);
  }
}

// Global cache instance
export const dashboardCache = new DashboardCache();

// Utility functions
export const getCachedDashboard = (dashboardId: string, fetchFn: () => Promise<any>) => 
  dashboardCache.getDashboard(dashboardId, fetchFn);

export const getCachedDashboardList = (fetchFn: () => Promise<any>) =>
  dashboardCache.getDashboardList(fetchFn);

export const invalidateDashboard = (dashboardId: string) => 
  dashboardCache.invalidate(dashboardId);

export const preloadDashboard = (dashboardId: string, fetchFn: () => Promise<any>) =>
  dashboardCache.preload(dashboardId, fetchFn);

// Auto-cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const stats = dashboardCache.getStats();
    console.log('📊 Dashboard cache stats:', stats);
  }, 10 * 60 * 1000);
}