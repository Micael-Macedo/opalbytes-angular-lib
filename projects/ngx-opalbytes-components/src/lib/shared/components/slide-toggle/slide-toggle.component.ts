import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Input,
  Output,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { LucideDynamicIcon } from "@lucide/angular";

export interface ICaoSlideToggleChangeEvent {
  checked: boolean;
  source: CaoSlideToggleComponent;
}

@Component({
  selector: "cao-slide-toggle",
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: "./slide-toggle.component.html",
  styleUrl: "./slide-toggle.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaoSlideToggleComponent),
      multi: true,
    },
  ],
})
export class CaoSlideToggleComponent implements ControlValueAccessor {
  @Input() checked = false;
  @Input() isDisabled = false;
  @Input() label = "";
  @Input() labelPosition: "before" | "after" = "after";
  @Input() name = "";
  @Input() id = "";
  @Input() ariaLabel = "";
  @Input() dataCy = "";
  @Input() required = false;

  @Input() trackColor?: string;
  @Input() trackCheckedColor?: string;
  @Input() thumbColor?: string;
  @Input() thumbCheckedColor?: string;
  @Input() disabledTrackColor?: string;
  @Input() disabledThumbColor?: string;
  @Input() labelColor?: string;
  @Input() disabledLabelColor?: string;
  @Input() focusRingColor?: string;
  @Input() trackWidth?: string;
  @Input() trackHeight?: string;
  @Input() thumbSize?: string;
  @Input() animationDuration?: string;

  @Input() thumbIcon = "";
  @Input() thumbCheckedIcon = "";
  @Input() isLucideThumbIcon = false;
  @Input() thumbIconColor = "";
  @Input() thumbCheckedIconColor = "";
  @Input() thumbIconSize: string | number = 12;
  @Input() thumbIconStrokeWidth: string | number = 2;

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
    this.cdr.markForCheck();
  }

  get disabled(): boolean {
    return this.isDisabled;
  }

  @Output() readonly checkedChange = new EventEmitter<boolean>();
  @Output() readonly toggleChange = new EventEmitter<ICaoSlideToggleChangeEvent>();

  private readonly cdr = inject(ChangeDetectorRef);
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  get resolvedThumbIcon(): string {
    return this.checked && this.thumbCheckedIcon
      ? this.thumbCheckedIcon
      : this.thumbIcon;
  }

  get resolvedThumbIconColor(): string {
    return this.checked
      ? this.thumbCheckedIconColor || this.thumbIconColor
      : this.thumbIconColor;
  }

  @HostBinding("style")
  get hostStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.trackColor) {
      styles["--cao-slide-toggle-track"] = this.trackColor;
    }
    if (this.trackCheckedColor) {
      styles["--cao-slide-toggle-track-checked"] = this.trackCheckedColor;
    }
    if (this.thumbColor) {
      styles["--cao-slide-toggle-thumb"] = this.thumbColor;
    }
    if (this.thumbCheckedColor) {
      styles["--cao-slide-toggle-thumb-checked"] = this.thumbCheckedColor;
    }
    if (this.disabledTrackColor) {
      styles["--cao-slide-toggle-track-disabled"] = this.disabledTrackColor;
    }
    if (this.disabledThumbColor) {
      styles["--cao-slide-toggle-thumb-disabled"] = this.disabledThumbColor;
    }
    if (this.labelColor) {
      styles["--cao-slide-toggle-label"] = this.labelColor;
    }
    if (this.disabledLabelColor) {
      styles["--cao-slide-toggle-label-disabled"] = this.disabledLabelColor;
    }
    if (this.focusRingColor) {
      styles["--cao-slide-toggle-focus-ring"] = this.focusRingColor;
    }
    if (this.trackWidth) {
      styles["--cao-slide-toggle-track-width"] = this.trackWidth;
    }
    if (this.trackHeight) {
      styles["--cao-slide-toggle-track-height"] = this.trackHeight;
    }
    if (this.thumbSize) {
      styles["--cao-slide-toggle-thumb-size"] = this.thumbSize;
    }
    if (this.animationDuration) {
      styles["--cao-slide-toggle-duration"] = this.animationDuration;
    }
    if (this.resolvedThumbIconColor) {
      styles["--cao-slide-toggle-thumb-icon-color"] = this.resolvedThumbIconColor;
    }

    styles["--cao-slide-toggle-thumb-icon-size"] = this.toCssLength(
      this.thumbIconSize,
    );

    return styles;
  }

  toggle(): void {
    if (this.isDisabled) {
      return;
    }

    this.updateChecked(!this.checked, true);
  }

  setChecked(value: boolean): void {
    if (this.isDisabled) {
      return;
    }

    this.updateChecked(value, true);
  }

  enable(): void {
    this.isDisabled = false;
    this.cdr.markForCheck();
  }

  disable(): void {
    this.isDisabled = true;
    this.cdr.markForCheck();
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateChecked(target.checked, true);
  }

  onEnter(event: Event): void {
    if (this.isDisabled) {
      return;
    }

    event.preventDefault();
    this.toggle();
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: boolean | null): void {
    this.checked = !!value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  private toCssLength(value: string | number): string {
    return typeof value === "number" ? `${value}px` : value;
  }

  private updateChecked(value: boolean, emit: boolean): void {
    if (this.isDisabled) {
      return;
    }

    this.checked = value;
    this.onChange(value);

    if (emit) {
      this.checkedChange.emit(value);
      this.toggleChange.emit({ checked: value, source: this });
    }

    this.cdr.markForCheck();
  }
}
