import { LucideUser, provideLucideIcons } from '@lucide/angular';
import { applicationConfig, argsToTemplate, Meta, StoryObj } from '@storybook/angular-vite';

import { CaoAvatarComponent } from './avatar';

/* eslint-disable @typescript-eslint/naming-convention */
const STORY_ICONS = { LucideUser };
/* eslint-enable @typescript-eslint/naming-convention */

const PHOTO = 'https://i.pravatar.cc/200?img=12';
const ROW = 'display:flex;gap:16px;align-items:center;flex-wrap:wrap';

const meta: Meta<CaoAvatarComponent> = {
    title: 'Componentes/Avatar',
    component: CaoAvatarComponent,
    tags: ['autodocs'],
    decorators: [applicationConfig({ providers: [provideLucideIcons(STORY_ICONS as never)] })],
    render: (args) => ({ props: args, template: `<cao-avatar ${argsToTemplate(args)} />` }),
    argTypes: {
        src: { control: 'text', description: 'URL da imagem. Vazia → ícone, label ou imagem padrão.' },
        defaultSrc: { control: 'text', description: 'Imagem padrão customizada.' },
        label: { control: 'text' },
        isLucideIcon: { control: 'boolean' },
        iconColor: { control: 'color' },
        size: { control: 'text', description: "'small' | 'normal' | 'large' | 'xlarge' | número (px) | '4rem'" },
        shape: { control: 'inline-radio', options: ['circle', 'rounded', 'square'] },
        strokeWidth: { control: 'text' },
        strokeColor: { control: 'color' },
        strokeStyle: { control: 'inline-radio', options: ['solid', 'dashed', 'dotted', 'double'] },
        bgColor: { control: 'color' },
        textColor: { control: 'color' },
    },
    args: { size: 'large', shape: 'circle', strokeWidth: 0, strokeColor: '#ffffff', strokeStyle: 'solid' },
};
export default meta;

type Story = StoryObj<CaoAvatarComponent>;

export const DefaultImage: Story = {};

export const WithImage: Story = { args: { src: PHOTO, alt: 'Foto de perfil' } };

export const WithLabel: Story = { args: { label: 'MB', bgColor: '#eef2ff', textColor: '#4338ca' } };

export const WithIcon: Story = { args: { icon: 'user', bgColor: '#dcfce7', iconColor: '#166534' } };

export const BrokenImageFallsBack: Story = { args: { src: 'https://invalid.example/nao-existe.png' } };

export const CustomDefaultImage: Story = { args: { defaultSrc: 'https://i.pravatar.cc/200?img=47' } };

export const Sizes: Story = {
    render: () => ({
        template: `
      <div style="${ROW}">
        <cao-avatar [src]="'${PHOTO}'" size="small" />
        <cao-avatar [src]="'${PHOTO}'" size="normal" />
        <cao-avatar [src]="'${PHOTO}'" size="large" />
        <cao-avatar [src]="'${PHOTO}'" size="xlarge" />
        <cao-avatar [src]="'${PHOTO}'" [size]="96" />
        <cao-avatar [src]="'${PHOTO}'" size="7rem" />
      </div>`,
    }),
};

export const Shapes: Story = {
    render: () => ({
        template: `
      <div style="${ROW}">
        <cao-avatar [src]="'${PHOTO}'" size="xlarge" shape="circle" />
        <cao-avatar [src]="'${PHOTO}'" size="xlarge" shape="rounded" />
        <cao-avatar [src]="'${PHOTO}'" size="xlarge" shape="square" />
      </div>`,
    }),
};

export const Stroke: Story = {
    render: () => ({
        template: `
      <div style="${ROW}">
        <cao-avatar [src]="'${PHOTO}'" size="xlarge" [strokeWidth]="2" strokeColor="#4f46e5" />
        <cao-avatar [src]="'${PHOTO}'" size="xlarge" [strokeWidth]="4" strokeColor="#16a34a" strokeStyle="dashed" />
        <cao-avatar label="AB" size="xlarge" shape="rounded" [strokeWidth]="3" strokeColor="#f59e0b" strokeStyle="double" />
      </div>`,
    }),
};