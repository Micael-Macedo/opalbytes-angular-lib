import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ICaoBreadcrumbItem, ICaoBreadcrumbItemClickEvent } from './breadcrumb.model';
import { CaoBaseIcon } from '../base-icon/base-icon';

@Component({
  selector: 'cao-breadcrumb',
  imports: [NgTemplateOutlet, RouterLink, CaoBaseIcon],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoBreadcrumbComponent {
  /** Itens do breadcrumb. O último item é tratado como página atual. */
  readonly items = input<ICaoBreadcrumbItem[]>([]);
  /** Item "home" opcional, sempre exibido como primeiro item. */
  readonly home = input<ICaoBreadcrumbItem | undefined>(undefined);

  /** Texto do divisor. Padrão: `'/'`. Ignorado se `separatorIcon` for informado. */
  readonly separator = input<string>('/');
  /** Ícone do divisor (nome Lucide ou imagem). Tem prioridade sobre `separator`. */
  readonly separatorIcon = input<string>('');
  readonly isLucideSeparatorIcon = input<boolean>(true);
  readonly separatorIconSize = input<number>(14);
  readonly separatorIconStrokeWidth = input<number>(1.5);

  readonly linkColor = input<string>('');
  readonly linkHoverColor = input<string>('');
  readonly currentColor = input<string>('');
  readonly separatorColor = input<string>('');
  readonly fontSize = input<string>('');
  readonly gap = input<string>('');

  readonly ariaLabel = input<string>('Breadcrumb');
  readonly dataCy = input<string>('');

  /** Emitido ao clicar em qualquer item interativo. */
  readonly itemClick = output<ICaoBreadcrumbItemClickEvent>();

  protected readonly allItems = computed<ICaoBreadcrumbItem[]>(() => {
    const home = this.home();
    return home ? [home, ...this.items()] : this.items();
  });

  protected isInteractive(item: ICaoBreadcrumbItem, isLast: boolean): boolean {
    return !isLast && !item.disabled && (this.hasLink(item) || !!item.href || !!item.command);
  }

  protected hasLink(item: ICaoBreadcrumbItem): boolean {
    return item.link !== undefined && item.link !== null;
  }

  protected onItemClick(item: ICaoBreadcrumbItem, index: number, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    const payload: ICaoBreadcrumbItemClickEvent = { item, index, originalEvent: event };
    item.command?.(payload);
    this.itemClick.emit(payload);
  }

  protected iconPosition(item: ICaoBreadcrumbItem): 'left' | 'right' {
    return item.iconPosition ?? 'left';
  }

  protected isLucide(item: ICaoBreadcrumbItem): boolean {
    return item.isLucideIcon ?? true;
  }
}