import { provideRouter } from '@angular/router';

import { provideLucideIcons, LucideBuilding2, LucideChevronRight, LucideFolder, LucideHouse, LucideUser } from '@lucide/angular';
import { applicationConfig, argsToTemplate, Meta, StoryObj } from '@storybook/angular-vite';

import { CaoBreadcrumbComponent } from './breadcrumb';
import { ICaoBreadcrumbItem } from './breadcrumb.model';

/* eslint-disable @typescript-eslint/naming-convention */
const STORY_ICONS = { LucideBuilding2, LucideChevronRight, LucideFolder, LucideHouse, LucideUser };
/* eslint-enable @typescript-eslint/naming-convention */

const IMG_ICON =
    `data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4f46e5"/><path d="M8 12l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/></svg>',
    )}`;

const basicItems: ICaoBreadcrumbItem[] = [
    { label: 'Início', link: '/' },
    { label: 'Clientes', link: '/clientes' },
    { label: 'Maria Souza' },
];

const meta: Meta<CaoBreadcrumbComponent> = {
    title: 'Componentes/Breadcrumb',
    component: CaoBreadcrumbComponent,
    tags: ['autodocs'],
    decorators: [
        applicationConfig({
            providers: [
                provideRouter([]),
                provideLucideIcons(STORY_ICONS as never),
            ],
        }),
    ],
    render: (args) => ({ props: args, template: `<cao-breadcrumb ${argsToTemplate(args)} />` }),
    argTypes: {
        items: { control: 'object', description: 'Lista de itens (o último é a página atual).' },
        home: { control: 'object', description: 'Item home opcional, exibido antes dos itens.' },
        separator: { control: 'text', description: 'Texto do divisor. Padrão: "/".' },
        separatorIcon: { control: 'text', description: 'Ícone do divisor (Lucide ou imagem). Sobrepõe `separator`.' },
        isLucideSeparatorIcon: { control: 'boolean' },
        separatorIconSize: { control: 'number' },
        linkColor: { control: 'color' },
        linkHoverColor: { control: 'color' },
        currentColor: { control: 'color' },
        separatorColor: { control: 'color' },
        fontSize: { control: 'text' },
        gap: { control: 'text' },
        ariaLabel: { control: 'text' },
        itemClick: { action: 'itemClick' },
    },
    args: { items: basicItems, separator: '/', ariaLabel: 'Breadcrumb' },
};
export default meta;

type Story = StoryObj<CaoBreadcrumbComponent>;

export const Default: Story = {};

export const WithHome: Story = {
    args: { home: { icon: 'house', ariaLabel: 'Início', link: '/' }, items: basicItems.slice(1) },
};

export const IconsLeftAndRight: Story = {
    args: {
        items: [
            { label: 'Empresa', icon: 'building-2', iconPosition: 'left', link: '/empresa' },
            { label: 'Projetos', icon: 'folder', iconPosition: 'right', link: '/projetos' },
            { label: 'Perfil', icon: 'user', iconPosition: 'left' },
        ],
    },
};

export const ImageIcon: Story = {
    args: {
        items: [
            { label: 'Início', icon: IMG_ICON, isLucideIcon: false, link: '/' },
            { label: 'Relatórios', icon: IMG_ICON, isLucideIcon: false, iconPosition: 'right', link: '/relatorios' },
            { label: 'Mensal' },
        ],
    },
};

export const WithBadges: Story = {
    args: {
        items: [
            { label: 'Início', link: '/' },
            { label: 'Pedidos', link: '/pedidos', badge: 12 },
            { label: 'Pendentes', badge: 'novo', badgeBgColor: '#dcfce7', badgeColor: '#166534' },
        ],
    },
};

export const CustomTextSeparator: Story = { args: { separator: '>' } };

export const IconSeparator: Story = {
    args: { separatorIcon: 'chevron-right', isLucideSeparatorIcon: true, separatorColor: '#6b7280' },
};

export const ExternalLinkAndCommand: Story = {
    args: {
        items: [
            { label: 'Docs', href: 'https://angular.dev', target: '_blank' },
            { label: 'Ação customizada', command: () => console.warn('command executado') },
            { label: 'Desabilitado', link: '/x', disabled: true },
            { label: 'Atual' },
        ],
    },
};

export const Themed: Story = {
    args: {
        linkColor: '#0f766e',
        linkHoverColor: '#134e4a',
        currentColor: '#042f2e',
        separatorColor: '#5eead4',
        fontSize: '1rem',
        gap: '12px',
        separatorIcon: 'chevron-right',
    },
};