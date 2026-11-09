import { argsToTemplate, Meta, StoryObj } from '@storybook/angular-vite';

import { CaoProgressSpinnerComponent } from './progress-spinner';

const ROW = 'display:flex;gap:24px;align-items:center;flex-wrap:wrap';

const meta: Meta<CaoProgressSpinnerComponent> = {
  title: 'Componentes/Progress Spinner',
  component: CaoProgressSpinnerComponent,
  tags: ['autodocs'],
  render: (args) => ({ props: args, template: `<cao-progress-spinner ${argsToTemplate(args)} />` }),
  argTypes: {
    mode: { control: 'inline-radio', options: ['determinate', 'indeterminate'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    diameter: { control: { type: 'number', min: 8 } },
    strokeWidth: { control: { type: 'number', min: 0 }, description: '0 = automático (10% do diâmetro).' },
    strokeLinecap: { control: 'inline-radio', options: ['round', 'butt', 'square'] },
    color: { control: 'color' },
    trackColor: { control: 'color' },
    textColor: { control: 'color' },
    animationDuration: { control: 'text' },
    showValue: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    mode: 'indeterminate',
    value: 65,
    diameter: 48,
    strokeWidth: 0,
    strokeLinecap: 'round',
    showValue: false,
    ariaLabel: 'Carregando',
  },
};
export default meta;

type Story = StoryObj<CaoProgressSpinnerComponent>;

export const Indeterminate: Story = {};

export const Determinate: Story = { args: { mode: 'determinate', trackColor: '#e5e7eb' } };

export const WithValue: Story = {
  args: { mode: 'determinate', value: 72, diameter: 96, trackColor: '#e5e7eb', showValue: true },
};

export const CustomColors: Story = {
  args: { mode: 'determinate', value: 60, diameter: 80, color: '#16a34a', trackColor: '#dcfce7', showValue: true },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="${ROW}">
        <cao-progress-spinner [diameter]="16" ariaLabel="Muito pequeno" />
        <cao-progress-spinner [diameter]="24" ariaLabel="Pequeno" />
        <cao-progress-spinner [diameter]="48" ariaLabel="Médio" />
        <cao-progress-spinner [diameter]="80" ariaLabel="Grande" />
        <cao-progress-spinner [diameter]="120" [strokeWidth]="6" ariaLabel="Muito grande" />
      </div>`,
  }),
};

export const StrokeAndLinecap: Story = {
  render: () => ({
    template: `
      <div style="${ROW}">
        <cao-progress-spinner mode="determinate" [value]="70" [diameter]="64" [strokeWidth]="3" trackColor="#e5e7eb" />
        <cao-progress-spinner mode="determinate" [value]="70" [diameter]="64" [strokeWidth]="10" trackColor="#e5e7eb" />
        <cao-progress-spinner mode="determinate" [value]="70" [diameter]="64" [strokeWidth]="10" strokeLinecap="butt" trackColor="#e5e7eb" />
      </div>`,
  }),
};