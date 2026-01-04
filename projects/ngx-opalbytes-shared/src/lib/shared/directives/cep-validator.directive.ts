import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cepValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const cep = control.value.toString().trim();
    const isValid = isValidCEP(cep);

    return isValid ? null : { invalidCep: { value: control.value } };
  };
}

function isValidCEP(cep: string): boolean {
  // Remove caracteres não numéricos
  const cleanCep = cep.replace(/\D/g, '');

  // Verifica se tem 8 dígitos
  if (cleanCep.length !== 8) return false;

  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1{7}$/.test(cleanCep)) return false;

  // Validação básica de formato (aceita com ou sem máscara)
  // Formato: XXXXX-XXX ou XXXXXXXX
  const cepPattern = /^\d{5}-?\d{3}$/;
  return cepPattern.test(cep);
}
