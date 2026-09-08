import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CaoMultiPageExportStrategy } from './multi-page-export.strategy';
import { CaoHtmlToPdfConverter } from '../../../utils/html-to-pdf.converter';
import { ICaoPdfExportOptions } from '../../../interfaces/export-options.interface';
import { CaoExportStatus } from '../../../interfaces/export-result.interface';

describe('CaoMultiPageExportStrategy', () => {
  let strategy: CaoMultiPageExportStrategy;
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

    strategy = TestBed.inject(CaoMultiPageExportStrategy);
  });

  it('usa convertCanvasToPdf para gerar o PDF com paginação', () => {
    const options: ICaoPdfExportOptions = { filename: 'multi.pdf' };

    let result: unknown;
    strategy.export(element, options).subscribe((r) => {
      result = r;
    });

    expect(converterSpy.captureHtmlToCanvas).toHaveBeenCalledWith(element, expect.objectContaining({ filename: 'multi.pdf' }));
    expect(converterSpy.convertCanvasToPdf).toHaveBeenCalledTimes(1);
    expect(converterSpy.convertCanvasToSinglePagePdf).not.toHaveBeenCalled();
    expect(converterSpy.savePdf).toHaveBeenCalledWith(pdf, 'multi.pdf');
    expect(result).toMatchObject({
      status: CaoExportStatus.Success,
      filename: 'multi.pdf',
      size: 456,
    });
  });

  it('aplica scale padrão 2 quando não informado', () => {
    const options: ICaoPdfExportOptions = { filename: 'multi.pdf' };

    strategy.export(element, options).subscribe();

    expect(converterSpy.captureHtmlToCanvas).toHaveBeenCalledWith(
      element,
      expect.objectContaining({ filename: 'multi.pdf', scale: 2 }),
    );
  });

  it('retorna resultado de erro quando a exportação falha', () => {
    converterSpy.convertCanvasToPdf.mockImplementation(() => {
      throw new Error('falhou no pdf multipage');
    });

    let result: unknown;
    strategy.export(element, { filename: 'multi.pdf' }).subscribe((r) => {
      result = r;
    });

    expect(result).toMatchObject({
      status: CaoExportStatus.Error,
      error: 'falhou no pdf multipage',
    });
  });
});