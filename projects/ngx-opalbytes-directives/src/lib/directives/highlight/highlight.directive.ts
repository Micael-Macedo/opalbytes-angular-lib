import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[caoHighlight]',
  standalone: true
})
export class HighlightDirective {

  caoHighlight = input('yellow');

  private el = inject(ElementRef)

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.caoHighlight());
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}