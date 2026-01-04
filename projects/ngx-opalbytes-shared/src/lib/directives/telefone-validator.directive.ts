import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function telefoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const telefone = control.value.toString().trim();
    const isValid = isValidTelefone(telefone);

    return isValid ? null : { invalidTelefone: { value: control.value } };
  };
}

function isValidTelefone(telefone: string): boolean {
  // Remove caracteres não numéricos
  const cleanTelefone = telefone.replace(/\D/g, '');

  // Verifica se tem 10 ou 11 dígitos (com DDD)
  if (cleanTelefone.length < 10 || cleanTelefone.length > 11) return false;

  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleanTelefone)) return false;

  // Validação de formato (aceita vários formatos)
  // Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX ou XX XXXXX-XXXX ou XX XXXX-XXXX
  const telefonePattern = /^\(?(\d{2})\)?\s?(\d{4,5})-?(\d{4})$/;
  return telefonePattern.test(telefone);
}
