import { AfterContentInit, EventEmitter, Output } from "@angular/core";
import { ContentChildren, Input, QueryList } from "@angular/core";
import { Component } from "@angular/core";
import { StepComponent } from "./step/step";

@Component({
  selector: "cao-stepper",
  standalone: true,
  templateUrl: "./stepper.html",
  styleUrl: "./stepper.css",
})
export class StepperComponent implements AfterContentInit {
  constructor() {}
  @ContentChildren(StepComponent) steps!: QueryList<StepComponent>;
  @Input() title!: string;
  activeStepIndex: number = 0;
  lengthStep: number = 0;
  showLine: boolean = true;

  @Output() readonly maxReachedEvent: EventEmitter<null> = new EventEmitter<null>();

  ngAfterContentInit(): void {
    if (this.steps.length > 0) {
      this.steps.toArray()[0].isActive = true;
      this.lengthStep = this.steps.length;
    }
  }

  nextStep() {
    if (this.steps.length > 0) {
      if (this.activeStepIndex < this.steps.length - 1) {
        this.activeStepIndex++;
        this.steps.toArray()[this.activeStepIndex].isActive = true;
      } else {
        this.maxReachedEvent.emit(null);
      }
    }
  }

  prevStep() {
    if (this.steps.length > 0) {
      if (this.activeStepIndex > 0) {
        this.steps.toArray()[this.activeStepIndex].isActive = false;
        this.activeStepIndex--;
        this.steps.toArray()[this.activeStepIndex].isActive = true;
      }
    }
  }

  resetStepper() {
    this.activeStepIndex = 0;
    this.steps.forEach((step) => (step.isActive = false));
    if (this.steps.length > 0) {
      this.steps.toArray()[0].isActive = true;
    }
  }
}
