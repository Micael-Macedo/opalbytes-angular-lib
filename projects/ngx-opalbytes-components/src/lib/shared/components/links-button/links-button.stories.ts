import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';

import { LinksButton, INavContent } from './links-button';

const defaultNav: INavContent = {
  title: 'Navegação',
  links: [
    { text: 'Dashboard', url: '/dashboard' },
    { text: 'Relatórios', url: '/relatorios' },
    { text: 'Configurações', url: '/configuracoes' },
  ],
};

const meta: Meta<LinksButton> = {
  title: 'Componentes/Links Button',
  component: LinksButton,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<LinksButton>;

export const Padrao: Story = {
  args: {
    navContent: signal(defaultNav),
  },
};

export const ComLinkDesabilitado: Story = {
  args: {
    navContent: signal({
      title: 'Navegação',
      links: [
        { text: 'Dashboard', url: '/dashboard' },
        { text: 'Indisponível', url: '/x', disabled: true },
        { text: 'Configurações', url: '/configuracoes' },
      ],
    }),
  },
};

export const ComRotaDireta: Story = {
  args: {
    navContent: signal({
      title: 'Navegação externa',
      links: [
        { text: 'Site oficial', url: 'https://example.com', directRoute: true },
        { text: 'Dashboard', url: '/dashboard' },
      ],
    }),
  },
};

export const ComDataCy: Story = {
  args: {
    navContent: signal({
      title: 'Navegação instrumentada',
      links: [
        { text: 'Dashboard', url: '/dashboard', dataCy: 'link-dashboard' },
        { text: 'Relatórios', url: '/relatorios', dataCy: 'link-relatorios' },
      ],
    }),
  },
};