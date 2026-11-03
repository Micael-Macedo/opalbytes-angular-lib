import { LucideCheck, LucideX, provideLucideIcons } from '@lucide/angular';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoSlideToggleComponent } from './slide-toggle.component';

const imageIcon =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10" fill="%234f46e5"/%3E%3C/svg%3E';

const meta: Meta<CaoSlideToggleComponent> = {
  title: 'Componentes/Slide Toggle',
  component: CaoSlideToggleComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideLucideIcons(LucideCheck, LucideX)],
    }),
  ],
  argTypes: {
    checked: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    labelPosition: { control: 'select', options: ['before', 'after'] },
    trackColor: { control: 'color' },
    trackCheckedColor: { control: 'color' },
    thumbColor: { control: 'color' },
    thumbCheckedColor: { control: 'color' },
    disabledTrackColor: { control: 'color' },
    disabledThumbColor: { control: 'color' },
    labelColor: { control: 'color' },
    disabledLabelColor: { control: 'color' },
    focusRingColor: { control: 'color' },
    trackWidth: { control: 'text' },
    trackHeight: { control: 'text' },
    thumbSize: { control: 'text' },
    animationDuration: { control: 'text' },
    thumbIcon: { control: 'text' },
    thumbCheckedIcon: { control: 'text' },
    isLucideThumbIcon: { control: 'boolean' },
    thumbIconColor: { control: 'color' },
    thumbCheckedIconColor: { control: 'color' },
    thumbIconSize: { control: 'text' },
    thumbIconStrokeWidth: { control: 'text' },
  },
  args: {
    checked: false,
    isDisabled: false,
    label: 'Ativar notificações',
    labelPosition: 'after',
    thumbIcon: '',
    thumbCheckedIcon: '',
    isLucideThumbIcon: false,
    thumbIconColor: '',
    thumbCheckedIconColor: '',
    thumbIconSize: 12,
    thumbIconStrokeWidth: 2,
    checkedChange: fn(),
    toggleChange: fn(),
  },
};

export default meta;
type Story = StoryObj<CaoSlideToggleComponent>;

export const Padrao: Story = {
  args: {
    checked: false,
  },
};

export const Ativado: Story = {
  args: {
    checked: true,
    label: 'Notificações ativadas',
  },
};

export const Desabilitado: Story = {
  args: {
    checked: false,
    isDisabled: true,
    label: 'Desabilitado',
  },
};

export const DesabilitadoAtivado: Story = {
  args: {
    checked: true,
    isDisabled: true,
    label: 'Desabilitado e ativado',
  },
};

export const LabelAntes: Story = {
  args: {
    checked: true,
    label: 'Label antes',
    labelPosition: 'before',
  },
};

export const CoresCustomizadas: Story = {
  args: {
    checked: true,
    label: 'Cores customizadas',
    trackCheckedColor: '#16a34a',
    thumbCheckedColor: '#ffffff',
    trackColor: '#fca5a5',
    thumbColor: '#ffffff',
    labelColor: '#166534',
  },
};

export const TamanhoCustomizado: Story = {
  args: {
    checked: true,
    label: 'Tamanho customizado',
    trackWidth: '52px',
    trackHeight: '28px',
    thumbSize: '22px',
    animationDuration: '300ms',
  },
};

export const IconesLucide: Story = {
  args: {
    checked: true,
    label: 'Notificações ativadas',
    thumbIcon: 'x',
    thumbCheckedIcon: 'check',
    isLucideThumbIcon: true,
    thumbIconColor: '#6b7280',
    thumbCheckedIconColor: '#16a34a',
    thumbIconSize: 12,
    thumbIconStrokeWidth: 2.5,
  },
};

export const IconeImagem: Story = {
  args: {
    checked: true,
    label: 'Ícone via URL',
    thumbIcon: imageIcon,
    thumbCheckedIcon: imageIcon,
    isLucideThumbIcon: false,
    thumbIconSize: 10,
  },
};

export const IconeTamanhoCustomizado: Story = {
  args: {
    checked: true,
    label: 'Ícone maior',
    thumbIcon: 'x',
    thumbCheckedIcon: 'check',
    isLucideThumbIcon: true,
    thumbIconSize: 16,
    thumbIconStrokeWidth: 3,
    trackWidth: '52px',
    trackHeight: '28px',
    thumbSize: '24px',
  },
};
