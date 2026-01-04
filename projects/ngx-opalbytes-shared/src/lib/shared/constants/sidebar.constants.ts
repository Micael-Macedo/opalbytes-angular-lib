import { ISidebarItem } from '@shared.interfaces/sidebar-item.interface';

const SIDEBAR_CONFIG = {
  HOME: {
    route: 'home',
    label: 'INÍCIO',
    icon: 'home',
    permissions: [],
  },
  CADASTRO: {
    route: 'cadastro',
    label: 'CADASTRO',
    icon: 'person_add',
    permissions: ['read_usuario'],
  },
  CONSULTA: {
    route: 'consulta',
    label: 'CONSULTA ECM/PCBA',
    icon: 'security',
    permissions: ['read_person'],
  },
  CONSULTA_PROCESSO_DIGITALIZACAO: {
    route: 'cdr',
    label: 'CONSULTA PROCESSO',
    icon: 'search',
    permissions: ['read_processo_digitalizacao'],
  },
  DASHBOARD: {
    route: 'dashboard',
    label: 'DASHBOARD',
    icon: 'bar_chart',
    permissions: ['read_dashboard'],
  },
  // FINANCEIRO: {
  //   route: 'financeiro',
  //   label: 'FINANCEIRO',
  //   icon: 'attach_money',
  //   permissions: ['admin'] as Permission[],
  // },
  // COMERCIAL: {
  //   route: 'comercial',
  //   label: 'COMERCIAL',
  //   icon: 'shopping_cart',
  //   permissions: ['admin', 'operator'] as Permission[],
  // },
  EXPORTAR_DADOS: {
    route: 'relatorios',
    label: 'EXPORTAR DADOS',
    icon: 'description',
    permissions: ['read_person'],
  },
  RELATORIOS: {
    label: 'RELATÓRIOS',
    icon: 'assessment',
    permissions: [],
    children: [
      {
        route: 'relatorios/processo-digitalizacao',
        label: 'Processo Digitalização',
        permissions: [],
      },
      {
        route: 'relatorios/arquivo',
        label: 'Arquivo',
        permissions: [],
      },
      {
        route: 'relatorios/ficha',
        label: 'Ficha',
        permissions: [],
      },
    ],
  },
  CONFIGURACAO: {
    route: 'config',
    label: 'CONFIGURAÇÃO',
    icon: 'settings',
    permissions: [],
  },
  // SUPORTE: {
  //   route: 'suporte',
  //   label: 'SUPORTE',
  //   icon: 'help',
  //   permissions: ['operator'] as Permission[],
  // },
  // SUPORTE_SAC: {
  //   route: 'suporte-sac',
  //   label: 'SUPORTE SAC',
  //   icon: 'groups',
  //   permissions: ['admin', 'operator'] as Permission[],
  // },
} as const;

export const SIDEBAR_ROUTES = SIDEBAR_CONFIG;

export const SIDEBAR_ITEMS: ISidebarItem[] = Object.values(SIDEBAR_CONFIG).map((item) => ({
  route: 'route' in item && item.route ? `/${item.route}` : undefined,
  label: item.label,
  icon: item.icon,
  permissions: item.permissions ? [...item.permissions] : [], // Spread para converter readonly em mutável
  children:
    'children' in item && item.children
      ? item.children.map((child) => ({
          route: child.route ? `/${child.route}` : undefined,
          label: child.label,
          permissions: child.permissions ? [...child.permissions] : [],
        }))
      : undefined,
}));

export type SidebarRouteKey = keyof typeof SIDEBAR_ROUTES;
