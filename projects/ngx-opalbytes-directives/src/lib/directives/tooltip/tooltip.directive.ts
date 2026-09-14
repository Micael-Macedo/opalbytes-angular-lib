import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  computed,
  createComponent,
  signal,
} from '@angular/core';

import { CaoTooltipContainerComponent } from './tooltip';

export type CaoTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[caoTooltip]',
  standalone: true,
})
export class CaoTooltipDirective implements OnDestroy {
  @Input({ required: true }) set caoTooltip(value: string) { this._content.set(value); }
  @Input() set tooltipPosition(value: CaoTooltipPosition) { this._position.set(value); }
  @Input() set tooltipBgColor(value: string) { this._bgColor.set(value); }
  @Input() set tooltipTextColor(value: string) { this._textColor.set(value); }
  @Input() set tooltipFontSize(value: string) { this._fontSize.set(value); }
  @Input() set tooltipMaxWidth(value: string) { this._maxWidth.set(value); }
  @Input() set tooltipArrow(value: boolean) { this._arrow.set(value); }
  @Input() set tooltipOffsetPx(value: number) { this._offsetPx.set(value); }

  private readonly _content = signal<string>('');
  private readonly _position = signal<CaoTooltipPosition>('bottom');
  private readonly _bgColor = signal<string>('#323232');
  private readonly _textColor = signal<string>('#ffffff');
  private readonly _fontSize = signal<string>('13px');
  private readonly _maxWidth = signal<string>('220px');
  private readonly _arrow = signal<boolean>(true);
  private readonly _offsetPx = signal<number>(8);

  private readonly tooltipStyles = computed(() => ({
    '--cao-tooltip-bg': this._bgColor(),
    '--cao-tooltip-text-color': this._textColor(),
    '--cao-tooltip-font-size': this._fontSize(),
    '--cao-tooltip-max-width': this._maxWidth(),
  }));

  private componentRef: ComponentRef<CaoTooltipContainerComponent> | null = null;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly appRef: ApplicationRef,
    private readonly injector: EnvironmentInjector
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.show();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hide();
  }

  @HostListener('focus')
  onFocus(): void {
    this.show();
  }

  @HostListener('blur')
  onBlur(): void {
    this.hide();
  }

  private show(): void {
    if (this.componentRef) {return;}

    this.componentRef = createComponent(CaoTooltipContainerComponent, {
      environmentInjector: this.injector,
    });

    const instance = this.componentRef.instance;
    instance.content = this._content();
    instance.position = this._position();
    instance.showArrow = this._arrow();
    instance.styles = this.tooltipStyles();

    this.appRef.attachView(this.componentRef.hostView);
    this.renderer.appendChild(document.body, this.componentRef.location.nativeElement);

    requestAnimationFrame(() => {
      if (!this.componentRef) {return;}
      this.positionTooltip(this.componentRef.location.nativeElement as HTMLElement);
      this.componentRef.instance.visible = true;
      this.componentRef.changeDetectorRef.detectChanges();
    });
  }

  private hide(): void {
    if (!this.componentRef) {return;}
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.componentRef = null;
  }

  private positionTooltip(tooltipEl: HTMLElement): void {
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const offset = this._offsetPx();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    switch (this._position()) {
      case 'top':
        top = hostRect.top + scrollY - tooltipRect.height - offset;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + scrollY + offset;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left + scrollX - tooltipRect.width - offset;
        break;
      case 'right':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + scrollX + offset;
        break;
    }

    this.renderer.setStyle(tooltipEl, 'top', `${top}px`);
    this.renderer.setStyle(tooltipEl, 'left', `${left}px`);
  }

  ngOnDestroy(): void {
    this.hide();
  }
}