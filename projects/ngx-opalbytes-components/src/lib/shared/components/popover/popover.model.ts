import { ElementRef } from '@angular/core';

/** Lado do elemento de origem em que o popover é exibido. */
export type CaoPopoverPosition = 'top' | 'bottom' | 'left' | 'right';

/** Alinhamento do popover em relação ao elemento de origem. */
export type CaoPopoverAlign = 'start' | 'center' | 'end';

/** Evento que aciona o popover quando usado com `CaoPopoverTriggerDirective`. */
export type CaoPopoverTrigger = 'click' | 'hover' | 'focus';

/** Elemento de origem (âncora) do popover. */
export type CaoPopoverTarget = HTMLElement | ElementRef<HTMLElement> | null | undefined;

export interface ICaoPopoverShowOptions {
  /** Move o foco para dentro do popover ao abrir. Padrão: valor de `focusOnShow`. */
  focus?: boolean;
}

