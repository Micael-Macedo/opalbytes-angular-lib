import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const cpf = control.value.toString().trim();
    const isValid = isValidCPF(cpf);

    return isValid ? null : { invalidCpf: { value: control.value } };
  };
}

function isValidCPF(raw: string): boolean {
  const cpf = raw.replace(/\D/g, '');
  if (cpf.length !== 11) {return false;}
  return !/^(\d)\1{10}$/.test(cpf);
}
