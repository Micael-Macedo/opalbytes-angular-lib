import { Injectable, inject } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { MemoryMetricsService } from './memory-metrics.service';
import { PerformanceObserverService } from './performance-observer.service';
import { WebVitalsService } from './web-vitals.service';
import { IPerformanceMetrics, IPerformanceMark, IPerformanceMeasure } from '../models/performance-metrics.model';

@Injectable({ providedIn: 'root' })
export class PerformanceMetricsService {
  private webVitalsService = inject(WebVitalsService);
  private observerService = inject(PerformanceObserverService);
  private memoryService = inject(MemoryMetricsService);

  private metricsSubject = new BehaviorSubject<IPerformanceMetrics>({
    timestamp: Date.now(),
    marks: [],
    measures: []
  });

  public metrics$ = this.metricsSubject.asObservable();

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }
  }

  /**
   * Create a performance mark
   */
  mark(name: string, detail?: unknown): void {
    if (!window.performance?.mark) {
      return;
    }

    try {
      performance.mark(name, { detail });
      this.updateMetrics();
    } catch {
      // Mark creation failed, fail silently
    }
  }

  /**
   * Create a performance measure between two marks
   */
  measure(name: string, startMark: string, endMark: string, detail?: unknown): IPerformanceMeasure | null {
    if (!window.performance?.measure) {
      return null;
    }

    try {
      performance.measure(name, {
        start: startMark,
        end: endMark,
        detail
      });
      this.updateMetrics();

      const measures = performance.getEntriesByName(name, 'measure');
      return measures[measures.length - 1] as IPerformanceMeasure;
    } catch {
      return null;
    }
  }

  /**
   * Get all performance marks
   */
  getMarks(): IPerformanceMark[] {
    if (!window.performance?.getEntriesByType) {
      return [];
    }

    return performance.getEntriesByType('mark') as IPerformanceMark[];
  }

  /**
   * Get all performance measures
   */
  getMeasures(): IPerformanceMeasure[] {
    if (!window.performance?.getEntriesByType) {
      return [];
    }

    return performance.getEntriesByType('measure') as IPerformanceMeasure[];
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): IPerformanceMetrics {
    const marks = this.getMarks();
    const measures = this.getMeasures();
    const memory = this.memoryService.getMemoryInfo();

    const navigation = window.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = window.performance?.getEntriesByType('resource') as PerformanceResourceTiming[];

    return {
      timestamp: Date.now(),
      marks,
      measures,
      navigation,
      resources,
      memory
    };
  }

  /**
   * Clear all performance marks and measures
   */
  clearMetrics(): void {
    if (typeof window.performance?.clearMarks === 'function') {
      performance.clearMarks();
    }
    if (typeof window.performance?.clearMeasures === 'function') {
      performance.clearMeasures();
    }
    this.updateMetrics();
  }

  /**
   * Observe Web Vitals metrics
   */
  observeWebVitals(): Observable<unknown> {
    return this.webVitalsService.observeAll();
  }

  /**
   * Observe long tasks
   */
  observeLongTasks(): Observable<unknown> {
    return this.observerService.observeLongTasks();
  }

  private updateMetrics(): void {
    this.metricsSubject.next(this.getMetrics());
  }
}
