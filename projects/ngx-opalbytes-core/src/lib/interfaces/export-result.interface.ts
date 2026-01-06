export enum ExportStatus {
  Idle = 'idle',
  InProgress = 'in_progress',
  Success = 'success',
  Error = 'error',
}

export interface IExportResult {
  status: ExportStatus;
  filename?: string;
  error?: string;
  timestamp: Date;
  size?: number; // tamanho do arquivo em bytes
}

export interface IExportProgress {
  stage: 'capturing' | 'converting' | 'saving';
  progress: number; // 0-100
  message: string;
}
