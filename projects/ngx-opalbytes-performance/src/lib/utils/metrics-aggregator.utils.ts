import { IPerformanceMeasure } from '../models/performance-metrics.model';

export interface IAggregatedMetrics {
  name: string;
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  p95: number;
  p99: number;
}

/**
 * Aggregate multiple measurements of the same metric
 */
export function aggregateMetrics(measures: IPerformanceMeasure[]): Map<string, IAggregatedMetrics> {
  const grouped = new Map<string, number[]>();

  // Group by name
  measures.forEach(measure => {
    if (!grouped.has(measure.name)) {
      grouped.set(measure.name, []);
    }
    grouped.get(measure.name)!.push(measure.duration);
  });

  // Calculate aggregations
  const result = new Map<string, IAggregatedMetrics>();

  grouped.forEach((durations, name) => {
    const sorted = [...durations].sort((a, b) => a - b);

    result.set(name, {
      name,
      count: durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      mean: durations.reduce((a, b) => a + b, 0) / durations.length,
      median: getPercentile(sorted, 50),
      p95: getPercentile(sorted, 95),
      p99: getPercentile(sorted, 99)
    });
  });

  return result;
}

function getPercentile(sorted: number[], percentile: number): number {
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) {
    return sorted[lower];
  }

  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
