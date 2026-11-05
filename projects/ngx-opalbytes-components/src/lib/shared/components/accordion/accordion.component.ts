import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';

import {
  CAO_ACCORDION,
  CaoAccordionAlign,
  CaoAccordionDisplayMode,
  CaoAccordionTogglePosition,
  ICaoAccordionHost,
  ICaoAccordionItemRef,
} from './accordion.token';

const HEADER_SELECTOR = '.cao-accordion-item__header:not(:disabled)';

/**
 * Container de `<cao-accordion-item>`. Controla o modo de expansão (único ou múltiplo),
 * a navegação por teclado e o tema (cores, posições e visibilidade) herdado pelos itens.
 */
@Component({
  selector: 'cao-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CAO_ACCORDION, useExisting: forwardRef(() => CaoAccordionComponent) }],
})
export class CaoAccordionComponent implements ICaoAccordionHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly items = new Set<ICaoAccordionItemRef>();

  // ----- Comportamento -----
  /** Permite vários itens expandidos ao mesmo tempo. */
  readonly multi = input<boolean>(false);
  /** Oculta o ícone de expandir/recolher em todos os itens (cada item pode sobrescrever). */
  readonly hideToggle = input<boolean>(false);
  /** Exibe ou oculta o accordion inteiro. */
  readonly isVisible = input<boolean>(true);
  /** Atributo `data-cy` para testes E2E. */
  readonly dataCy = input<string>('');

  // ----- Posição / layout -----
  readonly togglePosition = input<CaoAccordionTogglePosition>('after');
  readonly headerAlign = input<CaoAccordionAlign>('start');
  readonly contentAlign = input<CaoAccordionAlign>('start');
  readonly displayMode = input<CaoAccordionDisplayMode>('default');

  // ----- Cores -----
  readonly headerBgColor = input<string>('');
  readonly headerTextColor = input<string>('');
  readonly headerHoverBgColor = input<string>('');
  readonly headerActiveBgColor = input<string>('');
  readonly activeColor = input<string>('');
  readonly contentBgColor = input<string>('');
  readonly contentTextColor = input<string>('');
  readonly borderColor = input<string>('');
  readonly disabledColor = input<string>('');
  readonly focusRingColor = input<string>('');
  readonly iconColor = input<string>('');

  // ----- Dimensões / animação -----
  readonly borderRadius = input<string>('');
  readonly gap = input<string>('');
  readonly headerPadding = input<string>('');
  readonly contentPadding = input<string>('');
  readonly animationDuration = input<string>('');

  private readonly hostStyle = computed(() => ({
    '--cao-accordion-header-bg': this.headerBgColor() || null,
    '--cao-accordion-header-text': this.headerTextColor() || null,
    '--cao-accordion-header-hover-bg': this.headerHoverBgColor() || null,
    '--cao-accordion-header-active-bg': this.headerActiveBgColor() || null,
    '--cao-accordion-active-color': this.activeColor() || null,
    '--cao-accordion-content-bg': this.contentBgColor() || null,
    '--cao-accordion-content-text': this.contentTextColor() || null,
    '--cao-accordion-border-color': this.borderColor() || null,
    '--cao-accordion-disabled-color': this.disabledColor() || null,
    '--cao-accordion-focus-ring': this.focusRingColor() || null,
    '--cao-accordion-icon-color': this.iconColor() || null,
    '--cao-accordion-radius': this.borderRadius() || null,
    '--cao-accordion-gap': this.gap() || null,
    '--cao-accordion-header-padding': this.headerPadding() || null,
    '--cao-accordion-content-padding': this.contentPadding() || null,
    '--cao-accordion-duration': this.animationDuration() || null,
    '--cao-accordion-content-align': this.contentAlign(),
  }));

  @HostBinding('style')
  get styleBinding(): Record<string, string | null> {
    return this.hostStyle();
  }

  @HostBinding('attr.data-cy')
  get dataCyAttr(): string | null {
    return this.dataCy() || null;
  }

  @HostBinding('class.cao-accordion--hidden')
  get hiddenClass(): boolean {
    return !this.isVisible();
  }

  @HostBinding('class.cao-accordion--default')
  get defaultModeClass(): boolean {
    return this.displayMode() === 'default';
  }

  @HostBinding('class.cao-accordion--flat')
  get flatModeClass(): boolean {
    return this.displayMode() === 'flat';
  }

  @HostBinding('class.cao-accordion--separated')
  get separatedModeClass(): boolean {
    return this.displayMode() === 'separated';
  }

  /** Expande todos os itens. Só tem efeito quando `multi` está ativo. */
  openAll(): void {
    if (!this.multi()) {
      return;
    }
    this.items.forEach((item) => item.open());
  }

  /** Recolhe todos os itens. */
  closeAll(): void {
    this.items.forEach((item) => item.close());
  }

  register(item: ICaoAccordionItemRef): void {
    this.items.add(item);
  }

  unregister(item: ICaoAccordionItemRef): void {
    this.items.delete(item);
  }

  /** Chamado pelos itens ao expandir: no modo único, recolhe os demais. */
  notifyOpened(item: ICaoAccordionItemRef): void {
    if (this.multi()) {
      return;
    }
    this.items.forEach((other) => {
      if (other !== item && other.expanded()) {
        other.close();
      }
    });
  }

  /** Navegação por teclado entre cabeçalhos: ↑ ↓ Home End. */
  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const root = this.host.nativeElement;
    const target = event.target as HTMLElement | null;

    if (!target?.classList.contains('cao-accordion-item__header') || target.closest('cao-accordion') !== root) {
      return;
    }

    const headers = Array.from(root.querySelectorAll<HTMLElement>(HEADER_SELECTOR)).filter(
      (header) => header.closest('cao-accordion') === root && !header.closest('.cao-accordion-item--hidden'),
    );
    const current = headers.indexOf(target);
    const last = headers.length - 1;
    let next: number;

    switch (event.key) {
      case 'ArrowDown':
        next = current >= last ? 0 : current + 1;
        break;
      case 'ArrowUp':
        next = current <= 0 ? last : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    headers[next]?.focus();
  }
}