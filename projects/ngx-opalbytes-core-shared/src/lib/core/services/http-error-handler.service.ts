import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, from, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { AlertService } from "./alert.service";
import { HttpErrorModel } from "../models/http-error.model";
import { AlertMessageBuilder } from "../utils/alert-message.builder";

/**
 * Serviço responsável por processar erros HTTP
 * Segue princípio Single Responsibility - apenas processa erros HTTP
 * Segue princípio Dependency Inversion - depende de abstrações (AlertService, Router)
 */
@Injectable({
  providedIn: "root",
})
export class HttpErrorHandlerService {
  constructor(
    private alertService: AlertService,
    private router: Router
  ) {}

  /**
   * Processa um erro HTTP e lança o erro novamente
   */
  handleError(error: HttpErrorResponse, skipAlert = false): Observable<never> {
    // Converter Blob para JSON se necessário
    const errorData$ = this.convertBlobToJson(error);

    return errorData$.pipe(
      switchMap((errorData) => {
        const httpError = this.buildHttpError(error.status, errorData);

        // Mostrar alerta se não estiver desabilitado
        if (!skipAlert && httpError.shouldShowAlert) {
          this.showErrorAlert(httpError);
        }

        // Redirecionar se necessário
        if (httpError.shouldRedirect && httpError.redirectPath) {
          this.router.navigate([httpError.redirectPath]);
        }

        return throwError(() => httpError);
      })
    );
  }

  /**
   * Converte Blob error para JSON (se necessário)
   */
  private convertBlobToJson(error: HttpErrorResponse): Observable<unknown> {
    if (error.error instanceof Blob && error.error.type === "application/json") {
      return from(error.error.text()).pipe(
        map((text: string) => {
          try {
            return JSON.parse(text);
          } catch {
            return error.error;
          }
        })
      );
    }

    return from([error.error]);
  }

  /**
   * Constrói HttpErrorModel a partir de status e errorData
   */
  private buildHttpError(status: number, errorData: unknown): HttpErrorModel {
    const customMessage = AlertMessageBuilder.extractMessageFromResponse(errorData);
    const config = AlertMessageBuilder.buildErrorConfig(status, customMessage || undefined);

    return HttpErrorModel.fromConfig(config, errorData);
  }

  /**
   * Exibe alerta de erro
   */
  showErrorAlert(httpError: HttpErrorModel): void {
    this.alertService.show({
      type: "error",
      title: httpError.title,
      message: httpError.message,
    });
  }

  /**
   * Exibe alerta de sucesso
   */
  showSuccessAlert(message?: string): void {
    const config = AlertMessageBuilder.buildSuccessConfig(message);

    this.alertService.show({
      type: "success",
      title: config.title,
      message: config.message,
    });
  }

  /**
   * Exibe alerta de info
   */
  showInfoAlert(title: string, message: string): void {
    this.alertService.show({
      type: "info",
      title,
      message,
    });
  }

  /**
   * Exibe alerta de warning
   */
  showWarningAlert(title: string, message: string): void {
    this.alertService.show({
      type: "warning",
      title,
      message,
    });
  }
}
