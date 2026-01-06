import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "cao-step",
  standalone: true,
  templateUrl: "./step.html",
  styleUrl: "./step.css",
  imports: [CommonModule],
})
export class StepComponent {
  @Input() title = "";
  @Input() isActive = false;
}
