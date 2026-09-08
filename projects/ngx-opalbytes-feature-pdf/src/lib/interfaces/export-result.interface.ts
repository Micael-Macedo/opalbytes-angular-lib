export enum CaoExportStatus {
  Idle = 'idle',
  InProgress = 'in_progress',
  Success = 'success',
  Error = 'error',
}

export interface ICaoExportResult {
  status: CaoExportStatus;
  filename?: string;
  error?: string;
  timestamp: Date;
  size?: number; // tamanho do arquivo em bytes
}
