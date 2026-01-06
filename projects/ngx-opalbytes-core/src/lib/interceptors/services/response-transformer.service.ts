import { HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HttpErrorHandlerService } from "./http-error-handler.service";
import { IApiResponse } from "../interfaces/api.interface";
import { AlertMessageBuilder } from "../utils/alert-message.builder";

/**
 * Tipo de severidade de alerta
 */
type AlertSeverity = "success" | "error" | "info" | "warning";

/**
 * Serviço responsável por transformar respostas HTTP
 * Segue princípio Single Responsibility - apenas transforma respostas
 * Segue princípio Open/Closed - extensível para novos formatos
 */
@Injectable({
  providedIn: "root",
})
export class ResponseTransformerService {
  constructor(private httpErrorHandler: HttpErrorHandlerService) {}

  /**
   * Processa evento HTTP e retorna transformado (se necessário)
   */
  processHttpEvent<T>(
    event: HttpEvent<T>,
    shouldTransform: boolean,
    skipAlert: boolean
  ): HttpEvent<T> | HttpEvent<IApiResponse> {
    if (!(event instanceof HttpResponse)) {
      return event;
    }

    const response = event.body as Record<string, unknown> | null;

    // Processar resposta com success: false
    if (response && response["success"] === false) {
      this.handleFailureResponse(response, skipAlert);
    }

    // Processar resposta com success: true
    if (response && response["success"] === true && !skipAlert) {
      this.handleSuccessResponse(response);
    }

    // Transformar resposta se solicitado
    if (shouldTransform && response) {
      return this.transformResponse(event, response);
    }

    return event;
  }

  /**
   * Processa resposta de falha (success: false)
   */
  private handleFailureResponse(response: Record<string, unknown>, skipAlert: boolean): void {
    if (skipAlert) {
      return;
    }

    const message = AlertMessageBuilder.extractMessageFromResponse(response);

    this.httpErrorHandler.showErrorAlert({
      title: "Erro",
      message: message || "Ocorreu um erro na operação.",
      status: 0,
      category: 4,
      shouldShowAlert: true,
      shouldRedirect: false,
      isClientError: () => false,
      isServerError: () => false,
    } as never);
  }

  /**
   * Processa resposta de sucesso (success: true)
   */
  private handleSuccessResponse(response: Record<string, unknown>): void {
    const message = AlertMessageBuilder.extractMessageFromResponse(response);

    // Apenas mostrar alerta se houver mensagem explícita
    if (message && message.trim()) {
      this.httpErrorHandler.showSuccessAlert(message);
    }
  }

  /**
   * Transforma resposta para formato IApiResponse
   */
  private transformResponse<T>(
    event: HttpResponse<T>,
    response: Record<string, unknown>
  ): HttpResponse<IApiResponse> {
    const isSuccess = response["success"] !== false;
    const message = this.buildResponseMessage(response, isSuccess);

    const transformed: IApiResponse = {
      data: (response["data"] as never[]) || [],
      totalCount: (response["totalCount"] as number) || 0,
      pageNumber: (response["pageNumber"] as number) || 1,
      pageSize: (response["pageSize"] as number) || 10,
      totalPages: (response["totalPages"] as number) || 0,
      success: isSuccess,
      messages: [message],
    };

    return event.clone({ body: transformed });
  }

  /**
   * Constrói mensagem da resposta
   */
  private buildResponseMessage(response: Record<string, unknown>, isSuccess: boolean): string {
    const extractedMessage = AlertMessageBuilder.extractMessageFromResponse(response);

    if (extractedMessage) {
      return extractedMessage;
    }

    return isSuccess ? "Operação realizada com sucesso." : "Operação falhou.";
  }

  /**
   * Determina severidade da resposta
   */
  private determineSeverity(response: Record<string, unknown>, isSuccess: boolean): AlertSeverity {
    const responseSeverity = response["severity"];

    if (
      typeof responseSeverity === "string" &&
      ["success", "error", "info", "warning"].includes(responseSeverity)
    ) {
      return responseSeverity as AlertSeverity;
    }

    return isSuccess ? "success" : "error";
  }
}
