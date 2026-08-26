import { CommonModule } from "@angular/common";
import {
  Component,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  inject,
  input,
} from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";

export interface ICaoPieChartItem {
  name: string;
  value: number;
  color: string;
}

interface ICaoSliceData extends ICaoPieChartItem {
  percentage: number;
  startAngle: number;
  endAngle: number;
  path: string;
}

interface ICaoTooltipState {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  value: number;
}

@Component({
  selector: "cao-pie-chart",
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoPieChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly data = input<ICaoPieChartItem[]>([]);
  readonly thickness = input(40);

  @ViewChild("chartWrapper") chartWrapper!: ElementRef<HTMLDivElement>;

  private readonly size = signal(240);
  private resizeObserver: ResizeObserver | null = null;

  slices: ICaoSliceData[] = [];
  total = 0;
  tooltip: ICaoTooltipState = { visible: false, x: 0, y: 0, label: "", value: 0 };
  hoveredIndex = -1;

  constructor() {}

  get svgSize(): number {
    return this.size();
  }

  get cx(): number {
    return this.size() / 2;
  }

  get cy(): number {
    return this.size() / 2;
  }

  get outerRadius(): number {
    return this.size() / 2;
  }

  get innerRadius(): number {
    return this.outerRadius - this.thickness();
  }

  ngAfterViewInit(): void {
    this.buildSlices();
    this.cdr.markForCheck();
    this.observeContainer();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.buildSlices();
    return _changes
  }

  private observeContainer(): void {
    const el = this.chartWrapper?.nativeElement;
    if (!el) {return;}

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {return;}

      const available = Math.min(entry.contentRect.width, entry.contentRect.height);
      const newSize = Math.max(120, Math.floor(available));

      if (Math.abs(newSize - this.size()) > 2) {
        this.size.set(newSize);
        this.buildSlices();
        this.cdr.markForCheck();
      }
    });
    this.resizeObserver.observe(el);
  }

  private buildSlices(): void {
    if (!this.data().length) {
      this.slices = [];
      this.total = 0;
      return;
    }

    this.total = this.data().reduce((sum, item) => sum + item.value, 0);
    if (this.total === 0) {
      this.slices = [];
      return;
    }

    let currentAngle = -Math.PI / 2;
    const gap = this.data().length > 1 ? 0.025 : 0;

    this.slices = this.data().map((item) => {
      const percentage = item.value / this.total;
      const sliceAngle = percentage * 2 * Math.PI - gap;
      const startAngle = currentAngle + gap / 2;
      const endAngle = startAngle + sliceAngle;
      currentAngle = endAngle + gap / 2;

      const path = this.describeArc(
        this.cx,
        this.cy,
        this.outerRadius,
        this.innerRadius,
        startAngle,
        endAngle
      );

      return {
        ...item,
        percentage: Math.round(percentage * 100),
        startAngle,
        endAngle,
        path,
      };
    });
  }

  private describeArc(
    cx: number,
    cy: number,
    outerR: number,
    innerR: number,
    startAngle: number,
    endAngle: number
  ): string {
    const fullCircle = Math.abs(endAngle - startAngle) >= 2 * Math.PI - 0.001;

    if (fullCircle) {
      const mid = startAngle + Math.PI;
      const ox1 = cx + outerR * Math.cos(startAngle);
      const oy1 = cy + outerR * Math.sin(startAngle);
      const ox2 = cx + outerR * Math.cos(mid);
      const oy2 = cy + outerR * Math.sin(mid);
      const ix1 = cx + innerR * Math.cos(startAngle);
      const iy1 = cy + innerR * Math.sin(startAngle);
      const ix2 = cx + innerR * Math.cos(mid);
      const iy2 = cy + innerR * Math.sin(mid);

      return [
        `M ${ox1} ${oy1}`,
        `A ${outerR} ${outerR} 0 0 1 ${ox2} ${oy2}`,
        `A ${outerR} ${outerR} 0 0 1 ${ox1} ${oy1}`,
        `L ${ix1} ${iy1}`,
        `A ${innerR} ${innerR} 0 0 0 ${ix2} ${iy2}`,
        `A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1}`,
        "Z",
      ].join(" ");
    }

    const outerStartX = cx + outerR * Math.cos(startAngle);
    const outerStartY = cy + outerR * Math.sin(startAngle);
    const outerEndX = cx + outerR * Math.cos(endAngle);
    const outerEndY = cy + outerR * Math.sin(endAngle);
    const innerStartX = cx + innerR * Math.cos(startAngle);
    const innerStartY = cy + innerR * Math.sin(startAngle);
    const innerEndX = cx + innerR * Math.cos(endAngle);
    const innerEndY = cy + innerR * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return [
      `M ${outerStartX} ${outerStartY}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
      "Z",
    ].join(" ");
  }

  normalizeColor(color: string): string {
    return color.startsWith("#") ? color : `#${color}`;
  }

  formatTotal(value: number): string {
    if (value >= 1_000_000) {return `${(value / 1_000_000).toFixed(1)  }M`;}
    if (value >= 1_000) {return `${(value / 1_000).toFixed(1)  }K`;}
    return value.toLocaleString("pt-BR");
  }

  formatValue(value: number): string {
    return value.toLocaleString("pt-BR");
  }

  trackByName(_: number, item: ICaoPieChartItem): string {
    return item.name;
  }
}
