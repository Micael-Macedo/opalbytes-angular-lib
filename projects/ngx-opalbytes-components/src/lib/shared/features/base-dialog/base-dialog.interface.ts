export type DialogType = "success" | "error" | "info" | "warning";

export interface IDialogConfig {
  type: DialogType;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  logoIcon?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
