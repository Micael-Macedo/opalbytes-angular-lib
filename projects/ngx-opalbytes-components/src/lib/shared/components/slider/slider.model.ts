import type { CaoSliderComponent } from './slider';

/** Identifica o thumb: `start` (único ou inicial) ou `end` (final, apenas no modo `range`). */
export type CaoSliderThumb = 'start' | 'end';

/** Evento emitido a cada alteração feita pelo usuário. */
export interface ICaoSliderChangeEvent {
  /** Valor único (ou inicial, no modo `range`). */
  value: number;
  /** Valor final (modo `range`); `null` no modo simples. */
  endValue: number | null;
  /** Thumb que originou a alteração. */
  thumb: CaoSliderThumb;
  /** Instância que originou o evento. */
  source: CaoSliderComponent;
}