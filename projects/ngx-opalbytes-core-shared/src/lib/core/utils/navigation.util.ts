import { ROUTES } from './../../shared/constants/routes.constants';
import { Injectable } from "@angular/core";
import { NavigationExtras, Router, UrlTree } from "@angular/router";


/**
 * Tipo para as rotas configuradas
 */
type RouteConfig = {
  path: string;
  title: string;
};

/**
 * Opções de navegação
 */
export interface INavigationOptions extends NavigationExtras {
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
}

/**
 * Service utilitário para navegação centralizada
 * Evita magic strings e fornece métodos prontos para uso
 *
 * @example
 * // Navegação simples
 * this.navigationUtil.navigateTo(ROUTES.HOME);
 *
 * @example
 * // Com tratamento de erro
 * this.navigationUtil.navigateTo(ROUTES.CATALOGO, {
 *   onError: (err) => console.error('Erro:', err)
 * });
 *
 * @example
 * // Com query params
 * this.navigationUtil.navigateTo(ROUTES.CATALOGO, {
 *   queryParams: { categoria: 'cnh' }
 * });
 */
@Injectable({
  providedIn: "root",
})
export class NavigationUtil {
  constructor(private router: Router) {}

  /**
   * Navega para uma rota usando a configuração de ROUTES
   * @param route - Configuração da rota (ex: ROUTES.HOME)
   * @param options - Opções de navegação e callbacks
   * @returns Promise<boolean>
   */
  async navigateTo(route: RouteConfig, options?: INavigationOptions): Promise<boolean> {
    const { onError, onSuccess, ...navigationExtras } = options || {};

    try {
      const result = await this.router.navigate([route.path], navigationExtras);

      if (result && onSuccess) {
        onSuccess();
      }

      return result;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error("Erro ao navegar:", error);
      }
      return false;
    }
  }

  /**
   * Navega para uma rota com parâmetros dinâmicos
   * @param route - Configuração da rota base
   * @param params - Parâmetros dinâmicos (ex: { slug: 'abc123' })
   * @param options - Opções de navegação e callbacks
   * @returns Promise<boolean>
   *
   * @example
   * // Para rota 'homologacao/:slug'
   * this.navigationUtil.navigateToWithParams(
   *   ROUTES.HOMOLOGACAO,
   *   { slug: 'abc123' }
   * );
   * // Navega para: /homologacao/abc123
   */
  async navigateToWithParams(
    route: RouteConfig,
    params: Record<string, string | number>,
    options?: INavigationOptions
  ): Promise<boolean> {
    const { onError, onSuccess, ...navigationExtras } = options || {};

    try {
      let path = route.path;

      // Substitui os parâmetros na rota
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, String(value));
      });

      const result = await this.router.navigate([path], navigationExtras);

      if (result && onSuccess) {
        onSuccess();
      }

      return result;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error("Erro ao navegar:", error);
      }
      return false;
    }
  }

  /**
   * Navega para uma URL absoluta
   * @param url - URL completa (ex: '/catalogo/cursos')
   * @param options - Opções de navegação e callbacks
   * @returns Promise<boolean>
   */
  async navigateByUrl(url: string | UrlTree, options?: INavigationOptions): Promise<boolean> {
    const { onError, onSuccess, ...navigationExtras } = options || {};

    try {
      const result = await this.router.navigateByUrl(url, navigationExtras);

      if (result && onSuccess) {
        onSuccess();
      }

      return result;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error("Erro ao navegar:", error);
      }
      return false;
    }
  }

  /**
   * Navega para a rota anterior (back)
   * Se não houver histórico, navega para a HOME
   */
  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateTo(ROUTES.HOME);
    }
  }

  /**
   * Recarrega a rota atual
   * @param options - Opções de navegação
   */
  async reload(options?: INavigationOptions): Promise<boolean> {
    const currentUrl = this.router.url;

    // Navega para uma rota dummy e volta
    await this.router.navigateByUrl("/", { skipLocationChange: true });

    return this.navigateByUrl(currentUrl, options);
  }

  /**
   * Obtém a URL atual
   * @returns string
   */
  getCurrentUrl(): string {
    return this.router.url;
  }

  /**
   * Verifica se está em uma rota específica
   * @param route - Configuração da rota
   * @returns boolean
   */
  isCurrentRoute(route: RouteConfig): boolean {
    const currentPath = this.router.url.split("?")[0].replace("/", "");
    const routePath = route.path.replace("/", "");
    return currentPath === routePath;
  }

  /**
   * Navega de forma relativa à rota atual
   * @param commands - Comandos de navegação
   * @param options - Opções de navegação e callbacks
   * @returns Promise<boolean>
   *
   * @example
   * // Na rota '/curso', navegar para '/curso/detalhes'
   * this.navigationUtil.navigateRelative(['detalhes']);
   */
  async navigateRelative(commands: string[], options?: INavigationOptions): Promise<boolean> {
    const { onError, onSuccess, ...navigationExtras } = options || {};

    try {
      const result = await this.router.navigate(commands, {
        relativeTo: navigationExtras.relativeTo,
        ...navigationExtras,
      });

      if (result && onSuccess) {
        onSuccess();
      }

      return result;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error("Erro ao navegar:", error);
      }
      return false;
    }
  }

  /**
   * Abre uma rota em uma nova aba
   * @param route - Configuração da rota
   */
  openInNewTab(route: RouteConfig): void {
    const url = this.router.serializeUrl(this.router.createUrlTree([route.path]));
    window.open(url, "_blank");
  }
}
