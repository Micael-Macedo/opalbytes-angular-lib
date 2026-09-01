import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoBaseButtonComponent } from './base-button.component';

const meta: Meta<CaoBaseButtonComponent> = {
  title: 'Componentes/Base Button',
  component: CaoBaseButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    buttonText: { control: 'text' },
    btnClass: { control: 'text' },
    tooltip: { control: 'text' },
    leadingIcon: { control: 'text' },
    trailingIcon: { control: 'text' },
    isLucideIcon: { control: 'boolean' },
    iconColor: { control: 'color' },
    isDarkMode: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    strokeWidthIcon: { control: { type: 'number', min: 0.5, max: 3, step: 0.1 } },
    minTextToTooltip: { control: { type: 'number', min: 1, max: 100 } },
    iconSize: { control: { type: 'number', min: 8, max: 64 } },
    dataCy: { control: 'text' },
  },
  args: {
    buttonClick: fn(),
    buttonText: 'Clique!',
  },
};

export default meta;
type Story = StoryObj<CaoBaseButtonComponent>;

export const Padrao: Story = {
  args: {
    buttonText: 'Clique!',
  },
};

export const Principal: Story = {
  args: {
    buttonText: 'Salvar',
    btnClass: 'btn-primary',
  },
};

export const ComLeadingIcon: Story = {
  args: {
    buttonText: 'Salvar',
    leadingIcon: 'Save',
    isLucideIcon: true,
  },
};

export const ComTrailingIcon: Story = {
  args: {
    buttonText: 'Próximo',
    trailingIcon: 'ArrowRight',
    isLucideIcon: true,
  },
};

export const ComAmbosIcones: Story = {
  args: {
    buttonText: 'Enviar',
    leadingIcon: 'Send',
    trailingIcon: 'ArrowRight',
    isLucideIcon: true,
    iconColor: '#f97316',
  },
};

export const Desabilitado: Story = {
  args: {
    buttonText: 'Desabilitado',
    isDisabled: true,
  },
};

export const Carregando: Story = {
  args: {
    buttonText: 'Carregando...',
    isLoading: true,
  },
};

export const ModoEscuro: Story = {
  args: {
    buttonText: 'Tema Escuro',
    isDarkMode: true,
  },
};

export const DesabilitadoComIcone: Story = {
  args: {
    buttonText: 'Bloqueado',
    leadingIcon: 'Lock',
    isLucideIcon: true,
    isDisabled: true,
  },
};