import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CaoSinglePageExportStrategy } from './single-page-export.strategy';
import { CaoHtmlToPdfConverter } from '../../../utils/html-to-pdf.converter';
import { ICaoPdfExportOptions } from '../../../interfaces/export-options.interface';
import { CaoExportStatus } from '../../../interfaces/export-result.interface';

describe('CaoSinglePageExportStrategy', () => {
  let strategy: CaoSinglePageExportStrategy;
  let converterSpy: {
    captureHtmlToCanvas: ReturnType<typeof vi.fn>;
    convertCanvasToPdf: ReturnType<typeof vi.fn>;
    convertCanvasToSinglePagePdf: ReturnType<typeof vi.fn>;
    savePdf: ReturnType<typeof vi.fn>;
  };

  const element = document.createElement('div');
  const canvas = {} as HTMLCanvasElement;
  const pdf = { output: () => ({ byteLength: 456 }) };

  beforeEach(() => {
    converterSpy = {
      captureHtmlToCanvas: vi.fn().mockReturnValue(of(canvas)),
      convertCanvasToPdf: vi.fn().mockReturnValue(of(pdf)),
      convertCanvasToSinglePagePdf: vi.fn().mockReturnValue(of(pdf)),
      savePdf: vi.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: CaoHtmlToPdfConverter, useValue: converterSpy }],
    });

    strategy = TestBed.inject(CaoSinglePageExportStrategy);
  });

  it('usa convertCanvasToSinglePagePdf para gerar o PDF em uma página', () => {
    const options: ICaoPdfExportOptions = { filename: 'unica.pdf' };

    let result: unknown;
    strategy.export(element, options).subscribe((r) => {
      result = r;
    });

    expect(converterSpy.captureHtmlToCanvas).toHaveBeenCalledWith(element, expect.objectContaining({ filename: 'unica.pdf' }));
    expect(converterSpy.convertCanvasToSinglePagePdf).toHaveBeenCalledTimes(1);
    expect(converterSpy.convertCanvasToPdf).not.toHaveBeenCalled();
    expect(converterSpy.savePdf).toHaveBeenCalledWith(pdf, 'unica.pdf');
    expect(result).toMatchObject({
      status: CaoExportStatus.Success,
      filename: 'unica.pdf',
      size: 456,
    });
  });

  it('força orientação portrait no modo single-page', () => {
    const options: ICaoPdfExportOptions = { filename: 'unica.pdf', orientation: 'landscape' };

    strategy.export(element, options).subscribe();

    expect(converterSpy.captureHtmlToCanvas).toHaveBeenCalledWith(
      element,
      expect.objectContaining({ filename: 'unica.pdf', orientation: 'portrait' }),
    );
  });

  it('retorna resultado de erro quando a exportação falha', () => {
    converterSpy.captureHtmlToCanvas.mockReturnValue(of(canvas));
    converterSpy.convertCanvasToSinglePagePdf.mockImplementation(() => {
      throw new Error('falhou no pdf');
    });

    let result: unknown;
    strategy.export(element, { filename: 'unica.pdf' }).subscribe((r) => {
      result = r;
    });

    expect(result).toMatchObject({
      status: CaoExportStatus.Error,
      error: 'falhou no pdf',
    });
  });
});