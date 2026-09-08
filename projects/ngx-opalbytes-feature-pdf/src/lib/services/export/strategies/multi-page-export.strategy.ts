import { Injectable } from '@angular/core';

import jsPDF from 'jspdf';
import { catchError, Observable, of } from 'rxjs';

import { CaoBaseExportStrategy } from './base-export.strategy';
import { ICaoPdfExportOptions } from '../../../interfaces/export-options.interface';
import { CaoExportStatus, ICaoExportResult } from '../../../interfaces/export-result.interface';

@Injectable({
  providedIn: 'root',
})
export class CaoMultiPageExportStrategy extends CaoBaseExportStrategy {
  export(element: HTMLElement, options: ICaoPdfExportOptions): Observable<ICaoExportResult> {
    // Configurações específicas para múltiplas páginas
    const multiPageOptions: ICaoPdfExportOptions = {
      ...options,
      format: options.format ?? 'a4',
      scale: options.scale ?? 2,
    };

    return this.executeExport(element, multiPageOptions).pipe(
      catchError((error) =>
        of({
          status: CaoExportStatus.Error,
          error: error.message ?? 'Erro ao exportar PDF',
          timestamp: new Date(),
        } as ICaoExportResult),
      ),
    );
  }

  protected override convertPdf(
    canvas: HTMLCanvasElement,
    options: ICaoPdfExportOptions,
  ): Observable<jsPDF> {
    return this.converter.convertCanvasToPdf(canvas, options);
  }
}