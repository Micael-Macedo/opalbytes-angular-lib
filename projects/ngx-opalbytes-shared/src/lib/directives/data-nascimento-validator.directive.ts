import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dataNascimentoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const data = control.value.toString().trim();
    const isValid = isValidDataNascimento(data);

    return isValid ? null : { invalidDataNascimento: { value: control.value } };
  };
}

function isValidDataNascimento(data: string): boolean {
  // Aceita formatos: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
  const yyyyMMddFormat = /^(\d{4})-(\d{2})-(\d{2})$/; // YYYY-MM-DD (formato do input type="date")
  const ddMMyyyyFormat = /^(\d{2})[/-](\d{2})[/-](\d{4})$/; // DD/MM/YYYY ou DD-MM-YYYY

  let match: RegExpMatchArray | null = null;
  let day = 0,
    month = 0,
    year = 0;

  // Primeiro tenta YYYY-MM-DD (formato do input type="date")
  match = data.match(yyyyMMddFormat);
  if (match) {
    year = parseInt(match[1]);
    month = parseInt(match[2]);
    day = parseInt(match[3]);
  } else {
    // Tenta DD/MM/YYYY ou DD-MM-YYYY
    match = data.match(ddMMyyyyFormat);
    if (match) {
      day = parseInt(match[1]);
      month = parseInt(match[2]);
      year = parseInt(match[3]);
    }
  }

  if (!match) {return false;}

  // Validação básica de data
  if (month < 1 || month > 12) {return false;}
  if (day < 1 || day > 31) {return false;}

  // Validação de ano (não pode ser futuro e deve ser razoável)
  const currentYear = new Date().getFullYear();
  if (year > currentYear || year < 1900) {return false;}

  // Validação de dias por mês
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    daysInMonth[1] = 29;
  }

  return day <= daysInMonth[month - 1];
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
