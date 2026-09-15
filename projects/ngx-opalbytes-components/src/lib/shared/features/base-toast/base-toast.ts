import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { LucideDynamicIcon } from '@lucide/angular';

import { IToastConfig, ToastType } from './base-toast.interface';

@Component({
  selector: 'cao-base-toast',
  imports: [LucideDynamicIcon],
  templateUrl: './base-toast.html',
  styleUrl: './base-toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoBaseToast implements OnInit {
  data!: IToastConfig;

  closeToast: () => void = () => {};

  iconName!: string;
  progressDuration!: number;

  private iconNames: Record<ToastType, string> = {
    success: 'circle-check',
    error: 'circle-x',
    info: 'info',
    warning: 'triangle-alert',
  };

  ngOnInit(): void {
    this.iconName = this.iconNames[this.data.type];
    this.progressDuration = this.data.duration ?? 4000;
  }
}