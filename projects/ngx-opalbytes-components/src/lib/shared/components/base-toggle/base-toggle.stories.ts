import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoBaseToggleComponent } from './base-toggle.component';

const meta: Meta<CaoBaseToggleComponent> = {
  title: 'Componentes/Base Toggle',
  component: CaoBaseToggleComponent,
  tags: ['autodocs'],
  argTypes: {
    isChecked: { control: 'boolean' },
    checkedTextPlaceholder: { control: 'text' },
    uncheckedTextPlaceholder: { control: 'text' },
    isDisabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    statusChanged: fn(),
    valueChange: fn(),
    searchClick: fn(),
    inputChange: fn(),
    checkedTextPlaceholder: 'Ligado',
    uncheckedTextPlaceholder: 'Desligado',
  },
};

export default meta;
type Story = StoryObj<CaoBaseToggleComponent>;

export const Padrao: Story = {
  args: {
    isChecked: false,
  },
};

export const Ativado: Story = {
  args: {
    isChecked: true,
    checkedTextPlaceholder: 'Módulo',
  },
};

export const Desabilitado: Story = {
  args: {
    isChecked: true,
    isDisabled: true,
  },
};

export const DesabilitadoSemChecagem: Story = {
  args: {
    isChecked: false,
    isDisabled: true,
  },
};

export const ComPlaceholderPersonalizado: Story = {
  args: {
    isChecked: false,
    uncheckedTextPlaceholder: 'Notificações push',
  },
};