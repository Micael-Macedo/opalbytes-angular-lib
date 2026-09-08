export interface ICaoWatermark {
  text: string;
  opacity?: number; // 0-1, transparência do watermark
  color?: string; // cor do texto (hex ou 'r,g,b'), padrão cinza claro
  fontSize?: number; // tamanho da fonte, padrão 60
  angle?: number; // ângulo de rotação do texto, padrão 45
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile';
  pages?: 'first' | 'first-last' | 'all'; // páginas que recebem o watermark, padrão 'all'
}

export interface ICaoPdfExportOptions {
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
  watermark?: ICaoWatermark;
}
