import { computed, inject, Injectable, signal } from '@angular/core';


import { catchError, finalize, Observable, of, tap } from 'rxjs';

import { IPdfExportOptions } from '../interfaces/export-options.interface';
import { ExportStatus, IExportResult } from '../interfaces/export-result.interface';
import { IExportStrategy } from '../interfaces/export-strategy.interface';
import { MultiPageExportStrategy } from './export/strategies/multi-page-export.strategy';
import { SinglePageExportStrategy } from './export/strategies/single-page-export.strategy';

type ExportType = 'single-page' | 'multi-page';

@Injectable({
  providedIn: 'root',
})
export class CaoPdfExportService {
  private singlePageStrategy = inject(SinglePageExportStrategy);
  private multiPageStrategy = inject(MultiPageExportStrategy);

  // Signals para estado reativo
  private readonly exportStatusSignal = signal<ExportStatus>(ExportStatus.Idle);
  private readonly lastResultSignal = signal<IExportResult | null>(null);
  private readonly errorMessageSignal = signal<string | null>(null);

  // Computed signals
  readonly isExporting = computed(() => this.exportStatusSignal() === ExportStatus.InProgress);
  readonly hasError = computed(() => this.exportStatusSignal() === ExportStatus.Error);
  readonly lastResult = this.lastResultSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();

  /**
   * Exporta elemento HTML para PDF
   */
  exportToPdf(
    element: HTMLElement,
    options: IPdfExportOptions,
    type: ExportType = 'multi-page',
  ): Observable<IExportResult> {
    // Resetar estado
    this.exportStatusSignal.set(ExportStatus.InProgress);
    this.errorMessageSignal.set(null);

    const strategy = this.getStrategy(type);

    return strategy.export(element, options).pipe(
      tap((result) => {
        this.exportStatusSignal.set(result.status);
        this.lastResultSignal.set(result);

        if (result.status === ExportStatus.Error && result.error) {
          this.errorMessageSignal.set(result.error);
        }
      }),
      catchError((error) => {
        const errorMessage = error.message ?? 'Erro desconhecido';
        const errorResult: IExportResult = {
          status: ExportStatus.Error,
          error: errorMessage,
          timestamp: new Date(),
        };

        this.exportStatusSignal.set(ExportStatus.Error);
        this.errorMessageSignal.set(errorMessage);
        this.lastResultSignal.set(errorResult);

        return of(errorResult);
      }),
      finalize(() => {
        // Resetar para Idle após 2 segundos se não houver erro
        if (this.exportStatusSignal() === ExportStatus.Success) {
          setTimeout(() => {
            this.exportStatusSignal.set(ExportStatus.Idle);
          }, 2000);
        }
      }),
    );
  }

  /**
   * Reseta o estado do serviço
   */
  reset(): void {
    this.exportStatusSignal.set(ExportStatus.Idle);
    this.lastResultSignal.set(null);
    this.errorMessageSignal.set(null);
  }

  /**
   * Obtém estratégia de exportação
   */
  private getStrategy(type: ExportType): IExportStrategy {
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
