import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular-vite';

import { CaoSliderComponent } from './slider';

const COLUMN = 'display:flex;flex-direction:column;gap:40px;max-width:480px;padding:48px 24px 16px';

const meta: Meta<CaoSliderComponent> = {
  title: 'Components/Slider',
  component: CaoSliderComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ReactiveFormsModule] })],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    endValue: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    range: { control: 'boolean' },
    discrete: { control: 'boolean' },
    showTickMarks: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    color: { control: 'color' },
    trackColor: { control: 'color' },
    thumbColor: { control: 'color' },
    trackHeight: { control: 'text' },
    thumbSize: { control: 'text' },
    sliderChange: { action: 'sliderChange' },
    dragStarted: { action: 'dragStarted' },
    dragEnded: { action: 'dragEnded' },
  },
  args: { min: 0, max: 100, step: 1, value: 30, range: false, discrete: false, showTickMarks: false, ariaLabel: 'Volume' },
  render: (args) => ({
    props: args,
    template: `<div style="${COLUMN}"><cao-slider ${argsToTemplate(args)} /></div>`,
  }),
};
export default meta;

type Story = StoryObj<CaoSliderComponent>;

export const Default: Story = {};

export const Discrete: Story = { args: { discrete: true, value: 40 } };

export const TickMarks: Story = { args: { discrete: true, showTickMarks: true, step: 10, value: 50 } };

export const Range: Story = { args: { range: true, discrete: true, value: 25, endValue: 75, ariaLabel: 'Faixa de preço' } };

export const Disabled: Story = { args: { isDisabled: true, value: 60 } };

export const CustomColors: Story = {
  args: { color: '#16a34a', trackColor: '#dcfce7', trackHeight: '8px', thumbSize: '24px', discrete: true, value: 65 },
};

export const FormattedValue: Story = {
  render: () => ({
    props: { money: (value: number) => `R$ ${value.toLocaleString('pt-BR')}` },
    template: `
      <div style="${COLUMN}">
        <cao-slider [min]="0" [max]="5000" [step]="100" [discrete]="true" [displayWith]="money" [value]="1500" ariaLabel="Orçamento" />
      </div>`,
  }),
};

export const WithReactiveForms: Story = {
  render: () => ({
    props: { volume: new FormControl(35, { nonNullable: true }), faixa: new FormControl<[number, number]>([20, 80], { nonNullable: true }) },
    template: `
      <div style="${COLUMN}">
        <cao-slider [formControl]="volume" [discrete]="true" ariaLabel="Volume" />
        <span>Volume: {{ volume.value }}</span>

        <cao-slider [formControl]="faixa" [range]="true" [discrete]="true" ariaLabel="Faixa" />
        <span>Faixa: {{ faixa.value[0] }} – {{ faixa.value[1] }}</span>

        <button type="button" (click)="volume.disabled ? volume.enable() : volume.disable()">Alternar desabilitado</button>
      </div>`,
  }),
};