import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';

import { CaoProgressSpinnerLinecap, CaoProgressSpinnerMode } from './progress-spinner.model';

const MIN_DIAMETER = 8;

const clampPercent = (value: number): number => Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

@Component({
  selector: 'cao-progress-spinner',
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoProgressSpinnerComponent {
  /** Modo de exibição. Padrão: `'indeterminate'`. */
  readonly mode = input<CaoProgressSpinnerMode>('indeterminate');
  /** Progresso de 0 a 100 (modo `determinate`). */
  readonly value = input(0, { transform: numberAttribute });
  /** Diâmetro em px. */
  readonly diameter = input(48, { transform: numberAttribute });
  /** Espessura do traço em px. `0` = automático (10% do diâmetro). */
  readonly strokeWidth = input(0, { transform: numberAttribute });
  /** Formato da ponta do traço. */
  readonly strokeLinecap = input<CaoProgressSpinnerLinecap>('round');

  /** Cor do indicador (qualquer cor CSS). */
  readonly color = input<string>('');
  /** Cor do trilho (círculo de fundo). Padrão: transparente. */
  readonly trackColor = input<string>('');
  /** Duração de uma volta completa no modo indeterminado. */
  readonly animationDuration = input<string>('');
  /** Exibe o percentual no centro (modo `determinate`). */
  readonly showValue = input<boolean>(false);
  /** Cor do percentual. */
  readonly textColor = input<string>('');

  readonly ariaLabel = input<string>('');
  readonly ariaLabelledBy = input<string>('');
  readonly dataCy = input<string>('');

  protected readonly isDeterminate = computed<boolean>(() => this.mode() === 'determinate');

  protected readonly size = computed<number>(() => {
    const diameter = this.diameter();
    return Number.isFinite(diameter) ? Math.max(MIN_DIAMETER, diameter) : 48;
  });

  protected readonly stroke = computed<number>(() => {
    const width = this.strokeWidth();
    const raw = width > 0 ? width : this.size() * 0.1;
    return Math.min(Math.max(raw, 1), this.size() / 2);
  });

  protected readonly center = computed<number>(() => this.size() / 2);
  protected readonly radius = computed<number>(() => (this.size() - this.stroke()) / 2);
  protected readonly circumference = computed<number>(() => 2 * Math.PI * this.radius());

  protected readonly clampedValue = computed<number>(() => clampPercent(this.value()));

  protected readonly dashOffset = computed<number | null>(() =>
    this.isDeterminate() ? this.circumference() * (1 - this.clampedValue() / 100) : null,
  );

  protected readonly ariaValueNow = computed<number | null>(() =>
    this.isDeterminate() ? Math.round(this.clampedValue()) : null,
  );

  protected readonly valueLabel = computed<string>(() => `${Math.round(this.clampedValue())}%`);
  protected readonly fontSize = computed<number>(() => Math.max(8, Math.round(this.size() * 0.24)));
}