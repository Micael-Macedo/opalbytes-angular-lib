import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CaoTooltipPosition } from './tooltip.directive';


@Component({
  selector: 'cao-tooltip-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./tooltip.html",
  styleUrl: "./tooltip.css",
})
export class CaoTooltipContainerComponent {
  @Input() content = '';
  @Input() position: CaoTooltipPosition = 'bottom';
  @Input() showArrow = true;
  @Input() visible = false;
  @Input() styles: Record<string, string> = {};
}