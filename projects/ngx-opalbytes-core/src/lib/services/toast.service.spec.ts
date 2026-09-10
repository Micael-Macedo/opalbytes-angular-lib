import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

import { ToastService } from "./toast.service";

describe("ToastService", () => {
  let service: ToastService;
  let snackBarMock: { open: ReturnType<typeof vi.fn>; dismiss: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    snackBarMock = {
      open: vi.fn(),
      dismiss: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: snackBarMock }],
    });

    service = TestBed.inject(ToastService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call snackbar.open with Fechar action on success", () => {
    service.success("Mensagem de sucesso");
    expect(snackBarMock.open).toHaveBeenCalledWith("Mensagem de sucesso", "Fechar", expect.anything());
  });

  it("should call snackbar.open with error type", () => {
    service.error("Mensagem de erro");
    expect(snackBarMock.open).toHaveBeenCalledWith("Mensagem de erro", "Fechar", expect.anything());
  });

  it("should call snackbar.open with info type", () => {
    service.info("Mensagem de info");
    expect(snackBarMock.open).toHaveBeenCalledWith("Mensagem de info", "Fechar", expect.anything());
  });

  it("should call snackbar.open with warning type", () => {
    service.warning("Mensagem de warning");
    expect(snackBarMock.open).toHaveBeenCalledWith("Mensagem de warning", "Fechar", expect.anything());
  });

  it("should merge custom panelClass into the snackbar config", () => {
    service.success("Teste", { panelClass: ["custom-class"] });

    const [message, action, config] = snackBarMock.open.mock.calls[0] as [string, string, MatSnackBarConfig];
    expect(message).toBe("Teste");
    expect(config.panelClass).toContain("custom-class");
    expect(config.duration).toBe(4000);
  });

  it("should call dismiss on dismissAll", () => {
    service.dismissAll();
    expect(snackBarMock.dismiss).toHaveBeenCalled();
  });
});