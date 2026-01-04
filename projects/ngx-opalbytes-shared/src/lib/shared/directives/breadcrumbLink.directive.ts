import {
  Directive,
  inject,
  ElementRef,
  input,
  computed,
  HostListener,
  HostBinding,
} from '@angular/core';

export type BreadcrumbLinkVariant = 'default' | 'current' | 'disabled';

@Directive({
  selector: '[appBreadcrumbLink]',
  standalone: true,
  host: {
    '[class]': 'linkClasses()',
    '[attr.aria-current]': 'isCurrent() ? "page" : null',
    '[tabindex]': 'disabled() ? "-1" : "0"',
  },
})
export class BreadcrumbLinkDirective {
  private el = inject(ElementRef);

  variant = input<BreadcrumbLinkVariant>('default');
  className = input<string>('');
  disabled = input<boolean>(false);
  href = input<string>('');
  isCurrent = input<boolean>(false);

  @HostBinding('attr.href')
  get hrefAttr() {
    return this.disabled() ? null : this.href();
  }

  linkClasses = computed(() => {
    const base = [
      'inline-flex',
      'items-center',
      'text-sm',
      'font-medium',
      'transition-colors',
      'duration-200',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
    ];

    const variants = {
      default: [
        'text-muted-foreground',
        'hover:text-foreground',
        'hover:underline',
        'active:text-foreground/80',
      ],
      current: ['text-foreground', 'font-semibold', 'cursor-default'],
      disabled: ['text-muted-foreground/50', 'cursor-not-allowed', 'pointer-events-none'],
    };

    const currentVariant = this.disabled()
      ? 'disabled'
      : this.isCurrent()
        ? 'current'
        : this.variant();

    return [...base, ...(variants[currentVariant] || variants.default), this.className()]
      .filter(Boolean)
      .join(' ');
  });

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.disabled() || this.isCurrent()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled() || this.isCurrent()) {
      event.preventDefault();
      event.stopPropagation();
    } else if (this.href()) {
      // Navega programaticamente se for um link
      window.location.href = this.href();
    }
  }

  constructor() {
    const nativeElement = this.el.nativeElement;
    if (nativeElement.tagName.toLowerCase() !== 'a') {
      nativeElement.setAttribute('role', 'link');
    }
  }
}
