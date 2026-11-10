import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  CaoCmdKFilterFn,
  CaoCmdKPosition,
  ICaoCmdKGroup,
  ICaoCmdKItem,
  ICaoCmdKSelectEvent,
} from './command-k.model';
import { CaoBaseIcon } from '../base-icon/base-icon';

interface ICmdKSourceGroup {
  key: string;
  heading: string;
  items: ICaoCmdKItem[];
}

interface ICmdKEntry {
  item: ICaoCmdKItem;
  heading: string;
  index: number;
  domId: string;
}

interface ICmdKViewGroup {
  key: string;
  heading: string;
  headingId: string;
  entries: ICmdKEntry[];
}

const MIN_FUZZY_LENGTH = 3;

let nextId = 0;

const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const isSubsequence = (query: string, text: string): boolean => {
  let position = 0;
  for (const char of text) {
    if (char === query[position]) {
      position++;
      if (position === query.length) {
        return true;
      }
    }
  }
  return false;
};

const isWordStart = (text: string, index: number): boolean => index === 0 || text[index - 1] === ' ';

const isFuzzyMatch = (query: string, text: string): boolean => {
  for (let index = 0; index < text.length; index++) {
    if (text[index] === query[0] && isWordStart(text, index) && isSubsequence(query, text.slice(index))) {
      return true;
    }
  }
  return false;
};

/** Pontuação de relevância: 0 = não corresponde. */
const scoreItem = (item: ICaoCmdKItem, query: string): number => {
  const label = normalize(item.label);
  if (label === query) {
    return 100;
  }
  if (label.startsWith(query)) {
    return 80;
  }
  if (label.split(/\s+/).some((word) => word.startsWith(query))) {
    return 60;
  }
  if (label.includes(query)) {
    return 40;
  }
  const extra = normalize([item.description ?? '', ...(item.keywords ?? [])].join(' '));
  if (extra.includes(query)) {
    return 20;
  }
  return query.length >= MIN_FUZZY_LENGTH && isFuzzyMatch(query, label) ? 10 : 0;
};

@Component({
  selector: 'cao-cmd-k',
  imports: [CaoBaseIcon],
  templateUrl: './command-k.html',
  styleUrl: './command-k.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'caoCmdK',
})
export class CaoCmdKComponent {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogTemplate = viewChild<TemplateRef<unknown>>('dialogTemplate');

  private overlayRef: OverlayRef | null = null;
  private subscriptions = new Subscription();
  private previousFocus: HTMLElement | null = null;

  private readonly instanceId = `cao-cmdk-${nextId++}`;
  protected readonly listId = `${this.instanceId}-list`;
  protected readonly activeIndex = signal(-1);

  protected readonly modifierLabel =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl';

  /** Controla a visibilidade da paleta. Suporta `[(open)]`. */
  readonly open = model(false);
  /** Texto digitado na busca. Suporta `[(query)]`. */
  readonly query = model('');

  /** Itens sem grupo (exibidos antes dos grupos). */
  readonly items = input<ICaoCmdKItem[]>([]);
  /** Grupos de itens. */
  readonly groups = input<ICaoCmdKGroup[]>([]);

  /** Placeholder do campo de busca da paleta. */
  readonly placeholder = input<string>('Digite um comando ou pesquise...');
  /** Texto exibido quando nenhum item corresponde à busca. */
  readonly emptyText = input<string>('Nenhum resultado encontrado.');

  /** Exibe o campo (botão) que abre a paleta. Com `false`, use `[(open)]` ou o atalho. */
  readonly showTrigger = input(true, { transform: booleanAttribute });
  /** Texto do campo que abre a paleta. */
  readonly triggerPlaceholder = input<string>('Buscar comandos...');
  /** Habilita o atalho global `Ctrl + K` / `⌘ + K`. */
  readonly enableShortcut = input(true, { transform: booleanAttribute });
  /** Tecla usada com `Ctrl`/`⌘`. */
  readonly shortcutKey = input<string>('k');

