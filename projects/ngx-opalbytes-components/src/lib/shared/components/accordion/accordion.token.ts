import { InjectionToken, Signal } from '@angular/core';

/** Posição do ícone de expandir/recolher em relação ao texto do cabeçalho. */
export type CaoAccordionTogglePosition = 'before' | 'after';

/** Alinhamento horizontal de texto (cabeçalho ou conteúdo). */
export type CaoAccordionAlign = 'start' | 'center' | 'end';

/**
 * Modo de exibição do accordion.
 * - `default`: painéis unidos dentro de um único contorno arredondado.
 * - `flat`: painéis unidos, sem bordas laterais nem cantos arredondados.
 * - `separated`: cada painel é um cartão independente, separado por `gap`.
 */
export type CaoAccordionDisplayMode = 'default' | 'flat' | 'separated';

/** Contrato mínimo que um item precisa expor para ser controlado pelo accordion. */
export interface ICaoAccordionItemRef {
  readonly expanded: Signal<boolean>;
  readonly isDisabled: Signal<boolean>;
  open(): void;
  close(): void;
}

/**
 * Contrato do accordion consumido pelos itens.
 * Existe para evitar import circular entre `accordion` e `accordion-item`.
 */
export interface ICaoAccordionHost {
  readonly multi: Signal<boolean>;
  readonly hideToggle: Signal<boolean>;
  readonly togglePosition: Signal<CaoAccordionTogglePosition>;
  readonly headerAlign: Signal<CaoAccordionAlign>;
  readonly displayMode: Signal<CaoAccordionDisplayMode>;
  register(item: ICaoAccordionItemRef): void;
  unregister(item: ICaoAccordionItemRef): void;
  notifyOpened(item: ICaoAccordionItemRef): void;
}

export const CAO_ACCORDION = new InjectionToken<ICaoAccordionHost>('CAO_ACCORDION');