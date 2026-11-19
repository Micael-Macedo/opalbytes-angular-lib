export type CaoModalSize =
  | "w-100"
  | "w-90"
  | "w-80"
  | "w-75"
  | "w-70"
  | "w-60"
  | "w-50"
  | "w-40"
  | "w-30"
  | "w-20"
  | "w-10";

export type CaoModalPanelClass = "default" | "custom";

export interface ICaoModalOptions<TData = unknown> {
  data?: TData;
  inputs?: Record<string, unknown>;
  closeOnOverlayClick?: boolean;
  closeOthers?: boolean;
}

export interface ICaoModalRef<TResult = unknown> {
  readonly id: string;
  close(result?: TResult): void;
}