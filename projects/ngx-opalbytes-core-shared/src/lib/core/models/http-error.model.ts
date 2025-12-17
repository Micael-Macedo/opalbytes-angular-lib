import { HttpStatusCategory } from "../enums/http-status.enum";

/**
 * Interface para configuração de erro HTTP
 */
export interface IHttpErrorConfig {
  status: number;
  title: string;
  message: string;
  category: HttpStatusCategory;
  shouldShowAlert: boolean;
  shouldRedirect: boolean;
  redirectPath?: string;
}

/**
 * Classe que representa um erro HTTP estruturado
 * Segue princípio Single Responsibility - apenas armazena dados do erro
 */
export class HttpErrorModel {
  constructor(
    public readonly status: number,
    public readonly title: string,
    public readonly message: string,
    public readonly category: HttpStatusCategory,
    public readonly shouldShowAlert = true,
    public readonly shouldRedirect = false,
    public readonly redirectPath?: string,
    public readonly originalError?: unknown
  ) {}

  /**
   * Factory method para criar HttpErrorModel a partir de config
   */
  static fromConfig(config: IHttpErrorConfig, originalError?: unknown): HttpErrorModel {
    return new HttpErrorModel(
      config.status,
      config.title,
      config.message,
      config.category,
      config.shouldShowAlert,
      config.shouldRedirect,
      config.redirectPath,
      originalError
    );
  }

  /**
   * Verifica se é erro do cliente
   */
  isClientError(): boolean {
    return this.category === HttpStatusCategory.CLIENT_ERROR;
  }

  /**
   * Verifica se é erro do servidor
   */
  isServerError(): boolean {
    return this.category === HttpStatusCategory.SERVER_ERROR;
  }
}
