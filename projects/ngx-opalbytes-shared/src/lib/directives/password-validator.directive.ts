import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordValidatorOptions {
  nomeField?: string;
  sobrenomeField?: string;
  emailField?: string;
}

export function passwordValidator(options?: PasswordValidatorOptions): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const password = control.value.toString().trim();

    // Verificar comprimento mínimo
    if (password.length < 12) {
      return { invalidPassword: { value: control.value, reason: 'minLength' } };
    }

    // Verificar pelo menos 1 maiúscula
    if (!/[A-Z]/.test(password)) {
      return { invalidPassword: { value: control.value, reason: 'noUppercase' } };
    }

    // Verificar pelo menos 1 minúscula
    if (!/[a-z]/.test(password)) {
      return { invalidPassword: { value: control.value, reason: 'noLowercase' } };
    }

    // Verificar pelo menos 1 dígito
    if (!/\d/.test(password)) {
      return { invalidPassword: { value: control.value, reason: 'noDigit' } };
    }

    // Verificar pelo menos 1 símbolo
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return { invalidPassword: { value: control.value, reason: 'noSymbol' } };
    }

    // Verificar se contém nome
    if (options?.nomeField) {
      const nome = control.parent?.get(options.nomeField)?.value?.toString().trim().toLowerCase();
      if (nome && nome.length >= 3) {
        if (password.toLowerCase().includes(nome)) {
          return { invalidPassword: { value: control.value, reason: 'containsNome' } };
        }
      }
    }

    // Verificar se contém sobrenome
    if (options?.sobrenomeField) {
      const sobrenome = control.parent
        ?.get(options.sobrenomeField)
        ?.value?.toString()
        .trim()
        .toLowerCase();
      if (sobrenome && sobrenome.length >= 3) {
        if (password.toLowerCase().includes(sobrenome)) {
          return { invalidPassword: { value: control.value, reason: 'containsSobrenome' } };
        }
      }
    }

    // Verificar se contém parte local do e-mail
    if (options?.emailField) {
      const email = control.parent?.get(options.emailField)?.value?.toString().trim().toLowerCase();
      if (email) {
        const emailLocal = email.split('@')[0];
        if (emailLocal && emailLocal.length >= 3) {
          if (password.toLowerCase().includes(emailLocal)) {
            return { invalidPassword: { value: control.value, reason: 'containsEmail' } };
          }
        }
      }
    }

    // Verificar repetições (ex: aaaa, 1111)
    if (/(.)\1{3,}/.test(password)) {
      return { invalidPassword: { value: control.value, reason: 'hasRepetition' } };
    }

    // Verificar sequências numéricas óbvias (ex: 1234, 4321)
    const sequences = ['0123456789', '9876543210', '1234567890', '0987654321'];
    const passwordLower = password.toLowerCase();
    for (const seq of sequences) {
      for (let i = 0; i <= seq.length - 4; i++) {
        const subSeq = seq.substring(i, i + 4);
        if (
          passwordLower.includes(subSeq) ||
          passwordLower.includes(subSeq.split('').reverse().join(''))
        ) {
          return { invalidPassword: { value: control.value, reason: 'hasSequence' } };
        }
      }
    }

    // Verificar sequências alfabéticas óbvias (ex: abcd, zyxw)
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i <= alphabet.length - 4; i++) {
      const subSeq = alphabet.substring(i, i + 4);
      if (
        passwordLower.includes(subSeq) ||
        passwordLower.includes(subSeq.split('').reverse().join(''))
      ) {
        return { invalidPassword: { value: control.value, reason: 'hasSequence' } };
      }
    }

    return null;
  };
}
