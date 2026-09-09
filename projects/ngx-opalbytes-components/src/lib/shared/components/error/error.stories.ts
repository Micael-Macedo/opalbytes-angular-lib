import { Component } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoError } from './error';
import { CaoBaseInput } from '../base-input/base-input';
import { CaoFormField } from '../form-field/form-field';

@Component({
  selector: 'cao-error-story',
  imports: [ReactiveFormsModule, CaoFormField, CaoBaseInput, CaoError],
  template: `
    <div style="max-width: 420px; display: flex; flex-direction: column; gap: 24px;">
      <cao-form-field [control]="requiredControl" label="E-mail">
        <cao-input [control]="requiredControl" placeholder="Digite seu e-mail"></cao-input>
        <cao-error>O campo é obrigatório</cao-error>
      </cao-form-field>
      <cao-form-field [control]="patternControl" label="CPF">
        <cao-input [control]="patternControl" placeholder="000.000.000-00"></cao-input>
        @if (patternControl.hasError('pattern')) {
          <cao-error>Formato de CPF inválido</cao-error>
        }
      </cao-form-field>
    </div>
  `,
})
class CaoErrorStoryComponent {
  requiredControl: AbstractControl = new FormControl('', [Validators.required]);
  patternControl: AbstractControl = new FormControl('', [
    Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  ]);

  constructor() {
    this.requiredControl.markAsTouched();
    this.patternControl.markAsTouched();
  }
}

const render = () => ({
  component: CaoErrorStoryComponent,
});

const meta: Meta<CaoError> = {
  title: 'Componentes/Error',
  component: CaoError,
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<CaoError>;

export const ErroObrigatorio: Story = {
  render,
};

export const ErroPorPadrao: Story = {
  args: {},
  render,
};