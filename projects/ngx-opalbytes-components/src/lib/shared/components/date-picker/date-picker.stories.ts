import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoDatePicker } from './date-picker';

const meta: Meta<CaoDatePicker> = {
  title: 'Componentes/Date Picker',
  component: CaoDatePicker,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    inputClass: { control: 'text' },
    errorMessage: { control: 'text' },
    isDisabled: { control: 'boolean' },
    searchMode: { control: 'boolean' },
    showBorder: { control: 'boolean' },
    isLucideIcon: { control: 'boolean' },
    iconColor: { control: 'color' },
    tooltip: { control: 'text' },
    dataCy: { control: 'text' },
    dateHint: { control: 'text' },
    controlName: { control: 'text' },
    openOnFocus: { control: 'boolean' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
  },
  args: {
    valueChange: fn(),
    searchClick: fn(),
    inputChange: fn(),
    leadingIconClick: fn(),
    trailingIconClick: fn(),
    placeholder: 'Data de nascimento',
  },
};

export default meta;
type Story = StoryObj<CaoDatePicker>;

export const Padrao: Story = {
  args: {
    placeholder: 'Selecione uma data',
  },
};

export const ComLeadingIcon: Story = {
  args: {
    placeholder: 'Selecione uma data',
    leadingIcon: 'Calendar',
    isLucideIcon: true,
    iconColor: '#3b82f6',
  },
};

export const ComTrailingIcon: Story = {
  args: {
    placeholder: 'Selecione uma data',
    trailingIcon: 'X',
    isLucideIcon: true,
  },
};

export const ComDataMinimaEMaxima: Story = {
  args: {
    placeholder: 'Selecione uma data',
    minDate: new Date(2026, 0, 1),
    maxDate: new Date(2026, 11, 31),
  },
};

export const ComDica: Story = {
  args: {
    placeholder: 'Selecione uma data',
    dateHint: 'DD/MM/AAAA',
  },
};

export const Desabilitado: Story = {
  args: {
    placeholder: 'Selecione uma data',
    isDisabled: true,
    value: new Date(2026, 0, 15),
  },
};

export const ComErro: Story = {
  args: {
    placeholder: 'Selecione uma data',
    errorMessage: 'Data obrigatória',
  },
};