  /** Fecha a paleta ao selecionar um item. */
  readonly closeOnSelect = input(true, { transform: booleanAttribute });
  /** Limpa a busca ao fechar. */
  readonly clearOnClose = input(true, { transform: booleanAttribute });
  /** Volta ao início/fim ao navegar além do último/primeiro item. */
  readonly loop = input(true, { transform: booleanAttribute });
  /** Filtra localmente. Use `false` para busca remota (controle `items`/`groups` via `(queryChange)`). */
  readonly localFilter = input(true, { transform: booleanAttribute });
  /** Função de filtro customizada (substitui o filtro padrão). */
  readonly filterFn = input<CaoCmdKFilterFn | null>(null);
  /** Posição vertical do painel. Padrão: centro da tela. */
  readonly position = input<CaoCmdKPosition>('center');

  readonly width = input<string>('640px');
  readonly listMaxHeight = input<string>('320px');
  readonly bgColor = input<string>('');
  readonly textColor = input<string>('');
  readonly borderColor = input<string>('');
  readonly activeBgColor = input<string>('');

  readonly ariaLabel = input<string>('Menu de comandos');
  readonly dataCy = input<string>('');

  /** Emitido ao selecionar um item. */
  readonly itemSelected = output<ICaoCmdKSelectEvent>();

  private readonly sourceGroups = computed<ICmdKSourceGroup[]>(() => {
    const all: ICmdKSourceGroup[] = [
      { key: 'ungrouped', heading: '', items: this.items() },
      ...this.groups().map((group, index) => ({
        key: `group-${group.id ?? index}`,
        heading: group.heading,
        items: group.items,
      })),
    ];
    return all.filter((group) => group.items.length > 0);
  });

  protected readonly visibleGroups = computed<ICmdKViewGroup[]>(() => {
    const query = normalize(this.query().trim());
    const customFilter = this.filterFn();
    const filterLocally = this.localFilter() && query.length > 0;
    let index = 0;

    return this.sourceGroups()
      .map((group) => {
        let items = group.items;

        if (filterLocally) {
          if (customFilter) {
            items = items.filter((item) => customFilter(item, this.query().trim()));
          } else {
            items = items
              .map((item) => ({ item, score: scoreItem(item, query) }))
              .filter((scored) => scored.score > 0)
              .sort((a, b) => b.score - a.score)
              .map((scored) => scored.item);
          }
        }

        return { group, items };
      })
      .filter(({ items }) => items.length > 0)
      .map(({ group, items }) => ({
        key: group.key,
        heading: group.heading,
        headingId: `${this.instanceId}-${group.key}`,
        entries: items.map((item) => ({
          item,
          heading: group.heading,
          index,
          domId: `${this.instanceId}-opt-${index++}`,
        })),
      }));
  });

  protected readonly flatEntries = computed<ICmdKEntry[]>(() =>
    this.visibleGroups().flatMap((group) => group.entries),
  );

  protected readonly activeDomId = computed<string | null>(
    () => this.flatEntries()[this.activeIndex()]?.domId ?? null,
  );

  constructor() {
    const unlisten = this.renderer.listen('document', 'keydown', (event: KeyboardEvent) =>
      this.onDocumentKeydown(event),
    );
    this.destroyRef.onDestroy(() => {
      unlisten();
      this.disposeOverlay();
    });

    effect(() => {
      const isOpen = this.open();
      const template = this.dialogTemplate();
      untracked(() => {
        if (isOpen && template) {
          this.attach(template);
        } else if (!isOpen) {
          this.detach();
        }
      });
    });
  }

  /** Abre a paleta. */
  show(): void {
    this.open.set(true);
  }

  /** Fecha a paleta. */
  close(): void {
    this.open.set(false);
  }

  /** Alterna a paleta. */
  toggle(): void {
    this.open.update((value) => !value);
  }

