import { FormsModule } from '@angular/forms';

import {
  LucideCheck,
  LucideCircle,
  LucideHeart,
  LucideMinus,
  LucideX,
  provideLucideIcons,
} from '@lucide/angular';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoCheckboxComponent } from './checkbox.component';

const imageIcon =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="8" fill="%234f46e5"/%3E%3C/svg%3E';

const meta: Meta<CaoCheckboxComponent> = {
  title: 'Componentes/Checkbox',
  component: CaoCheckboxComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideLucideIcons(
          LucideCheck,
          LucideMinus,
          LucideX,
          LucideCircle,
          LucideHeart,
        ),
      ],
    }),
    (story) => ({
      ...story,
      moduleMetadata: {
        imports: [FormsModule],
      },
    }),
  ],
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    labelPosition: { control: 'select', options: ['before', 'after'] },
    name: { control: 'text' },
    id: { control: 'text' },
    ariaLabel: { control: 'text' },
    ariaLabelledBy: { control: 'text' },
    dataCy: { control: 'text' },
    color: { control: 'color' },
    uncheckedColor: { control: 'color' },
    disabledColor: { control: 'color' },
    labelColor: { control: 'color' },
    disabledLabelColor: { control: 'color' },
    focusRingColor: { control: 'color' },
    size: { control: 'text' },
    borderRadius: { control: 'text' },
    animationDuration: { control: 'text' },
    checkedIcon: { control: 'text' },
    uncheckedIcon: { control: 'text' },
    indeterminateIcon: { control: 'text' },
    isLucideIcon: { control: 'boolean' },
    iconColor: { control: 'color' },
    checkedIconColor: { control: 'color' },
    uncheckedIconColor: { control: 'color' },
    iconSize: { control: 'text' },
    iconStrokeWidth: { control: 'text' },
  },
  args: {
    checked: false,
    indeterminate: false,
    isDisabled: false,
    required: false,
    label: 'Aceito os termos',
    labelPosition: 'after',
    checkedIcon: '',
    uncheckedIcon: '',
    indeterminateIcon: '',
    isLucideIcon: false,
    iconColor: '',
    checkedIconColor: '',
    uncheckedIconColor: '',
    iconSize: 14,
    iconStrokeWidth: 2.5,
    checkedChange: fn(),
    indeterminateChange: fn(),
    checkboxChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <cao-checkbox
        [(ngModel)]="checked"
        [indeterminate]="indeterminate"
        [isDisabled]="isDisabled"
        [required]="required"
        [label]="label"
        [labelPosition]="labelPosition"
        [name]="name"
        [id]="id"
        [ariaLabel]="ariaLabel"
        [ariaLabelledBy]="ariaLabelledBy"
        [dataCy]="dataCy"
        [color]="color"
        [uncheckedColor]="uncheckedColor"
        [disabledColor]="disabledColor"
        [labelColor]="labelColor"
        [disabledLabelColor]="disabledLabelColor"
        [focusRingColor]="focusRingColor"
        [size]="size"
        [borderRadius]="borderRadius"
        [animationDuration]="animationDuration"
        [checkedIcon]="checkedIcon"
        [uncheckedIcon]="uncheckedIcon"
        [indeterminateIcon]="indeterminateIcon"
        [isLucideIcon]="isLucideIcon"
        [iconColor]="iconColor"
        [checkedIconColor]="checkedIconColor"
        [uncheckedIconColor]="uncheckedIconColor"
        [iconSize]="iconSize"
        [iconStrokeWidth]="iconStrokeWidth"
        (checkedChange)="checkedChange($event)"
        (indeterminateChange)="indeterminateChange($event)"
        (checkboxChange)="checkboxChange($event)">
      </cao-checkbox>
    `,
  }),
};

export default meta;
type Story = StoryObj<CaoCheckboxComponent>;

export const Padrao: Story = {};

export const Marcado: Story = {
  args: {
    checked: true,
  },
};

export const Indeterminado: Story = {
  args: {
    indeterminate: true,
  },
};

export const Desabilitado: Story = {
  args: {
    isDisabled: true,
  },
};

export const DesabilitadoMarcado: Story = {
  args: {
    checked: true,
    isDisabled: true,
  },
};

export const LabelAntes: Story = {
  args: {
    checked: true,
    labelPosition: 'before',
  },
};

export const Obrigatorio: Story = {
  args: {
    required: true,
    label: 'Campo obrigatório',
  },
};

export const CoresCustomizadas: Story = {
  args: {
    checked: true,
    label: 'Cores customizadas',
    color: '#16a34a',
    uncheckedColor: '#94a3b8',
    labelColor: '#166534',
    focusRingColor: 'rgba(22, 163, 74, 0.35)',
  },
};

export const TamanhoCustomizado: Story = {
  args: {
    checked: true,
    label: 'Tamanho customizado',
    size: '28px',
    borderRadius: '8px',
    animationDuration: '300ms',
    iconSize: 20,
    iconStrokeWidth: 3,
  },
};

export const IconesLucide: Story = {
  args: {
    checked: true,
    label: 'Ícones Lucide',
    checkedIcon: 'check',
    uncheckedIcon: 'x',
    indeterminateIcon: 'minus',
    isLucideIcon: true,
    checkedIconColor: '#ffffff',
    uncheckedIconColor: '#6b7280',
    iconSize: 14,
    iconStrokeWidth: 2.5,
  },
};

export const IconesCustomizados: Story = {
  args: {
    checked: true,
    label: 'Ícones customizados',
    checkedIcon: 'heart',
    uncheckedIcon: 'circle',
    isLucideIcon: true,
    checkedIconColor: '#ffffff',
    uncheckedIconColor: '#db2777',
    color: '#db2777',
    uncheckedColor: '#f9a8d4',
  },
};

export const IconeImagem: Story = {
  args: {
    checked: true,
    label: 'Ícone via URL/data URI',
    checkedIcon: imageIcon,
    uncheckedIcon: imageIcon,
    isLucideIcon: false,
    iconSize: 12,
  },
};
