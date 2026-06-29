import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LucideDynamicIcon } from '@lucide/angular';

import { MaterialModule } from "../../../material.module";

@Component({
  selector: 'cao-date-picker',
  imports: [CommonModule, FormsModule, MatTooltipModule, LucideDynamicIcon, MaterialModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CaoDatePicker,
      multi: true,
    },
  ],
})
export class CaoDatePicker implements ControlValueAccessor {
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
  @Input() control?: AbstractControl | null;
  @Input() tooltip = "";
  @Input() dataCy?: string = "";
  @Input() dateHint?: string;
  @Input() controlName = "";

  @Input() openOnFocus = true;

  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

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
  @Output() readonly leadingIconClick = new EventEmitter<MouseEvent | Event>();
  @Output() readonly trailingIconClick = new EventEmitter<MouseEvent | Event>();

  @ViewChild('pickerCao') picker!: MatDatepicker<Date>;

  isFocused = false;
  icon = false;
  _leadingIcon?: string;
  _trailingIcon?: string;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get controlNameValue(): string {
    return this.controlName;
  }

  onInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  onInputChange(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.inputChange.emit(newValue);
  }

  onFocus(): void {
    this.isFocused = true;

    if (this.openOnFocus && this.picker && !this.picker.opened) {
      this.picker.open();
    }

    this.onTouched();
  }

  onBlur(): void {
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

  onSearchClick(): void {
    this.searchClick.emit();
  }

  onLeadingIconClick(event: MouseEvent | Event): void {
    event.stopPropagation();
    this.leadingIconClick.emit(event);
  }
  onTrailingIconClick(event: MouseEvent | Event): void {
    event.stopPropagation();
    this.trailingIconClick.emit(event);
  }

  openPicker(): void {
    if (this.picker && !this.picker.opened) {
      this.picker.open();
    }
  }

  closePicker(): void {
    if (this.picker?.opened) {
      this.picker.close();
    }
  }

  clearValue(): void {
    this.value = "";
    this.onChange(null);
    this.onTouched();
    this.valueChange.emit("");
  }

  writeValue(value: string | null | undefined): void {
    this.value = value || "";
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}