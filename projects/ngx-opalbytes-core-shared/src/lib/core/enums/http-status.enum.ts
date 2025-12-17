/**
 * Enum de HTTP Status Codes
 * Baseado em: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export enum HttpStatus {
  // ========================================
  // 2xx Success
  // ========================================
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // ========================================
  // 3xx Redirection
  // ========================================
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,

  // ========================================
  // 4xx Client Errors
  // ========================================
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  // ========================================
  // 5xx Server Errors
  // ========================================
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * Categorias de Status HTTP
 */
export enum HttpStatusCategory {
  SUCCESS = "SUCCESS",
  REDIRECTION = "REDIRECTION",
  CLIENT_ERROR = "CLIENT_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN",
}

/**
 * Utilitário para trabalhar com HTTP Status
 */
export class HttpStatusUtil {
  /**
   * Retorna a categoria de um status code
   */
  static getCategory(status: number): HttpStatusCategory {
    if (status >= 200 && status < 300) {
      return HttpStatusCategory.SUCCESS;
    }
    if (status >= 300 && status < 400) {
      return HttpStatusCategory.REDIRECTION;
    }
    if (status >= 400 && status < 500) {
      return HttpStatusCategory.CLIENT_ERROR;
    }
    if (status >= 500 && status < 600) {
      return HttpStatusCategory.SERVER_ERROR;
    }
    return HttpStatusCategory.UNKNOWN;
  }

  /**
   * Verifica se é um erro do cliente
   */
  static isClientError(status: number): boolean {
    return this.getCategory(status) === HttpStatusCategory.CLIENT_ERROR;
  }

  /**
   * Verifica se é um erro do servidor
   */
  static isServerError(status: number): boolean {
    return this.getCategory(status) === HttpStatusCategory.SERVER_ERROR;
  }

  /**
   * Verifica se é sucesso
   */
  static isSuccess(status: number): boolean {
    return this.getCategory(status) === HttpStatusCategory.SUCCESS;
  }

  /**
   * Verifica se deve redirecionar
   */
  static shouldRedirect(status: number): boolean {
    return status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN;
  }
}
