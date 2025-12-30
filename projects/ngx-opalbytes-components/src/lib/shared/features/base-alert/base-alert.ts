import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { AlertType } from './base-alert.interface';

@Component({
  selector: 'cao-alert',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './base-alert.html',
  styleUrl: './base-alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseAlert implements OnInit {
  data!: {
    type: AlertType;
    title: string;
    message: string;
    alertIcon?: string
  };

  iconPath!: string;
  titleClass!: string;

  private iconPaths: Record<AlertType, string> = {
    success: "https://placehold.co/600x400",
    error: "https://placehold.co/600x400",
    info: "https://placehold.co/600x400",
    warning: "https://placehold.co/600x400",
  };

  ngOnInit(): void {
    this.iconPath = this.iconPaths[this.data.type];
    this.titleClass = `title-${this.data.type}`;
  }
}
