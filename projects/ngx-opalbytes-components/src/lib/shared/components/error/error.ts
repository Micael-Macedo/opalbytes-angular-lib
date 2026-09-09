import { Component, inject, Input } from '@angular/core';

import { IErrorStateMatcher } from '../form-field/error-state-matcher';
import { CaoFormField } from '../form-field/form-field';

@Component({
  selector: 'cao-error',
  imports: [],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class CaoError {
  @Input() errorStateMatcher?: IErrorStateMatcher;

  private readonly formField = inject(CaoFormField, { optional: true }) as
    | CaoFormField
    | null;

  get control() {
    return this.formField?.control ?? null;
  }

  get hasErrorState(): boolean {
    const control = this.control;
    if (!control) {
      return false;
    }
    const matcher = this.errorStateMatcher ?? this.formField?.errorStateMatcher;
    return matcher
      ? matcher.isErrorState(control, this.formField)
      : !!(control.invalid && (control.touched || control.dirty));
  }
}
