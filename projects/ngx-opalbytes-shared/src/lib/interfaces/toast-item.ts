type ToastVariant = "default" | "destructive";

export interface IToastItem {
  id: number;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}
