export interface IPdfExportOptions {
  filename: string;
  format?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  quality?: number; // 0-1 para html2canvas
  compress?: boolean;
  includeDate?: boolean;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  scale?: number; // escala do canvas
  backgroundColor?: string;
  watermark?: {
    text: string;
    opacity: number;
  };
}

export interface IHtmlElementOptions {
  element: HTMLElement;
  excludeSelectors?: string[]; // seletores CSS para excluir
  includeSelectors?: string[]; // seletores CSS para incluir
}
