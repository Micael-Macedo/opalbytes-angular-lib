import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoTabGroup } from './tab-group';
import { CaoTabPanel } from '../tab-panel/tab-panel';

const renderTabs = (panels: string) => ({
  template: `<cao-tab-group>${panels}</cao-tab-group>`,
  moduleMetadata: { imports: [CaoTabGroup, CaoTabPanel] },
});

const defaultPanels = `
  <cao-tab-panel label="Aba 1"><p>Conteúdo da primeira aba.</p></cao-tab-panel>
  <cao-tab-panel label="Aba 2"><p>Conteúdo da segunda aba.</p></cao-tab-panel>
  <cao-tab-panel label="Aba 3"><p>Conteúdo da terceira aba.</p></cao-tab-panel>
`;

const panelsWithIcons = `
  <cao-tab-panel label="Início" leadingIcon="Home"><p>Conteúdo de início.</p></cao-tab-panel>
  <cao-tab-panel label="Buscar" leadingIcon="Search"><p>Conteúdo de busca.</p></cao-tab-panel>
  <cao-tab-panel label="Configurações" leadingIcon="Settings"><p>Conteúdo de configurações.</p></cao-tab-panel>
`;

const meta: Meta<CaoTabGroup> = {
  title: 'Componentes/Tab Group',
  component: CaoTabGroup,
  tags: ['autodocs'],
  argTypes: {
    selectedIndex: { control: { type: 'number', min: 0 } },
    labelHeight: { control: 'text' },
    labelPaddingX: { control: 'text' },
    labelGap: { control: 'text' },
    colorText: { control: 'color' },
    colorActive: { control: 'color' },
    colorHoverBg: { control: 'color' },
    colorDisabled: { control: 'color' },
    colorInkBar: { control: 'color' },
    colorHeaderBorder: { control: 'color' },
    inkBarHeight: { control: 'text' },
    contentPaddingTop: { control: 'text' },
    labelRadius: { control: 'text' },
    animationDuration: { control: 'text' },
    dynamicHeight: { control: 'boolean' },
    labelAlign: { control: 'select', options: ['start', 'center', 'end'] },
    iconColorActive: { control: 'color' },
    iconColorInactive: { control: 'color' },
    strokeWidthIcon: { control: { type: 'number', min: 0.5, max: 3, step: 0.1 } },
  },
  args: {
    selectedTabChange: fn(),
    focusChange: fn(),
  },
};

export default meta;
type Story = StoryObj<CaoTabGroup>;

export const Padrao: Story = {
  render: () => renderTabs(defaultPanels),
};

export const ComIcones: Story = {
  render: () => renderTabs(panelsWithIcons),
};

export const ComAbaDesabilitada: Story = {
  args: {
    selectedIndex: 0,
  },
  render: () =>
    renderTabs(`
      <cao-tab-panel label="Aba 1"><p>Conteúdo da primeira aba.</p></cao-tab-panel>
      <cao-tab-panel label="Bloqueada" isDisabled="true"><p>Não acessível.</p></cao-tab-panel>
      <cao-tab-panel label="Aba 3"><p>Conteúdo da terceira aba.</p></cao-tab-panel>
    `),
};

export const CoresPersonalizadas: Story = {
  args: {
    colorText: '#374151',
    colorActive: '#dc2626',
    colorHoverBg: '#fee2e2',
    colorInkBar: '#dc2626',
    colorHeaderBorder: '#f3f4f6',
  },
  render: () => renderTabs(defaultPanels),
};

export const LabelsCentralizados: Story = {
  args: {
    labelAlign: 'center',
  },
  render: () => renderTabs(defaultPanels),
};

export const TrailingIcons: Story = {
  render: () =>
    renderTabs(`
      <cao-tab-panel label="Notificações" trailingIcon="Bell"><p>Conteúdo com sino.</p></cao-tab-panel>
      <cao-tab-panel label="Perfil" trailingIcon="User"><p>Conteúdo de perfil.</p></cao-tab-panel>
    `),
};