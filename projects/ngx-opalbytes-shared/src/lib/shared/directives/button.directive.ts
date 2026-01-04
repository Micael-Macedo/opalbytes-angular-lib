import { Directive, inject, input, computed, ElementRef, HostListener } from '@angular/core';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'success'
  | 'warn';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Directive({
  selector: '[appButton]',
  standalone: true,
  host: {
    '[class]': 'buttonClasses()',
    '[disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.type]': 'type()',
  },
})
export class ButtonDirective {
  private el = inject(ElementRef);

  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('default');
  className = input<string>('');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  loading = input<boolean>(false);

  buttonClasses = computed(() => {
    const base = [
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'whitespace-nowrap',
      'rounded-md',
      'text-sm',
      'font-medium',
      'ring-offset-background',
      'transition-all',
      'duration-200',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      '[&_svg]:pointer-events-none',
      '[&_svg]:w-4',
      '[&_svg]:h-4',
      '[&_svg]:shrink-0',
    ];

    // Adiciona classes de loading se necessário
    if (this.loading()) {
      base.push('cursor-wait', 'relative');
    }

    const variants = {
      default: [
        'bg-primary',
        'text-primary-foreground',
        'hover:bg-primary/90',
        'active:bg-primary/95',
      ],
      destructive: [
        'bg-destructive',
        'text-destructive-foreground',
        'hover:bg-destructive/90',
        'active:bg-destructive/95',
      ],
      success: ['bg-green-600', 'text-white', 'hover:bg-green-700', 'active:bg-green-800'],
      warn: ['bg-yellow-600', 'text-white', 'hover:bg-yellow-700', 'active:bg-yellow-800'],
      outline: [
        'border',
        'border-input',
        'bg-background',
        'hover:bg-accent',
        'hover:text-accent-foreground',
        'active:bg-accent/80',
      ],
      secondary: [
        'bg-secondary',
        'text-secondary-foreground',
        'hover:bg-secondary/80',
        'active:bg-secondary/90',
      ],
      ghost: ['hover:bg-accent', 'hover:text-accent-foreground', 'active:bg-accent/80'],
      link: ['text-primary', 'underline-offset-4', 'hover:underline', 'active:text-primary/80'],
    };

    const sizes = {
      default: ['h-10', 'px-4', 'py-2'],
      sm: ['h-9', 'px-3', 'py-1.5'],
      lg: ['h-11', 'px-8', 'py-3'],
      icon: ['h-10', 'w-10', 'p-0'],
    };

    return [
      ...base,
      ...(variants[this.variant()] || variants.default),
      ...(sizes[this.size()] || sizes.default),
      this.className(),
    ]
      .filter(Boolean)
      .join(' ');
  });

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  constructor() {
    const nativeEl = this.el.nativeElement;
    if (nativeEl.tagName.toLowerCase() !== 'button') {
      nativeEl.setAttribute('role', 'button');
      nativeEl.setAttribute('tabindex', '0');
    }
  }
}
