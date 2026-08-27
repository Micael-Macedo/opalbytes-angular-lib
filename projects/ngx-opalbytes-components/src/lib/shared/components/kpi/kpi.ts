import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";

export interface ICaoImage {
  src: string;
  alt: string;
}
export interface ICaoKPI {
  title: string;
  value: string;
  textColor: string;
  borderColor: string;
  icon: ICaoImage;
}

@Component({
  selector: "cao-kpi",
  imports: [CommonModule],
  templateUrl: "./kpi.html",
  styleUrl: "./kpi.css",
  standalone: true,
})
export class CaoKpi {
  readonly kpiData = input.required<ICaoKPI>();
}
