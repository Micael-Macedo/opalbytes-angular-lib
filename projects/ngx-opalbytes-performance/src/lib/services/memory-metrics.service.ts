import { Injectable } from '@angular/core';

import { Observable, interval } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { IMemoryInfo } from '../models/performance-metrics.model';

// Extend Window interface to include memory property
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class MemoryMetricsService {
  /**
   * Check if memory API is available
   */
  isMemoryAPIAvailable(): boolean {
    return typeof window !== 'undefined' &&
           window.performance?.memory !== undefined;
  }

  /**
   * Get current memory information
   */
  getMemoryInfo(): IMemoryInfo | undefined {
    if (!this.isMemoryAPIAvailable()) {
      return undefined;
    }

    const memory = window.performance.memory;
    if (!memory) {
      return undefined;
    }

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };
  }

  /**
   * Observe memory usage over time
   * @param intervalMs - Interval in milliseconds to check memory (default: 5000)
   */
  observeMemory(intervalMs = 5000): Observable<IMemoryInfo> {
    return interval(intervalMs).pipe(
      map(() => this.getMemoryInfo()),
      filter((info): info is IMemoryInfo => info !== undefined)
    );
  }

  /**
   * Get memory usage percentage
   */
  getMemoryUsagePercentage(): number | undefined {
    const info = this.getMemoryInfo();

    if (!info || !info.usedJSHeapSize || !info.jsHeapSizeLimit) {
      return undefined;
    }

    return (info.usedJSHeapSize / info.jsHeapSizeLimit) * 100;
  }

  /**
   * Check if memory usage is critical (> 90%)
   */
  isCriticalMemoryUsage(): boolean {
    const percentage = this.getMemoryUsagePercentage();
    return percentage !== undefined && percentage > 90;
  }
}
