import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  input,
  model,
  output,
  untracked,
} from '@angular/core';

import { CAO_ACCORDION, CaoAccordionAlign, CaoAccordionTogglePosition, ICaoAccordionItemRef } from '../accordion/accordion.token';


let nextId = 0;

/**
 * Item do accordion. Pode ser usado dentro de `<cao-accordion>` ou isolado (como um cartão expansível).
 * Os inputs de cor/posição, quando informados, sobrescrevem os valores definidos no accordion.
 */
@Component({
  selector: 'cao-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoAccordionItemComponent implements ICaoAccordionItemRef {
  private readonly accordion = inject(CAO_ACCORDION, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private previousExpanded: boolean | null = null;

  protected readonly headerId = `cao-accordion-header-${nextId}`;
  protected readonly panelId = `cao-accordion-panel-${nextId++}`;

  // ----- Conteúdo -----
  readonly label = input<string>('');
  readonly description = input<string>('');
  /** Nível do heading (aria-level) do cabeçalho. */
  readonly headingLevel = input<number>(3);

  // ----- Estado -----
  /** Estado de expansão. Suporta two-way binding: `[(expanded)]`. */
  readonly expanded = model<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  /** Exibe ou oculta o item. */
  readonly isVisible = input<boolean>(true);
  readonly dataCy = input<string>('');

  // ----- Posição (sobrescreve o accordion quando informado) -----
  readonly hideToggle = input<boolean | undefined>(undefined);
  readonly togglePosition = input<CaoAccordionTogglePosition | undefined>(undefined);
  readonly headerAlign = input<CaoAccordionAlign | undefined>(undefined);

  // ----- Cores (sobrescrevem o accordion quando informadas) -----
  readonly headerBgColor = input<string>('');
  readonly headerTextColor = input<string>('');
  readonly headerActiveBgColor = input<string>('');
  readonly activeColor = input<string>('');
  readonly contentBgColor = input<string>('');
  readonly contentTextColor = input<string>('');
  readonly borderColor = input<string>('');
  readonly iconColor = input<string>('');

  // ----- Eventos -----
  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly toggleHidden = computed(
    () => this.hideToggle() ?? this.accordion?.hideToggle() ?? false,
  );
  protected readonly togglePos = computed(
    () => this.togglePosition() ?? this.accordion?.togglePosition() ?? 'after',
  );
  private readonly align = computed(() => this.headerAlign() ?? this.accordion?.headerAlign() ?? 'start');
  private readonly isCard = computed(() => (this.accordion?.displayMode() ?? 'separated') === 'separated');

  protected readonly headerDataCy = computed(() => (this.dataCy() ? `${this.dataCy()}-header` : null));
  protected readonly panelDataCy = computed(() => (this.dataCy() ? `${this.dataCy()}-content` : null));

  private readonly hostStyle = computed(() => ({
    '--cao-accordion-header-bg': this.headerBgColor() || null,
    '--cao-accordion-header-text': this.headerTextColor() || null,
    '--cao-accordion-header-active-bg': this.headerActiveBgColor() || null,
    '--cao-accordion-active-color': this.activeColor() || null,
    '--cao-accordion-content-bg': this.contentBgColor() || null,
    '--cao-accordion-content-text': this.contentTextColor() || null,
    '--cao-accordion-border-color': this.borderColor() || null,
    '--cao-accordion-icon-color': this.iconColor() || null,
    '--cao-accordion-header-align': this.align(),
  }));

  @HostBinding('style')
  get styleBinding(): Record<string, string | null> {
    return this.hostStyle();
  }

  @HostBinding('attr.data-cy')
  get dataCyAttr(): string | null {
    return this.dataCy() || null;
  }

  @HostBinding('class.cao-accordion-item--hidden')
  get hiddenClass(): boolean {
    return !this.isVisible();
  }

  @HostBinding('class.cao-accordion-item--expanded')
  get expandedClass(): boolean {
    return this.expanded();
  }

  @HostBinding('class.cao-accordion-item--card')
  get cardClass(): boolean {
    return this.isCard();
  }

  constructor() {
    this.accordion?.register(this);
    this.destroyRef.onDestroy(() => this.accordion?.unregister(this));

    effect(() => {
      const isExpanded = this.expanded();
      untracked(() => this.handleExpandedChange(isExpanded));
    });
  }

  /** Alterna o estado (ignorado quando o item está desabilitado). */
  toggle(): void {
    if (this.isDisabled()) {
      return;
    }
    this.expanded.update((value) => !value);
  }

  open(): void {
    this.expanded.set(true);
  }

  close(): void {
    this.expanded.set(false);
  }

  private handleExpandedChange(isExpanded: boolean): void {
    if (isExpanded) {
      this.accordion?.notifyOpened(this);
    }

    if (this.previousExpanded !== null && this.previousExpanded !== isExpanded) {
      const event = isExpanded ? this.opened : this.closed;
      event.emit();
    }
    this.previousExpanded = isExpanded;
  }
}