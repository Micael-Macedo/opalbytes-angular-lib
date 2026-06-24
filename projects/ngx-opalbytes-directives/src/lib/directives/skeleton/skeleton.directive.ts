import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  inject,
  input,
  signal,
  effect,
  afterNextRender,
  Injector,
} from '@angular/core';

export interface ICaoSkeletonEntry {
  element: HTMLElement;
  placeholder: HTMLElement;
}

@Directive({
  selector: '[caoSkeleton]',
  standalone: true,
})
export class CaoSkeletonDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private injector = inject(Injector);

  /** Controla se o skeleton está ativo. Bind via [caoSkeleton]="isLoading" */
  readonly caoSkeleton = input<boolean>(true);

  /**
   * Estratégia de leitura de tamanho:
   * - 'computed'  → usa getComputedStyle (padrão, mais preciso)
   * - 'bounding'  → usa getBoundingClientRect
   */
  readonly caoSkeletonStrategy = input<'computed' | 'bounding'>('computed');

  /**
   * Raio de borda padrão dos placeholders (ex: '6px', '50%').
   * Se não informado, o raio é herdado do elemento original.
   */
  readonly caoSkeletonRadius = input<string>('');

  /**
   * Cor base do skeleton. Padrão: '#e2e8f0'
   */
  readonly caoSkeletonColor = input<string>('#e2e8f0');

  /**
   * Cor do brilho animado. Padrão: '#f8fafc'
   */
  readonly caoSkeletonShine = input<string>('#f8fafc');

  /**
   * Controla se deve percorrer todos os elementos filhos.
   * - false (padrão): aplica o skeleton apenas no elemento com a diretiva
   * - true: percorre todos os filhos e cria skeletons individuais
   */
  readonly caoSkeletonDeep = input<boolean>(false);

  /**
   * Permite customizar o estilo do skeleton via CSS classes
   */
  readonly caoSkeletonClass = input<string>('');

  /**
   * Permite customizar o estilo inline do placeholder
   */
  readonly caoSkeletonStyle = input<Record<string, string>>({});

  private entries: ICaoSkeletonEntry[] = [];
  private styleSheet: HTMLStyleElement | null = null;
  private viewInitialized = signal(false);
  private isBuilding = false;
  private buildPending = false;
  private hostPlaceholder: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;

  protected readonly SKIP_TAGS = new Set([
        'script', 'style', 'link', 'meta',
    'br', 'hr', 'wbr', 'source', 'track',
  ]);

  constructor() {
    effect(() => {
      const active = this.caoSkeleton();
      this.caoSkeletonDeep();
      this.caoSkeletonColor();
      this.caoSkeletonShine();
      this.caoSkeletonRadius();
      this.caoSkeletonClass();
      this.caoSkeletonStyle();
      this.caoSkeletonStrategy();

      if (!this.viewInitialized) { return };

      if (!active) {
        this.teardownSkeleton();
        return;
      }

      afterNextRender({
        write: () => this.buildSkeleton(),
      }, { injector: this.injector });
    });
  }

  ngAfterViewInit(): void {
    this.injectGlobalStyles();
    this.viewInitialized.set(true);
  }


  private buildSkeleton(): void {
    if (this.isBuilding) {return;}
    this.isBuilding = true;

    try {
      this.removeOrphanedPlaceholders();
      this.teardownSkeleton();
      const host = this.el.nativeElement as HTMLElement;
      
      if (this.caoSkeletonDeep()) {
        this.collectLeaves(host);
      } else {
        this.replaceElementSkeleton(host);
      }
    } finally {
      this.isBuilding = false;
    }
  }

  /**
   * Verifica se o elemento é um componente Angular (tag com hífen)
   */
  private isAngularComponent(element: HTMLElement): boolean {
    const tag = element.tagName.toLowerCase();
    return tag.includes('-');
  }

  /**
   * Encontra o elemento mais interno renderizável de um componente
   */
  private getInnermostRenderableElement(element: HTMLElement): HTMLElement {
    if (this.isAngularComponent(element)) {
      const children = Array.from(element.children) as HTMLElement[];
      
      if (children.length === 0) {
        return element;
      }
      
      for (const child of children) {
        if (!this.shouldSkip(child)) {
          if (this.isAngularComponent(child)) {
            return this.getInnermostRenderableElement(child);
          }
          return child;
        }
      }
      
      const firstValidChild = children.find(c => !this.shouldSkip(c));
      if (firstValidChild) {
        return firstValidChild;
      }
      
      return element;
    }
    
    return element;
  }

  /**
   * Aplica skeleton em um elemento, seja ele componente ou não
   */
  private replaceElementSkeleton(element: HTMLElement): void {
    const targetElement = this.getInnermostRenderableElement(element);
    this.replaceSkeleton(targetElement);
  }

  /**
   * Percorre a árvore DOM recursivamente buscando folhas visíveis.
   */
  private collectLeaves(element: HTMLElement): void {
    const children = Array.from(element.children) as HTMLElement[];

    if (children.length === 0 || !this.hasRenderableChildren(element)) {
      this.replaceSkeleton(element);
      return;
    }

    for (const child of children) {
      if (this.shouldSkip(child)) {continue;}

      const hasVisibleChildren = this.hasRenderableChildren(child);

      if (hasVisibleChildren) {
        this.collectLeaves(child);
      } else {
        this.replaceSkeleton(child);
      }
    }
  }

  private hasRenderableChildren(el: HTMLElement): boolean {
    return Array.from(el.children).some(
      (c) => !this.shouldSkip(c as HTMLElement)
    );
  }

  private shouldSkip(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    if (this.SKIP_TAGS.has(tag)) {return true;}

    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') {return true;}
    if (parseFloat(style.width) === 0 && parseFloat(style.height) === 0) {return true;}

    if (el.textContent?.trim() === '' && el.children.length === 0 && tag !== 'img' && tag !== 'svg') {
      return true;
    }

    return false;
  }

  /**
   * Cria um placeholder posicionado exatamente sobre o elemento original.
   */
  private replaceSkeleton(target: HTMLElement): void {
    const targetElement = this.getInnermostRenderableElement(target);
    
    if (this.entries.some(e => e.element === targetElement)) {return;}
    
    const rect = this.measureElement(targetElement);
    if (rect.width < 4 || rect.height < 4) {return;}

    const hostRect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();

    const top = rect.top - hostRect.top;
    const left = rect.left - hostRect.left;

    const hostStyle = getComputedStyle(this.el.nativeElement);
    if (hostStyle.position === 'static') {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    }

    const shape = this.detectShape(targetElement);
    const radius = this.resolveRadius(targetElement, shape);

    const placeholder = this.createPlaceholder(
      targetElement, 
      top, 
      left, 
      rect.width, 
      rect.height, 
      radius
    );
    
    this.renderer.appendChild(this.el.nativeElement, placeholder);
    
    this.applyCustomStyles(placeholder);

    this.hideElement(targetElement);

    this.entries.push({ element: targetElement, placeholder });
  }

  /**
   * Cria um elemento placeholder com as propriedades básicas
   */
  private createPlaceholder(
    target: HTMLElement, 
    top: number, 
    left: number, 
    width: number, 
    height: number, 
    radius: string
  ): HTMLElement {
    const placeholder = this.renderer.createElement('span') as HTMLElement;
    this.renderer.addClass(placeholder, 'cao-skeleton-placeholder');
    
    if (this.caoSkeletonClass()) {
      this.renderer.addClass(placeholder, this.caoSkeletonClass());
    }
    
    const baseStyles: Record<string, string> = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: radius,
      backgroundColor: this.caoSkeletonColor(),
      backgroundImage: `linear-gradient(90deg, transparent 0%, ${this.caoSkeletonShine()} 50%, transparent 100%)`,
      backgroundSize: '200% 100%',
      animation: 'cao-shimmer 1.6s infinite linear',
      zIndex: '10',
      pointerEvents: 'none',
      display: 'block',
      willChange: 'transform, background-position',
    };

    Object.entries(baseStyles).forEach(([key, value]) => {
      this.renderer.setStyle(placeholder, key, value);
    });

    return placeholder;
  }

  /**
   * Aplica estilos customizados ao placeholder
   */
  private applyCustomStyles(placeholder: HTMLElement): void {
    const customStyles = this.caoSkeletonStyle();
    Object.entries(customStyles).forEach(([key, value]) => {
      this.renderer.setStyle(placeholder, key, value);
    });
  }

  /**
   * Esconde o elemento mantendo o layout
   */
  private hideElement(element: HTMLElement): void {
    this.renderer.setStyle(element, 'color', 'transparent');
    this.renderer.setStyle(element, 'user-select', 'none');
    this.renderer.setStyle(element, 'pointer-events', 'none');
    
    const computed = getComputedStyle(element);
    if (computed.display === 'inline' || computed.display === 'inline-block') {
      this.renderer.setStyle(element, 'display', 'inline-block');
    }
  }

  /**
   * Restaura o elemento para seu estado original
   */
  private restoreElement(element: HTMLElement): void {
    this.renderer.setStyle(element, 'visibility', 'visible');
    this.renderer.setStyle(element, 'color', '');
    this.renderer.removeStyle(element, 'color');
    this.renderer.removeStyle(element, 'user-select');
    this.renderer.removeStyle(element, 'pointer-events');
    this.renderer.removeStyle(element, 'display');
  }


  /**
   * Remove spans placeholder órfãos que porventura tenham ficado no DOM
   */
  private removeOrphanedPlaceholders(): void {
    this.el.nativeElement.querySelectorAll('.cao-skeleton-placeholder').forEach((el: Element) => {
      el.parentNode?.removeChild(el);
    });
  }

  private teardownSkeleton(): void {
    const entriesToRestore = [...this.entries];
    this.entries = [];
    this.hostPlaceholder = null;

    for (const { element, placeholder } of entriesToRestore) {
      this.restoreElement(element);
      if (placeholder.parentNode) {
        this.renderer.removeChild(placeholder.parentNode, placeholder);
      }
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }


  private measureElement(el: HTMLElement): DOMRect {
    if (this.caoSkeletonStrategy() === 'bounding') {
      return el.getBoundingClientRect();
    }

    const rect = el.getBoundingClientRect();
    return new DOMRect(
      rect.left, 
      rect.top, 
      el.offsetWidth || rect.width, 
      el.offsetHeight || rect.height
    );
  }


  private detectShape(el: HTMLElement): 'circle' | 'rounded' | 'rect' {
    const tag = el.tagName.toLowerCase();
    const cls = el.classList;

    if (
      cls.contains('rounded-full') ||
      cls.contains('rounded-circle') ||
      cls.contains('circle') ||
      el.style.borderRadius?.includes('50%')
    ) {return 'circle';}

    if (tag === 'button' || cls.contains('btn') || cls.contains('rounded') || cls.contains('rounded-md')) {
      return 'rounded';
    }

    const computed = getComputedStyle(el);
    const br = parseFloat(computed.borderRadius || '0');
    if (br > 0) {return 'rounded';}

    return 'rect';
  }

  private resolveRadius(el: HTMLElement, shape: 'circle' | 'rounded' | 'rect'): string {
    if (this.caoSkeletonRadius()) {return this.caoSkeletonRadius();}

    switch (shape) {
      case 'circle':  return '50%';
      case 'rounded': return getComputedStyle(el).borderRadius || '6px';
      default:        return '4px';
    }
  }

  private injectGlobalStyles(): void {
    const id = 'cao-skeleton-styles';
    if (document.getElementById(id)) {return;}

    const style = this.renderer.createElement('style') as HTMLStyleElement;
    style.id = id;
    style.textContent = `
      @keyframes cao-shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .cao-skeleton-placeholder {
          animation: none !important;
        }
      }

      .cao-skeleton-placeholder {
        will-change: transform;
        transition: opacity 0.2s ease;
        opacity: 1;
      }

      .cao-skeleton-placeholder.hidden {
        opacity: 0;
      }
    `;
    this.renderer.appendChild(document.head, style);
    this.styleSheet = style;
  }

  ngOnDestroy(): void {
    this.teardownSkeleton();
  }
}