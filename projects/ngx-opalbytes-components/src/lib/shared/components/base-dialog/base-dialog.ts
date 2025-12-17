import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

export type DialogType = "success" | "error" | "info" | "warning";

export interface IDialogConfig {
  type: DialogType;
  title: string;
  logoIcon?: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

@Component({
  selector: 'cao-base-dialog',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './base-dialog.html',
  styleUrl: './base-dialog.css',
})
export class BaseDialog {
  @Input() config!: IDialogConfig;

  closeDialog: () => void = this.noop;

  protected iconPaths: Record<DialogType, string> = {
    success: "https://placehold.co/600x400",
    error: "https://placehold.co/600x400",
    info: "https://placehold.co/600x400",
    warning: "https://placehold.co/600x400",
  };

  private noop(): void {
    return
  }

  getIconPath(): string {
    return this.iconPaths[this.config.type];
  }

  handleConfirm(): void {
    this.config.onConfirm?.();
    this.closeDialog();
  }

  handleCancel(): void {
    this.config.onCancel?.();
    this.closeDialog();
  }
}