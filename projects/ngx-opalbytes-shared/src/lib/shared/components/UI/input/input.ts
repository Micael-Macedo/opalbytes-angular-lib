import { Component, Input as NgInput, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true,
    },
  ],
})
export class CustomInput implements ControlValueAccessor {
  @NgInput() id?: string;
  @NgInput() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @NgInput() placeholder?: string;
  @NgInput() disabled = false;
  @NgInput() className = '';

  private innerValue = '';

  // ✅ Implementações não-vazias para evitar o erro do ESLint
  onChange: (value: string) => void = () => void 0;
  onTouched: () => void = () => void 0;

  cn(...classes: (string | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }

  writeValue(value: string): void {
    this.innerValue = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get value(): string {
    return this.innerValue;
  }

  set value(val: string) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.onChange(val);
    }
  }

  handleBlur(): void {
    this.onTouched();
  }
}
