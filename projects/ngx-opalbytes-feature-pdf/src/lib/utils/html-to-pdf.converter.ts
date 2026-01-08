import { Injectable } from '@angular/core';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { from, Observable } from 'rxjs';

import { IPdfExportOptions } from '../interfaces/export-options.interface';


@Injectable({
  providedIn: 'root',
})
export class HtmlToPdfConverter {
  /**
   * Converte elemento HTML para canvas
   */
  captureHtmlToCanvas(
    element: HTMLElement,
    options: IPdfExportOptions,
  ): Observable<HTMLCanvasElement> {
    const canvasOptions = {
      scale: options.scale ?? 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: options.backgroundColor ?? '#ffffff',
      logging: false,
      // Ignorar elementos que não devem aparecer no PDF
      ignoreElements: (element: Element) => {
        // Ignorar botões, elementos com classe .no-print e data-no-export
        return (
          element.tagName === 'BUTTON' ||
          element.classList.contains('no-print') ||
          element.hasAttribute('data-no-export')
        );
      },
    };

    return from(
      html2canvas(element, canvasOptions).then(
        (canvas) => {
          return canvas;
        },
        (error) => {
          throw error;
        },
      ),
    );
  }

  /**
   * Converte canvas para PDF
   */
  convertCanvasToPdf(canvas: HTMLCanvasElement, options: IPdfExportOptions): Observable<jsPDF> {
    return new Observable((observer) => {
      try {
        const imgData = canvas.toDataURL('image/png', options.quality ?? 0.95);
        const format = options.format ?? 'a4';
        const orientation = options.orientation ?? 'portrait';

        const pdf = new jsPDF({
          orientation,
          unit: 'mm',
          format,
          compress: options.compress ?? true,
        });

        // Dimensões do PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Dimensões da imagem
        const imgWidth = pdfWidth - (options.margin?.left ?? 10) - (options.margin?.right ?? 10);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = options.margin?.top ?? 10;

        // Adicionar primeira página
        pdf.addImage(imgData, 'PNG', options.margin?.left ?? 10, position, imgWidth, imgHeight);

        heightLeft -= pdfHeight;

        // Adicionar páginas extras se necessário
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', options.margin?.left ?? 10, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        // Adicionar marca d'água se configurado
        if (options.watermark) {
          this.addWatermark(pdf, options.watermark);
        }

        // Adicionar data se configurado
        if (options.includeDate) {
          this.addDateFooter(pdf);
        }

        observer.next(pdf);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Salva PDF no dispositivo
   */
  savePdf(pdf: jsPDF, filename: string): Observable<void> {
    return new Observable((observer) => {
      try {
        pdf.save(filename);
        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Adiciona marca d'água ao PDF
   */
  private addWatermark(pdf: jsPDF, watermark: { text: string; opacity: number }): void {
    const pageCount = pdf.getNumberOfPages();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(60);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.setGState(new (pdf as any).GState({ opacity: watermark.opacity }));

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.text(watermark.text, pdfWidth / 2, pdfHeight / 2, {
        align: 'center',
        angle: 45,
      });
    }
  }

  /**
   * Adiciona rodapé com data
   */
  private addDateFooter(pdf: jsPDF): void {
    const pageCount = pdf.getNumberOfPages();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);

    const date = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.text(`Gerado em: ${date}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
    }
  }
}
