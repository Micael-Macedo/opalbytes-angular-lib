import { isPlatformBrowser } from '@angular/common';
import {
    Directive,
    ElementRef,
    OnDestroy,
    PLATFORM_ID,
    Renderer2,
    afterNextRender,
    booleanAttribute,
    computed,
    effect,
    inject,
    input,
} from '@angular/core';

export type CaoBadgeContent = string | number | null | undefined;
export type CaoBadgeColorPreset = 'primary' | 'accent' | 'warn' | 'success' | 'info';
export type CaoBadgeColor = CaoBadgeColorPreset | (string & Record<never, never>);
export type CaoBadgeSize = 'small' | 'medium' | 'large';
export type CaoBadgePosition =
    | 'above after'
    | 'above before'
    | 'below before'
    | 'below after'
    | 'above'
    | 'below'
    | 'before'
    | 'after';

type VerticalPosition = 'above' | 'below';
type HorizontalPosition = 'before' | 'after';

export interface ICaoBadgeSizeSpec {
    readonly box: number;
    readonly font: number;
    readonly dot: number;
}

export const CAO_BADGE_COLORS: Readonly<Record<CaoBadgeColorPreset, string>> = {
    primary: '#1976d2',
    accent: '#ff4081',
    warn: '#d32f2f',
    success: '#2e7d32',
    info: '#0288d1',
};

export const CAO_BADGE_SIZES: Readonly<Record<CaoBadgeSize, ICaoBadgeSizeSpec>> = {
    small: { box: 16, font: 10, dot: 6 },
    medium: { box: 22, font: 12, dot: 8 },
    large: { box: 28, font: 14, dot: 10 },
};

function toOptionalNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}

function resolvePosition(position: string): {
    vertical: VerticalPosition;
    horizontal: HorizontalPosition;
} {
    const tokens = (position ?? '').split(/\s+/);
    return {
        vertical: tokens.includes('below') ? 'below' : 'above',
        horizontal: tokens.includes('before') ? 'before' : 'after',
    };
}

@Directive({
    selector: '[caoBadge]',
    standalone: true,
})
export class CaoBadgeDirective implements OnDestroy {
    readonly caoBadge = input<CaoBadgeContent>();
    readonly caoBadgeColor = input<CaoBadgeColor>('primary');
    readonly caoBadgeTextColor = input<string>('#ffffff');
    readonly caoBadgePosition = input<CaoBadgePosition>('above after');
    readonly caoBadgeSize = input<CaoBadgeSize>('medium');
    readonly caoBadgeOverlap = input(true, { transform: booleanAttribute });
    readonly caoBadgeHidden = input(false, { transform: booleanAttribute });
    readonly caoBadgeDot = input(false, { transform: booleanAttribute });
    readonly caoBadgeMax = input<number | undefined, unknown>(undefined, {
        transform: toOptionalNumber,
    });
    readonly caoBadgeDescription = input<string>('');

    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    private readonly renderer = inject(Renderer2);
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly badgeEl: HTMLElement = this.renderer.createElement('span');
    private hostPositionForced = false;

    private readonly text = computed(() => {
        if (this.caoBadgeDot()) {
            return '';
        }
        const value = this.caoBadge();
        if (value === null || value === undefined || String(value).trim() === '') {
            return '';
        }
        const max = this.caoBadgeMax();
        const numeric = Number(value);
        if (max !== undefined && !Number.isNaN(numeric) && numeric > max) {
            return `${max}+`;
        }
        return String(value);
    });

    private readonly visible = computed(
        () => !this.caoBadgeHidden() && (this.caoBadgeDot() || this.text() !== ''),
    );

    constructor() {
        this.renderer.addClass(this.badgeEl, 'cao-badge');
        this.applyStaticStyles();
        this.renderer.appendChild(this.host, this.badgeEl);

        afterNextRender(() => this.ensureHostPositioned());
        effect(() => this.render());
    }

    ngOnDestroy(): void {
        this.renderer.removeChild(this.host, this.badgeEl);
        if (this.hostPositionForced) {
            this.renderer.removeStyle(this.host, 'position');
        }
    }

    private ensureHostPositioned(): void {
        if (!this.isBrowser) {
            return;
        }
        if (getComputedStyle(this.host).position === 'static') {
            this.renderer.setStyle(this.host, 'position', 'relative');
            this.hostPositionForced = true;
        }
    }

    private applyStaticStyles(): void {
        const reducedMotion =
            this.isBrowser &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.applyStyles(this.badgeEl, [
            ['position', 'absolute'],
            ['z-index', '1'],
            ['display', 'flex'],
            ['align-items', 'center'],
            ['justify-content', 'center'],
            ['box-sizing', 'border-box'],
            ['border-radius', '100%'],
            ['font-family', 'inherit'],
            ['font-weight', '600'],
            ['line-height', '1'],
            ['white-space', 'nowrap'],
            ['pointer-events', 'none'],
            ['user-select', 'none'],
            ['transform-origin', 'center'],
            ['transition', reducedMotion ? 'none' : 'transform 200ms ease-in-out'],
        ]);
    }

    private applyStyles(el: HTMLElement, styles: ReadonlyArray<readonly [string, string]>): void {
        for (const [prop, value] of styles) {
            this.renderer.setStyle(el, prop, value);
        }
    }

    private render(): void {
        const spec = CAO_BADGE_SIZES[this.caoBadgeSize()] ?? CAO_BADGE_SIZES.medium;
        const dot = this.caoBadgeDot();
        const box = dot ? spec.dot : spec.box;
        const visible = this.visible();
        const description = this.caoBadgeDescription();
        const { vertical, horizontal } = resolvePosition(this.caoBadgePosition());

        const verticalOffset = `${-box / 2}px`;
        const horizontalOffset = `${this.caoBadgeOverlap() ? -box / 2 : -box}px`;

        const color = this.caoBadgeColor();
        const background =
            color in CAO_BADGE_COLORS ? CAO_BADGE_COLORS[color as CaoBadgeColorPreset] : color;

        this.applyStyles(this.badgeEl, [
            ['top', vertical === 'above' ? verticalOffset : 'auto'],
            ['bottom', vertical === 'below' ? verticalOffset : 'auto'],
            ['left', horizontal === 'before' ? horizontalOffset : 'auto'],
            ['right', horizontal === 'after' ? horizontalOffset : 'auto'],
            ['height', `${box}px`],
            ['min-width', `${box}px`],
            ['padding', dot ? '0' : `0 ${Math.round(box / 4)}px`],
            ['font-size', `${spec.font}px`],
            ['background-color', background],
            ['color', this.caoBadgeTextColor()],
            ['transform', visible ? 'scale(1)' : 'scale(0)'],
        ]);
        
        this.renderer.setProperty(this.badgeEl, 'textContent', this.text());

        if (visible && description) {
            this.renderer.setAttribute(this.badgeEl, 'role', 'img');
            this.renderer.setAttribute(this.badgeEl, 'aria-label', description);
            this.renderer.removeAttribute(this.badgeEl, 'aria-hidden');
        } else {
            this.renderer.removeAttribute(this.badgeEl, 'role');
            this.renderer.removeAttribute(this.badgeEl, 'aria-label');
            this.renderer.setAttribute(this.badgeEl, 'aria-hidden', 'true');
        }
    }
}