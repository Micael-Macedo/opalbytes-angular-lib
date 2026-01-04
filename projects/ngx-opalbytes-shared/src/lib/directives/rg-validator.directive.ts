import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rgValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const rg = control.value.toString().trim();
    const isValid = isValidRG(rg);

    return isValid ? null : { invalidRg: { value: control.value } };
  };
}

function isValidRG(rg: string): boolean {
  // Remove caracteres não numéricos exceto X
  rg = rg.replace(/[^\dX]/gi, '');

  // Verifica se tem entre 7 e 9 dígitos (mais o X opcional)
  if (rg.length < 7 || rg.length > 10) return false;

  // Verifica se todos os dígitos são iguais (exceto o último que pode ser X)
  const baseDigits = rg.slice(0, -1);
  if (/^(\d)\1+$/.test(baseDigits)) return false;

  // Validação básica de formato (aceita vários formatos de RG)
  // Formato: XX.XXX.XXX-X ou XXXXXXXX-X ou XXXXXXXX
  const rgPattern = /^(\d{1,2}\.?\d{3}\.?\d{3}-?[X\d])$/i;
  return rgPattern.test(rg);
}
