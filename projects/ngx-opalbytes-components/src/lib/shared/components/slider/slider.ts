import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CaoSliderThumb, ICaoSliderChangeEvent } from './slider.model';

interface ICaoSliderThumbView {
  id: CaoSliderThumb;
  value: number;
  pct: number;
  min: number;
  max: number;
  ariaLabel: string;
}

interface ICaoSliderTick {
  value: number;
  pct: number;
}

const MAX_TICKS = 101;
const PAGE_STEPS = 10;

@Component({
  selector: 'cao-slider',
  templateUrl: './slider.html',
  styleUrl: './slider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CaoSliderComponent), multi: true }],
})
export class CaoSliderComponent implements ControlValueAccessor {
  private readonly trackRef = viewChild.required<ElementRef<HTMLElement>>('track');

  private onChangeFn: (value: number | [number, number]) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;
  private pendingTie = false;

  private readonly cvaDisabled = signal(false);
  protected readonly dragging = signal<CaoSliderThumb | null>(null);

  /** Valor mínimo. */
  readonly min = input(0, { transform: numberAttribute });
  /** Valor máximo. */
  readonly max = input(100, { transform: numberAttribute });
  /** Incremento entre valores. */
  readonly step = input(1, { transform: numberAttribute });
  /** Habilita dois thumbs (intervalo). Com `ngModel`/formulários, o valor é `[inicio, fim]`. */
  readonly range = input(false, { transform: booleanAttribute });
  /** Exibe um balão com o valor sobre o thumb ao passar o mouse, focar ou arrastar. */
  readonly discrete = input(false, { transform: booleanAttribute });
  /** Exibe marcas em cada passo (ocultas se houver mais de 101 passos). */
  readonly showTickMarks = input(false, { transform: booleanAttribute });
  readonly isDisabled = input(false, { transform: booleanAttribute });
  /** Alias de `isDisabled`. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Valor único (ou inicial, no modo `range`). Suporta `[(value)]`. */
  readonly value = model<number | null>(null);
  /** Valor final (modo `range`). Suporta `[(endValue)]`. */
  readonly endValue = model<number | null>(null);

  /** Formata o valor exibido no balão e no `aria-valuetext`. */
  readonly displayWith = input<(value: number) => string>((value) => String(value));

  readonly color = input<string>('');
  readonly trackColor = input<string>('');
  readonly thumbColor = input<string>('');
  readonly trackHeight = input<string>('');
  readonly thumbSize = input<string>('');

  readonly ariaLabel = input<string>('');
  readonly ariaLabelledBy = input<string>('');
  readonly startAriaLabel = input<string>('Valor inicial');
  readonly endAriaLabel = input<string>('Valor final');
  readonly dataCy = input<string>('');

  /** Emitido quando o usuário começa a arrastar. */
  readonly dragStarted = output<void>();
  /** Emitido quando o usuário solta o thumb. */
  readonly dragEnded = output<void>();
  /** Emitido a cada alteração feita pelo usuário (ponteiro ou teclado). */
  readonly sliderChange = output<ICaoSliderChangeEvent>();

  protected readonly isInactive = computed<boolean>(
    () => this.isDisabled() || this.disabled() || this.cvaDisabled(),
  );

  private readonly bounds = computed(() => {
    const min = this.min();
    return { min, max: Math.max(min, this.max()) };
  });

  private readonly stepValue = computed<number>(() => (this.step() > 0 ? this.step() : 1));

  private readonly decimals = computed<number>(() => {
    const text = String(this.stepValue());
    const index = text.indexOf('.');
    return index === -1 ? 0 : text.length - index - 1;
  });

  protected readonly resolvedStart = computed<number>(() => {
    const { min, max } = this.bounds();
    const start = this.clamp(this.value() ?? min);
    if (!this.range()) {
      return start;
    }
    return Math.min(start, this.clamp(this.endValue() ?? max));
  });

  protected readonly resolvedEnd = computed<number>(() => {
    const { min, max } = this.bounds();
    if (!this.range()) {
      return this.resolvedStart();
    }
    return Math.max(this.clamp(this.value() ?? min), this.clamp(this.endValue() ?? max));
  });

  protected readonly startPct = computed<number>(() => this.toPercent(this.resolvedStart()));
  protected readonly endPct = computed<number>(() => this.toPercent(this.resolvedEnd()));

  protected readonly fillStart = computed<number>(() => (this.range() ? this.startPct() : 0));
  protected readonly fillWidth = computed<number>(() =>
    this.range() ? this.endPct() - this.startPct() : this.startPct(),
  );

  protected readonly thumbs = computed<ICaoSliderThumbView[]>(() => {
    const { min, max } = this.bounds();
    const start = this.resolvedStart();
    const end = this.resolvedEnd();

    if (!this.range()) {
      return [{ id: 'start', value: start, pct: this.startPct(), min, max, ariaLabel: this.ariaLabel() }];
    }
    return [
      { id: 'start', value: start, pct: this.startPct(), min, max: end, ariaLabel: this.startAriaLabel() },
      { id: 'end', value: end, pct: this.endPct(), min: start, max, ariaLabel: this.endAriaLabel() },
    ];
  });

  protected readonly ticks = computed<ICaoSliderTick[]>(() => {
    if (!this.showTickMarks()) {
      return [];
    }
    const { min, max } = this.bounds();
    const step = this.stepValue();
    const count = Math.floor((max - min) / step) + 1;
    if (count < 2 || count > MAX_TICKS) {
      return [];
    }
    return Array.from({ length: count }, (_, index) => {
      const value = this.round(min + index * step);
      return { value, pct: this.toPercent(value) };
    });
  });

