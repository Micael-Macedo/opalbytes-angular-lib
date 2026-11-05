import { Component, ElementRef, inject, input, signal } from '@angular/core';

export type CaoPopoverPosition = 'top' | 'bottom' | 'left' | 'right';
@Component({
  selector: 'cao-popover',
  imports: [],
  templateUrl: './popover.html',
  styleUrl: './popover.css',
})
export class CaoPopover {

  active = false
  position = input<CaoPopoverPosition>('bottom')
  showArrow = input<boolean>(true);
  
  private readonly _offsetPx = signal<number>(8);

  private readonly elementRef = inject(ElementRef)

  toggle(event: any) {
    this.active = !this.active

    if(this.active) {
      this.positionPopover(event.target)
    }
  }

    private positionPopover(element: HTMLElement): void {
    const hostRect = element.getBoundingClientRect();
    const nativeElement = this.elementRef.nativeElement as HTMLElement;
    const popoverRect = nativeElement.getBoundingClientRect();
    const offset = this._offsetPx();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    switch (this.position()) {
      case 'top':
        top = hostRect.top + scrollY - popoverRect.height - offset;
        left = hostRect.left + scrollX + (hostRect.width - popoverRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + scrollY + offset;
        left = hostRect.left + scrollX + (hostRect.width - popoverRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + scrollY + (hostRect.height - popoverRect.height) / 2;
        left = hostRect.left + scrollX - popoverRect.width - offset;
        break;
      case 'right':
        top = hostRect.top + scrollY + (hostRect.height - popoverRect.height) / 2;
        left = hostRect.right + scrollX + offset;
        break;
    }

    this.elementRef.nativeElement.setStyle(element, 'top', `${top}px`);
    this.elementRef.nativeElement.setStyle(element, 'left', `${left}px`);
  }
}
