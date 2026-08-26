import { CommonModule } from "@angular/common";
import { Component, Input, computed, signal, ChangeDetectionStrategy } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";

export type CaoHeatmapMode = "today" | "7days" | "14days";

export interface ICaoHeatmapCell {
  value: number;
}

export interface ICaoHeatmapColumn {
  label: string;
  cells: ICaoHeatmapCell[];
}

export interface ICaoHeatmapConfig {
  rowLabels: string[];
  columns: ICaoHeatmapColumn[];
  legendMinLabel?: string;
  legendMaxLabel?: string;
  colors?: [string, string, string, string];
  mode?: CaoHeatmapMode;
}

@Component({
  selector: "cao-heatmap-chart",
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "heatmap-chart.html",
  styleUrls: ["heatmap-chart.css"],
})
export class CaoHeatmapComponent {
  readonly CELL_H = 10;
  readonly GAP = 2;

  readonly DEFAULT_COLORS: [string, string, string, string] = [
    "#FFE2C5",
    "#FFC183",
    "#FF9021",
    "#F65802",
  ];

  readonly MODES = [
    { label: "Hoje", value: "today" as CaoHeatmapMode },
    { label: "7 dias", value: "7days" as CaoHeatmapMode },
    { label: "14 dias", value: "14days" as CaoHeatmapMode },
  ];

  @Input()
  set config(v: ICaoHeatmapConfig) {
    this._externalConfig.set(v);
    if (v.mode) {this.activeMode.set(v.mode);}
  }

  private _externalConfig = signal<ICaoHeatmapConfig | null>(null);

  activeMode = signal<CaoHeatmapMode>("7days");

  effectiveCfg = computed<ICaoHeatmapConfig>(() => {
    const ext = this._externalConfig();
    return ext!;
  });

  resolvedColors = computed<[string, string, string, string]>(
    () => this.effectiveCfg().colors ?? this.DEFAULT_COLORS
  );

  readonly hasData = computed(() => {
    const cfg = this._externalConfig();
    return !!cfg && cfg.columns.length > 0;
  });

  gridCols = computed(() => `repeat(${this.effectiveCfg().columns.length}, 1fr)`);

  setMode(mode: CaoHeatmapMode): void {
    this.activeMode.set(mode);
  }

  colorFor(value: number): string {
    const colors = this.resolvedColors();
    const idx = Math.max(0, Math.min(3, Math.round(value)));
    return colors[idx];
  }
}
