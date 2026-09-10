import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AlertService } from "./alert.service";
import { ToastService } from "../toast.service";
import { ICaoAlertConfig } from "../../interfaces";

describe("AlertService", () => {
  let service: AlertService;
  const toastMock = {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [{ provide: ToastService, useValue: toastMock }],
    });

    service = TestBed.inject(AlertService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call toast.success for success type", () => {
    const config: ICaoAlertConfig = { type: "success", title: "Ok", message: "Tudo certo" };
    service.show(config);
    expect(toastMock.success).toHaveBeenCalledWith("Ok: Tudo certo");
  });

  it("should call toast.error for error type", () => {
    const config: ICaoAlertConfig = { type: "error", title: "Ops", message: "Falhou" };
    service.show(config);
    expect(toastMock.error).toHaveBeenCalledWith("Ops: Falhou");
  });

  it("should call toast.info for info type", () => {
    const config: ICaoAlertConfig = { type: "info", title: "Info", message: "Atenção" };
    service.show(config);
    expect(toastMock.info).toHaveBeenCalledWith("Info: Atenção");
  });

  it("should call toast.warning for warning type", () => {
    const config: ICaoAlertConfig = { type: "warning", title: "Cuidado", message: "Verifique" };
    service.show(config);
    expect(toastMock.warning).toHaveBeenCalledWith("Cuidado: Verifique");
  });

  it("should use message only when title is absent", () => {
    const config: ICaoAlertConfig = { type: "info", message: "Sem título", title: "" };
    service.show(config);
    expect(toastMock.info).toHaveBeenCalledWith("Sem título");
  });

  it("should default to info for unknown type", () => {
    const config = { type: "unknown", title: "X", message: "Y" } as unknown as ICaoAlertConfig;
    service.show(config);
    expect(toastMock.info).toHaveBeenCalledWith("X: Y");
  });
});