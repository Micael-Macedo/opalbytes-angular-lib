import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, Subject, from, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { IAlertEvent } from "../interfaces/alert-config.interface";
import { HttpErrorModel } from "../models/http-error.model";
import { AlertMessageBuilder } from "../utils/alert-message.builder";

/**
 * Serviço responsável por processar erros HTTP e emitir eventos de alerta.
 * Segue princípio Single Responsibility - apenas processa erros HTTP
 * Segue princípio Dependency Inversion - não depende de serviços de UI
 * Segue princípio Observer - emite eventos para consumidores
 */
@Injectable({
  providedIn: "root",
})
export class HttpErrorHandlerService {
  private alertSubject = new Subject<IAlertEvent>();

  constructor(
    private router: Router
  ) { }

  /**
   * Observable de eventos de alerta.
   * Consumidores devem se inscrever para reagir aos erros.
   */
  getAlerts(): Observable<IAlertEvent> {
    return this.alertSubject.asObservable();
  }

  /**
   * Processa um erro HTTP e lança o erro novamente
   */
  handleError(error: HttpErrorResponse, skipAlert = false): Observable<never> {
    const errorData$ = this.convertBlobToJson(error);

    return errorData$.pipe(
      switchMap((errorData) => {
        const httpError = this.buildHttpError(error.status, errorData);

        if (!skipAlert && httpError.shouldShowAlert) {
          this.showErrorAlert(httpError);
        }

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
   * Emite evento de alerta de erro
   */
  showErrorAlert(httpError: HttpErrorModel): void {
    this.alertSubject.next({
      type: "error",
      title: httpError.title,
      message: httpError.message,
    });
  }

  /**
   * Emite evento de alerta de sucesso
   */
  showSuccessAlert(message?: string): void {
    const config = AlertMessageBuilder.buildSuccessConfig(message);

    this.alertSubject.next({
      type: "success",
      title: config.title,
      message: config.message,
    });
  }

  /**
   * Emite evento de alerta de info
   */
  showInfoAlert(title: string, message: string): void {
    this.alertSubject.next({
      type: "info",
      title,
      message,
    });
  }

  /**
   * Emite evento de alerta de warning
   */
  showWarningAlert(title: string, message: string): void {
    this.alertSubject.next({
      type: "warning",
      title,
      message,
    });
  }
}
