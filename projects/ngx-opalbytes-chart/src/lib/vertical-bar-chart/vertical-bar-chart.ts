import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";

export interface ICaoBarItem {
  label: string;
  value: number;
}

@Component({
  selector: "cao-vertical-bar-chart",
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "vertical-bar-chart.html",
  styleUrls: ["vertical-bar-chart.css"],
})
export class CaoVerticalBarChartComponent implements OnChanges {
  @Input() data: ICaoBarItem[] = [];

  @Input() barColor = "#FFE5CA";

  @Input() barHoverColor = "#FFB871";
  @Input() barTipColor = "#FAB46F";

  @Input() tickCount = 6;
  @Output() readonly mouseEnter = new EventEmitter<MouseEvent>();
  @Output() readonly mouseLeave = new EventEmitter<MouseEvent>();

  yTicks: number[] = [];
  maxValue = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] || changes["tickCount"]) {
      this.buildAxis();
    }
  }

  buildAxis(): void {
    if (!this.data?.length) {
      this.yTicks = [];
      this.maxValue = 0;
      return;
    }

    const dataMax = Math.max(...this.data.map((d) => d.value));
    this.maxValue = dataMax || 1;

    const steps = this.tickCount - 1;
    this.yTicks = Array.from({ length: this.tickCount }, (_, i) =>
      Math.round((dataMax * (steps - i)) / steps)
    );
  }

  getPercent(value: number): number {
    if (!this.maxValue) {return 0;}
    return (value / this.maxValue) * 100;
  }

  onEnter(event: MouseEvent): void {
    this.mouseEnter.emit(event);
  }

  onLeave(event: MouseEvent): void {
    this.mouseLeave.emit(event);
  }
}
