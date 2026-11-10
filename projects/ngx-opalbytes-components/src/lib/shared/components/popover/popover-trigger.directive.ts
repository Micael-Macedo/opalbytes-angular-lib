import { DestroyRef, Directive, ElementRef, OnDestroy, OnInit, Renderer2, booleanAttribute, inject, input, numberAttribute } from '@angular/core';

import { CaoPopoverComponent } from './popover';
import { CaoPopoverTrigger } from './popover.model';

/**
 * Liga um elemento a um `<cao-popover>` de forma declarativa.
 *
 * ```html
 * <button [caoPopoverTrigger]="pop">Abrir</button>
 * <cao-popover #pop>Conteúdo</cao-popover>
 * ```
 */
@Directive({
  selector: '[caoPopoverTrigger]',
  exportAs: 'caoPopoverTrigger',
})
export class CaoPopoverTriggerDirective implements OnInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  private timer: ReturnType<typeof setTimeout> | null = null;
  private panelHovered = false;
  private panelSubscription: { unsubscribe(): void } | null = null;

  /** Instância do popover controlado por este elemento. */
  readonly caoPopoverTrigger = input.required<CaoPopoverComponent>();
  /** Evento que aciona o popover. Padrão: `'click'`. */
  readonly caoPopoverTriggerOn = input<CaoPopoverTrigger>('click');
  /** Atraso (ms) para abrir/fechar no modo `hover`. */
  readonly caoPopoverHoverDelay = input(150, { transform: numberAttribute });
  /** Desabilita o gatilho. */
  readonly caoPopoverDisabled = input(false, { transform: booleanAttribute });

  constructor() {
    const unlisteners = [
      this.renderer.listen(this.element, 'click', (event: Event) => this.onClick(event)),
      this.renderer.listen(this.element, 'mouseenter', () => this.onMouseEnter()),
      this.renderer.listen(this.element, 'mouseleave', () => this.onMouseLeave()),
      this.renderer.listen(this.element, 'focusin', () => this.onFocusIn()),
      this.renderer.listen(this.element, 'focusout', (event: FocusEvent) => this.onFocusOut(event)),
    ];
    this.destroyRef.onDestroy(() => unlisteners.forEach((unlisten) => unlisten()));
  }

  ngOnInit(): void {
    this.panelSubscription = this.caoPopoverTrigger().panelHoverChange.subscribe((hovered) =>
      this.onPanelHover(hovered),
    );
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.panelSubscription?.unsubscribe();
  }

  private get active(): boolean {
    return !this.caoPopoverDisabled();
  }

  private onClick(event: Event): void {
    if (this.active && this.caoPopoverTriggerOn() === 'click') {
      this.caoPopoverTrigger().toggle(event, this.element);
    }
  }

  private onMouseEnter(): void {
    if (!this.active || this.caoPopoverTriggerOn() !== 'hover') {
      return;
    }
    this.clearTimer();
    this.timer = setTimeout(() => this.caoPopoverTrigger().show(null, this.element, { focus: false }), this.caoPopoverHoverDelay());
  }

  private onMouseLeave(): void {
    if (this.caoPopoverTriggerOn() === 'hover') {
      this.scheduleHide();
    }
  }

  private onPanelHover(hovered: boolean): void {
    if (this.caoPopoverTriggerOn() !== 'hover') {
      return;
    }
    this.panelHovered = hovered;
    if (hovered) {
      this.clearTimer();
    } else {
      this.scheduleHide();
    }
  }

  private onFocusIn(): void {
    if (this.active && this.caoPopoverTriggerOn() === 'focus') {
      this.caoPopoverTrigger().show(null, this.element, { focus: false });
    }
  }

  private onFocusOut(event: FocusEvent): void {
    if (this.caoPopoverTriggerOn() !== 'focus') {
      return;
    }
    const popover = this.caoPopoverTrigger();
    if (!popover.containsNode(event.relatedTarget as Node | null)) {
      popover.hide();
    }
  }

  private scheduleHide(): void {
    this.clearTimer();
    this.timer = setTimeout(() => {
      if (!this.panelHovered) {
        this.caoPopoverTrigger().hide();
      }
    }, this.caoPopoverHoverDelay());
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}