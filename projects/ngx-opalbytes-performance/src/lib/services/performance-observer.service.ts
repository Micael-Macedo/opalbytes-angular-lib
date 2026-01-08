import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { ILongTaskEntry } from '../models/performance-metrics.model';

@Injectable({ providedIn: 'root' })
export class PerformanceObserverService {
  private longTaskSubject = new Subject<ILongTaskEntry>();
  public longTasks$ = this.longTaskSubject.asObservable();

  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeLongTaskObserver();
  }

  private initializeLongTaskObserver(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            const longTask: ILongTaskEntry = {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
              attribution: (entry as unknown as { attribution?: ILongTaskEntry['attribution'] }).attribution
            };
            this.longTaskSubject.next(longTask);
          }
        }
      });

      this.observer.observe({ entryTypes: ['longtask'] });
    } catch {
      // Long task API not supported, fail silently
    }
  }

  /**
   * Observe long tasks (tasks taking > 50ms)
   */
  observeLongTasks(): Observable<ILongTaskEntry> {
    return this.longTasks$;
  }

  /**
   * Disconnect the observer
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Reconnect the observer
   */
  reconnect(): void {
    this.disconnect();
    this.initializeLongTaskObserver();
  }
}
