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

import type { CaoRadioButtonComponent } from "./radio-button.component";

let nextRadioGroupId = 0;

export interface ICaoRadioChangeEvent {
  value: unknown;
  source: CaoRadioButtonComponent;
}

@Component({
  selector: "cao-radio-group",
  standalone: true,
  template: "<ng-content />",
  styleUrl: "./radio-group.component.css",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaoRadioGroupComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoRadioGroupComponent implements ControlValueAccessor {
  @Input() value: unknown = undefined;
  @Input() name = "";
  @Input() isDisabled = false;
  @Input() required = false;
  @Input() orientation: "vertical" | "horizontal" = "vertical";
  @Input() labelPosition: "before" | "after" = "after";
  @Input() compareWith: (option: unknown, value: unknown) => boolean = (
    option,
    value,
  ) => option === value;

  @Input() color?: string;
  @Input() unselectedColor?: string;
  @Input() disabledColor?: string;
  @Input() labelColor?: string;
  @Input() disabledLabelColor?: string;
  @Input() focusRingColor?: string;
  @Input() size?: string;
  @Input() animationDuration?: string;
  @Input() gap?: string;

  @Input() ariaLabel = "";
  @Input() ariaLabelledBy = "";
  @Input() dataCy = "";

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
    this.cdr.markForCheck();
  }

  get disabled(): boolean {
    return this.isDisabled;
  }

  @Output() readonly valueChange = new EventEmitter<unknown>();
  @Output() readonly selectionChange = new EventEmitter<ICaoRadioChangeEvent>();

  readonly resolvedName = `cao-radio-group-${nextRadioGroupId++}`;

  private readonly cdr = inject(ChangeDetectorRef);
  private formDisabled = false;
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  get isEffectivelyDisabled(): boolean {
    return this.isDisabled || this.formDisabled;
  }

  @HostBinding("attr.role")
  readonly role = "radiogroup";

  @HostBinding("class.cao-radio-group--horizontal")
  get isHorizontal(): boolean {
    return this.orientation === "horizontal";
  }

  @HostBinding("class.cao-radio-group--disabled")
  get isDisabledClass(): boolean {
    return this.isEffectivelyDisabled;
  }

  @HostBinding("attr.aria-label")
  get ariaLabelAttr(): string | null {
    return this.ariaLabel || null;
  }

  @HostBinding("attr.aria-labelledby")
  get ariaLabelledByAttr(): string | null {
    return this.ariaLabelledBy || null;
  }

  @HostBinding("attr.aria-disabled")
  get ariaDisabledAttr(): boolean | null {
    return this.isEffectivelyDisabled || null;
  }

  @HostBinding("attr.aria-required")
  get ariaRequiredAttr(): boolean | null {
    return this.required || null;
  }

  @HostBinding("attr.data-cy")
  get dataCyAttr(): string | null {
    return this.dataCy || null;
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
    if (this.gap) {
      styles["--cao-radio-gap"] = this.gap;
    }

    return styles;
  }

  get groupName(): string {
    return this.name || this.resolvedName;
  }

  isValueSelected(value: unknown): boolean {
    return this.compareWith(this.value, value);
  }

  select(button: CaoRadioButtonComponent): void {
    if (this.isEffectivelyDisabled || button.effectiveDisabled) {
      return;
    }

    if (this.compareWith(this.value, button.value)) {
      this.markAsTouched();
      return;
    }

    this.value = button.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.selectionChange.emit({ value: this.value, source: button });
    this.markAsTouched();
    this.cdr.markForCheck();
  }

  markAsTouched(): void {
    this.onTouched();
  }

  enable(): void {
    this.isDisabled = false;
    this.cdr.markForCheck();
  }

  disable(): void {
    this.isDisabled = true;
    this.cdr.markForCheck();
  }

  writeValue(value: unknown): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
    this.cdr.markForCheck();
  }
}
