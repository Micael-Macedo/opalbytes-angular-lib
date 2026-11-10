/** Item (comando) exibido na lista. */
export interface ICaoCmdKItem {
  /** Identificador único do item. */
  id: string | number;
  /** Texto principal (usado na busca). */
  label: string;
  /** Texto secundário exibido abaixo do `label` (também usado na busca). */
  description?: string;
  /** Nome do ícone Lucide ou caminho/URL de imagem. */
  icon?: string;
  /** Define se `icon` é Lucide. Padrão: `true`. */
  isLucideIcon?: boolean;
  /** Cor do ícone Lucide. */
  iconColor?: string;
  /** Atalho exibido à direita (apenas visual). Ex.: `'⌘P'` ou `['Ctrl', 'P']`. */
  shortcut?: string | string[];
  /** Palavras-chave adicionais usadas na busca. */
  keywords?: string[];
  /** Texto de badge exibido à direita. */
  badge?: string;
  /** Desabilita o item (não pode ser selecionado). */
  disabled?: boolean;
  /** Dados livres associados ao item (devolvidos em `itemSelected`). */
  data?: unknown;
  /** Callback executado ao selecionar o item. */
  command?: (item: ICaoCmdKItem) => void;
  /** Atributo `data-cy` para testes E2E. */
  dataCy?: string;
}

/** Grupo de itens com um título. */
export interface ICaoCmdKGroup {
  /** Identificador opcional do grupo. */
  id?: string | number;
  /** Título exibido acima dos itens. */
  heading: string;
  items: ICaoCmdKItem[];
}

/** Evento emitido ao selecionar um item. */
export interface ICaoCmdKSelectEvent {
  item: ICaoCmdKItem;
  /** Título do grupo do item (vazio para itens sem grupo). */
  group: string;
}

/** Posição vertical do painel. */
export type CaoCmdKPosition = 'center' | 'top';

/** Função de filtro customizada. Recebe o texto digitado (sem espaços nas pontas). */
export type CaoCmdKFilterFn = (item: ICaoCmdKItem, query: string) => boolean;