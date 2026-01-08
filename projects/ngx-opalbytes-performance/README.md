# 📊 ngx-opalbytes-performance

Biblioteca Angular para monitoramento de performance em runtime. Fornece métricas detalhadas de Web Vitals, custom marks/measures, long tasks e uso de memória.

---

## Compatibilidade

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Angular    | ^21.0.0 | Framework principal da biblioteca |
| RxJS       | ~7.8.0 | Programação reativa |

## Instalação

```bash
npm install ngx-opalbytes-performance
```

---

## Funcionalidades

### Web Vitals
- **LCP (Largest Contentful Paint)** - Tempo de carregamento do maior elemento
- **FID (First Input Delay)** - Tempo de resposta à primeira interação
- **CLS (Cumulative Layout Shift)** - Estabilidade visual
- **FCP (First Contentful Paint)** - Tempo para primeiro conteúdo
- **TTFB (Time to First Byte)** - Tempo para primeiro byte
- **INP (Interaction to Next Paint)** - Tempo de interação para próxima pintura

### Performance Metrics
- Custom marks e measures via Performance API
- Detecção de Long Tasks (> 50ms)
- Monitoramento de uso de memória (quando disponível)
- Agregação e exportação de métricas

---

## Uso

### Configuração Básica

```typescript
import { Component, inject } from '@angular/core';
import { PerformanceMetricsService } from 'ngx-opalbytes-performance';

@Component({
  selector: 'app-root',
  template: `...`
})
export class AppComponent {
  private performanceService = inject(PerformanceMetricsService);

  ngOnInit() {
    // Iniciar monitoramento de Web Vitals
    this.performanceService.observeWebVitals().subscribe(vitals => {
      console.log('Web Vitals:', vitals);
    });
  }
}
```

### Custom Marks e Measures

```typescript
import { inject } from '@angular/core';
import { PerformanceMetricsService } from 'ngx-opalbytes-performance';

export class DataService {
  private performanceService = inject(PerformanceMetricsService);

  loadData() {
    this.performanceService.mark('data-fetch-start');

    return this.http.get('/api/data').pipe(
      tap(() => {
        this.performanceService.mark('data-fetch-end');
        this.performanceService.measure(
          'data-fetch-duration',
          'data-fetch-start',
          'data-fetch-end'
        );
      })
    );
  }
}
```

### Monitoramento de Long Tasks

```typescript
import { inject } from '@angular/core';
import { PerformanceObserverService } from 'ngx-opalbytes-performance';

export class MonitoringComponent {
  private observerService = inject(PerformanceObserverService);

  ngOnInit() {
    this.observerService.observeLongTasks().subscribe(longTask => {
      console.warn('Long task detected:', longTask.duration, 'ms');
    });
  }
}
```

### Monitoramento de Memória

```typescript
import { inject } from '@angular/core';
import { MemoryMetricsService } from 'ngx-opalbytes-performance';

export class MemoryMonitoringComponent {
  private memoryService = inject(MemoryMetricsService);

  ngOnInit() {
    // Observar uso de memória a cada 5 segundos
    this.memoryService.observeMemory(5000).subscribe(memoryInfo => {
      console.log('Memory usage:', memoryInfo);

      if (this.memoryService.isCriticalMemoryUsage()) {
        console.error('Critical memory usage detected!');
      }
    });
  }
}
```

---

## API

### PerformanceMetricsService

```typescript
interface PerformanceMetricsService {
  // Web Vitals
  observeWebVitals(): Observable<IWebVitalMetric>;

  // Custom Marks/Measures
  mark(name: string, detail?: unknown): void;
  measure(name: string, startMark: string, endMark: string, detail?: unknown): IPerformanceMeasure | null;

  // Métricas agregadas
  getMetrics(): IPerformanceMetrics;
  clearMetrics(): void;

  // Observadores
  observeLongTasks(): Observable<ILongTaskEntry>;
}
```

### WebVitalsService

```typescript
interface WebVitalsService {
  observeAll(): Observable<IWebVitalMetric>;
  getCurrentVitals(): Promise<IWebVitals>;
}
```

### PerformanceObserverService

```typescript
interface PerformanceObserverService {
  observeLongTasks(): Observable<ILongTaskEntry>;
  disconnect(): void;
  reconnect(): void;
}
```

### MemoryMetricsService

```typescript
interface MemoryMetricsService {
  isMemoryAPIAvailable(): boolean;
  getMemoryInfo(): IMemoryInfo | undefined;
  observeMemory(intervalMs?: number): Observable<IMemoryInfo>;
  getMemoryUsagePercentage(): number | undefined;
  isCriticalMemoryUsage(): boolean;
}
```

---

## Utilitários

### Formatação

```typescript
import {
  formatDuration,
  formatBytes,
  calculatePercentile
} from 'ngx-opalbytes-performance';

const duration = formatDuration(1234); // "1.23s"
const size = formatBytes(1024000); // "1000 KB"
const p95 = calculatePercentile([100, 200, 300], 95); // 290
```

### Agregação de Métricas

```typescript
import { aggregateMetrics } from 'ngx-opalbytes-performance';

const measures = performanceService.getMeasures();
const aggregated = aggregateMetrics(measures);

aggregated.forEach(metric => {
  console.log(`${metric.name}: min=${metric.min}, max=${metric.max}, p95=${metric.p95}`);
});
```

### Score de Performance

```typescript
import { calculatePerformanceScore } from 'ngx-opalbytes-performance';

const vitals = await webVitalsService.getCurrentVitals();
const score = calculatePerformanceScore(vitals); // 0-100

if (score < 50) {
  console.warn('Poor performance detected');
}
```

---

## Modelos de Dados

### IWebVitals

```typescript
interface IWebVitals {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  inp?: number;
}
```

### IPerformanceMetrics

```typescript
interface IPerformanceMetrics {
  timestamp: number;
  marks: IPerformanceMark[];
  measures: IPerformanceMeasure[];
  resources?: PerformanceResourceTiming[];
  navigation?: PerformanceNavigationTiming;
  memory?: IMemoryInfo;
}
```

---

## Contribuir

Siga as [regras de commit do projeto](/README.md#regras-de-commit-com-escopo-obrigatório) usando o escopo `performance`:

```bash
git commit -m "feat(performance): add memory usage tracking"
```

---

## Licença

Esta biblioteca faz parte do monorepo opalbytes-angular-lib.
