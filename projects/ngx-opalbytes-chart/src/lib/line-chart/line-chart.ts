import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  signal,
  computed,
} from "@angular/core";

export interface IChartSeriesPoint {
  name: string | Date;
  value: number;
}

export interface IChartSeries {
  name: string;
  color: string;
  series: IChartSeriesPoint[];
}

interface IComputedPoint {
  x: number;
  y: number;
  value: number;
  label: string;
  seriesName: string;
  color: string;
}

interface IComputedSeries {
  name: string;
  color: string;
  pathD: string;
  points: IComputedPoint[];
}

interface ITooltipEntry {
  name: string;
  color: string;
  value: number;
}

interface IXGroup {
  label: string;
  x: number;
  y: number;
  entries: ITooltipEntry[];
}

@Component({
  selector: "cao-line-chart",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./line-chart.component.html",
  styleUrl: "./line-chart.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoLineChartComponent implements OnChanges, AfterViewInit {
  @Input() data: IChartSeries[] = [];
  @Input() height = 320;
  @Input() yTicks = 6;

  @ViewChild("chartContainer") containerRef!: ElementRef<HTMLDivElement>;

  private width = signal(800);

  readonly paddingLeft = 52;
  readonly paddingRight = 24;
  readonly paddingTop = 16;
  readonly paddingBottom = 36;

  get chartWidth() {
    return this.width() - this.paddingLeft - this.paddingRight;
  }
  get chartHeight() {
    return this.height - this.paddingTop - this.paddingBottom;
  }

  allPoints = signal<{ value: number; name: string | Date }[]>([]);
  computedSeries = signal<IComputedSeries[]>([]);
  yTickValues = signal<{ value: number; y: number }[]>([]);
  xTickValues = signal<{ label: string; x: number }[]>([]);
  xGroups = signal<IXGroup[]>([]);
  activeXIndex = signal<number | null>(null);

  readonly tooltipData = computed<IXGroup | null>(() => {
    const i = this.activeXIndex();
    if (i === null) {return null;}
    return this.xGroups()[i] ?? null;
  });

  readonly tooltipPosition = computed<{ left: number; top: number; flip: boolean } | null>(() => {
    const td = this.tooltipData();
    if (!td) {return null;}
    const flip = td.x > this.width() - 160;
    return { left: td.x, top: Math.max(td.y - 12, 4), flip };
  });

  readonly hoverZones = computed<{ x: number; width: number }[]>(() => {
    const ticks = this.xTickValues();
    if (!ticks.length) {return [];}
    if (ticks.length === 1) {
      return [{ x: this.paddingLeft - 12, width: this.chartWidth + 24 }];
    }
    const step = this.chartWidth / (ticks.length - 1);
    return ticks.map((tick, i) => {
      if (i === 0) {
        return { x: this.paddingLeft - 12, width: step / 2 + 12 };
      }
      if (i === ticks.length - 1) {
        return { x: tick.x - step / 2, width: step / 2 + 12 };
      }
      return { x: tick.x - step / 2, width: step };
    });
  });

  private minVal = 0;
  private maxVal = 0;

  ngOnChanges() {
    this.compute();
  }

  ngAfterViewInit() {
    this.observeWidth();
  }

  private observeWidth() {
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && Math.abs(w - this.width()) > 2) {
        this.width.set(w);
        this.compute();
      }
    });
    ro.observe(this.containerRef.nativeElement);
  }

  private allSeriesPoints(): IChartSeriesPoint[] {
    return this.data.flatMap((s) => s.series);
  }

  private compute() {
    if (!this.data?.length) {return;}

    const allPts = this.allSeriesPoints();
    this.minVal = Math.min(...allPts.map((p) => p.value));
    this.maxVal = Math.max(...allPts.map((p) => p.value));

    const allNames = Array.from(new Set(allPts.map((p) => String(p.name)))).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const xStep = allNames.length > 1 ? this.chartWidth / (allNames.length - 1) : 0;

    const xTickValues = allNames.map((name, i) => ({
      label: this.formatLabel(name),
      x: this.paddingLeft + i * xStep,
    }));

    const series: IComputedSeries[] = this.data.map((s) => {
      const sorted = [...s.series].sort(
        (a, b) => new Date(String(a.name)).getTime() - new Date(String(b.name)).getTime()
      );

      const points: IComputedPoint[] = sorted.map((p) => {
        const xi = allNames.indexOf(String(p.name));
        const x = this.paddingLeft + xi * xStep;
        const y = this.paddingTop + this.chartHeight - this.scaleY(p.value);
        return {
          x,
          y,
          value: p.value,
          label: this.formatLabel(String(p.name)),
          seriesName: s.name,
          color: s.color,
        };
      });

      const pathD = this.smoothPath(points);

      return { name: s.name, color: s.color, pathD, points };
    });

    const xGroups: IXGroup[] = xTickValues.map((tick) => {
      const entries: ITooltipEntry[] = series
        .map((s) => {
          const pt = s.points.find((p) => p.label === tick.label);
          return pt ? { name: s.name, color: s.color, value: pt.value } : null;
        })
        .filter((e): e is ITooltipEntry => e !== null);

      const y =
        series.length > 0
          ? Math.min(
              ...series.map((s) => {
                const pt = s.points.find((p) => p.label === tick.label);
                return pt ? pt.y : this.paddingTop + this.chartHeight;
              })
            )
          : this.paddingTop;

      return { label: tick.label, x: tick.x, y, entries };
    });

    const range = this.maxVal - this.minVal;
    let yTickValues: { value: number; y: number }[] = [];

    const allIntegerValues = allPts.map((p) => Math.round(p.value));
    const uniqueIntegers = Array.from(new Set(allIntegerValues)).sort((a, b) => a - b);
    const isBinaryData =
      uniqueIntegers.length <= 2 && uniqueIntegers.every((v) => v === 0 || v === 1);

    if (isBinaryData) {
      const binaryValues = [0, 1].filter((v) => v >= this.minVal && v <= this.maxVal);

      yTickValues = binaryValues.map((value) => {
        const y = this.paddingTop + this.chartHeight - this.scaleY(value);
        return { value, y };
      });
    } else if (range <= 2) {
      const start = Math.floor(this.minVal);
      const end = Math.ceil(this.maxVal);
      const values = Array.from({ length: end - start + 1 }, (_, i) => start + i);

      yTickValues = values.map((value) => {
        const y = this.paddingTop + this.chartHeight - this.scaleY(value);
        return { value, y };
      });
    } else {
      const step = range / (this.yTicks - 1);
      const tickValues = Array.from({ length: this.yTicks }, (_, i) => {
        const value = this.minVal + step * i;
        return Math.round(value);
      });

      const uniqueTickValues = tickValues.filter(
        (value, index, self) => self.indexOf(value) === index
      );

      yTickValues = uniqueTickValues.map((value) => {
        const y = this.paddingTop + this.chartHeight - this.scaleY(value);
        return { value, y };
      });
    }

    this.computedSeries.set(series);
    this.xTickValues.set(xTickValues);
    this.yTickValues.set(yTickValues);
    this.xGroups.set(xGroups);
  }

  onColumnEnter(index: number) {
    this.activeXIndex.set(index);
  }

  onColumnLeave() {
    this.activeXIndex.set(null);
  }

  private scaleY(value: number): number {
    if (this.maxVal === this.minVal) {return this.chartHeight / 2;}
    return ((value - this.minVal) / (this.maxVal - this.minVal)) * this.chartHeight;
  }

  private smoothPath(points: IComputedPoint[]): string {
    if (points.length === 0) {return "";}
    if (points.length === 1) {return `M ${points[0].x} ${points[0].y}`;}

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX = (curr.x + next.x) / 2;
      d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }

  private formatLabel(name: string): string {
    try {
      const d = new Date(name);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      }
    } catch {}
    return name;
  }

  get svgWidth() {
    return this.width();
  }

  get svgHeight() {
    return this.height;
  }
}
