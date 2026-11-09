import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';

import { CaoProgressBarMode } from './progress-bar.model';

const clampPercent = (value: number): number => Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

@Component({
  selector: 'cao-progress-bar',
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoProgressBarComponent {
  /** Modo de exibição. Padrão: `'determinate'`. */
  readonly mode = input<CaoProgressBarMode>('determinate');
  /** Progresso de 0 a 100 (modos `determinate` e `buffer`). */
  readonly value = input(0, { transform: numberAttribute });
  /** Valor do buffer de 0 a 100 (modo `buffer`). */
  readonly bufferValue = input(0, { transform: numberAttribute });

  /** Cor da barra de progresso (qualquer cor CSS). */
  readonly color = input<string>('');
  /** Cor do trilho. */
  readonly trackColor = input<string>('');
  /** Cor do buffer (modo `buffer`). */
  readonly bufferColor = input<string>('');
  /** Altura da barra. */
  readonly height = input<string>('4px');
  /** Raio da borda. Padrão: totalmente arredondada. */
  readonly borderRadius = input<string>('');
  /** Duração do ciclo da animação nos modos indeterminado/query/buffer. */
  readonly animationDuration = input<string>('');
  /** Exibe o percentual ao lado da barra (modos `determinate` e `buffer`). */
  readonly showValue = input<boolean>(false);

  readonly ariaLabel = input<string>('');
  readonly ariaLabelledBy = input<string>('');
  readonly dataCy = input<string>('');

  protected readonly clampedValue = computed<number>(() => clampPercent(this.value()));
  protected readonly clampedBuffer = computed<number>(() => clampPercent(this.bufferValue()));

  protected readonly hasValue = computed<boolean>(() => this.mode() === 'determinate' || this.mode() === 'buffer');

  protected readonly ariaValueNow = computed<number | null>(() =>
    this.hasValue() ? Math.round(this.clampedValue()) : null,
  );

  protected readonly valueLabel = computed<string>(() => `${Math.round(this.clampedValue())}%`);
}