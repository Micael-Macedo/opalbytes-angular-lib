import { CommonModule } from "@angular/common";
import {
  Component,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  Optional,
} from "@angular/core";

import { CaoRadioGroupComponent } from "./radio-group.component";

let nextRadioId = 0;

@Component({
  selector: "cao-radio-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./radio-button.component.html",
  styleUrl: "./radio-button.component.css",
})
export class CaoRadioButtonComponent {
  @Input() value: unknown = undefined;
  @Input() label = "";
  @Input() isDisabled = false;
  @Input() labelPosition?: "before" | "after";
  @Input() id = "";
  @Input() name = "";
  @Input() ariaLabel = "";
  @Input() ariaLabelledBy = "";
  @Input() dataCy = "";

  @Input() color?: string;
  @Input() unselectedColor?: string;
  @Input() disabledColor?: string;
  @Input() labelColor?: string;
  @Input() disabledLabelColor?: string;
  @Input() focusRingColor?: string;
  @Input() size?: string;
  @Input() animationDuration?: string;

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  get disabled(): boolean {
    return this.isDisabled;
  }

  private readonly uid = `cao-radio-${nextRadioId++}`;

  constructor(
    @Optional()
    @Inject(forwardRef(() => CaoRadioGroupComponent))
    readonly group: CaoRadioGroupComponent | null,
  ) {}

  get effectiveDisabled(): boolean {
    return this.isDisabled || !!this.group?.isEffectivelyDisabled;
  }

  get effectiveLabelPosition(): "before" | "after" {
    return this.labelPosition ?? this.group?.labelPosition ?? "after";
  }

  get effectiveName(): string {
    return this.name || this.group?.groupName || this.uid;
  }

  get inputId(): string {
    return this.id || this.uid;
  }

  get isSelected(): boolean {
    return this.group?.isValueSelected(this.value) ?? false;
  }

  get isRequired(): boolean {
    return this.group?.required ?? false;
  }

  @HostBinding("style")
  get hostStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.color) {
      styles["--cao-radio-color"] = this.color;
    }
    if (this.unselectedColor) {
      styles["--cao-radio-unselected"] = this.unselectedColor;
    }
    if (this.disabledColor) {
      styles["--cao-radio-disabled"] = this.disabledColor;
    }
    if (this.labelColor) {
      styles["--cao-radio-label"] = this.labelColor;
    }
    if (this.disabledLabelColor) {
      styles["--cao-radio-label-disabled"] = this.disabledLabelColor;
    }
    if (this.focusRingColor) {
      styles["--cao-radio-focus-ring"] = this.focusRingColor;
    }
    if (this.size) {
      styles["--cao-radio-size"] = this.size;
    }
    if (this.animationDuration) {
      styles["--cao-radio-duration"] = this.animationDuration;
    }

    return styles;
  }

  select(): void {
    if (this.effectiveDisabled) {
      return;
    }

    this.group?.select(this);
  }

  onBlur(): void {
    this.group?.markAsTouched();
  }

  enable(): void {
    this.isDisabled = false;
  }

  disable(): void {
    this.isDisabled = true;
  }
}
