import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoBaseInput } from './base-input';

const meta: Meta<CaoBaseInput> = {
  title: 'Componentes/Base Input',
  component: CaoBaseInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'textarea', 'number', 'password', 'date'],
    },
    placeholder: { control: 'text' },
    inputClass: { control: 'text' },
    value: { control: 'text' },
    errorMessage: { control: 'text' },
    isDisabled: { control: 'boolean' },
    maxLength: { control: { type: 'number', min: 1 } },
    searchMode: { control: 'boolean' },
    showBorder: { control: 'boolean' },
    isLucideIcon: { control: 'boolean' },
    iconColor: { control: 'color' },
    mask: { control: 'text' },
    tooltip: { control: 'text' },
    dataCy: { control: 'text' },
    textareaRows: { control: 'text' },
    decimalMarker: { control: 'select', options: ['.', ','] },
    thousandSeparator: { control: 'text' },
    allowNegativeNumbers: { control: 'boolean' },
    separatorLimit: { control: 'text' },
  },
  args: {
    valueChange: fn(),
    searchClick: fn(),
    inputChange: fn(),
    placeholder: 'Digite algo...',
  },
};

export default meta;
type Story = StoryObj<CaoBaseInput>;

export const Padrao: Story = {
  args: {
    placeholder: 'Digite seu nome',
    type: 'text',
  },
};

export const ComLeadingIcon: Story = {
  args: {
    placeholder: 'Buscar usuário',
    type: 'text',
    leadingIcon: 'Search',
    isLucideIcon: true,
  },
};

export const ComTrailingIcon: Story = {
  args: {
    placeholder: 'Buscar usuário',
    type: 'text',
    trailingIcon: 'ChevronDown',
    isLucideIcon: true,
  },
};

export const ComAmbosIcones: Story = {
  args: {
    placeholder: 'Valor monetário',
    type: 'text',
    leadingIcon: 'DollarSign',
    trailingIcon: 'X',
    isLucideIcon: true,
  },
};

export const PadraoComIconeSVG: Story = {
  args: {
    placeholder: 'Buscar',
    type: 'text',
    leadingIcon: 'https://lucide.dev/icons/search.svg',
    isLucideIcon: false,
  },
};

export const AreaDeTexto: Story = {
  args: {
    placeholder: 'Descreva o problema...',
    type: 'textarea',
    textareaRows: '4',
  },
};

export const Senha: Story = {
  args: {
    placeholder: 'Digite sua senha',
    type: 'password',
    trailingIcon: 'Eye',
    isLucideIcon: true,
  },
};

export const ModoSearch: Story = {
  args: {
    placeholder: 'Pesquisar itens...',
    type: 'text',
    searchMode: true,
  },
};

export const Desabilitado: Story = {
  args: {
    placeholder: 'Campo desabilitado',
    type: 'text',
    isDisabled: true,
    value: 'Valor bloqueado',
  },
};

export const ComErro: Story = {
  args: {
    placeholder: 'Digite seu e-mail',
    type: 'text',
    errorMessage: 'E-mail obrigatório',
  },
};

export const ComMascara: Story = {
  args: {
    placeholder: '00.000.000/0000-00',
    type: 'text',
    mask: '00.000.000/0000-00',
  },
};