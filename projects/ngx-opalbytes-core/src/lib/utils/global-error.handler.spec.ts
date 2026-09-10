import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { HttpErrorResponse } from "@angular/common/http";

import { GlobalErrorHandler } from "./global-error.handler";
import { AlertService } from "../services/alert/alert.service";
import { HttpErrorModel } from "../models/http-error.model";
import { HttpStatusCategory } from "../enums/http-status.enum";

describe("GlobalErrorHandler", () => {
  let handler: GlobalErrorHandler;
  let alertMock: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    alertMock = { show: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: AlertService, useValue: alertMock },
      ],
    });

    handler = TestBed.inject(GlobalErrorHandler);
  });

  it("should be created", () => {
    expect(handler).toBeTruthy();
  });

  it("should show alert for HttpErrorResponse", () => {
    const error = new HttpErrorResponse({ status: 404, statusText: "Not Found", error: { message: "x" } });
    handler.handleError(error);
    expect(alertMock.show).toHaveBeenCalled();
  });

  it("should show alert for runtime Error", () => {
    handler.handleError(new Error("runtime failure"));
    expect(alertMock.show).toHaveBeenCalled();
  });

  it("should show alert for HttpErrorModel with status >= 500", () => {
    const model = new HttpErrorModel(500, "Erro", "Falha interna", HttpStatusCategory.SERVER_ERROR);
    handler.handleError(model as unknown as Error);
    expect(alertMock.show).toHaveBeenCalled();
  });

  it("should not show alert again for HttpErrorModel < 500", () => {
    const model = new HttpErrorModel(400, "Erro", "Bad request", HttpStatusCategory.CLIENT_ERROR);
    handler.handleError(model as unknown as Error);
    expect(alertMock.show).not.toHaveBeenCalled();
  });

  it("should show generic alert for unknown errors", () => {
    handler.handleError("random string" as unknown as Error);
    expect(alertMock.show).toHaveBeenCalled();
  });
});