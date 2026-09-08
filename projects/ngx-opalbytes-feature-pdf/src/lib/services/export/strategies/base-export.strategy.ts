import { inject } from '@angular/core';

import jsPDF from 'jspdf';
import { map, Observable, switchMap } from 'rxjs';

import { ICaoPdfExportOptions } from '../../../interfaces/export-options.interface';
import { CaoExportStatus, ICaoExportResult } from '../../../interfaces/export-result.interface';
import { ICaoExportStrategy } from '../../../interfaces/export-strategy.interface';
import { CaoHtmlToPdfConverter } from '../../../utils/html-to-pdf.converter';

export abstract class CaoBaseExportStrategy implements ICaoExportStrategy {
  protected converter = inject(CaoHtmlToPdfConverter);

  abstract export(element: HTMLElement, options: ICaoPdfExportOptions): Observable<ICaoExportResult>;

  /**
   * Converte o canvas capturado em um PDF. Cada estratégia define seu modo:
   * single-page ou multi-page.
   */
  protected abstract convertPdf(
    canvas: HTMLCanvasElement,
    options: ICaoPdfExportOptions,
  ): Observable<jsPDF>;

  protected executeExport(
    element: HTMLElement,
    options: ICaoPdfExportOptions,
  ): Observable<ICaoExportResult> {
    return this.converter.captureHtmlToCanvas(element, options).pipe(
      switchMap((canvas) => this.convertPdf(canvas, options)),
      switchMap((pdf) => {
        return this.converter.savePdf(pdf, options.filename).pipe(
          map(
            () =>
              ({
                status: CaoExportStatus.Success,
                filename: options.filename,
                timestamp: new Date(),
                size: this.estimatePdfSize(pdf),
              }) as ICaoExportResult,
          ),
        );
      }),
    );
  }

  private estimatePdfSize(pdf: jsPDF): number {
    // Estimativa do tamanho em bytes
    const output = pdf.output('arraybuffer');
    return output.byteLength;
  }
}