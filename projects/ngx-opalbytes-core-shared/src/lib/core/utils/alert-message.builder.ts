import { HttpStatus, HttpStatusUtil } from "../enums/http-status.enum";
import { IHttpErrorConfig } from "../models/http-error.model";

/**
 * Interface para mensagem de status HTTP
 */
interface IHttpStatusMessage {
  title: string;
  message: string;
  shouldRedirect?: boolean;
  redirectPath?: string;
}

/**
 * Builder para construir mensagens de alerta baseadas em HTTP Status
 * Segue princípio Single Responsibility - apenas constrói mensagens
 * Segue princípio Open/Closed - extensível através do mapa de mensagens
 */
export class AlertMessageBuilder {
  /**
   * Mapa de mensagens por status code
   * Facilita extensão e manutenção (Open/Closed Principle)
   */
  private static readonly STATUS_MESSAGES: Map<number, IHttpStatusMessage> = new Map([
    // ========================================
    // 2xx Success
    // ========================================
    [
      HttpStatus.OK,
      {
        title: "Sucesso",
        message: "Operação realizada com sucesso.",
      },
    ],
    [
      HttpStatus.CREATED,
      {
        title: "Criado",
        message: "Registro criado com sucesso.",
      },
    ],
    [
      HttpStatus.ACCEPTED,
      {
        title: "Aceito",
        message: "Sua solicitação foi aceita e será processada.",
      },
    ],
    [
      HttpStatus.NO_CONTENT,
      {
        title: "Sucesso",
        message: "Operação realizada com sucesso.",
      },
    ],

    // ========================================
    // 4xx Client Errors
    // ========================================
    [
      HttpStatus.BAD_REQUEST,
      {
        title: "Dados Inválidos",
        message: "Verifique os dados enviados e tente novamente.",
      },
    ],
    [
      HttpStatus.UNAUTHORIZED,
      {
        title: "Não Autorizado",
        message: "Sua sessão expirou. Faça login novamente.",
        shouldRedirect: true,
        redirectPath: "/login",
      },
    ],
    [
      HttpStatus.PAYMENT_REQUIRED,
      {
        title: "Pagamento Necessário",
        message: "É necessário realizar o pagamento para continuar.",
      },
    ],
    [
      HttpStatus.FORBIDDEN,
      {
        title: "Acesso Negado",
        message: "Você não tem permissão para acessar este recurso.",
        shouldRedirect: true,
        redirectPath: "/",
      },
    ],
    [
      HttpStatus.NOT_FOUND,
      {
        title: "Não Encontrado",
        message: "O recurso solicitado não foi encontrado.",
      },
    ],
    [
      HttpStatus.METHOD_NOT_ALLOWED,
      {
        title: "Método Não Permitido",
        message: "A operação solicitada não é permitida.",
      },
    ],
    [
      HttpStatus.NOT_ACCEPTABLE,
      {
        title: "Não Aceitável",
        message: "O servidor não pode produzir uma resposta aceitável.",
      },
    ],
    [
      HttpStatus.REQUEST_TIMEOUT,
      {
        title: "Tempo Esgotado",
        message: "A requisição demorou muito tempo. Tente novamente.",
      },
    ],
    [
      HttpStatus.CONFLICT,
      {
        title: "Conflito",
        message: "Já existe um registro com essas informações.",
      },
    ],
    [
      HttpStatus.GONE,
      {
        title: "Recurso Removido",
        message: "Este recurso não está mais disponível.",
      },
    ],
    [
      HttpStatus.UNPROCESSABLE_ENTITY,
      {
        title: "Dados Inválidos",
        message: "Os dados enviados não puderam ser processados.",
      },
    ],
    [
      HttpStatus.TOO_MANY_REQUESTS,
      {
        title: "Muitas Requisições",
        message: "Você fez muitas requisições. Aguarde um momento.",
      },
    ],

    // ========================================
    // 5xx Server Errors
    // ========================================
    [
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        title: "Erro no Servidor",
        message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
      },
    ],
    [
      HttpStatus.NOT_IMPLEMENTED,
      {
        title: "Não Implementado",
        message: "Esta funcionalidade ainda não está disponível.",
      },
    ],
    [
      HttpStatus.BAD_GATEWAY,
      {
        title: "Gateway Incorreto",
        message: "Erro de comunicação com o servidor. Tente novamente.",
      },
    ],
    [
      HttpStatus.SERVICE_UNAVAILABLE,
      {
        title: "Serviço Indisponível",
        message: "O serviço está temporariamente indisponível. Tente novamente em alguns minutos.",
      },
    ],
    [
      HttpStatus.GATEWAY_TIMEOUT,
      {
        title: "Tempo Esgotado",
        message: "O servidor demorou muito para responder. Tente novamente.",
      },
    ],
  ]);

  /**
   * Mensagem padrão para status desconhecidos
   */
  private static readonly DEFAULT_MESSAGE: IHttpStatusMessage = {
    title: "Erro Inesperado",
    message: "Ocorreu um erro inesperado. Tente novamente.",
  };

  /**
   * Constrói configuração de erro HTTP a partir de um status code
   */
  static buildErrorConfig(status: number, customMessage?: string): IHttpErrorConfig {
    const statusMessage = this.STATUS_MESSAGES.get(status) || this.DEFAULT_MESSAGE;
    const category = HttpStatusUtil.getCategory(status);

    return {
      status,
      title: statusMessage.title,
      message: customMessage || statusMessage.message,
      category,
      shouldShowAlert: true,
      shouldRedirect: statusMessage.shouldRedirect || false,
      redirectPath: statusMessage.redirectPath,
    };
  }

  /**
   * Constrói configuração de sucesso
   */
  static buildSuccessConfig(customMessage?: string): IHttpErrorConfig {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const statusMessage = this.STATUS_MESSAGES.get(HttpStatus.OK)!;

    return {
      status: HttpStatus.OK,
      title: statusMessage.title,
      message: customMessage || statusMessage.message,
      category: HttpStatusUtil.getCategory(HttpStatus.OK),
      shouldShowAlert: true,
      shouldRedirect: false,
    };
  }

  /**
   * Extrai mensagem de erro de diferentes formatos de resposta da API
   * Segue ordem de prioridade: messages (array) > message (string) > detail
   */
  static extractMessageFromResponse(errorData: unknown): string | null {
    if (!errorData) {
      return null;
    }

    // Se errorData é uma string, usar ela diretamente
    if (typeof errorData === "string" && errorData.trim()) {
      return errorData;
    }

    // Type guard para verificar se é um objeto
    if (typeof errorData !== "object") {
      return null;
    }

    const errorObj = errorData as Record<string, unknown>;

    // Prioridade 1: messages (array)
    if (Array.isArray(errorObj["messages"]) && errorObj["messages"].length > 0) {
      const messages = errorObj["messages"].filter((msg) => typeof msg === "string").join(", ");
      if (messages) {
        return messages;
      }
    }

    // Prioridade 2: message (string)
    if (typeof errorObj["message"] === "string" && errorObj["message"].trim()) {
      return errorObj["message"];
    }

    // Prioridade 3: detail (string)
    if (typeof errorObj["detail"] === "string" && errorObj["detail"].trim()) {
      return errorObj["detail"];
    }

    // Prioridade 4: error (string)
    if (typeof errorObj["error"] === "string" && errorObj["error"].trim()) {
      return errorObj["error"];
    }

    return null;
  }
}
