import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { CaoPdfExportService } from './pdf-export.service';
import { CaoMultiPageExportStrategy } from './export/strategies/multi-page-export.strategy';
import { CaoSinglePageExportStrategy } from './export/strategies/single-page-export.strategy';
import { CaoExportStatus, ICaoExportResult } from '../interfaces/export-result.interface';
import { ICaoPdfExportOptions } from '../interfaces/export-options.interface';

describe('CaoPdfExportService', () => {
  let service: CaoPdfExportService;
  let singleStrategySpy: { export: ReturnType<typeof vi.fn> };
  let multiStrategySpy: { export: ReturnType<typeof vi.fn> };
  let element: HTMLElement;
  let options: ICaoPdfExportOptions;

  const successResult: ICaoExportResult = {
    status: CaoExportStatus.Success,
    filename: 'relatorio.pdf',
    timestamp: new Date(),
    size: 123,
  };

  beforeEach(() => {
    singleStrategySpy = { export: vi.fn() };
    multiStrategySpy = { export: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        CaoPdfExportService,
        { provide: CaoSinglePageExportStrategy, useValue: singleStrategySpy },
        { provide: CaoMultiPageExportStrategy, useValue: multiStrategySpy },
      ],
    });

    service = TestBed.inject(CaoPdfExportService);
    element = document.createElement('div');
    options = { filename: 'relatorio.pdf' };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('usa a estratégia multi-page por padrão', () => {
    multiStrategySpy.export.mockReturnValue(of(successResult));

    service.exportToPdf(element, options).subscribe();

    expect(multiStrategySpy.export).toHaveBeenCalledWith(element, options);
    expect(singleStrategySpy.export).not.toHaveBeenCalled();
  });

  it('usa a estratégia single-page quando informada', () => {
    singleStrategySpy.export.mockReturnValue(of(successResult));

    service.exportToPdf(element, options, 'single-page').subscribe();

    expect(singleStrategySpy.export).toHaveBeenCalledWith(element, options);
    expect(multiStrategySpy.export).not.toHaveBeenCalled();
  });

  it('atualiza signals de sucesso durante a exportação', () => {
    multiStrategySpy.export.mockReturnValue(of(successResult));

    let emission: ICaoExportResult | undefined;
    service.exportToPdf(element, options).subscribe((result) => {
      emission = result;
    });

    expect(emission).toEqual(successResult);
    expect(service.lastResult()).toEqual(successResult);
    expect(service.isExporting()).toBe(false);
    expect(service.hasError()).toBe(false);
    expect(service.errorMessage()).toBeNull();
  });

  it('isExporting fica true durante a exportação e volta a false ao concluir', () => {
    vi.useFakeTimers();
    const subject = new Subject<ICaoExportResult>();
    multiStrategySpy.export.mockReturnValue(subject.asObservable());

    let emission: ICaoExportResult | undefined;
    service.exportToPdf(element, options).subscribe((result) => {
      emission = result;
    });

    expect(service.isExporting()).toBe(true);

    subject.next(successResult);
    subject.complete();

    expect(service.isExporting()).toBe(false);
    expect(emission).toEqual(successResult);

    vi.advanceTimersByTime(2000);
    expect(service.isExporting()).toBe(false);
  });

  it('trata erro sem propagar exceção e atualiza os signals de erro', () => {
    multiStrategySpy.export.mockReturnValue(throwError(() => new Error('falhou')));

    let emission: ICaoExportResult | undefined;
    let erro: unknown;
    service.exportToPdf(element, options).subscribe({
      next: (result) => {
        emission = result;
      },
      error: (err) => {
        erro = err;
      },
    });

    expect(erro).toBeUndefined();
    expect(emission?.status).toBe(CaoExportStatus.Error);
    expect(emission?.error).toBe('falhou');
    expect(service.hasError()).toBe(true);
    expect(service.isExporting()).toBe(false);
    expect(service.errorMessage()).toBe('falhou');
    expect(service.lastResult()?.status).toBe(CaoExportStatus.Error);
  });

  it('reset limpa todos os estados', () => {
    multiStrategySpy.export.mockReturnValue(of(successResult));
    service.exportToPdf(element, options).subscribe();

    service.reset();

    expect(service.lastResult()).toBeNull();
    expect(service.errorMessage()).toBeNull();
    expect(service.isExporting()).toBe(false);
    expect(service.hasError()).toBe(false);
  });
});