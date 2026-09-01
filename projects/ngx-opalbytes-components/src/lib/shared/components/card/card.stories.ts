import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoCardComponent, ICaoCardBadge, ICaoCardMeta } from './card.component';

const cardMeta: ICaoCardMeta[] = [
  { icon: 'https://lucide.dev/icons/eye.svg', label: 'Visualizações' },
  { icon: 'https://lucide.dev/icons/clock.svg', label: 'Última atualização' },
];

const cardBadge: ICaoCardBadge = {
  label: 'Novo',
  color: 'text-white',
  borderColor: 'border-green-600',
  bg: '#22c55e',
};

const meta: Meta<CaoCardComponent> = {
  title: 'Componentes/Card',
  component: CaoCardComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['horizontal', 'square'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    detail: { control: 'text' },
    detailColor: { control: 'text' },
    icon: { control: 'text' },
    bgColor: { control: 'text' },
    borderColor: { control: 'text' },
    selected: { control: 'boolean' },
    clickable: { control: 'boolean' },
    cardClick: { action: 'cardClicked' },
  },
  args: {
    cardClick: fn(),
    title: 'Projeto Renova',
    subtitle: 'Monitoramento de qualidade',
  },
};

export default meta;
type Story = StoryObj<CaoCardComponent>;

export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
  },
};

export const HorizontalComIcone: Story = {
  args: {
    variant: 'horizontal',
    icon: 'https://lucide.dev/icons/image.svg',
  },
};

export const HorizontalComAvatar: Story = {
  args: {
    variant: 'horizontal',
    avatar: { initials: 'OP', color: 'bg-indigo-500' },
  },
};

export const HorizontalComDetalhe: Story = {
  args: {
    variant: 'horizontal',
    detail: 'Detalhe adicional do card',
    detailColor: 'text-amber-600',
  },
};

export const ComBadge: Story = {
  args: {
    variant: 'horizontal',
    badge: cardBadge,
  },
};

export const ComMeta: Story = {
  args: {
    variant: 'horizontal',
    meta: cardMeta,
  },
};

export const Clicavel: Story = {
  args: {
    variant: 'horizontal',
    clickable: true,
  },
};

export const Selecionado: Story = {
  args: {
    variant: 'horizontal',
    selected: true,
  },
};

export const Quadrado: Story = {
  args: {
    variant: 'square',
    title: 'KPIs',
  },
};

export const QuadradoComIcone: Story = {
  args: {
    variant: 'square',
    title: 'Análises',
    icon: 'https://lucide.dev/icons/image.svg',
  },
};