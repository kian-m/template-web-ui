// Performance monitoring and benchmarking system

interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  method: 'batch' | 'individual' | 'fallback';
  itemCount?: number;
  error?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 100; // Keep last 100 metrics

  startOperation(operation: string): string {
    const operationId = `${operation}_${Date.now()}_${Math.random()}`;
    return operationId;
  }

  endOperation(
    operationId: string,
    operation: string,
    method: 'batch' | 'individual' | 'fallback',
    success: boolean,
    itemCount?: number,
    error?: string
  ): PerformanceMetric {
    const endTime = performance.now();
    const startTime = parseFloat(operationId.split('_')[1]) || endTime;
    
    const metric: PerformanceMetric = {
      operation,
      startTime,
      endTime,
      duration: endTime - startTime,
      success,
      method,
      itemCount,
      error,
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log performance info
    const methodEmoji = method === 'batch' ? '📦' : method === 'individual' ? '🔄' : '🏃';
    const statusEmoji = success ? '✅' : '❌';
    const itemInfo = itemCount ? ` (${itemCount} items)` : '';
    
    console.log(
      `${methodEmoji}${statusEmoji} ${operation}${itemInfo}: ${metric.duration.toFixed(2)}ms (${method})`
    );

    return metric;
  }

  getBenchmarkReport(): {
    batchStats: { avgDuration: number; successRate: number; operations: number };
    individualStats: { avgDuration: number; successRate: number; operations: number };
    fallbackStats: { avgDuration: number; successRate: number; operations: number };
    recommendation: 'batch' | 'individual' | 'mixed';
  } {
    const batchMetrics = this.metrics.filter(m => m.method === 'batch');
    const individualMetrics = this.metrics.filter(m => m.method === 'individual');
    const fallbackMetrics = this.metrics.filter(m => m.method === 'fallback');

    const calculateStats = (metrics: PerformanceMetric[]) => {
      if (metrics.length === 0) {
        return { avgDuration: 0, successRate: 0, operations: 0 };
      }

      const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
      const successRate = metrics.filter(m => m.success).length / metrics.length;

      return {
        avgDuration: Math.round(avgDuration * 100) / 100,
        successRate: Math.round(successRate * 1000) / 10, // percentage with 1 decimal
        operations: metrics.length,
      };
    };

    const batchStats = calculateStats(batchMetrics);
    const individualStats = calculateStats(individualMetrics);
    const fallbackStats = calculateStats(fallbackMetrics);

    // Determine recommendation based on performance and reliability
    let recommendation: 'batch' | 'individual' | 'mixed' = 'individual';
    
    if (batchStats.operations > 0 && individualStats.operations > 0) {
      // If batch is faster AND reliable (>80% success rate)
      if (batchStats.avgDuration < individualStats.avgDuration && batchStats.successRate > 80) {
        recommendation = 'batch';
      } 
      // If individual is much more reliable (>20% better success rate)
      else if (individualStats.successRate - batchStats.successRate > 20) {
        recommendation = 'individual';
      }
      // Mixed strategy: use batch for bulk operations, individual for single operations
      else {
        recommendation = 'mixed';
      }
    }

    return { batchStats, individualStats, fallbackStats, recommendation };
  }

  getRecentFailures(): PerformanceMetric[] {
    return this.metrics
      .filter(m => !m.success)
      .slice(-10) // Last 10 failures
      .sort((a, b) => b.endTime - a.endTime);
  }

  clearMetrics(): void {
    this.metrics = [];
    console.log('🧹 Performance metrics cleared');
  }

  logPerformanceReport(): void {
    const report = this.getBenchmarkReport();
    
    console.group('📊 Performance Benchmark Report');
    console.log('🔥 Batch Operations:', report.batchStats);
    console.log('🔄 Individual Operations:', report.individualStats);
    console.log('🏃 Fallback Operations:', report.fallbackStats);
    console.log(`💡 Recommendation: Use ${report.recommendation} approach`);
    
    const recentFailures = this.getRecentFailures();
    if (recentFailures.length > 0) {
      console.log('⚠️ Recent Failures:');
      recentFailures.forEach(failure => {
        console.log(`  - ${failure.operation} (${failure.method}): ${failure.error}`);
      });
    }
    
    console.groupEnd();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for easy integration
export const startTimer = (operation: string) => performanceMonitor.startOperation(operation);

export const endTimer = (
  operationId: string,
  operation: string,
  method: 'batch' | 'individual' | 'fallback',
  success: boolean,
  itemCount?: number,
  error?: string
) => performanceMonitor.endOperation(operationId, operation, method, success, itemCount, error);

export const getBenchmarkReport = () => performanceMonitor.getBenchmarkReport();

export const logPerformanceReport = () => performanceMonitor.logPerformanceReport();

// Auto-report performance every 30 seconds in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const report = getBenchmarkReport();
    if (report.batchStats.operations + report.individualStats.operations > 5) {
      logPerformanceReport();
    }
  }, 30000);
}