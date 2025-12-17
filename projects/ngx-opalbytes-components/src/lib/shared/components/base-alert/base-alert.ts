import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

export type AlertType = "success" | "error" | "info" | "warning";

export interface IAlertConfig {
  type: AlertType;
  title: string;
  message: string;
  alertIcon?: string; 
}


@Component({
  selector: 'cao-base-alert',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './base-alert.html',
  styleUrl: './base-alert.css',
})
export class BaseAlert {
  data!: {
    type: AlertType;
    title: string;
    message: string;
    alertIcon?: string
  };

  private iconPaths: Record<AlertType, string> = {
    success: "https://placehold.co/600x400",
    error: "https://placehold.co/600x400",
    info: "https://placehold.co/600x400",
    warning: "https://placehold.co/600x400",
  };

  getIconPath(type: AlertType): string {
    return this.iconPaths[type];
  }

  getTitleClass(type: AlertType): string {
    return `title-${type}`;
  }
}
