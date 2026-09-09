import { Component, computed, input, Input } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';

import { IErrorStateMatcher } from './error-state-matcher';
import { IFormFieldControl } from './form-field-control';
import { CaoBaseIcon } from '../base-icon/base-icon';

@Component({
  selector: 'cao-form-field',
  imports: [CaoBaseIcon],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class CaoFormField extends CaoBaseIcon implements IFormFieldControl {
  inputBackground = input<string>();
  borderColor = input<string>();
  borderWidth = input<string>();
  borderRadius = input<string>();
  errorColor = input<string>();
  labelColor = input<string>();
  hintColor = input<string>();
  textColor = input<string>();
  focusBorderColor = input<string>();
  successBorderColor = input<string>();

  formFieldStyles = computed(() => {
    const styles: Record<string, string> = {};

    if (this.inputBackground()) {
      styles['--cao-form-field-bg-background'] = this.inputBackground()!;
    }
    if (this.borderColor()) {
      styles['--cao-form-field-border-color'] = this.borderColor()!;
    }
    if (this.borderWidth()) {
      styles['--cao-form-field-border-width'] = this.borderWidth()!;
    }
    if (this.borderRadius()) {
      styles['--cao-form-field-border-radius'] = this.borderRadius()!;
    }
    if (this.errorColor()) {
      styles['--cao-form-field-color-error'] = this.errorColor()!;
    }
    if (this.labelColor()) {
      styles['--cao-form-field-color-label'] = this.labelColor()!;
    }
    if (this.hintColor()) {
      styles['--cao-form-field-color-hint'] = this.hintColor()!;
    }
    if (this.textColor()) {
      styles['--cao-form-field-color-text'] = this.textColor()!;
    }
    if (this.focusBorderColor()) {
      styles['--cao-form-field-focus-border'] = this.focusBorderColor()!;
    }
    if (this.successBorderColor()) {
      styles['--cao-form-field-success-border'] = this.successBorderColor()!;
    }

    return styles;
  });
  @Input() label = '';
  @Input() labelInside = false;
  @Input() hintLabel = '';
  @Input() control: AbstractControl | null = null;
  @Input() forId = '';
  @Input() errorStateMatcher?: IErrorStateMatcher;
  @Input() leadingIcon?: string;
  @Input() trailingIcon?: string;

  _isSubmitted = false;
  _focused = false;

  get id(): string {
    return this.forId;
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  get required(): boolean {
    if (!this.control) {
      return false;
    }
    const hasValidator =
      typeof this.control.hasValidator === 'function'
        ? this.control.hasValidator(Validators.required)
        : false;
    return hasValidator;
  }

  get floating(): boolean {
    return this._focused || !!this.control?.value;
  }

  get errorStateActive(): boolean {
    const control = this.control;
    if (!control) {
      return false;
    }
    const matcher = this.errorStateMatcher;
    return matcher
      ? matcher.isErrorState(control, this)
      : !!(control.invalid && (control.touched || control.dirty || this._isSubmitted));
  }

  onFocusIn(): void {
    this._focused = true;
    if (this.control && !this._isSubmitted) {
      this.control.markAsTouched();
    }
  }

  onFocusOut(): void {
    this._focused = false;
  }
}