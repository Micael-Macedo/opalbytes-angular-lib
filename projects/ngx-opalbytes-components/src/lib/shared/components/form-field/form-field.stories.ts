import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoFormField } from './form-field';
import { CaoBaseInput } from '../base-input/base-input';
import { CaoError } from '../error/error';
import { CaoHint } from '../hint/hint';

const storyImports = [ReactiveFormsModule, CaoFormField, CaoBaseInput, CaoHint, CaoError];

const renderFormField = (inner: string, props: Record<string, unknown> = {}) => ({
  template: `<div style="max-width: 420px;">${inner}</div>`,
  moduleMetadata: { imports: storyImports },
  props,
});

const control = () => new FormControl('', [Validators.required]);

const meta: Meta<CaoFormField> = {
  title: 'Componentes/Form Field',
  component: CaoFormField,
  subcomponents: {
    caoBaseInput: CaoBaseInput,
    caoHint: CaoHint,
    caoError: CaoError,
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    labelInside: { control: 'boolean' },
    hintLabel: { control: 'text' },
    leadingIcon: { control: 'text' },
    trailingIcon: { control: 'text' },
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
};

export default meta;
type Story = StoryObj<CaoFormField>;

export const Padrao: Story = {
  render: () =>
    renderFormField(
      `
        <cao-form-field forId="padrao" [label]="'Nome'" [control]="control">
          <cao-input [control]="control" [placeholder]="'Digite seu nome'"></cao-input>
        </cao-form-field>
      `,
      { control: control() }
    ),
};

export const LabelDentro: Story = {
  render: () =>
    renderFormField(
      `
        <cao-form-field forId="label-dentro" [label]="'Nome'" [labelInside]="true" [control]="control">
          <cao-input [control]="control" [placeholder]="' '"></cao-input>
        </cao-form-field>
      `,
      { control: control() }
    ),
};

export const ComHint: Story = {
  render: () =>
    renderFormField(
      `
        <cao-form-field forId="cep" [label]="'CEP'" [control]="control">
          <cao-input [control]="control" [placeholder]="'00000-000'"></cao-input>
          <cao-hint>Formato: 00000-000</cao-hint>
        </cao-form-field>
      `,
      { control: control() }
    ),
};

export const ComErro: Story = {
  render: () => {
    const erroControl = control();
    erroControl.markAsTouched();
    return renderFormField(
      `
        <cao-form-field forId="email" [label]="'E-mail'" [control]="control">
          <cao-input [control]="control" [placeholder]="'Digite seu e-mail'"></cao-input>
          <cao-error>Campo obrigatório</cao-error>
        </cao-form-field>
      `,
      { control: erroControl }
    );
  },
};

export const ComIcones: Story = {
  render: () =>
    renderFormField(
      `
        <cao-form-field
          forId="buscar"
          [label]="'Buscar'"
          leadingIcon="Search"
          trailingIcon="SlidersHorizontal"
          iconColor="#4f46e5"
          [control]="control">
          <cao-input [control]="control" [placeholder]="'Pesquisar...'"></cao-input>
        </cao-form-field>
      `,
      { control: control() }
    ),
};

export const ComMascaraCPF: Story = {
  render: () =>
    renderFormField(
      `
        <cao-form-field forId="cpf" [label]="'CPF'" [control]="control">
          <cao-input
            [control]="control"
            [placeholder]="'000.000.000-00'"
            [mask]="'000.000.000-00'"></cao-input>
        </cao-form-field>
      `,
      { control: control() }
    ),
};

export const Desabilitado: Story = {
  render: () =>
    renderFormField(
      `
        <cao-form-field forId="bloqueado" [label]="'Campo bloqueado'" [control]="control">
          <cao-input [control]="control" [isDisabled]="true" [placeholder]="'Valor indisponível'"></cao-input>
        </cao-form-field>
      `,
      { control: new FormControl({ value: '', disabled: true }) }
    ),
};

export const CoresCustomizadas: Story = {
  render: () => {
    const coresControl = control();
    coresControl.markAsTouched();
    return renderFormField(
      `
        <cao-form-field
          forId="cores"
          [label]="'Personalizado'"
          inputBackground="#f8fafc"
          borderColor="#94a3b8"
          borderWidth="2px"
          borderRadius="16px"
          errorColor="#e11d48"
          labelColor="#0f766e"
          hintColor="#64748b"
          textColor="#0f172a"
          focusBorderColor="#0d9488"
          successBorderColor="#16a34a"
          [control]="control">
          <cao-input [control]="control" [placeholder]="'Cores via input'"></cao-input>
          <cao-hint>Hint customizado</cao-hint>
          <cao-error>Erro customizado</cao-error>
        </cao-form-field>
      `,
      { control: coresControl }
    );
  },
};