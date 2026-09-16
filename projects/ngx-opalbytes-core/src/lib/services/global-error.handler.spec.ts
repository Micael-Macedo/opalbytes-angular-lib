import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { HttpErrorResponse } from "@angular/common/http";

import { HttpStatusCategory } from "../enums/http-status.enum";
import { IAlertEvent } from "../interfaces/alert-config.interface";
import { HttpErrorModel } from "../models/http-error.model";
import { GlobalErrorHandler } from "./global-error.handler";

describe("GlobalErrorHandler", () => {
  let handler: GlobalErrorHandler;
  let alerts: IAlertEvent[];

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});

    handler = new GlobalErrorHandler();
    alerts = [];
    handler.getAlerts().subscribe((alert) => alerts.push(alert));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be created", () => {
    expect(handler).toBeTruthy();
  });

  it("should emit error alert for HttpErrorResponse with custom message", () => {
    const error = new HttpErrorResponse({
      status: 404,
      statusText: "Not Found",
      error: { message: "Recurso não encontrado" },
    });

    handler.handleError(error);

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      type: "error",
      message: "Recurso não encontrado",
    });
  });

  it("should emit error alert for HttpErrorResponse with default message", () => {
    const error = new HttpErrorResponse({ status: 500, statusText: "Internal Server Error" });

    handler.handleError(error);

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      type: "error",
      title: "Erro no Servidor",
    });
  });

  it("should log HttpErrorResponse to console.error", () => {
    const error = new HttpErrorResponse({ status: 500, statusText: "Internal Server Error" });

    handler.handleError(error);

    expect(console.error).toHaveBeenCalled();
  });

  it("should emit alert for runtime Error", () => {
    handler.handleError(new Error("runtime failure"));

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      type: "error",
      title: "Erro Inesperado",
      message: "Erro: runtime failure",
    });
    expect(console.error).toHaveBeenCalled();
  });

  it("should emit alert for HttpErrorModel with shouldShowAlert=true", () => {
    const model = new HttpErrorModel(
      500,
      "Erro no Servidor",
      "Falha interna",
      HttpStatusCategory.SERVER_ERROR,
      true
    );

    handler.handleError(model);

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      type: "error",
      title: "Erro no Servidor",
      message: "Falha interna",
    });
  });

  it("should emit alert for HttpErrorModel with client error and shouldShowAlert=true", () => {
    const model = new HttpErrorModel(
      400,
      "Dados Inválidos",
      "Bad request",
      HttpStatusCategory.CLIENT_ERROR,
      true
    );

    handler.handleError(model);

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      type: "error",
      title: "Dados Inválidos",
    });
  });

  it("should not emit alert for HttpErrorModel with shouldShowAlert=false", () => {
    const model = new HttpErrorModel(
      500,
      "Erro no Servidor",
      "Falha interna",
      HttpStatusCategory.SERVER_ERROR,
      false
    );

    handler.handleError(model);

    expect(alerts).toHaveLength(0);
    expect(console.warn).toHaveBeenCalled();
  });

  it("should emit generic alert for unknown errors", () => {
    handler.handleError("random string");

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      type: "error",
      title: "Erro Inesperado",
      message: "Ocorreu um erro inesperado. Tente recarregar a página.",
    });
    expect(console.error).toHaveBeenCalled();
  });

  it("should prefer HttpErrorResponse handling over generic Error", () => {
    const response = new HttpErrorResponse({ status: 401, statusText: "Unauthorized", error: { message: "Sessão expirada" } });

    handler.handleError(response);

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      type: "error",
      title: "Não Autorizado",
    });
  });
});