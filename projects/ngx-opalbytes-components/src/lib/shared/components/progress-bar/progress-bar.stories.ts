import { argsToTemplate, Meta, StoryObj } from '@storybook/angular-vite';

import { CaoProgressBarComponent } from './progress-bar';

const meta: Meta<CaoProgressBarComponent> = {
  title: 'Componentes/Progress Bar',
  component: CaoProgressBarComponent,
  tags: ['autodocs'],
  render: (args) => ({ props: args, template: `<cao-progress-bar ${argsToTemplate(args)} />` }),
  argTypes: {
    mode: { control: 'inline-radio', options: ['determinate', 'indeterminate', 'buffer', 'query'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    bufferValue: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    color: { control: 'color' },
    trackColor: { control: 'color' },
    bufferColor: { control: 'color' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
    animationDuration: { control: 'text' },
    showValue: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: { mode: 'determinate', value: 40, bufferValue: 70, height: '4px', showValue: false, ariaLabel: 'Progresso' },
};
export default meta;

type Story = StoryObj<CaoProgressBarComponent>;

export const Determinate: Story = {};

export const Indeterminate: Story = { args: { mode: 'indeterminate' } };

export const Buffer: Story = { args: { mode: 'buffer', value: 30, bufferValue: 65 } };

export const Query: Story = { args: { mode: 'query' } };

export const WithValue: Story = { args: { value: 72, showValue: true, height: '8px' } };

export const CustomColors: Story = {
  args: { value: 60, color: '#16a34a', trackColor: '#dcfce7', height: '10px', showValue: true },
};

export const Heights: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:480px">
        <cao-progress-bar [value]="60" height="2px" ariaLabel="Fino" />
        <cao-progress-bar [value]="60" height="6px" ariaLabel="Médio" />
        <cao-progress-bar [value]="60" height="14px" ariaLabel="Grosso" />
        <cao-progress-bar [value]="60" height="14px" borderRadius="2px" ariaLabel="Quadrado" />
      </div>`,
  }),
};