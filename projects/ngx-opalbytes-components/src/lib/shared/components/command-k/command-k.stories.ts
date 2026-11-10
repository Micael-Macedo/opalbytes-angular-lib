import {
  LucideCalculator,
  LucideCalendar,
  LucideCreditCard,
  LucideSettings,
  LucideSmile,
  LucideUser,
  provideLucideIcons,
} from '@lucide/angular';
import { applicationConfig, argsToTemplate, Meta, StoryObj } from '@storybook/angular-vite';

import { CaoCmdKComponent } from './command-k';
import { ICaoCmdKGroup, ICaoCmdKItem } from './command-k.model';


// Ajuste os nomes dos ícones conforme a versão do @lucide/angular instalada no projeto.
/* eslint-disable @typescript-eslint/naming-convention */
const STORY_ICONS = { LucideCalculator, LucideCalendar, LucideCreditCard, LucideSettings, LucideSmile, LucideUser };
/* eslint-enable @typescript-eslint/naming-convention */

const GROUPS: ICaoCmdKGroup[] = [
  {
    heading: 'Sugestões',
    items: [
      { id: 'calendar', label: 'Calendário', icon: 'calendar' },
      { id: 'emoji', label: 'Buscar emoji', icon: 'smile' },
      { id: 'calc', label: 'Calculadora', icon: 'calculator', disabled: true },
    ],
  },
  {
    heading: 'Configurações',
    items: [
      { id: 'profile', label: 'Perfil', icon: 'user', shortcut: '⌘P' },
      { id: 'billing', label: 'Cobrança', icon: 'credit-card', shortcut: '⌘B' },
      { id: 'settings', label: 'Configurações', icon: 'settings', shortcut: '⌘S', keywords: ['preferências'] },
    ],
  },
];

const WRAP = 'padding:24px;max-width:420px';

const meta: Meta<CaoCmdKComponent> = {
  title: 'Components/Cmd-K',
  component: CaoCmdKComponent,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideLucideIcons(STORY_ICONS as never)] })],
  argTypes: {
    position: { control: 'inline-radio', options: ['center', 'top'] },
    placeholder: { control: 'text' },
    emptyText: { control: 'text' },
    triggerPlaceholder: { control: 'text' },
    showTrigger: { control: 'boolean' },
    enableShortcut: { control: 'boolean' },
    shortcutKey: { control: 'text' },
    closeOnSelect: { control: 'boolean' },
    clearOnClose: { control: 'boolean' },
    loop: { control: 'boolean' },
    localFilter: { control: 'boolean' },
    width: { control: 'text' },
    listMaxHeight: { control: 'text' },
    bgColor: { control: 'color' },
    textColor: { control: 'color' },
    borderColor: { control: 'color' },
    activeBgColor: { control: 'color' },
    itemSelected: { action: 'itemSelected' },
  },
  args: {
    groups: GROUPS,
    items: [],
    position: 'center',
    showTrigger: true,
    enableShortcut: true,
    shortcutKey: 'k',
    closeOnSelect: true,
    clearOnClose: true,
    loop: true,
    localFilter: true,
  },
  render: (args) => ({
    props: args,
    template: `<div style="${WRAP}"><cao-cmd-k ${argsToTemplate(args)} /></div>`,
  }),
};
export default meta;

type Story = StoryObj<CaoCmdKComponent>;

/** Clique no campo ou use Ctrl + K / ⌘ + K para abrir. */
export const Default: Story = {};

export const PositionedAtTop: Story = { args: { position: 'top' } };

export const DescriptionsAndBadges: Story = {
  args: {
    groups: [
      {
        heading: 'Páginas',
        items: [
          { id: 'dash', label: 'Dashboard', description: 'Visão geral das métricas', badge: 'Novo' },
          { id: 'orders', label: 'Pedidos', description: 'Acompanhe e gerencie pedidos', shortcut: ['G', 'P'] },
          { id: 'users', label: 'Usuários', description: 'Perfis e permissões' },
        ],
      },
    ],
  },
};

export const Headless: Story = {
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="${WRAP}">
        <button type="button" (click)="cmd.show()">Abrir paleta (ou Ctrl + K)</button>
        <cao-cmd-k #cmd [showTrigger]="false" [groups]="groups" (itemSelected)="itemSelected($event)" />
      </div>`,
  }),
};

export const RemoteSearch: Story = {
  render: () => {
    const catalog: ICaoCmdKItem[] = ['Angular', 'Astro', 'Svelte', 'Solid', 'Vue', 'React'].map((name) => ({
      id: name,
      label: name,
      description: 'Framework',
    }));

    return {
      props: {
        results: catalog,
        search: (query: string) => {
          // Simula uma busca remota: o componente apenas exibe os itens recebidos.
          const term = query.trim().toLowerCase();
          return term ? catalog.filter((item) => item.label.toLowerCase().includes(term)) : catalog;
        },
      },
      template: `
        <div style="${WRAP}">
          <cao-cmd-k
            [localFilter]="false"
            [items]="results"
            placeholder="Buscar frameworks..."
            (queryChange)="results = search($event)" />
        </div>`,
    };
  },
};