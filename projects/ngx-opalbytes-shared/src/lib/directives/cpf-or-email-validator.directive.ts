import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfOrEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().trim();

    // Se contém @, validar como email
    if (value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(value);
      return isValidEmail ? null : { invalidEmail: { value: control.value } };
    }

    // Se não contém @, validar como CPF ou como nome de usuário
    const cpf = value.replace(/\D/g, '');
    const isValidCpf = isValidCPF(cpf);
    if (isValidCpf) {return null;}

    // Permitir usernames (letras, números, ponto, traço e underscore) 3-50 chars
    const usernameRegex = /^[a-zA-Z0-9._-]{3,50}$/;
    const isValidUsername = usernameRegex.test(value);
    return isValidUsername ? null : { invalidLogin: { value: control.value } };
  };
}

function isValidCPF(raw: string): boolean {
  const cpf = raw.replace(/\D/g, '');

  // Verificar se tem 11 dígitos
  if (cpf.length !== 11) {return false;}

  // Verificar se não são todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cpf)) {return false;}

  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {remainder = 0;}
  if (remainder !== parseInt(cpf.charAt(9))) {return false;}

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {remainder = 0;}
  if (remainder !== parseInt(cpf.charAt(10))) {return false;}

  return true;
}
