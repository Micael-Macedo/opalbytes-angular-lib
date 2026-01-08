export interface IPerformanceMetrics {
  timestamp: number;
  marks: IPerformanceMark[];
  measures: IPerformanceMeasure[];
  resources?: PerformanceResourceTiming[];
  navigation?: PerformanceNavigationTiming;
  memory?: IMemoryInfo;
}

export interface IPerformanceMark {
  name: string;
  startTime: number;
  duration: number;
  detail?: unknown;
}

export interface IPerformanceMeasure {
  name: string;
  startTime: number;
  duration: number;
  detail?: unknown;
}

export interface IMemoryInfo {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

export interface ILongTaskEntry {
  name: string;
  duration: number;
  startTime: number;
  attribution?: ITaskAttributionTiming[];
}

export interface ITaskAttributionTiming {
  name: string;
  containerType: string;
  containerName: string;
  containerId: string;
}
