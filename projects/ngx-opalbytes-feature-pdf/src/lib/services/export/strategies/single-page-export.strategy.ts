import { Injectable } from '@angular/core';


import { IPdfExportOptions } from '@pdf.interfaces/export-options.interface';
import { ExportStatus, IExportResult } from '@pdf.interfaces/export-result.interface';
import { catchError, Observable, of } from 'rxjs';

import { BaseExportStrategy } from './base-export.strategy';

@Injectable({
  providedIn: 'root',
})
export class SinglePageExportStrategy extends BaseExportStrategy {
  export(element: HTMLElement, options: IPdfExportOptions): Observable<IExportResult> {
    // Configurações específicas para página única
    const singlePageOptions: IPdfExportOptions = {
      ...options,
      format: options.format ?? 'a4',
      orientation: 'portrait',
    };

    return this.executeExport(element, singlePageOptions).pipe(
      catchError((error) =>
        of({
          status: ExportStatus.Error,
          error: error.message ?? 'Erro ao exportar PDF',
          timestamp: new Date(),
        } as IExportResult),
      ),
    );
  }
}
