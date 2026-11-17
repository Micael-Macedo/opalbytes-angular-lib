export type CaoAlertType = "success" | "error" | "info" | "warning";

export interface ICaoAlertConfig {
  type: CaoAlertType;
  message: string;
  title?: string;
  alertIcon?: string; 
}

export interface ICaoAlertDTO extends Pick<ICaoAlertConfig, 'message' | 'type' | 'title' > {
  duration?: number,
}
