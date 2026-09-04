import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type CaoSkeletonVariant = 'rect' | 'circle' | 'text';

@Component({
  selector: 'cao-skeleton',
  imports: [CommonModule],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
})
export class CaoSkeletonComponent {
  borderRadius = input('14px');
  width = input('100%');
  height = input('100%');
  bgColor = input<string>("#e2e8f0");
  shine = input<string>("#f8fafc");
  variant = input<CaoSkeletonVariant>('rect');
  speed = input<string>('2s');
  size = input<string>();
  animationDeg = input<string>('90deg');

  skeletonStyles = computed(() => {
    const styles: Record<string, string> = {
      '--skeleton-width': this.size() || this.width(),
      '--skeleton-height': this.size() || this.height(),
      '--skeleton-speed': this.speed(),
      '--skeleton-animation-deg': this.animationDeg(),
    };

    if (this.bgColor()) {
      styles['--skeleton-bg'] = this.bgColor()!;
    }

    if (this.shine()) {
      styles['--skeleton-shine'] = this.shine()!;
    }

    if (this.variant() !== 'circle') {
      styles['--skeleton-radius'] = this.borderRadius();
    }


    return styles;
  });
}