  // --- ControlValueAccessor ---

  writeValue(value: number | [number, number] | null | undefined): void {
    if (Array.isArray(value)) {
      this.value.set(value[0] ?? null);
      this.endValue.set(value[1] ?? null);
    } else {
      this.value.set(typeof value === 'number' ? value : null);
    }
  }

  registerOnChange(fn: (value: number | [number, number]) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  // --- Template helpers ---

  protected format(value: number): string {
    return this.displayWith()(value);
  }

  protected isTickActive(pct: number): boolean {
    return this.range() ? pct >= this.startPct() && pct <= this.endPct() : pct <= this.startPct();
  }

  protected onBlur(): void {
    this.onTouchedFn();
  }

  // --- Pointer ---

  protected onPointerDown(event: PointerEvent): void {
    if (this.isInactive() || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    const thumbElement = (event.target as HTMLElement).closest<HTMLElement>('[data-thumb]');
    const raw = this.snap(this.rawValueFromPointer(event));
    const start = this.resolvedStart();
    const end = this.resolvedEnd();
    let thumb: CaoSliderThumb = 'start';
    this.pendingTie = false;

    if (this.range()) {
      if (start === end) {
        if (raw === start) {
          this.pendingTie = true;
          thumb = thumbElement?.dataset['thumb'] === 'end' ? 'end' : 'start';
        } else {
          thumb = raw > start ? 'end' : 'start';
        }
      } else if (thumbElement) {
        thumb = thumbElement.dataset['thumb'] === 'end' ? 'end' : 'start';
      } else {
        thumb = Math.abs(raw - start) < Math.abs(raw - end) ? 'start' : 'end';
      }
    }

    if (!thumbElement) {
      this.updateThumb(thumb, raw);
    }

    this.trackRef().nativeElement.setPointerCapture?.(event.pointerId);
    this.dragging.set(thumb);
    this.focusThumb(thumb);
    this.dragStarted.emit();
    event.preventDefault();
  }

  protected onPointerMove(event: PointerEvent): void {
    const thumb = this.dragging();
    if (!thumb || this.isInactive()) {
      return;
    }

    const raw = this.snap(this.rawValueFromPointer(event));

    if (this.pendingTie) {
      const start = this.resolvedStart();
      if (raw === start) {
        return;
      }
      this.pendingTie = false;
      const decided: CaoSliderThumb = raw > start ? 'end' : 'start';
      this.dragging.set(decided);
      this.focusThumb(decided);
      this.updateThumb(decided, raw);
      return;
    }

    this.updateThumb(thumb, raw);
  }

  protected onPointerEnd(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    this.pendingTie = false;
    this.dragging.set(null);
    this.trackRef().nativeElement.releasePointerCapture?.(event.pointerId);
    this.dragEnded.emit();
    this.onTouchedFn();
  }

  // --- Keyboard ---

  protected onKeydown(event: KeyboardEvent, thumb: CaoSliderThumb): void {
    if (this.isInactive()) {
      return;
    }

    const { min, max } = this.bounds();
    const step = this.stepValue();
    const current = thumb === 'start' ? this.resolvedStart() : this.resolvedEnd();
    let next: number;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - step;
        break;
      case 'PageUp':
        next = current + step * PAGE_STEPS;
        break;
      case 'PageDown':
        next = current - step * PAGE_STEPS;
        break;
      case 'Home':
        next = min;
        break;
      case 'End':
        next = max;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.updateThumb(thumb, this.snap(next));
  }

  // --- Internals ---

  private updateThumb(thumb: CaoSliderThumb, next: number): void {
    const range = this.range();
    let value = this.clamp(next);

    if (range) {
      value = thumb === 'start' ? Math.min(value, this.resolvedEnd()) : Math.max(value, this.resolvedStart());
    }

    const current = thumb === 'start' ? this.resolvedStart() : this.resolvedEnd();
    if (value === current) {
      return;
    }

    if (range && this.endValue() === null) {
      this.endValue.set(this.resolvedEnd());
    }
    if (thumb === 'start') {
      this.value.set(value);
    } else {
      this.endValue.set(value);
    }

    const start = this.resolvedStart();
    const end = this.resolvedEnd();
    this.onChangeFn(range ? [start, end] : start);
    this.sliderChange.emit({ value: start, endValue: range ? end : null, thumb, source: this });
  }

  private rawValueFromPointer(event: PointerEvent): number {
    const rect = this.trackRef().nativeElement.getBoundingClientRect();
    const { min, max } = this.bounds();
    const ratio = rect.width > 0 ? Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)) : 0;
    return min + ratio * (max - min);
  }

  private snap(raw: number): number {
    const { min } = this.bounds();
    const step = this.stepValue();
    return this.clamp(this.round(Math.round((raw - min) / step) * step + min));
  }

  private clamp(value: number): number {
    const { min, max } = this.bounds();
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  }

  private round(value: number): number {
    return Number(value.toFixed(this.decimals()));
  }

  private toPercent(value: number): number {
    const { min, max } = this.bounds();
    return max === min ? 0 : ((value - min) / (max - min)) * 100;
  }

  private focusThumb(thumb: CaoSliderThumb): void {
    this.trackRef().nativeElement.querySelector<HTMLElement>(`[data-thumb="${thumb}"]`)?.focus({ preventScroll: true });
  }
}