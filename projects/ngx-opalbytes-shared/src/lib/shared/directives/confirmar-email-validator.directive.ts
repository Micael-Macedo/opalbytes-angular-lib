import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmarEmailValidator(emailField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const confirmarEmail = control.value.toString().trim();
    const email = control.parent?.get(emailField)?.value?.toString().trim();

    if (!email) {
      return null; // Se não há email para comparar, deixa o required validator lidar
    }

    const isValid = confirmarEmail === email;

    return isValid ? null : { emailsNaoCoincidem: { value: control.value } };
  };
}
