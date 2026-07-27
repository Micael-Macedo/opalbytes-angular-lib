import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'cao-base-icon',
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: './base-icon.html',
  styleUrl: './base-icon.css',
})
export class CaoBaseIcon {
  @Input() imgSource = ""
  @Input() isLucideIcon = true
  @Input() strokeWidthIcon = 1
  @Input() iconColor = ""
  @Input() size = 32
}
