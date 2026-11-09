import { ConnectedOverlayPositionChange, Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { CaoPopoverAlign, CaoPopoverPosition, CaoPopoverTarget, ICaoPopoverShowOptions } from './popover.model';

export const CAO_POPOVER_POSITION_PREFIX = 'cao-popover-pos-';

const OPPOSITE: Record<CaoPopoverPosition, CaoPopoverPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const PERPENDICULAR: Record<CaoPopoverPosition, CaoPopoverPosition[]> = {
  top: ['right', 'left'],
  bottom: ['right', 'left'],
  left: ['bottom', 'top'],
  right: ['bottom', 'top'],
};

function toConnectedPosition(position: CaoPopoverPosition, align: CaoPopoverAlign, offset: number): ConnectedPosition {
  const panelClass = `${CAO_POPOVER_POSITION_PREFIX}${position}`;

  if (position === 'top' || position === 'bottom') {
    return {
      originX: align,
      originY: position === 'bottom' ? 'bottom' : 'top',
      overlayX: align,
      overlayY: position === 'bottom' ? 'top' : 'bottom',
      offsetY: position === 'bottom' ? offset : -offset,
      panelClass,
    };
  }

  const vertical = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
  return {
    originX: position === 'right' ? 'end' : 'start',
    originY: vertical,
    overlayX: position === 'right' ? 'start' : 'end',
    overlayY: vertical,
    offsetX: position === 'right' ? offset : -offset,
    panelClass,
  };
}

/** Posição preferida seguida das alternativas (oposta e perpendiculares) usadas quando não há espaço. */
export function buildPopoverPositions(
  position: CaoPopoverPosition,
  align: CaoPopoverAlign,
  offset: number,
): ConnectedPosition[] {
  const order = [position, OPPOSITE[position], ...PERPENDICULAR[position]];
  return order.map((item) => toConnectedPosition(item, align, offset));
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let nextId = 0;

@Component({
  selector: 'cao-popover',
  templateUrl: './popover.html',
  imports: [CommonModule],
  styleUrl: './popover.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'caoPopover',
})
export class CaoPopoverComponent {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');

  private overlayRef: OverlayRef | null = null;
  private origin: HTMLElement | null = null;
  private subscriptions = new Subscription();
  private focusMoved = false;
  private readonly openState = signal(false);

  protected readonly panelId = `cao-popover-${nextId++}`;
  protected readonly placement = signal<CaoPopoverPosition>('bottom');

  /** Lado do elemento de origem em que o popover aparece. Se não houver espaço, o CDK escolhe outro lado. */
  readonly position = input<CaoPopoverPosition>('bottom');
  /** Alinhamento em relação ao elemento de origem. */
  readonly align = input<CaoPopoverAlign>('center');
  /** Distância (px) entre a origem e o popover. */
  readonly offset = input(10, { transform: numberAttribute });
  /** Exibe a seta apontando para a origem. */
  readonly showArrow = input(true, { transform: booleanAttribute });
  /** Fecha ao clicar fora do popover. */
  readonly dismissable = input(true, { transform: booleanAttribute });
  /** Fecha ao pressionar `Esc`. */
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  /** Exibe o botão de fechar no canto superior direito. */
  readonly showCloseIcon = input(false, { transform: booleanAttribute });
  /** Move o foco para o primeiro elemento focável do popover ao abrir (e devolve à origem ao fechar). */
  readonly focusOnShow = input(true, { transform: booleanAttribute });

  /** Largura fixa do popover (ex.: `'320px'`). */
  readonly width = input<string>('');
  /** Largura máxima. */
  readonly maxWidth = input<string>('360px');
  readonly bgColor = input<string>('');
  readonly textColor = input<string>('');
  readonly borderColor = input<string>('');
  readonly borderRadius = input<string>('');
  readonly padding = input<string>('');
  /** Classe(s) CSS adicionais aplicadas ao painel do popover. */
  readonly styleClass = input<string>('');
  /** Classe(s) CSS adicionais aplicadas ao painel do overlay (CDK). */
  readonly panelClass = input<string | string[]>('');

  readonly role = input<string>('dialog');
  readonly ariaLabel = input<string>('');
  readonly ariaLabelledBy = input<string>('');
  readonly closeAriaLabel = input<string>('Fechar');
  readonly dataCy = input<string>('');

  /** Emitido após o popover ser aberto. */
  readonly shown = output<void>();
  /** Emitido após o popover ser fechado. */
  readonly hidden = output<void>();
  /** Emitido quando o ponteiro entra/sai do painel (usado pelo gatilho `hover`). */
  readonly panelHoverChange = output<boolean>();

  /** `true` enquanto o popover está aberto. */
  readonly isOpen = this.openState.asReadonly();

  constructor() {
    this.destroyRef.onDestroy(() => this.dispose());
  }

  /** Abre o popover se estiver fechado (ou aberto em outra origem); fecha se já estiver aberto na mesma origem. */
  toggle(event?: Event | null, target?: CaoPopoverTarget, options: ICaoPopoverShowOptions = {}): void {
    const origin = this.resolveOrigin(event, target);
    if (!origin) {
      return;
    }
    if (this.openState() && this.origin === origin) {
      this.hide();
      return;
    }
    this.show(event, origin, options);
  }

  /** Abre o popover ancorado em `target` (ou em `event.currentTarget`). */
  show(event?: Event | null, target?: CaoPopoverTarget, options: ICaoPopoverShowOptions = {}): void {
    const origin = this.resolveOrigin(event, target);
    if (!origin) {
      return;
    }
    if (this.openState()) {
      if (this.origin === origin) {
        return;
      }
      this.close(false);
    }

    this.origin = origin;
    this.placement.set(this.position());

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(buildPopoverPositions(this.position(), this.align(), this.offset()))
      .withFlexibleDimensions(false)
      .withPush(false)
      .withViewportMargin(8);

    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: this.panelClass(),
    });
    this.overlayRef = overlayRef;

    this.subscriptions.add(positionStrategy.positionChanges.subscribe((change) => this.onPositionChange(change)));
    this.subscriptions.add(
      overlayRef.outsidePointerEvents().subscribe((event) => {
        if (this.dismissable() && !this.origin?.contains(event.target as Node)) {
          this.close(false);
        }
      }),
    );
    this.subscriptions.add(
      overlayRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape' && this.closeOnEscape()) {
          event.preventDefault();
          this.close(true);
        }
      }),
    );

    overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    this.openState.set(true);
    this.setOriginAria(origin, true);

    if (options.focus ?? this.focusOnShow()) {
      this.focusPanel(overlayRef.overlayElement);
    }
    this.shown.emit();
  }

  /** Fecha o popover. */
  hide(): void {
    this.close(true);
  }

  /** Recalcula a posição (útil se a origem mudou de lugar ou o conteúdo mudou de tamanho). */
  reposition(): void {
    this.overlayRef?.updatePosition();
  }

  /** Indica se o nó está dentro do painel do popover aberto. */
  containsNode(node: Node | null | undefined): boolean {
    return !!node && !!this.overlayRef?.overlayElement.contains(node);
  }

  protected onCloseClick(): void {
    this.close(true);
  }

  private close(restoreFocus: boolean): void {
    const overlayRef = this.overlayRef;
    if (!overlayRef) {
      return;
    }
    const origin = this.origin;
    const shouldRestoreFocus = restoreFocus && this.focusMoved;

    this.overlayRef = null;
    this.origin = null;
    this.focusMoved = false;
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    overlayRef.dispose();

    this.openState.set(false);
    this.setOriginAria(origin, false);
    if (shouldRestoreFocus) {
      origin?.focus({ preventScroll: true });
    }
    this.hidden.emit();
  }

  private dispose(): void {
    this.subscriptions.unsubscribe();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.origin = null;
  }

  private onPositionChange(change: ConnectedOverlayPositionChange): void {
    const panelClass = change.connectionPair.panelClass;
    const value = Array.isArray(panelClass) ? panelClass[0] : panelClass;
    if (typeof value === 'string' && value.startsWith(CAO_POPOVER_POSITION_PREFIX)) {
      this.placement.set(value.slice(CAO_POPOVER_POSITION_PREFIX.length) as CaoPopoverPosition);
    }
  }

  private resolveOrigin(event?: Event | null, target?: CaoPopoverTarget): HTMLElement | null {
    if (target) {
      return target instanceof ElementRef ? target.nativeElement : target;
    }
    return (event?.currentTarget ?? event?.target ?? null) as HTMLElement | null;
  }

  private focusPanel(overlayElement: HTMLElement): void {
    const panel = overlayElement.querySelector<HTMLElement>('.cao-popover');
    const target = panel?.querySelector<HTMLElement>(`.cao-popover__content ${FOCUSABLE_SELECTOR}`) ?? panel;
    if (target) {
      target.focus({ preventScroll: true });
      this.focusMoved = true;
    }
  }

  private setOriginAria(origin: HTMLElement | null, open: boolean): void {
    if (!origin) {
      return;
    }
    origin.setAttribute('aria-expanded', String(open));
    if (open) {
      if (this.role() === 'dialog') {
        origin.setAttribute('aria-haspopup', 'dialog');
      }
      origin.setAttribute('aria-controls', this.panelId);
    } else {
      origin.removeAttribute('aria-controls');
    }
  }
}