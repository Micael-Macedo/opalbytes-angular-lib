import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '@domain/services/user.service';
import { ToastService } from '@core/services/toast.service';
import { FormErrorService } from '@core/services/form-error.service';
import { User } from '@domain/models/user.model';
import { cpfValidator, passwordValidator, CpfMaskDirective } from '@shared/directives/directives';

// Validador customizado para confirmar senha
function confirmarSenhaValidator(): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const confirmarSenha = control.value.toString().trim();
    const novaSenha = control.parent?.get('novaSenha')?.value?.toString().trim();

    if (!novaSenha) {
      return null; // Se não há senha para comparar, deixa o required validator lidar
    }

    const isValid = confirmarSenha === novaSenha;

    return isValid ? null : { senhasNaoCoincidem: { value: control.value } };
  };
}

@Component({
  selector: 'app-senha-modal',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, CpfMaskDirective],
  templateUrl: './senha-modal.html',
})
export class SenhaModal {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private formErrorService = inject(FormErrorService);
  private ref = inject(MatDialogRef<SenhaModal>);
  private data = inject<{ user: User }>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  form: FormGroup;

  mostrarNovaSenha = signal(false);
  mostrarConfirmar = signal(false);
  isLoading = signal(false);

  constructor() {
    this.form = this.fb.group({
      cpf: ['', [Validators.required, cpfValidator()]],
      dataNascimento: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, passwordValidator()]],
      confirmarNovaSenha: ['', [Validators.required, confirmarSenhaValidator()]],
    });
  }

  toggleVisibilidade(campo: 'novaSenha' | 'confirmarNovaSenha') {
    switch (campo) {
      case 'novaSenha':
        this.mostrarNovaSenha.update((v) => !v);
        break;
      case 'confirmarNovaSenha':
        this.mostrarConfirmar.update((v) => !v);
        break;
    }
  }

  getErrorMessage(field: string): string {
    return this.formErrorService.getErrorMessage(this.form, field);
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const formValue = this.form.value;

    const dataNascimento = new Date(formValue.dataNascimento).toISOString();

    this.userService
      .resetPassword({
        cpf: formValue.cpf,
        dataNascimento: dataNascimento,
        newPassword: formValue.novaSenha,
        confirmPassword: formValue.confirmarNovaSenha,
      })
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  fechar() {
    this.ref.close();
  }
}
