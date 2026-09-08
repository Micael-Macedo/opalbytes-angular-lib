import { beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';

import { CaoHtmlToPdfConverter } from './html-to-pdf.converter';
import { ICaoPdfExportOptions } from '../interfaces/export-options.interface';

const mocks = vi.hoisted(() => {
  const addImage = vi.fn();
  const addPage = vi.fn();
  const setPage = vi.fn();
  const setTextColor = vi.fn();
  const setFontSize = vi.fn();
  const setGState = vi.fn();
  const text = vi.fn();
  const save = vi.fn();
  const output = vi.fn(() => new ArrayBuffer(8));

  class MockGState {
    constructor(public options: { opacity?: number }) {}
  }

  class MockJSPDF {
    internal = {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    };
    pages = 1;
    GState = MockGState;
    constructor(public options: Record<string, unknown>) {}
    getNumberOfPages(): number {
      return this.pages;
    }
    addPage(): void {
      this.pages += 1;
      addPage();
    }
    setPage(page: number): void {
      setPage(page);
    }
    addImage(...args: unknown[]): void {
      addImage(...args);
    }
    save(filename: string): void {
      save(filename);
    }
    output(): ArrayBuffer {
      return output();
    }
    setTextColor(...args: unknown[]): void {
      setTextColor(...args);
    }
    setFontSize(...args: unknown[]): void {
      setFontSize(...args);
    }
    setGState(state: unknown): void {
      setGState(state);
    }
    text(...args: unknown[]): void {
      text(...args);
    }
  }

  return {
    html2canvas: vi.fn(),
    addImage,
    addPage,
    setPage,
    setTextColor,
    setFontSize,
    setGState,
    text,
    save,
    output,
    MockJSPDF,
  };
});

vi.mock('jspdf', () => ({
  default: mocks.MockJSPDF,
}));

vi.mock('html2canvas', () => ({
  default: mocks.html2canvas,
}));

describe('CaoHtmlToPdfConverter', () => {
  let converter: CaoHtmlToPdfConverter;
  let hostElement: HTMLElement;

  const baseOptions: () => ICaoPdfExportOptions = () => ({
    filename: 'teste.pdf',
  });

  const fakeCanvas = (width: number, height: number) =>
    ({
      width,
      height,
      toDataURL: () => 'data:image/png;base64,FAKE',
    }) as unknown as HTMLCanvasElement;

  beforeEach(() => {
    converter = new CaoHtmlToPdfConverter();
    hostElement = document.createElement('div');
    hostElement.innerHTML = '<p>conteudo</p>';
    document.body.appendChild(hostElement);

    mocks.addImage.mockClear();
    mocks.addPage.mockClear();
    mocks.setPage.mockClear();
    mocks.setTextColor.mockClear();
    mocks.setFontSize.mockClear();
    mocks.setGState.mockClear();
    mocks.text.mockClear();
    mocks.save.mockClear();
    mocks.output.mockClear();
    mocks.html2canvas.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(hostElement);
  });

  describe('captureHtmlToCanvas', () => {
    it('chama html2canvas com o scale e backgroundColor configurados', async () => {
      const canvas = fakeCanvas(100, 200);
      mocks.html2canvas.mockResolvedValue(canvas);

      const options = { ...baseOptions(), scale: 3, backgroundColor: '#000000' };
      const result = await firstValueFrom(converter.captureHtmlToCanvas(hostElement, options));

      expect(result).toBe(canvas);
      const canvasOptions = mocks.html2canvas.mock.calls[0]?.[1] as {
        scale: number;
        backgroundColor: string;
      };
      expect(canvasOptions.scale).toBe(3);
      expect(canvasOptions.backgroundColor).toBe('#000000');
    });

    it('usa scale e backgroundColor padrão quando não informados', async () => {
      mocks.html2canvas.mockResolvedValue(fakeCanvas(100, 200));

      await firstValueFrom(converter.captureHtmlToCanvas(hostElement, baseOptions()));

      const canvasOptions = mocks.html2canvas.mock.calls[0]?.[1] as {
        scale: number;
        backgroundColor: string;
      };
      expect(canvasOptions.scale).toBe(2);
      expect(canvasOptions.backgroundColor).toBe('#ffffff');
    });

    it('ignoreElements exclui BUTTON, .no-print e [data-no-export]', async () => {
      mocks.html2canvas.mockResolvedValue(fakeCanvas(100, 200));
      hostElement.innerHTML = `
        <button>ok</button>
        <div class="no-print">x</div>
        <span data-no-export>y</span>
        <p>normal</p>
      `;

      await firstValueFrom(converter.captureHtmlToCanvas(hostElement, baseOptions()));

      const canvasOptions = mocks.html2canvas.mock.calls[0]?.[1] as {
        ignoreElements: (element: Element) => boolean;
      };
      const children = Array.from(hostElement.children);
      const button = children.find((c) => c.tagName === 'BUTTON');
      const noPrint = children.find((c) => c.classList.contains('no-print'));
      const noExport = children.find((c) => c.hasAttribute('data-no-export'));
      const normal = children.find((c) => c.tagName === 'P');

      expect(button).toBeDefined();
      expect(noPrint).toBeDefined();
      expect(noExport).toBeDefined();
      expect(normal).toBeDefined();
      expect(canvasOptions.ignoreElements(button as Element)).toBe(true);
      expect(canvasOptions.ignoreElements(noPrint as Element)).toBe(true);
      expect(canvasOptions.ignoreElements(noExport as Element)).toBe(true);
      expect(canvasOptions.ignoreElements(normal as Element)).toBe(false);
    });
  });

  describe('convertCanvasToPdf (multi-page)', () => {
    it('gera uma única página quando o conteúdo cabe', () => {
      const options = baseOptions();
      converter.convertCanvasToPdf(fakeCanvas(190, 250), options).subscribe();

      expect(mocks.addImage).toHaveBeenCalledTimes(1);
      expect(mocks.addPage).not.toHaveBeenCalled();
    });

    it('adiciona páginas quando o conteúdo excede a altura da página', () => {
      const options = baseOptions();
      converter.convertCanvasToPdf(fakeCanvas(190, 1900), options).subscribe();

      const pages = Math.ceil(1900 / 297);
      expect(mocks.addPage).toHaveBeenCalledTimes(pages - 1);
      expect(mocks.addImage).toHaveBeenCalledTimes(pages);
    });

    it('aplica o watermark em todas as páginas por padrão', () => {
      const options = {
        ...baseOptions(),
        watermark: { text: 'Confidencial', opacity: 0.5 },
      };
      converter.convertCanvasToPdf(fakeCanvas(190, 1900), options).subscribe();

      const pages = Math.ceil(1900 / 297);
      expect(mocks.setGState).toHaveBeenCalledWith(expect.objectContaining({ options: { opacity: 0.5 } }));
      expect(mocks.setPage).toHaveBeenCalledTimes(pages);
    });

    it('aplica a data quando includeDate está ativo', () => {
      const options = { ...baseOptions(), includeDate: true };
      converter.convertCanvasToPdf(fakeCanvas(190, 250), options).subscribe();

      expect(mocks.setTextColor).toHaveBeenCalledWith(100, 100, 100);
      expect(mocks.setFontSize).toHaveBeenCalledWith(8);
      expect(mocks.text).toHaveBeenCalledWith(expect.stringContaining('Gerado em:'), 105, 287, { align: 'center' });
    });
  });

  describe('convertCanvasToSinglePagePdf', () => {
    it('ajusta a imagem para caber na página única preservando proporção', () => {
      const options = baseOptions();
      converter.convertCanvasToSinglePagePdf(fakeCanvas(200, 400), options).subscribe();

      expect(mocks.addPage).not.toHaveBeenCalled();
      const addImageArgs = mocks.addImage.mock.calls[0];

      const margin = 10;
      const boxWidth = 210 - margin - margin;
      const boxHeight = 297 - margin - margin;
      const scale = Math.min(boxWidth / 200, boxHeight / 400);
      const imgWidth = 200 * scale;
      const imgHeight = 400 * scale;
      const x = margin + (boxWidth - imgWidth) / 2;
      const y = margin + (boxHeight - imgHeight) / 2;

      expect(addImageArgs?.[1]).toBe('PNG');
      expect(addImageArgs?.[2]).toBeCloseTo(x, 5);
      expect(addImageArgs?.[3]).toBeCloseTo(y, 5);
      expect(addImageArgs?.[4]).toBeCloseTo(imgWidth, 5);
      expect(addImageArgs?.[5]).toBeCloseTo(imgHeight, 5);
    });
  });

  describe('watermark customizável', () => {
    it('usa cor hex e ângulo configurados', () => {
      const options = {
        ...baseOptions(),
        watermark: { text: 'Seguro', color: '#ff0000', angle: 30 },
      };
      converter.convertCanvasToPdf(fakeCanvas(190, 250), options).subscribe();

      expect(mocks.setTextColor).toHaveBeenCalledWith(255, 0, 0);
      expect(mocks.text).toHaveBeenCalledWith(
        'Seguro',
        105,
        148.5,
        { align: 'center', angle: 30 },
      );
    });

    it('usa cor rgb e tamanho de fonte configurados', () => {
      const options = {
        ...baseOptions(),
        watermark: { text: 'Rascunho', color: '0, 128, 0', fontSize: 30 },
      };
      converter.convertCanvasToPdf(fakeCanvas(190, 250), options).subscribe();

      expect(mocks.setTextColor).toHaveBeenCalledWith(0, 128, 0);
      expect(mocks.setFontSize).toHaveBeenCalledWith(30);
    });

    it('aplica o watermark apenas na primeira página', () => {
      const options: ICaoPdfExportOptions = {
        ...baseOptions(),
        watermark: { text: 'copie', pages: 'first' },
      };
      converter.convertCanvasToPdf(fakeCanvas(190, 1900), options).subscribe();

      expect(mocks.setPage).toHaveBeenCalledTimes(1);
      expect(mocks.setPage).toHaveBeenCalledWith(1);
    });

    it('aplica o watermark na primeira e última página', () => {
      const options: ICaoPdfExportOptions = {
        ...baseOptions(),
        watermark: { text: 'copie', pages: 'first-last' },
      };
      converter.convertCanvasToPdf(fakeCanvas(190, 1900), options).subscribe();

      const pages = Math.ceil(1900 / 297);
      expect(mocks.setPage).toHaveBeenCalledTimes(2);
      expect(mocks.setPage).toHaveBeenNthCalledWith(1, 1);
      expect(mocks.setPage).toHaveBeenNthCalledWith(2, pages);
    });
  });

  describe('savePdf', () => {
    it('chama pdf.save com o nome do arquivo', () => {
      const pdf = new mocks.MockJSPDF({});

      converter.savePdf(pdf as never, 'relatorio.pdf').subscribe();

      expect(mocks.save).toHaveBeenCalledWith('relatorio.pdf');
    });
  });
});