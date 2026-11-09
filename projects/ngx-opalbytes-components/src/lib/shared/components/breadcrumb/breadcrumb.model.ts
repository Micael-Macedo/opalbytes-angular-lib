import { Params } from '@angular/router';

/** Posição do ícone em relação ao texto do item. */
export type CaoBreadcrumbIconPosition = 'left' | 'right';

/** Item do breadcrumb. */
export interface ICaoBreadcrumbItem {
  /** Texto exibido. Pode ser omitido em itens apenas com ícone (informe `ariaLabel`). */
  label?: string;
  /** Nome do ícone Lucide ou caminho/URL/data URI da imagem. */
  icon?: string;
  /** Define se `icon` é um ícone Lucide. Padrão: `true`. */
  isLucideIcon?: boolean;
  /** Posição do ícone em relação ao texto. Padrão: `'left'`. */
  iconPosition?: CaoBreadcrumbIconPosition;
  /** Cor do ícone (aplicada a ícones Lucide). */
  iconColor?: string;
  /** Tamanho do ícone em px. Padrão: `16`. */
  iconSize?: number;
  /** Espessura do traço do ícone Lucide. Padrão: `1.5`. */
  iconStrokeWidth?: number;

  /** Navegação interna via Angular Router (ex.: `'/clientes'` ou `['/clientes', 12]`). */
  link?: string | unknown[];
  /** Query params usados junto com `link`. */
  queryParams?: Params;
  /** Navegação externa via `href`. Ignorado se `link` estiver definido. */
  href?: string;
  /** `target` do link (ex.: `'_blank'`). */
  target?: '_self' | '_blank' | '_parent' | '_top';
  /** Callback executado ao clicar (item sem `link`/`href` vira um botão). */
  command?: (event: ICaoBreadcrumbItemClickEvent) => void;

  /** Texto/valor do badge exibido após o item. */
  badge?: string | number;
  /** Cor do texto do badge. */
  badgeColor?: string;
  /** Cor de fundo do badge. */
  badgeBgColor?: string;

  /** Desabilita a interação com o item. */
  disabled?: boolean;
  /** `aria-label` do item (recomendado para itens apenas com ícone). */
  ariaLabel?: string;
  /** Atributo `data-cy` para testes E2E. */
  dataCy?: string;
}

/** Evento emitido ao clicar em um item. */
export interface ICaoBreadcrumbItemClickEvent {
  item: ICaoBreadcrumbItem;
  index: number;
  originalEvent: Event;
}