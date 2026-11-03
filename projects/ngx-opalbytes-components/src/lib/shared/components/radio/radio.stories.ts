import { FormsModule } from '@angular/forms';

import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoRadioButtonComponent } from './radio-button.component';
import { CaoRadioGroupComponent } from './radio-group.component';

const meta: Meta<CaoRadioGroupComponent> = {
  title: 'Componentes/Radio',
  component: CaoRadioGroupComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story,
      moduleMetadata: {
        imports: [FormsModule, CaoRadioGroupComponent, CaoRadioButtonComponent],
      },
    }),
  ],
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    labelPosition: { control: 'select', options: ['before', 'after'] },
    isDisabled: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    color: { control: 'color' },
    unselectedColor: { control: 'color' },
    disabledColor: { control: 'color' },
    labelColor: { control: 'color' },
    disabledLabelColor: { control: 'color' },
    focusRingColor: { control: 'color' },
    size: { control: 'text' },
    animationDuration: { control: 'text' },
    gap: { control: 'text' },
  },
  args: {
    value: 'option-1',
    orientation: 'vertical',
    labelPosition: 'after',
    isDisabled: false,
    required: false,
    valueChange: fn(),
    selectionChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <cao-radio-group
        [(ngModel)]="value"
        [orientation]="orientation"
        [labelPosition]="labelPosition"
        [isDisabled]="isDisabled"
        [required]="required"
        [color]="color"
        [unselectedColor]="unselectedColor"
        [disabledColor]="disabledColor"
        [labelColor]="labelColor"
        [disabledLabelColor]="disabledLabelColor"
        [focusRingColor]="focusRingColor"
        [size]="size"
        [animationDuration]="animationDuration"
        [gap]="gap"
        (valueChange)="valueChange($event)"
        (selectionChange)="selectionChange($event)">
        <cao-radio-button value="option-1" label="Opção 1"></cao-radio-button>
        <cao-radio-button value="option-2" label="Opção 2"></cao-radio-button>
        <cao-radio-button value="option-3" label="Opção 3"></cao-radio-button>
      </cao-radio-group>
    `,
  }),
};

export default meta;
type Story = StoryObj<CaoRadioGroupComponent>;

export const Padrao: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    gap: '16px',
  },
};

export const Desabilitado: Story = {
  args: {
    isDisabled: true,
  },
};

export const OpcaoDesabilitada: Story = {
  render: (args) => ({
    props: args,
    template: `
      <cao-radio-group
        [(ngModel)]="value"
        [orientation]="orientation"
        [labelPosition]="labelPosition"
        [isDisabled]="isDisabled"
        [color]="color"
        [unselectedColor]="unselectedColor"
        [disabledColor]="disabledColor"
        (valueChange)="valueChange($event)"
        (selectionChange)="selectionChange($event)">
        <cao-radio-button value="option-1" label="Disponível"></cao-radio-button>
        <cao-radio-button value="option-2" label="Indisponível" [isDisabled]="true"></cao-radio-button>
        <cao-radio-button value="option-3" label="Disponível"></cao-radio-button>
      </cao-radio-group>
    `,
  }),
};

export const CoresCustomizadas: Story = {
  args: {
    color: '#16a34a',
    unselectedColor: '#94a3b8',
    labelColor: '#166534',
    size: '24px',
    gap: '12px',
  },
};

export const LabelAntes: Story = {
  args: {
    labelPosition: 'before',
  },
};
