import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { BaseTimeRange } from './base-time-range';

const meta: Meta<BaseTimeRange> = {
  title: 'Componentes/Base Time Range',
  component: BaseTimeRange,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    dataCy: { control: 'text' },
    controlName: { control: 'text' },
  },
  args: {
    rangeSelected: fn(),
    label: 'Período',
  },
};

export default meta;
type Story = StoryObj<BaseTimeRange>;

export const Padrao: Story = {
  args: {
    label: 'Período de análise',
  },
};

export const ComMinimoEMaximo: Story = {
  args: {
    label: 'Período de análise',
    minDate: new Date(2026, 0, 1),
    maxDate: new Date(2026, 11, 31),
  },
};

export const ComInicioEFinal: Story = {
  args: {
    label: 'Período de análise',
    startDate: new Date(2026, 2, 1),
    finalDate: new Date(2026, 2, 15),
    minDate: new Date(2026, 0, 1),
    maxDate: new Date(2026, 11, 31),
  },
};

export const ComDataCy: Story = {
  args: {
    label: 'Período de análise',
    dataCy: 'time-range-analise',
    controlName: 'periodo',
  },
};