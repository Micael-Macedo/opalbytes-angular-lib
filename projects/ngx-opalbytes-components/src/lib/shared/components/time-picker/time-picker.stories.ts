import { FormControl } from '@angular/forms';

import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { TimePicker } from './time-picker';

const meta: Meta<TimePicker> = {
  title: 'Componentes/Time Picker',
  component: TimePicker,
  tags: ['autodocs'],
  argTypes: {
    isDisabled: { control: 'boolean' },
    dataCy: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
  },
  args: {
    timeChange: fn(),
    min: '07:00',
    max: '23:00',
  },
};

export default meta;
type Story = StoryObj<TimePicker>;

export const Padrao: Story = {
  args: {
    min: '07:00',
    max: '23:00',
  },
};

export const ComMinimoEMaximo: Story = {
  args: {
    min: '09:00',
    max: '18:00',
  },
};

export const ComValor: Story = {
  render: (args) => ({
    template: `
      <cao-time-picker
        [control]="control"
        [min]="min"
        [max]="max"
        [isDisabled]="isDisabled"
        (timeChange)="timeChange($event)" />
    `,
    props: {
      control: new FormControl<Date | null>(new Date(2026, 0, 1, 14, 30)),
      min: args.min,
      max: args.max,
      isDisabled: args.isDisabled,
      timeChange: fn(),
    },
  }),
};

export const Desabilitado: Story = {
  args: {
    isDisabled: true,
  },
};