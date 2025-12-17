export type AlertType = "success" | "error" | "info" | "warning";

export interface IAlertConfig {
  type: AlertType;
  title: string;
  message: string;
}
