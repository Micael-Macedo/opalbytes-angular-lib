import { Component } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoFormField } from './form-field';
import { CaoBaseInput } from '../base-input/base-input';
import { CaoError } from '../error/error';
import { CaoHint } from '../hint/hint';

@Component({
  selector: 'cao-form-field-story',
  imports: [ReactiveFormsModule, CaoFormField, CaoBaseInput, CaoError, CaoHint],
  template: `
    <div style="max-width: 420px;">
      <cao-form-field
        [control]="control"
        forId="cao-form-field-story"
        [label]="label"
        [labelInside]="labelInside"
        [hintLabel]="hintLabel"
        [leadingIcon]="leadingIcon"
        [trailingIcon]="trailingIcon"
        [isLucideIcon]="isLucideIcon"
        [iconColor]="iconColor"
        [inputBackground]="inputBackground"
        [borderColor]="borderColor"
        [borderWidth]="borderWidth"
        [borderRadius]="borderRadius"
        [errorColor]="errorColor"
        [labelColor]="labelColor"
        [hintColor]="hintColor"
        [textColor]="textColor"
        [focusBorderColor]="focusBorderColor"
        [successBorderColor]="successBorderColor">
        <cao-input
          [control]="control"
          [isDisabled]="control?.disabled === true"
          [placeholder]="placeholder"
          [mask]="mask"></cao-input>
        <input />
        <cao-hint>{{ hintLabel }}</cao-hint>
        @if (showError) {
          <cao-error>Campo obrigatório</cao-error>
        }
      </cao-form-field>
    </div>
  `,
})
class CaoFormFieldStoryComponent {
  control: AbstractControl = new FormControl('', [Validators.required]);
  label = 'Nome';
  labelInside = false;
  hintLabel = '';
  placeholder = 'Digite aqui...';
  leadingIcon = '';
  trailingIcon = '';
  isLucideIcon = true;
  iconColor = '';
  mask = '';
  showHint = false;
  showError = false;
  inputBackground?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  errorColor?: string;
  labelColor?: string;
  hintColor?: string;
  textColor?: string;
  focusBorderColor?: string;
  successBorderColor?: string;

  constructor() {
    this.control.markAsTouched();
  }
}

const render = (args: Partial<CaoFormFieldStoryComponent>) => ({
  component: CaoFormFieldStoryComponent,
  props: args,
});

const meta: Meta<CaoFormField> = {
  title: 'Componentes/Form Field',
  component: CaoFormField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    labelInside: { control: 'boolean' },
    hintLabel: { control: 'text' },
    forId: { control: 'text' },
    leadingIcon: { control: 'text' },
    trailingIcon: { control: 'text' },
    isLucideIcon: { control: 'boolean' },
    iconColor: { control: 'color' },
    inputBackground: { control: 'color' },
    borderColor: { control: 'color' },
    borderWidth: { control: 'text' },
    borderRadius: { control: 'text' },
    errorColor: { control: 'color' },
    labelColor: { control: 'color' },
    hintColor: { control: 'color' },
    textColor: { control: 'color' },
    focusBorderColor: { control: 'color' },
    successBorderColor: { control: 'color' },
  },
  args: {
    label: 'Nome',
  },
};

export default meta;
type Story = StoryObj<CaoFormField>;

export const Padrao: Story = {
  render: () => render({ label: 'Nome', placeholder: 'Digite seu nome' }),
};

export const LabelDentro: Story = {
  render: () => render({ label: 'Nome', labelInside: true, placeholder: ' ' }),
};

export const ComHint: Story = {
  render: () =>
    render({
      label: 'CEP',
      placeholder: '00000-000',
      hintLabel: 'Formato: 00000-000',
      showHint: true,
    }),
};

export const ComErro: Story = {
  render: () =>
    render({
      label: 'E-mail',
      placeholder: 'Digite seu e-mail',
      showError: true,
    }),
};

export const ComIcones: Story = {
  render: () =>
    render({
      label: 'Buscar',
      placeholder: 'Pesquisar...',
      leadingIcon: 'Search',
      trailingIcon: 'SlidersHorizontal',
      iconColor: '#4f46e5',
    }),
};

export const ComMascaraCPF: Story = {
  render: () =>
    render({
      label: 'CPF',
      placeholder: '000.000.000-00',
      mask: '000.000.000-00',
    }),
};

export const Desabilitado: Story = {
  render: () =>
    render({
      control: new FormControl({ value: '', disabled: true }),
      label: 'Campo bloqueado',
      placeholder: 'Valor indisponível',
    }),
};

export const CoresCustomizadas: Story = {
  render: () =>
    render({
      label: 'Personalizado',
      placeholder: 'Cores via input',
      inputBackground: '#f8fafc',
      borderColor: '#94a3b8',
      borderWidth: '2px',
      borderRadius: '16px',
      errorColor: '#e11d48',
      labelColor: '#0f766e',
      hintColor: '#64748b',
      textColor: '#0f172a',
      focusBorderColor: '#0d9488',
      successBorderColor: '#16a34a',
    }),
};