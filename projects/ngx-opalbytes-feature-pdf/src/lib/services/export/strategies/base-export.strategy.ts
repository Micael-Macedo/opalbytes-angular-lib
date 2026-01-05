import { inject } from '@angular/core';


import { IPdfExportOptions } from '@pdf.interfaces/export-options.interface';
import { ExportStatus, IExportResult } from '@pdf.interfaces/export-result.interface';
import { IExportStrategy } from '@pdf.interfaces/export-strategy.interface';
import { HtmlToPdfConverter } from '@pdf.utils/html-to-pdf.converter';
import jsPDF from 'jspdf';
import { map, Observable, switchMap } from 'rxjs';

export abstract class BaseExportStrategy implements IExportStrategy {
  protected converter = inject(HtmlToPdfConverter);

  abstract export(element: HTMLElement, options: IPdfExportOptions): Observable<IExportResult>;

  protected executeExport(
    element: HTMLElement,
    options: IPdfExportOptions,
  ): Observable<IExportResult> {
    return this.converter.captureHtmlToCanvas(element, options).pipe(
      switchMap((canvas) => this.converter.convertCanvasToPdf(canvas, options)),
      switchMap((pdf) => {
        return this.converter.savePdf(pdf, options.filename).pipe(
          map(
            () =>
              ({
                status: ExportStatus.Success,
                filename: options.filename,
                timestamp: new Date(),
                size: this.estimatePdfSize(pdf),
              }) as IExportResult,
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
