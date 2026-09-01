import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { CaoDropDownComponent, ICaoDropDownOption } from './drop-down';

const defaultOptions: ICaoDropDownOption[] = [
  { id: 1, nome: 'Ativo' },
  { id: 2, nome: 'Inativo' },
  { id: 3, nome: 'Pendente' },
  { id: 4, nome: 'Suspenso' },
];

const optionsWithIcons: ICaoDropDownOption[] = [
  { id: 1, nome: 'Ativo', icon: 'check_circle' },
  { id: 2, nome: 'Inativo', icon: 'cancel' },
  { id: 3, nome: 'Pendente', icon: 'schedule' },
  { id: 4, nome: 'Suspenso', icon: 'block' },
];

const meta: Meta<CaoDropDownComponent> = {
  title: 'Componentes/Drop Down',
  component: CaoDropDownComponent,
  tags: ['autodocs'],
  argTypes: {
    textHeader: { control: 'text' },
    options: { control: 'object' },
    dropDownClass: { control: 'text' },
    isDisabled: { control: 'boolean' },
    tooltip: { control: 'text' },
    dropDirectionInput: { control: 'select', options: ['up', 'down'] },
    dataCy: { control: 'text' },
    ariaLabel: { control: 'text' },
    ariaLabelledBy: { control: 'text' },
    listAriaLabel: { control: 'text' },
  },
  args: {
    itemSelected: fn(),
    textHeader: 'SELECIONE UM ITEM',
    options: defaultOptions,
  },
};

export default meta;
type Story = StoryObj<CaoDropDownComponent>;

export const Padrao: Story = {
  args: {
    textHeader: 'Selecione um status',
    options: defaultOptions,
  },
};

export const ComIcones: Story = {
  args: {
    textHeader: 'Selecione um status',
    options: optionsWithIcons,
  },
};

export const Desabilitado: Story = {
  args: {
    textHeader: 'Selecione um status',
    options: defaultOptions,
    isDisabled: true,
  },
};

export const AberturaParaCima: Story = {
  args: {
    textHeader: 'Selecione um status',
    options: defaultOptions,
    dropDirectionInput: 'up',
  },
};

export const ComTooltip: Story = {
  args: {
    textHeader: 'Selecione um status',
    options: defaultOptions,
    tooltip: 'Escolha um dos status disponíveis',
  },
};

export const ClassePersonalizada: Story = {
  args: {
    textHeader: 'Selecione um status',
    options: defaultOptions,
    dropDownClass: 'dropdown-secundary',
  },
};