import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

import { LucideDynamicIcon } from "@lucide/angular";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";

@Component({
  standalone: true,
  selector: "cao-input",
  templateUrl: "./base-input.html",
  styleUrls: ["./base-input.css"],
  imports: [CommonModule, FormsModule, NgxMaskDirective, MatTooltipModule, LucideDynamicIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CaoBaseInput,
      multi: true,
    },
    provideNgxMask(),
  ],
})
export class CaoBaseInput implements ControlValueAccessor {
  @Input() type = "text";
  @Input() placeholder = "";
  @Input() inputClass = "";
  @Input() value: string | number | boolean | Date = "";
  @Input() errorMessage = "";
  @Input() isDisabled = false;
  @Input() maxLength?: number;
  @Input() searchMode = false;
  @Input() showBorder = false;
  @Input() isLucideIcon = false;
  @Input() iconColor = "";
  @Input() mask?: string;
  @Input() control?: AbstractControl | null;
  @Input() tooltip = "";
  @Input() dataCy?: string = "";
  @Input() textareaRows?: string = "";

  @Input() decimalMarker: "." | "," | [".", ","] = ",";
  @Input() thousandSeparator = ".";
  @Input() allowNegativeNumbers = false;
  @Input() separatorLimit = "";

  @Input() set leadingIcon(value: string) {
    this._leadingIcon = value;
    this.icon = true;
  }

  @Input() set trailingIcon(value: string) {
    this._trailingIcon = value;
    this.icon = true;
  }

  @Output() readonly valueChange = new EventEmitter<string>();
  @Output() readonly searchClick = new EventEmitter<void>();
  @Output() readonly inputChange = new EventEmitter<string>();

  isFocused = false;
  icon = false;
  _leadingIcon?: string;
  _trailingIcon?: string;

  onChange: any = () => { };
  onTouched: any = () => { };

  get hasError() {
    return !!this.errorMessage;
  }

  @Input() controlName = "";

  get controlNameValue(): string {
    return this.controlName;
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  onInputChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.inputChange.emit(newValue);
  }

  onFocus() {
    this.isFocused = true;
    this.onTouched();
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();

    if (this.control?.touched && this.control?.valid && this.control?.value) {
      setTimeout(() => {
        const active = document.activeElement as HTMLElement;
        const current = document.querySelector(`[formcontrolname="${this.controlNameValue}"]`);
        if (!current || !active || !current.contains(active)) {
          this.control?.markAsUntouched();
        }
      });
    }
  }

  onSearchClick() {
    this.searchClick.emit();
  }

  writeValue(value: string | null | undefined): void {
    this.value = value || "";
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
