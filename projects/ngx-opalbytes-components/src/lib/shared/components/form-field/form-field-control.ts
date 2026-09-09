import { AbstractControl } from '@angular/forms';

export interface IFormFieldControl<T = any> {
  readonly control: AbstractControl<T> | null | undefined;
  readonly id: string;
  readonly label: string;
  readonly labelInside: boolean;
  readonly disabled: boolean;
  readonly required: boolean;
}
