import { Component, HostBinding, Input } from '@angular/core';
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
  @HostBinding('style')
  get _hostStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.inputBackground !== undefined) {
      styles['--cao-form-field-bg-background'] = this.inputBackground;
    }
    if (this.borderColor !== undefined) {
      styles['--cao-form-field-border-color'] = this.borderColor;
    }
    if (this.borderWidth !== undefined) {
      styles['--cao-form-field-border-width'] = this.borderWidth;
    }
    if (this.borderRadius !== undefined) {
      styles['--cao-form-field-border-radius'] = this.borderRadius;
    }
    if (this.errorColor !== undefined) {
      styles['--cao-form-field-color-error'] = this.errorColor;
    }
    if (this.labelColor !== undefined) {
      styles['--cao-form-field-color-label'] = this.labelColor;
    }
    if (this.hintColor !== undefined) {
      styles['--cao-form-field-color-hint'] = this.hintColor;
    }
    if (this.textColor !== undefined) {
      styles['--cao-form-field-color-text'] = this.textColor;
    }
    if (this.focusBorderColor !== undefined) {
      styles['--cao-form-field-focus-border'] = this.focusBorderColor;
    }
    if (this.successBorderColor !== undefined) {
      styles['--cao-form-field-success-border'] = this.successBorderColor;
    }
    return styles;
  }

  @Input() inputBackground?: string;
  @Input() borderColor?: string;
  @Input() borderWidth?: string;
  @Input() borderRadius?: string;
  @Input() errorColor?: string;
  @Input() labelColor?: string;
  @Input() hintColor?: string;
  @Input() textColor?: string;
  @Input() focusBorderColor?: string;
  @Input() successBorderColor?: string;
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