import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailOrUsernameValidator(): ValidatorFn {
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

    // Se não contém @, validar como nome de usuário
    // Permitir usernames (letras, números, ponto, traço e underscore) 3-50 chars
    const usernameRegex = /^[a-zA-Z0-9._-]{3,50}$/;
    const isValidUsername = usernameRegex.test(value);
    return isValidUsername ? null : { invalidLogin: { value: control.value } };
  };
}
