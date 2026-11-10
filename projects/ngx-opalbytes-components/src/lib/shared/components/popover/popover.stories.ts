import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular-vite';

import { CaoPopoverComponent } from './popover';
import { CaoPopoverTriggerDirective } from './popover-trigger.directive';

const WRAP = 'display:flex;justify-content:center;align-items:center;gap:16px;flex-wrap:wrap;padding:140px 40px';

const meta: Meta<CaoPopoverComponent> = {
  title: 'Components/Popover',
  component: CaoPopoverComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CaoPopoverTriggerDirective] })],
  argTypes: {
    position: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    offset: { control: 'number' },
    showArrow: { control: 'boolean' },
    dismissable: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    showCloseIcon: { control: 'boolean' },
    focusOnShow: { control: 'boolean' },
    width: { control: 'text' },
    maxWidth: { control: 'text' },
    bgColor: { control: 'color' },
    textColor: { control: 'color' },
    borderColor: { control: 'color' },
    borderRadius: { control: 'text' },
    padding: { control: 'text' },
    shown: { action: 'shown' },
    hidden: { action: 'hidden' },
  },
  args: {
    position: 'bottom',
    align: 'center',
    offset: 10,
    showArrow: true,
    dismissable: true,
    closeOnEscape: true,
    showCloseIcon: false,
    focusOnShow: true,
    maxWidth: '360px',
    ariaLabel: 'Detalhes',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="${WRAP}">
        <button type="button" (click)="op.toggle($event)">Abrir popover</button>
        <cao-popover #op ${argsToTemplate(args)}>
          <strong>Informações</strong>
          <p style="margin:4px 0 0">Conteúdo livre: textos, formulários, listas ou qualquer componente.</p>
        </cao-popover>
      </div>`,
  }),
};
export default meta;

type Story = StoryObj<CaoPopoverComponent>;

export const Default: Story = {};

export const WithCloseIcon: Story = { args: { showCloseIcon: true } };

export const WithoutArrow: Story = { args: { showArrow: false, offset: 6 } };

export const NotDismissable: Story = { args: { dismissable: false, showCloseIcon: true, closeOnEscape: false } };

export const Positions: Story = {
  render: () => ({
    template: `
      <div style="${WRAP}">
        <button type="button" (click)="t.toggle($event)">Topo</button>
        <cao-popover #t position="top">Aparece acima</cao-popover>

        <button type="button" (click)="b.toggle($event)">Baixo</button>
        <cao-popover #b position="bottom">Aparece abaixo</cao-popover>

        <button type="button" (click)="l.toggle($event)">Esquerda</button>
        <cao-popover #l position="left">Aparece à esquerda</cao-popover>

        <button type="button" (click)="r.toggle($event)">Direita</button>
        <cao-popover #r position="right">Aparece à direita</cao-popover>
      </div>`,
  }),
};

export const Alignments: Story = {
  render: () => ({
    template: `
      <div style="${WRAP}">
        <button type="button" style="width:220px" (click)="s.toggle($event)">Alinhado ao início</button>
        <cao-popover #s align="start">Início</cao-popover>

        <button type="button" style="width:220px" (click)="c.toggle($event)">Centralizado</button>
        <cao-popover #c align="center">Centro</cao-popover>

        <button type="button" style="width:220px" (click)="e.toggle($event)">Alinhado ao fim</button>
        <cao-popover #e align="end">Fim</cao-popover>
      </div>`,
  }),
};

export const TriggerDirective: Story = {
  render: () => ({
    template: `
      <div style="${WRAP}">
        <button type="button" [caoPopoverTrigger]="click">Clique</button>
        <cao-popover #click>Aberto por clique</cao-popover>

        <button type="button" [caoPopoverTrigger]="hover" caoPopoverTriggerOn="hover">Passe o mouse</button>
        <cao-popover #hover [focusOnShow]="false">Aberto por hover (o painel também mantém aberto)</cao-popover>

        <button type="button" [caoPopoverTrigger]="focus" caoPopoverTriggerOn="focus">Foque aqui (Tab)</button>
        <cao-popover #focus role="tooltip">Aberto por foco</cao-popover>
      </div>`,
  }),
};

export const OneInstanceManyTriggers: Story = {
  render: () => ({
    template: `
      <div style="${WRAP}">
        <button type="button" (click)="op.toggle($event)">Item 1</button>
        <button type="button" (click)="op.toggle($event)">Item 2</button>
        <button type="button" (click)="op.toggle($event)">Item 3</button>
        <cao-popover #op [showCloseIcon]="true">Uma única instância reaproveitada em vários elementos.</cao-popover>
      </div>`,
  }),
};

export const RichContent: Story = {
  render: () => ({
    template: `
      <div style="${WRAP}">
        <button type="button" (click)="op.toggle($event)">Compartilhar</button>
        <cao-popover #op width="300px" [showCloseIcon]="true" ariaLabel="Compartilhar">
          <div style="display:flex;flex-direction:column;gap:8px">
            <strong>Compartilhar link</strong>
            <input type="text" value="https://exemplo.com/abc" readonly style="padding:6px 8px;border:1px solid #d1d5db;border-radius:6px" />
            <button type="button" (click)="op.hide()">Copiar e fechar</button>
          </div>
        </cao-popover>
      </div>`,
  }),
};

export const CustomColors: Story = {
  args: {
    bgColor: '#312e81',
    textColor: '#ffffff',
    borderColor: '#4338ca',
    borderRadius: '12px',
    showCloseIcon: false,
  },
};