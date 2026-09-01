import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoAutocompleteComponent, ICaoAutoCompleteOption } from './autocomplete.component';

const defaultOptions: ICaoAutoCompleteOption[] = [
  { id: 1, nome: 'João Silva' },
  { id: 2, nome: 'Maria Souza' },
  { id: 3, nome: 'Pedro Santos' },
  { id: 4, nome: 'Ana Oliveira' },
];

const optionsWithIcons: ICaoAutoCompleteOption[] = [
  { id: 1, nome: 'João Silva', icon: 'User' },
  { id: 2, nome: 'Maria Souza', icon: 'User' },
  { id: 3, nome: 'Pedro Santos', icon: 'User' },
  { id: 4, nome: 'Ana Oliveira', icon: 'User' },
];

const meta: Meta<CaoAutocompleteComponent> = {
  title: 'Componentes/Autocomplete',
  component: CaoAutocompleteComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    options: { control: 'object' },
    dataCy: { control: 'text' },
    controlName: { control: 'text' },
    isLucideIcon: { control: 'boolean' },
    iconColor: { control: 'color' },
    optionIcon: { control: 'text' },
    optionIConColor: { control: 'color' },
    isLucideOptionIcon: { control: 'boolean' },
    autocompleteBgColor: { control: 'color' },
    strokeWidthIcon: { control: { type: 'number', min: 0.5, max: 3, step: 0.1 } },
    isDisabled: { control: 'boolean' },
    inputHeigth: { control: 'text' },
    iconSize: { control: { type: 'number', min: 8, max: 48 } },
    showCheckIcon: { control: 'boolean' },
    isLucideCheckIcon: { control: 'boolean' },
  },
  args: {
    itemSelected: fn(),
    blurEvent: fn(),
    focusEvent: fn(),
    leadingIconClick: fn(),
    trailingIconClick: fn(),
    label: 'Selecione um usuário',
    placeholder: 'Buscar usuário...',
    options: defaultOptions,
  },
};

export default meta;
type Story = StoryObj<CaoAutocompleteComponent>;

export const Padrao: Story = {
  args: {
    label: 'Usuários',
    placeholder: 'Buscar usuário...',
    options: defaultOptions,
  },
};

export const ComLeadingIcon: Story = {
  args: {
    label: 'Usuários',
    placeholder: 'Buscar usuário...',
    options: defaultOptions,
    _leadingIcon: 'Search',
    isLucideIcon: true,
    iconColor: '#6b7280',
  },
};

export const ComLeadingETrailingIcons: Story = {
  args: {
    label: 'Usuários',
    placeholder: 'Buscar usuário...',
    options: defaultOptions,
    _leadingIcon: 'Search',
    _trailingIcon: 'ChevronsUpDown',
    isLucideIcon: true,
  },
};

export const ComIconesNasOpcoes: Story = {
  args: {
    label: 'Usuários',
    placeholder: 'Buscar usuário...',
    options: optionsWithIcons,
    optionIcon: 'User',
    isLucideOptionIcon: true,
    optionIConColor: '#f97316',
  },
};

export const Desabilitado: Story = {
  args: {
    label: 'Usuários',
    placeholder: 'Buscar usuário...',
    options: defaultOptions,
    isDisabled: true,
  },
};

export const AlturaPersonalizada: Story = {
  args: {
    label: 'Usuários',
    placeholder: 'Buscar usuário...',
    options: defaultOptions,
    inputHeigth: '70px',
  },
};

export const IconeCheckOculto: Story = {
  args: {
    label: 'Usuários',
    placeholder: 'Buscar usuário...',
    options: defaultOptions,
    showCheckIcon: false,
  },
};

export const FundoPersonalizado: Story = {
  args: {
    label: 'Usuários',
    placeholder: 'Buscar usuário...',
    options: defaultOptions,
    autocompleteBgColor: '#f3f4f6',
  },
};