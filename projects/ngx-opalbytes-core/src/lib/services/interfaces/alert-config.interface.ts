export interface IAlertConfig {
  type: "success" | "error" | "info" | "warning";
  message: string;
  title: string;
}