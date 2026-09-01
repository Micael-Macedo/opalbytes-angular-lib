import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { Paginator } from './paginator';

const meta: Meta<Paginator> = {
  title: 'Componentes/Paginator',
  component: Paginator,
  tags: ['autodocs'],
  argTypes: {
    totalItems: { control: { type: 'number', min: 0 } },
    pageSize: { control: { type: 'number', min: 1 } },
    currentPage: { control: { type: 'number', min: 1 } },
    pageSizeOptions: { control: 'object' },
    customClass: { control: 'text' },
    showFirstLastButtons: { control: 'boolean' },
  },
  args: {
    pageEvent: fn(),
    totalItems: 250,
    pageSize: 10,
  },
};

export default meta;
type Story = StoryObj<Paginator>;

export const Padrao: Story = {
  args: {
    totalItems: 250,
    pageSize: 10,
  },
};

export const OpcoesPersonalizadas: Story = {
  args: {
    totalItems: 1000,
    pageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
  },
};

export const SemPrimeiroEUltimo: Story = {
  args: {
    totalItems: 250,
    pageSize: 10,
    showFirstLastButtons: false,
  },
};

export const VariasPaginas: Story = {
  args: {
    totalItems: 3,
    pageSize: 1,
  },
};