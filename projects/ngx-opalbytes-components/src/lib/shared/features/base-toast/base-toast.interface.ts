import { BlockScrollStrategy, CloseScrollStrategy, GlobalPositionStrategy, NoopScrollStrategy, RepositionScrollStrategy } from "@angular/cdk/overlay";

export type ToastType = "success" | "error" | "info" | "warning";

export interface IToastConfig {
  type: ToastType;
  message: string;
  duration?: number;
  positionStrategy?: GlobalPositionStrategy;
  scrollStrategy?: BlockScrollStrategy | CloseScrollStrategy | NoopScrollStrategy | RepositionScrollStrategy;
}
