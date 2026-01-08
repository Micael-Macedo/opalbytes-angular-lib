export interface IPerformanceConfig {
  enableWebVitals?: boolean;
  enableLongTaskMonitoring?: boolean;
  enableMemoryMonitoring?: boolean;
  longTaskThreshold?: number; // in ms, default 50
  reportingEndpoint?: string;
  sampleRate?: number; // 0-1, percentage of sessions to track
}

export const DEFAULT_PERFORMANCE_CONFIG: IPerformanceConfig = {
  enableWebVitals: true,
  enableLongTaskMonitoring: true,
  enableMemoryMonitoring: true,
  longTaskThreshold: 50,
  sampleRate: 1.0
};
