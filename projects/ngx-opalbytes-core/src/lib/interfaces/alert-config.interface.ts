export interface ICaoAlertConfig {
  type: "success" | "error" | "info" | "warning";
  message: string;
  title: string;
}