  // --- Template handlers ---

  protected onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(this.firstEnabledIndex());
    const list = this.overlayRef?.overlayElement.querySelector<HTMLElement>('.cao-cmdk__list');
    if (list) {
      list.scrollTop = 0;
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.move(-1);
        break;
      case 'Enter': {
        if (event.isComposing) {
          return;
        }
        event.preventDefault();
        const entry = this.flatEntries()[this.activeIndex()];
        if (entry) {
          this.select(entry);
        }
        break;
      }
      case 'Tab':
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  protected onItemKeydown(event: KeyboardEvent, entry: ICmdKEntry): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(entry);
    }
  }

  protected setActive(entry: ICmdKEntry): void {
    if (!entry.item.disabled && this.activeIndex() !== entry.index) {
      this.activeIndex.set(entry.index);
    }
  }

  protected select(entry: ICmdKEntry): void {
    if (entry.item.disabled) {
      return;
    }
    entry.item.command?.(entry.item);
    this.itemSelected.emit({ item: entry.item, group: entry.heading });
    if (this.closeOnSelect()) {
      this.close();
    }
  }

  protected toKeys(shortcut: string | string[]): string[] {
    return Array.isArray(shortcut) ? shortcut : [shortcut];
  }

  // --- Overlay ---

  private attach(template: TemplateRef<unknown>): void {
    if (this.overlayRef) {
      return;
    }

    this.previousFocus = document.activeElement as HTMLElement | null;

    const global = this.overlay.position().global().centerHorizontally();
    const positionStrategy = this.position() === 'top' ? global.top('15vh') : global.centerVertically();

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'cao-cmdk-pane',
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    this.overlayRef = overlayRef;

    this.subscriptions.add(overlayRef.backdropClick().subscribe(() => this.close()));
    this.subscriptions.add(
      overlayRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.close();
        }
      }),
    );

    this.activeIndex.set(this.firstEnabledIndex());
    overlayRef.attach(new TemplatePortal(template, this.viewContainerRef));
    overlayRef.overlayElement.querySelector<HTMLInputElement>('.cao-cmdk__input')?.focus();
  }

  private detach(): void {
    const overlayRef = this.overlayRef;
    if (!overlayRef) {
      return;
    }

    this.overlayRef = null;
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    overlayRef.dispose();

    if (this.clearOnClose()) {
      this.query.set('');
    }
    this.activeIndex.set(-1);

    const previous = this.previousFocus;
    this.previousFocus = null;
    previous?.focus?.({ preventScroll: true });
  }

  private disposeOverlay(): void {
    this.subscriptions.unsubscribe();
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  // --- Navegação ---

  private firstEnabledIndex(): number {
    return this.flatEntries().findIndex((entry) => !entry.item.disabled);
  }

  private move(step: 1 | -1): void {
    const entries = this.flatEntries();
    if (entries.length === 0) {
      return;
    }

    let index = this.activeIndex();
    for (let attempt = 0; attempt < entries.length; attempt++) {
      index += step;
      if (index >= entries.length) {
        if (!this.loop()) {
          return;
        }
        index = 0;
      } else if (index < 0) {
        if (!this.loop()) {
          return;
        }
        index = entries.length - 1;
      }

      const entry = entries[index];
      if (entry && !entry.item.disabled) {
        this.activeIndex.set(index);
        this.scrollActiveIntoView();
        return;
      }
    }
  }

  private scrollActiveIntoView(): void {
    const root = this.overlayRef?.overlayElement;
    if (!root) {
      return;
    }
    requestAnimationFrame(() => {
      const id = this.activeDomId();
      if (id) {
        root.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView?.({ block: 'nearest' });
      }
    });
  }

  private onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.enableShortcut()) {
      return;
    }
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) {
      return;
    }
    if (event.key.toLowerCase() !== this.shortcutKey().toLowerCase()) {
      return;
    }
    event.preventDefault();
    this.toggle();
  }
}