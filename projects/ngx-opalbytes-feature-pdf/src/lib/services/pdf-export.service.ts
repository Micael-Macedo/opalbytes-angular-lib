import { computed, inject, Injectable, signal } from '@angular/core';

import { catchError, finalize, Observable, of, tap } from 'rxjs';

import { ICaoPdfExportOptions } from '../interfaces/export-options.interface';
import { CaoExportStatus, ICaoExportResult } from '../interfaces/export-result.interface';
import { ICaoExportStrategy } from '../interfaces/export-strategy.interface';
import { CaoMultiPageExportStrategy } from './export/strategies/multi-page-export.strategy';
import { CaoSinglePageExportStrategy } from './export/strategies/single-page-export.strategy';

type CaoExportType = 'single-page' | 'multi-page';

@Injectable({
  providedIn: 'root',
})
export class CaoPdfExportService {
  private singlePageStrategy = inject(CaoSinglePageExportStrategy);
  private multiPageStrategy = inject(CaoMultiPageExportStrategy);

  // Signals para estado reativo
  private readonly exportStatusSignal = signal<CaoExportStatus>(CaoExportStatus.Idle);
  private readonly lastResultSignal = signal<ICaoExportResult | null>(null);
  private readonly errorMessageSignal = signal<string | null>(null);

  // Computed signals
  readonly isExporting = computed(() => this.exportStatusSignal() === CaoExportStatus.InProgress);
  readonly hasError = computed(() => this.exportStatusSignal() === CaoExportStatus.Error);
  readonly lastResult = this.lastResultSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();

  /**
   * Exporta elemento HTML para PDF
   */
  exportToPdf(
    element: HTMLElement,
    options: ICaoPdfExportOptions,
    type: CaoExportType = 'multi-page',
  ): Observable<ICaoExportResult> {
    // Resetar estado
    this.exportStatusSignal.set(CaoExportStatus.InProgress);
    this.errorMessageSignal.set(null);

    const strategy = this.getStrategy(type);

    return strategy.export(element, options).pipe(
      tap((result) => {
        this.exportStatusSignal.set(result.status);
        this.lastResultSignal.set(result);

        if (result.status === CaoExportStatus.Error && result.error) {
          this.errorMessageSignal.set(result.error);
        }
      }),
      catchError((error) => {
        const errorMessage = error.message ?? 'Erro desconhecido';
        const errorResult: ICaoExportResult = {
          status: CaoExportStatus.Error,
          error: errorMessage,
          timestamp: new Date(),
        };

        this.exportStatusSignal.set(CaoExportStatus.Error);
        this.errorMessageSignal.set(errorMessage);
        this.lastResultSignal.set(errorResult);

        return of(errorResult);
      }),
      finalize(() => {
        // Resetar para Idle após 2 segundos se não houver erro
        if (this.exportStatusSignal() === CaoExportStatus.Success) {
          setTimeout(() => {
            this.exportStatusSignal.set(CaoExportStatus.Idle);
          }, 2000);
        }
      }),
    );
  }

  /**
   * Reseta o estado do serviço
   */
  reset(): void {
    this.exportStatusSignal.set(CaoExportStatus.Idle);
    this.lastResultSignal.set(null);
    this.errorMessageSignal.set(null);
  }

  /**
   * Obtém estratégia de exportação
   */
  private getStrategy(type: CaoExportType): ICaoExportStrategy {
    switch (type) {
      case 'single-page':
        return this.singlePageStrategy;
      case 'multi-page':
        return this.multiPageStrategy;
      default:
        return this.multiPageStrategy;
    }
  }
}