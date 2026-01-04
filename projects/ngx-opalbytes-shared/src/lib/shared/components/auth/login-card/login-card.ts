import {
  Component,
  EventEmitter,
  Output,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {
  emailOrUsernameValidator,
  FormControlStateDirective,
  FormHasErrorsDirective,
} from '@shared/directives/directives';

export interface LoginCredentials {
  login: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    FormControlStateDirective,
    FormHasErrorsDirective,
  ],
  templateUrl: './login-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginCard {
  @Output() login = new EventEmitter<LoginCredentials>();
  className = '';

  // Signals
  isLoading: WritableSignal<boolean> = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  rememberMe = signal(false);

  // validation signals
  loginError = signal<string | null>(null);
  passwordError = signal<string | null>(null);

  form = new FormBuilder().group({
    login: ['', [Validators.required, emailOrUsernameValidator()]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  submit() {
    if (this.isLoading()) return;

    this.form.markAllAsTouched();
    this.loginError.set(null);
    this.passwordError.set(null);

    const loginVal = (this.form.get('login')?.value ?? '').toString().trim();
    const passwordVal = (this.form.get('password')?.value ?? '').toString();

    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.login.emit({
      login: loginVal,
      password: passwordVal,
      rememberMe: this.rememberMe(),
    });
  }

  @Input() set externalLoading(val: boolean) {
    this.isLoading.set(!!val);
  }
  @Input() set externalError(val: string | null) {
    this.error.set(val ?? null);
  }
}
