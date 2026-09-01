import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoKpi, ICaoKPI } from './kpi';

const defaultKpi: ICaoKPI = {
  title: 'Faturamento',
  value: 'R$ 128.450,00',
  textColor: '#111827',
  borderColor: '#e5e7eb',
  icon: {
    src: 'https://lucide.dev/icons/trending-up.svg',
    alt: 'ícone de tendência',
  },
};

const meta: Meta<CaoKpi> = {
  title: 'Componentes/KPI',
  component: CaoKpi,
  tags: ['autodocs'],
  argTypes: {
    kpiData: { control: 'object' },
  },
  args: {
    kpiData: defaultKpi,
  },
};

export default meta;
type Story = StoryObj<CaoKpi>;

export const Padrao: Story = {
  args: {
    kpiData: defaultKpi,
  },
};

export const Sucesso: Story = {
  args: {
    kpiData: {
      title: 'Meta de vendas',
      value: '87%',
      textColor: '#16a34a',
      borderColor: '#16a34a',
      icon: {
        src: 'https://lucide.dev/icons/check-circle.svg',
        alt: 'ícone de sucesso',
      },
    },
  },
};

export const Alerta: Story = {
  args: {
    kpiData: {
      title: 'Pedidos pendentes',
      value: '32',
      textColor: '#dc2626',
      borderColor: '#dc2626',
      icon: {
        src: 'https://lucide.dev/icons/alert-triangle.svg',
        alt: 'ícone de alerta',
      },
    },
  },
};