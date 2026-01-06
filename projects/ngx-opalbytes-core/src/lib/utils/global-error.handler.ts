import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, Injector } from "@angular/core";

import { AlertMessageBuilder } from "./alert-message.builder";
import { HttpErrorModel } from "../models/http-error.model";
import { AlertService } from "../services/alert.service";

/**
 * Handler global de erros não tratados
 *
 * Previne que erros não tratados quebrem a aplicação
 * e deixem a tela em branco
 *
 * Funciona como última linha de defesa:
 * 1. ApiInterceptor captura erros HTTP
 * 2. Se componente não tratar, GlobalErrorHandler captura
 * 3. Mostra alerta e loga erro
 * 4. Aplicação continua funcionando
 */
@Injectable({ providedIn: "platform" })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    // Obter AlertService via injector (evita dependência circular)
    const alertService = this.injector.get(AlertService);

    // Processar erro HTTP
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error, alertService);
      return;
    }

    // Processar erro de runtime
    if (error instanceof Error) {
      this.handleRuntimeError(error, alertService);
      return;
    }

    // Processar HttpErrorModel (já processado pelo interceptor)
    if (this.isHttpErrorModel(error)) {
      this.handleHttpErrorModel(error, alertService);
      return;
    }

    // Erro desconhecido
    this.handleUnknownError(error, alertService);
  }

  /**
   * Processa erro HTTP não tratado
   */
  private handleHttpError(error: HttpErrorResponse, alertService: AlertService): void {
    const customMessage = AlertMessageBuilder.extractMessageFromResponse(error.error);
    const config = AlertMessageBuilder.buildErrorConfig(error.status, customMessage || undefined);

    alertService.show({
      type: "error",
      title: config.title,
      message: config.message,
    });
  }

  /**
   * Processa erro de runtime (JavaScript)
   */
  private handleRuntimeError(error: Error, alertService: AlertService): void {
    // Em produção, não mostrar detalhes técnicos
    const isProduction = this.isProduction();

    alertService.show({
      type: "error",
      title: "Erro Inesperado",
      message: isProduction
        ? "Ocorreu um erro inesperado. Tente recarregar a página."
        : `Erro: ${error.message}`,
    });
  }

  /**
   * Processa HttpErrorModel (já processado pelo interceptor)
   */
  private handleHttpErrorModel(error: HttpErrorModel, alertService: AlertService): void {
    // Mostrar alerta novamente apenas se for crítico
    if (error.status >= 500) {
      alertService.show({
        type: "error",
        title: error.title,
        message: error.message,
      });
    }
  }

  /**
   * Processa erro desconhecido
   */
  private handleUnknownError(error: unknown, alertService: AlertService): void {
    alertService.show({
      type: "error",
      title: "Erro Inesperado",
      message: "Ocorreu um erro inesperado. Tente recarregar a página.",
    });
  }

  /**
   * Type guard para HttpErrorModel
   */
  private isHttpErrorModel(error: unknown): error is HttpErrorModel {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "title" in error &&
      "message" in error &&
      "category" in error
    );
  }

  /**
   * Verifica se está em produção
   */
  private isProduction(): boolean {
    // Você pode injetar ENVIRONMENT aqui se quiser
    return false; // Por padrão, mostrar detalhes em dev
  }
}
