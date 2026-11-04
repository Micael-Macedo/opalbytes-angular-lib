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
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { LucideDynamicIcon } from "@lucide/angular";
import { Subscription } from "rxjs";

let nextCheckboxId = 0;

export interface ICaoCheckboxChangeEvent {
  checked: boolean;
  source: CaoCheckboxComponent;
}

@Component({
  selector: "cao-checkbox",
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: "./checkbox.component.html",
  styleUrl: "./checkbox.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaoCheckboxComponent),
      multi: true,
    },
  ],
})
export class CaoCheckboxComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  @Input() checked = false;
  @Input() indeterminate = false;
  @Input() isDisabled = false;
  @Input() required = false;
  @Input() label = "";
  @Input() labelPosition: "before" | "after" = "after";
  @Input() name = "";
  @Input() id = "";
  @Input() ariaLabel = "";
  @Input() ariaLabelledBy = "";
  @Input() dataCy = "";
  @Input() control?: AbstractControl | null;
  @Input() errorMessage = "";

  @Input() color?: string;
  @Input() uncheckedColor?: string;
  @Input() disabledColor?: string;
  @Input() labelColor?: string;
  @Input() disabledLabelColor?: string;
  @Input() focusRingColor?: string;

  @Input() size?: string;
  @Input() borderRadius?: string;
  @Input() animationDuration?: string;

  @Input() checkedIcon = "";
  @Input() uncheckedIcon = "";
  @Input() indeterminateIcon = "";
  @Input() isLucideIcon = false;
  @Input() iconColor = "";
  @Input() checkedIconColor = "";
  @Input() uncheckedIconColor = "";
  @Input() iconSize: string | number = 14;
  @Input() iconStrokeWidth: string | number = 2.5;

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
    this.cdr.markForCheck();
  }

  get disabled(): boolean {
    return this.isDisabled;
  }

  @Output() readonly checkedChange = new EventEmitter<boolean>();
  @Output() readonly indeterminateChange = new EventEmitter<boolean>();
  @Output() readonly checkboxChange = new EventEmitter<ICaoCheckboxChangeEvent>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly uid = `cao-checkbox-${nextCheckboxId++}`;
  private controlSub?: Subscription;
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["control"]) {
      this.controlSub?.unsubscribe();
      this.controlSub = this.control?.statusChanges.subscribe(() =>
        this.cdr.markForCheck(),
      );
    }
  }

  ngOnDestroy(): void {
    this.controlSub?.unsubscribe();
  }

  get inputId(): string {
    return this.id || this.uid;
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get hasInvalidState(): boolean {
    return !!(this.control?.touched && this.control?.invalid);
  }

  get hasValidState(): boolean {
    return !!(this.control?.touched && this.control?.valid);
  }

  get resolvedIconColor(): string {
    if (this.indeterminate) {
      return this.iconColor || this.checkedIconColor;
    }

    return this.checked
      ? this.checkedIconColor || this.iconColor
      : this.uncheckedIconColor || this.iconColor;
  }

  @HostBinding("style")
  get hostStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.color) {
      styles["--cao-checkbox-color"] = this.color;
    }
    if (this.uncheckedColor) {
      styles["--cao-checkbox-unselected"] = this.uncheckedColor;
    }
    if (this.disabledColor) {
      styles["--cao-checkbox-disabled"] = this.disabledColor;
    }
    if (this.labelColor) {
      styles["--cao-checkbox-label"] = this.labelColor;
    }
    if (this.disabledLabelColor) {
      styles["--cao-checkbox-label-disabled"] = this.disabledLabelColor;
    }
    if (this.focusRingColor) {
      styles["--cao-checkbox-focus-ring"] = this.focusRingColor;
    }
    if (this.size) {
      styles["--cao-checkbox-size"] = this.size;
    }
    if (this.borderRadius) {
      styles["--cao-checkbox-radius"] = this.borderRadius;
    }
    if (this.animationDuration) {
      styles["--cao-checkbox-duration"] = this.animationDuration;
    }
    if (this.resolvedIconColor) {
      styles["--cao-checkbox-icon-color"] = this.resolvedIconColor;
    }

    styles["--cao-checkbox-icon-size"] = this.toCssLength(this.iconSize);

    return styles;
  }

  toggle(): void {
    if (this.isDisabled) {
      return;
    }

    this.setChecked(!this.checked, true);
  }

  setChecked(value: boolean, emit = true): void {
    if (this.isDisabled) {
      return;
    }

    const wasIndeterminate = this.indeterminate;

    this.checked = value;
    this.indeterminate = false;
    this.onChange(value);

    if (emit) {
      this.checkedChange.emit(value);
      this.checkboxChange.emit({ checked: value, source: this });
    }

    if (wasIndeterminate) {
      this.indeterminateChange.emit(false);
    }

    this.cdr.markForCheck();
  }

  setIndeterminate(value: boolean): void {
    if (this.isDisabled || this.indeterminate === value) {
      return;
    }

    this.indeterminate = value;
    this.indeterminateChange.emit(value);
    this.cdr.markForCheck();
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
    this.setChecked(target.checked, true);
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
}
