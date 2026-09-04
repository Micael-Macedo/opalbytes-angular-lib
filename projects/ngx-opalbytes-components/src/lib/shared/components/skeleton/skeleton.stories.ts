import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoSkeletonComponent } from './skeleton';

const meta: Meta<CaoSkeletonComponent> = {
  title: 'Componentes/Skeleton',
  component: CaoSkeletonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['rect', 'circle', 'text'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
    size: { control: 'text' },
    bgColor: { control: 'color' },
    shine: { control: 'color' },
    borderRadius: { control: 'text' },
    speed: { control: 'text' },
    animationDeg: { control: 'text' },
  },
  args: {
    variant: 'rect',
    width: '200px',
    height: '40px',
    bgColor: '#e2e8f0',
    shine: '#f8fafc',
    speed: '2s',
  },
};

export default meta;
type Story = StoryObj<CaoSkeletonComponent>;

export const Retangulo: Story = {
  args: {
    variant: 'rect',
    width: '200px',
    height: '40px',
  },
};

export const RetanguloComBordaArredondada: Story = {
  args: {
    variant: 'rect',
    width: '200px',
    height: '60px',
    borderRadius: '8px',
  },
};

export const Circulos: Story = {
  args: {
    bgColor: '#8100ff',
  },

  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <cao-skeleton [size]="'24px'" [variant]="'circle'"></cao-skeleton>
        <cao-skeleton [size]="'48px'" [variant]="'circle'"></cao-skeleton>
        <cao-skeleton [size]="'80px'" [variant]="'circle'"></cao-skeleton>
      </div>
    `,
  }),
};

export const RetangulosComTamanhosVariados: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 320px;">
        <cao-skeleton [width]="'100%'" [height]="'12px'"></cao-skeleton>
        <cao-skeleton [width]="'80%'" [height]="'12px'"></cao-skeleton>
        <cao-skeleton [width]="'60%'" [height]="'12px'"></cao-skeleton>
      </div>
    `,
  }),
};

export const LinhaDeTexto: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 260px;">
        <cao-skeleton [variant]="'text'" [width]="'100%'"></cao-skeleton>
        <cao-skeleton [variant]="'text'" [width]="'90%'"></cao-skeleton>
        <cao-skeleton [variant]="'text'" [width]="'70%'"></cao-skeleton>
      </div>
    `,
  }),
};

export const CorCustomizada: Story = {
  args: {
    variant: 'rect',
    width: '220px',
    height: '48px',
    bgColor: '#e0e7ff',
    shine: '#ffffff',
    borderRadius: '12px',
  },
};

export const AnimacaoRapida: Story = {
  args: {
    variant: 'rect',
    width: '200px',
    height: '40px',
    speed: '0.8s',
  },
};

export const AnimacaoLenta: Story = {
  args: {
    variant: 'rect',
    width: '200px',
    height: '40px',
    speed: '4s',
  },
};

export const GradienteVertical: Story = {
  args: {
    variant: 'rect',
    width: '200px',
    height: '40px',
    animationDeg: '0deg',
  },
};
