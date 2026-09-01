import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { StepperComponent } from './stepper';

const meta: Meta<StepperComponent> = {
  title: 'Componentes/Stepper',
  component: StepperComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
  },
  args: {
    maxReachedEvent: fn(),
  },
};

export default meta;
type Story = StoryObj<StepperComponent>;

const renderStepper = (steps: string) => ({
  template: `
    <cao-stepper title="Etapas do cadastro" (maxReachedEvent)="maxReachedEvent()">
      ${steps}
    </cao-stepper>
  `,
  props: { maxReachedEvent: fn() },
});

export const Padrao: Story = {
  render: () =>
    renderStepper(`
      <cao-step title="Dados pessoais" />
      <cao-step title="Endereço" />
      <cao-step title="Confirmação" />
    `),
};

export const ComTitulo: Story = {
  render: () =>
    renderStepper(`
      <cao-step title="Etapa 1" />
      <cao-step title="Etapa 2" />
      <cao-step title="Etapa 3" />
    `),
};

export const MultiplastEtapas: Story = {
  render: () =>
    renderStepper(`
      <cao-step title="Cadastro" />
      <cao-step title="Documentos" />
      <cao-step title="Bancário" />
      <cao-step title="Revisão" />
      <cao-step title="Conclusão" />
    `),
};

export const SomenteStep: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px">
        <cao-step title="Ativa" isActive="true" />
        <cao-step title="Inativa" />
      </div>
    `,
  }),
};

export const StepComStepComponent: Story = {
  render: () =>
    renderStepper(`
      <cao-step title="Primeira" />
      <cao-step title="Segunda" />
      <cao-step title="Terceira" isActive="true" />
    `),
};