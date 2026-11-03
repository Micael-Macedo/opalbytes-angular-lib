import { FormsModule } from '@angular/forms';

import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoRadioButtonComponent } from './radio-button.component';
import { CaoRadioGroupComponent } from './radio-group.component';

const meta: Meta<CaoRadioButtonComponent> = {
  title: 'Componentes/Radio Button',
  component: CaoRadioButtonComponent,
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
    labelPosition: { control: 'select', options: ['before', 'after'] },
    isDisabled: { control: 'boolean' },
    disabled: { control: 'boolean' },
    color: { control: 'color' },
    unselectedColor: { control: 'color' },
    disabledColor: { control: 'color' },
    labelColor: { control: 'color' },
    disabledLabelColor: { control: 'color' },
    focusRingColor: { control: 'color' },
    size: { control: 'text' },
    animationDuration: { control: 'text' },
  },
  args: {
    value: 'option-1',
    label: 'Opção selecionada',
    labelPosition: 'after',
    isDisabled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      selectedValue: 'option-1',
    },
    template: `
    <cao-radio-group
      [(ngModel)]="selectedValue"
      [labelPosition]="labelPosition">
      <cao-radio-button
        value="option-1"
        [label]="label"
        [isDisabled]="isDisabled"
        [labelPosition]="labelPosition"
        [color]="color"
        [unselectedColor]="unselectedColor"
        [disabledColor]="disabledColor"
        [labelColor]="labelColor"
        [disabledLabelColor]="disabledLabelColor"
        [focusRingColor]="focusRingColor"
        [size]="size"
        [animationDuration]="animationDuration" />
      <cao-radio-button value="option-2" label="Outra opção" />
    </cao-radio-group>
    <p>Selecionado: {{ selectedValue }}</p>
  `,
  }),
};

export default meta;
type Story = StoryObj<CaoRadioButtonComponent>;

export const Padrao: Story = {};

export const Desabilitado: Story = {
  args: {
    isDisabled: true,
    label: 'Opção desabilitada',
  },
};

export const CoresCustomizadas: Story = {
  args: {
    color: '#16a34a',
    unselectedColor: '#94a3b8',
    labelColor: '#166534',
    size: '24px',
  },
};

export const LabelAntes: Story = {
  args: {
    labelPosition: 'before',
    label: 'Label antes',
  },
};
