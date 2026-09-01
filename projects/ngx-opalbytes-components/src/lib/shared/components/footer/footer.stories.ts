import type { Meta, StoryObj } from '@storybook/angular-vite';

import { Footer } from './footer';

const meta: Meta<Footer> = {
  title: 'Componentes/Footer',
  component: Footer,
  tags: ['autodocs'],
  argTypes: {
    currentRoute: { control: 'text' },
    footerText: { control: 'text' },
    isFixed: { control: 'boolean' },
  },
  args: {
    footerText: 'Opalbytes',
  },
};

export default meta;
type Story = StoryObj<Footer>;

export const Padrao: Story = {
  args: {
    footerText: 'Opalbytes',
  },
};

export const Fixo: Story = {
  args: {
    footerText: 'Opalbytes',
    isFixed: true,
  },
};

export const ComRota: Story = {
  args: {
    footerText: 'Opalbytes',
    currentRoute: '/dashboard',
  },
};

export const ComConteudo: Story = {
  render: (args) => ({
    template: `
      <cao-footer [currentRoute]="currentRoute" [footerText]="footerText" [isFixed]="isFixed">
        <div>Links úteis: <a href="#">Termos</a> | <a href="#">Privacidade</a></div>
      </cao-footer>
    `,
    props: args,
  }),
};