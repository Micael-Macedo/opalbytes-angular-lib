import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoTabPanel } from './tab-panel';

const meta: Meta<CaoTabPanel> = {
  title: 'Componentes/Tab Panel',
  component: CaoTabPanel,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    isLucideIcon: { control: 'boolean' },
    leadingIcon: { control: 'text' },
    trailingIcon: { control: 'text' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    label: 'Conteúdo da aba',
  },
};

export default meta;
type Story = StoryObj<CaoTabPanel>;

export const Padrao: Story = {
  render: (args) => ({
    template: `
      <cao-tab-panel
        [label]="label"
        [isLucideIcon]="isLucideIcon"
        [leadingIcon]="leadingIcon"
        [trailingIcon]="trailingIcon"
        [isDisabled]="isDisabled">
        <p>Este é o conteúdo renderizado pela aba.</p>
      </cao-tab-panel>
    `,
    props: args,
  }),
};

export const ComLeadingIcon: Story = {
  args: { label: 'Início', leadingIcon: 'Home', isLucideIcon: true },
};

export const ComTrailingIcon: Story = {
  args: { label: 'Notificações', trailingIcon: 'Bell', isLucideIcon: true },
};

export const ComAmbosIcones: Story = {
  args: { label: 'Configurações', leadingIcon: 'Settings', trailingIcon: 'ChevronRight', isLucideIcon: true },
};

export const Desabilitado: Story = {
  args: { label: 'Bloqueada', isDisabled: true },
};