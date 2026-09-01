import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoBaseIcon } from './base-icon';

const meta: Meta<CaoBaseIcon> = {
  title: 'Componentes/Base Icon',
  component: CaoBaseIcon,
  tags: ['autodocs'],
  argTypes: {
    imgSource: { control: 'text' },
    isLucideIcon: { control: 'boolean' },
    strokeWidthIcon: { control: { type: 'number', min: 0.5, max: 3, step: 0.1 } },
    iconColor: { control: 'color' },
    size: { control: { type: 'number', min: 8, max: 96 } },
  },
  args: {
    imgSource: 'Home',
    isLucideIcon: true,
    size: 32,
  },
};

export default meta;
type Story = StoryObj<CaoBaseIcon>;

export const IconeLucide: Story = {
  args: {
    imgSource: 'Home',
    isLucideIcon: true,
  },
};

export const IconeLucideComCor: Story = {
  args: {
    imgSource: 'Settings',
    isLucideIcon: true,
    iconColor: '#3b82f6',
  },
};

export const TamanhoPersonalizado: Story = {
  args: {
    imgSource: 'Bell',
    isLucideIcon: true,
    size: 48,
    strokeWidthIcon: 2,
  },
};

export const IconeSVG: Story = {
  args: {
    imgSource: 'https://lucide.dev/icons/home.svg',
    isLucideIcon: false,
    size: 32,
  },
};