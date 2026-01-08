import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { onLCP, onCLS, onFCP, onTTFB, onINP, Metric } from 'web-vitals';

import { IWebVitals, IWebVitalMetric, WEB_VITALS_THRESHOLDS } from '../models/web-vitals.model';

@Injectable({ providedIn: 'root' })
export class WebVitalsService {
  private vitalsSubject = new Subject<IWebVitalMetric>();
  public vitals$ = this.vitalsSubject.asObservable();

  constructor() {
    this.initializeWebVitals();
  }

  private initializeWebVitals(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Observe all Web Vitals
    onLCP(this.handleMetric.bind(this));
    onCLS(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));
  }

  private handleMetric(metric: Metric): void {
    const rating = this.getRating(metric.name as keyof typeof WEB_VITALS_THRESHOLDS, metric.value);

    const webVitalMetric: IWebVitalMetric = {
      name: metric.name as IWebVitalMetric['name'],
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType as IWebVitalMetric['navigationType']
    };

    this.vitalsSubject.next(webVitalMetric);
  }

  private getRating(name: keyof typeof WEB_VITALS_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = WEB_VITALS_THRESHOLDS[name];

    if (value <= thresholds.good) {
      return 'good';
    } else if (value <= thresholds.poor) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  }

  /**
   * Observe all Web Vitals as a stream
   */
  observeAll(): Observable<IWebVitalMetric> {
    return this.vitals$;
  }

  /**
   * Get current Web Vitals snapshot
   */
  getCurrentVitals(): Promise<IWebVitals> {
    return new Promise((resolve) => {
      const vitals: IWebVitals = {};
      let collected = 0;
      const expectedMetrics = 5;

      const timeout = setTimeout(() => {
        resolve(vitals);
      }, 3000);

      const handleMetric = (metric: Metric) => {
        switch (metric.name) {
          case 'LCP':
            vitals.lcp = metric.value;
            break;
          case 'CLS':
            vitals.cls = metric.value;
            break;
          case 'FCP':
            vitals.fcp = metric.value;
            break;
          case 'TTFB':
            vitals.ttfb = metric.value;
            break;
          case 'INP':
            vitals.inp = metric.value;
            break;
        }

        collected++;
        if (collected >= expectedMetrics) {
          clearTimeout(timeout);
          resolve(vitals);
        }
      };

      onLCP(handleMetric);
      onCLS(handleMetric);
      onFCP(handleMetric);
      onTTFB(handleMetric);
      onINP(handleMetric);
    });
  }
}
