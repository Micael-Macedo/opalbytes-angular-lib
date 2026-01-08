import { IPerformanceMetrics } from '../models/performance-metrics.model';
import { IWebVitals } from '../models/web-vitals.model';

/**
 * Format milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {return '0 Bytes';}

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))  } ${  sizes[i]}`;
}

/**
 * Calculate percentile from array of numbers
 */
export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) {return 0;}

  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * sorted.length;

  if (Math.floor(index) === index) {
    return sorted[index];
  } else {
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    return (sorted[lower] + sorted[upper]) / 2;
  }
}

/**
 * Export metrics to JSON
 */
export function exportMetricsToJSON(metrics: IPerformanceMetrics): string {
  return JSON.stringify(metrics, null, 2);
}

/**
 * Export Web Vitals to JSON
 */
export function exportWebVitalsToJSON(vitals: IWebVitals): string {
  return JSON.stringify(vitals, null, 2);
}

/**
 * Get performance score (0-100) based on Web Vitals
 */
export function calculatePerformanceScore(vitals: IWebVitals): number {
  let score = 100;

  // LCP scoring
  if (vitals.lcp) {
    if (vitals.lcp > 4000) {score -= 25;}
    else if (vitals.lcp > 2500) {score -= 10;}
  }

  // FID scoring
  if (vitals.fid) {
    if (vitals.fid > 300) {score -= 25;}
    else if (vitals.fid > 100) {score -= 10;}
  }

  // CLS scoring
  if (vitals.cls) {
    if (vitals.cls > 0.25) {score -= 25;}
    else if (vitals.cls > 0.1) {score -= 10;}
  }

  // FCP scoring
  if (vitals.fcp) {
    if (vitals.fcp > 3000) {score -= 15;}
    else if (vitals.fcp > 1800) {score -= 5;}
  }

  return Math.max(0, score);
}
