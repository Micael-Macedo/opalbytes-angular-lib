import { Injectable } from '@angular/core';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { from, Observable } from 'rxjs';

import { ICaoPdfExportOptions, ICaoWatermark } from '../interfaces/export-options.interface';

type WatermarkPosition = NonNullable<ICaoWatermark['position']>;
type WatermarkPages = NonNullable<ICaoWatermark['pages']>;

@Injectable({
  providedIn: 'root',
})
export class CaoHtmlToPdfConverter {
  /**
   * Converte elemento HTML para canvas
   */
  captureHtmlToCanvas(
    element: HTMLElement,
    options: ICaoPdfExportOptions,
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
   * Converte canvas para PDF com paginação automática (multi-page)
   */
  convertCanvasToPdf(canvas: HTMLCanvasElement, options: ICaoPdfExportOptions): Observable<jsPDF> {
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
        const marginLeft = options.margin?.left ?? 10;
        const marginRight = options.margin?.right ?? 10;
        const imgWidth = pdfWidth - marginLeft - marginRight;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = options.margin?.top ?? 10;

        // Adicionar primeira página
        pdf.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight);

        heightLeft -= pdfHeight;

        // Adicionar páginas extras se necessário
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight);
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
   * Converte canvas para PDF em uma única página, ajustando a imagem
   * (contain-fit) para caber no box definido pelas margens.
   */
  convertCanvasToSinglePagePdf(
    canvas: HTMLCanvasElement,
    options: ICaoPdfExportOptions,
  ): Observable<jsPDF> {
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

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const marginTop = options.margin?.top ?? 10;
        const marginRight = options.margin?.right ?? 10;
        const marginBottom = options.margin?.bottom ?? 10;
        const marginLeft = options.margin?.left ?? 10;

        // Box útil que a imagem pode ocupar
        const boxWidth = pdfWidth - marginLeft - marginRight;
        const boxHeight = pdfHeight - marginTop - marginBottom;

        // Escala contain (preserva proporção) para caber na página única
        const scale = Math.min(boxWidth / canvas.width, boxHeight / canvas.height);
        const imgWidth = canvas.width * scale;
        const imgHeight = canvas.height * scale;

        // Centralizar dentro do box
        const x = marginLeft + (boxWidth - imgWidth) / 2;
        const y = marginTop + (boxHeight - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

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
  private addWatermark(pdf: jsPDF, watermark: ICaoWatermark): void {
    const pageCount = pdf.getNumberOfPages();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const pages = this.resolveWatermarkPages(watermark.pages ?? 'all', pageCount);
    const position = watermark.position ?? 'center';
    const angle = watermark.angle ?? 45;
    const opacity = watermark.opacity ?? 0.3;

    pdf.setTextColor(...this.resolveColor(watermark.color ?? '200,200,200'));
    pdf.setFontSize(watermark.fontSize ?? 60);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.setGState(new (pdf as any).GState({ opacity }));

    for (const page of pages) {
      pdf.setPage(page);
      const spots = this.getWatermarkSpots(position, watermark.text.length, watermark.fontSize ?? 60, pdfWidth, pdfHeight);
      for (const spot of spots) {
        pdf.text(watermark.text, spot.x, spot.y, {
          align: 'center',
          angle,
        });
      }
    }
  }

  /**
   * Resolve em quais páginas o watermark deve aparecer
   */
  private resolveWatermarkPages(scope: WatermarkPages, pageCount: number): number[] {
    switch (scope) {
      case 'first':
        return [1];
      case 'first-last':
        return pageCount > 1 ? [1, pageCount] : [1];
      case 'all':
      default:
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
  }

  /**
   * Calcula os pontos (x, y) onde o watermark deve ser desenhado
   * conforme a posição configurada.
   */
  private getWatermarkSpots(
    position: WatermarkPosition,
    textLength: number,
    fontSize: number,
    pdfWidth: number,
    pdfHeight: number,
  ): Array<{ x: number; y: number }> {
    switch (position) {
      case 'top-left':
        return [{ x: 20, y: 20 }];
      case 'top-right':
        return [{ x: pdfWidth - 20, y: 20 }];
      case 'bottom-left':
        return [{ x: 20, y: pdfHeight - 20 }];
      case 'bottom-right':
        return [{ x: pdfWidth - 20, y: pdfHeight - 20 }];
      case 'tile':
        return this.getTiledSpots(textLength, fontSize, pdfWidth, pdfHeight);
      case 'center':
      default:
        return [{ x: pdfWidth / 2, y: pdfHeight / 2 }];
    }
  }

  /**
   * Gera pontos para repetir o watermark em mosaico pela página.
   */
  private getTiledSpots(
    textLength: number,
    fontSize: number,
    pdfWidth: number,
    pdfHeight: number,
  ): Array<{ x: number; y: number }> {
    const approxTextWidth = textLength * fontSize * 0.6;
    const stepX = Math.max(approxTextWidth + 30, 100);
    const stepY = fontSize * 3;
    const spots: Array<{ x: number; y: number }> = [];

    for (let y = stepY; y < pdfHeight; y += stepY) {
      for (let x = stepX / 2; x < pdfWidth; x += stepX) {
        spots.push({ x, y });
      }
    }
    return spots;
  }

  /**
   * Converte cor (hex ou 'r,g,b') para tupla RGB aceita pelo jsPDF.
   */
  private resolveColor(color: string): [number, number, number] {
    const rgba = color.replace('#', '');
    if (/^\d+,\s*\d+,\s*\d+$/.test(color)) {
      const [r, g, b] = color.split(',').map((part) => Number.parseInt(part.trim(), 10));
      return [r, g, b] as [number, number, number];
    }
    if (/^[0-9a-fA-F]{6}$/.test(rgba)) {
      const r = Number.parseInt(rgba.slice(0, 2), 16);
      const g = Number.parseInt(rgba.slice(2, 4), 16);
      const b = Number.parseInt(rgba.slice(4, 6), 16);
      return [r, g, b] as [number, number, number];
    }
    return [200, 200, 200];
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