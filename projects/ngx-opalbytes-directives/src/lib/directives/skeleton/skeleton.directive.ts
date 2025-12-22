import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  effect,
} from '@angular/core';

@Directive({
  selector: '[caoSkeleton]',
  standalone: true,
})
export class RnvSkeletonDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  private readonly SKELETON_DURATION = 2000;
  private loadingSignal = signal(true);
  private timeoutId: any;
  private skeletonElements: Array<{
    element: HTMLElement;
    originalClasses: string[];
    originalStyles: Map<string, string>;
  }> = [];

  private loadingEffect = effect(() => {
    const isLoading = this.loadingSignal();

    if (isLoading) {
      setTimeout(() => this.showSkeleton(), 0);
    } else {
      setTimeout(() => this.hideSkeleton(), 0);
    }
  });

  ngAfterViewInit(): void {
    this.timeoutId = setTimeout(() => {
      this.loadingSignal.set(false);
    }, this.SKELETON_DURATION);
  }

  private showSkeleton(): void {
    const element = this.el.nativeElement;
    this.applySkeletonToElement(element);
  }

  private applySkeletonToElement(element: HTMLElement): void {
    const children = Array.from(element.children) as HTMLElement[];

    children.forEach((child: HTMLElement) => {
      if (this.shouldSkipElement(child)) {
        return;
      }

      if (child.children.length > 0) {
        this.applySkeletonToElement(child);
      } else {
        this.createSkeletonForElement(child);
      }
    });
  }

  private shouldSkipElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    const skipTags = ['lucide-icon', 'svg', 'img'];

    return skipTags.includes(tagName);
  }

  private createSkeletonForElement(element: HTMLElement): void {
    const tagName = element.tagName.toLowerCase();
    const classList = Array.from(element.classList);

    const originalStyles = new Map<string, string>();
    ['background', 'color', 'border', 'box-shadow'].forEach((prop) => {
      const value = element.style.getPropertyValue(prop);
      if (value) {
        originalStyles.set(prop, value);
      }
    });

    this.skeletonElements.push({ element, originalClasses: classList, originalStyles });

    if (tagName === 'button') {
      this.renderer.addClass(element, 'skeleton-button');
    } else if (
      tagName === 'h1' ||
      tagName === 'h2' ||
      tagName === 'h3' ||
      tagName === 'h4' ||
      tagName === 'h5' ||
      tagName === 'h6'
    ) {
      this.renderer.addClass(element, 'skeleton-heading');
    } else if (tagName === 'p' || tagName === 'span' || tagName === 'a') {
      this.renderer.addClass(element, 'skeleton-text');
    } else if (
      element.classList.contains('rounded-full') ||
      element.classList.contains('rounded-circle')
    ) {
      this.renderer.addClass(element, 'skeleton-circle');
    } else {
      this.renderer.addClass(element, 'skeleton-box');
    }

    this.renderer.addClass(element, 'animate-pulse');
    this.renderer.setStyle(element, 'color', 'transparent');
    this.renderer.setStyle(element, 'user-select', 'none');
    this.renderer.setStyle(element, 'pointer-events', 'none');
  }

  private hideSkeleton(): void {
    this.skeletonElements.forEach(({ element, originalStyles }) => {
      this.renderer.removeClass(element, 'skeleton-button');
      this.renderer.removeClass(element, 'skeleton-heading');
      this.renderer.removeClass(element, 'skeleton-text');
      this.renderer.removeClass(element, 'skeleton-circle');
      this.renderer.removeClass(element, 'skeleton-box');
      this.renderer.removeClass(element, 'animate-pulse');

      this.renderer.removeStyle(element, 'color');
      this.renderer.removeStyle(element, 'user-select');
      this.renderer.removeStyle(element, 'pointer-events');

      originalStyles.forEach((value, prop) => {
        this.renderer.setStyle(element, prop, value);
      });
    });

    this.skeletonElements = [];
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.hideSkeleton();
  }
}
