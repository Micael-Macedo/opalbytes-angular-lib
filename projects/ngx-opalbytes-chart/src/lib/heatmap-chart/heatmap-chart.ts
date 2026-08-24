import { CommonModule } from "@angular/common";
import { Component, Input, computed, signal, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";

export type CaoHeatmapMode = "today" | "7days" | "14days";

export interface ICaoHeatmapCell {
  /** Valor de 0 a 3 (índice na escala de calor) */
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

const HOURS = [
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function randomValue(): number {
  const r = Math.random();
  if (r < 0.35) {return 0;}
  if (r < 0.6) {return 1;}
  if (r < 0.82) {return 2;}
  return 3;
}

function makeColumns(labels: string[]): ICaoHeatmapColumn[] {
  return labels.map((label) => ({
    label,
    cells: HOURS.map(() => ({ value: randomValue() })),
  }));
}

function last14DayLabels(): string[] {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
}

function makeDemoConfig(mode: CaoHeatmapMode): ICaoHeatmapConfig {
  const base = {
    rowLabels: HOURS,
    legendMinLabel: "Menor Instabilidade",
    legendMaxLabel: "Maior Instabilidade",
    mode,
  };
  switch (mode) {
    case "today":
      return {
        ...base,
        columns: [{ label: "Hoje", cells: HOURS.map(() => ({ value: randomValue() })) }],
      };
    case "14days":
      return { ...base, columns: makeColumns(last14DayLabels()) };
    default:
      return { ...base, columns: makeColumns(["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]) };
  }
}

@Component({
  selector: "cao-heatmap-chart",
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "heatmap-chart.html",
  styleUrls: ["heatmap-chart.css"],
})
export class CaoHeatmapComponent implements OnInit {
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

  private _demoConfig = signal<ICaoHeatmapConfig>(makeDemoConfig("7days"));

  activeMode = signal<CaoHeatmapMode>("7days");

  // ── Computed ─────────────────────────────────────────────────────────────────

  effectiveCfg = computed<ICaoHeatmapConfig>(() => {
    const ext = this._externalConfig();
    return ext ?? this._demoConfig();
  });

  resolvedColors = computed<[string, string, string, string]>(
    () => this.effectiveCfg().colors ?? this.DEFAULT_COLORS
  );

  gridCols = computed(() => `repeat(${this.effectiveCfg().columns.length}, 1fr)`);

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this._demoConfig.set(makeDemoConfig(this.activeMode()));
  }

  // ── Public ───────────────────────────────────────────────────────────────────

  setMode(mode: CaoHeatmapMode): void {
    this.activeMode.set(mode);

    // Se não há config externa, regenera dados de demo
    if (!this._externalConfig()) {
      this._demoConfig.set(makeDemoConfig(mode));
    }
  }

  colorFor(value: number): string {
    const colors = this.resolvedColors();
    const idx = Math.max(0, Math.min(3, Math.round(value)));
    return colors[idx];
  }
}
