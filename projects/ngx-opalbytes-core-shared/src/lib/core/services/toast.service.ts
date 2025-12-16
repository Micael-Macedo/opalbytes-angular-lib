import { Injectable, inject } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

export type ToastType = "success" | "error" | "info" | "warning";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  private baseConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: "end",
    verticalPosition: "top",
  };

  private getPanelClasses(type: ToastType): string[] {
    const baseClasses = [
      "!rounded-xl",
      "!shadow-lg",
      "!font-medium",
      "!text-sm",
      "!px-4",
      "!py-3",
      "!flex",
      "!items-center",
      "!gap-2",
      "!border",
      "!backdrop-blur-sm",
      "!transition-all",
      "!duration-200",
      "!hover:scale-[1.02]",
      "[&_.mdc-snackbar__surface]:!bg-transparent",
      "[&_.mdc-snackbar__surface]:!shadow-none",
      "[&_.mdc-snackbar__label]:!text-inherit",
      "[&_.mat-mdc-snack-bar-action]:!text-[var(--color-primary-foreground)]",
    ];

    const typeClasses: Record<ToastType, string[]> = {
      success: [
        "bg-[var(--color-success)]",
        "text-[var(--color-success-foreground)]",
        "border-[color-mix(in_srgb,var(--color-success)_80%,black)]",
      ],
      error: [
        "bg-[var(--color-destructive)]",
        "text-[var(--color-destructive-foreground)]",
        "border-[color-mix(in_srgb,var(--color-destructive)_80%,black)]",
      ],
      info: [
        "bg-[var(--color-primary)]",
        "text-[var(--color-primary-foreground)]",
        "border-[color-mix(in_srgb,var(--color-primary)_80%,black)]",
      ],
      warning: [
        "bg-[var(--color-warn)]",
        "text-[var(--color-warn-foreground)]",
        "border-[color-mix(in_srgb,var(--color-warn)_80%,black)]",
      ],
    };

    return [...baseClasses, ...(typeClasses[type] || [])];
  }

  private show(message: string, type: ToastType, config?: MatSnackBarConfig) {
    const mergedConfig: MatSnackBarConfig = {
      ...this.baseConfig,
      ...config,
      panelClass: [...this.getPanelClasses(type), ...(config?.panelClass || [])],
    };

    this.snackBar.open(message, "Fechar", mergedConfig);
  }

  success(message: string, config?: MatSnackBarConfig) {
    this.show(message, "success", config);
  }

  error(message: string, config?: MatSnackBarConfig) {
    this.show(message, "error", config);
  }

  info(message: string, config?: MatSnackBarConfig) {
    this.show(message, "info", config);
  }

  warning(message: string, config?: MatSnackBarConfig) {
    this.show(message, "warning", config);
  }

  dismissAll() {
    this.snackBar.dismiss();
  }
}
