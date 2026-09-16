import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";

import { Observable, Subject } from "rxjs";

import { IAlertEvent } from "../interfaces/alert-config.interface";
import { HttpErrorModel } from "../models/http-error.model";
import { AlertMessageBuilder } from "../utils/alert-message.builder";

/**
 * Handler global de erros não tratados
 *
 * Previne que erros não tratados quebrem a aplicação
 * e deixem a tela em branco
 *
 * Funciona como última linha de defesa:
 * 1. ApiInterceptor captura erros HTTP
 * 2. Se componente não tratar, GlobalErrorHandler captura
 * 3. Emite evento de alerta e loga erro no console
 * 4. Aplicação continua funcionando
 *
 * Consumidores devem se inscrever em getAlerts() para reagir aos erros.
 * Não depende de nenhum serviço de UI (Dependency Inversion Principle).
 */
@Injectable({ providedIn: "platform" })
export class GlobalErrorHandler implements ErrorHandler {
  private readonly alertSubject = new Subject<IAlertEvent>();

  /**
   * Observable de eventos de alerta de erro.
   * Consumidores devem se inscrever para exibir mensagens ao usuário.
   */
  getAlerts(): Observable<IAlertEvent> {
    return this.alertSubject.asObservable();
  }

  handleError(error: Error | HttpErrorResponse | HttpErrorModel | unknown): void {
    // Processar erro HTTP (HttpErrorResponse estende Error, verificar antes)
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
      return;
    }

    // Processar HttpErrorModel (já estruturado, respeita shouldShowAlert)
    if (this.isHttpErrorModel(error)) {
      this.handleHttpErrorModel(error);
      return;
    }

    // Processar erro de runtime
    if (error instanceof Error) {
      this.handleRuntimeError(error);
      return;
    }

    // Erro desconhecido
    this.handleUnknownError(error);
  }

  /**
   * Processa erro HTTP não tratado
   */
  private handleHttpError(error: HttpErrorResponse): void {
    const customMessage = AlertMessageBuilder.extractMessageFromResponse(error.error);
    const config = AlertMessageBuilder.buildErrorConfig(error.status, customMessage || undefined);

    this.showAlert({
      type: "error",
      title: config.title,
      message: config.message,
    });

    console.error(`[GlobalErrorHandler] HTTP ${error.status}`, error);
  }

  /**
   * Processa erro de runtime (JavaScript)
   */
  private handleRuntimeError(error: Error): void {
    // Em produção, não mostrar detalhes técnicos
    const isProduction = this.isProduction();

    this.showAlert({
      type: "error",
      title: "Erro Inesperado",
      message: isProduction
        ? "Ocorreu um erro inesperado. Tente recarregar a página."
        : `Erro: ${error.message}`,
    });

    console.error("[GlobalErrorHandler] Runtime error", error);
  }

  /**
   * Processa HttpErrorModel (já estruturado pelo interceptor)
   * Respeita a flag shouldShowAlert definida no próprio model.
   */
  private handleHttpErrorModel(error: HttpErrorModel): void {
    if (!error.shouldShowAlert) {
      console.warn("[GlobalErrorHandler] HttpErrorModel suprimido (shouldShowAlert=false)", error);
      return;
    }

    this.showAlert({
      type: "error",
      title: error.title,
      message: error.message,
    });

    console.error(`[GlobalErrorHandler] HTTP ${error.status}`, error.originalError ?? error);
  }

  /**
   * Processa erro desconhecido
   */
  private handleUnknownError(error: unknown): void {
    this.showAlert({
      type: "error",
      title: "Erro Inesperado",
      message: "Ocorreu um erro inesperado. Tente recarregar a página.",
    });

    console.error("[GlobalErrorHandler] Erro desconhecido", error);
  }

  /**
   * Emite evento de alerta para os subscribers
   */
  private showAlert(config: IAlertEvent): void {
    this.alertSubject.next(config);
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
