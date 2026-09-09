import { AbstractControl } from '@angular/forms';

import { IFormFieldControl } from './form-field-control';

export interface IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    formFieldControl: IFormFieldControl | null
  ): boolean;
}

export class ErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    formFieldControl: IFormFieldControl | null
  ): boolean {
    if (!control) {
      return false;
    }
    const isSubmitted = formFieldControl && (formFieldControl as any)._isSubmitted;
    return !!(
      control.invalid &&
      (control.touched || control.dirty || isSubmitted)
    );
  }
}

export class ShowOnDirtyErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    formFieldControl: IFormFieldControl | null
  ): boolean {
    if (!control) {
      return false;
    }
    const isSubmitted = formFieldControl && (formFieldControl as any)._isSubmitted;
    return !!(control.invalid && (control.dirty || isSubmitted));
  }
}

export const DEFAULT_ERROR_STATE_MATCHER = new ErrorStateMatcher();
