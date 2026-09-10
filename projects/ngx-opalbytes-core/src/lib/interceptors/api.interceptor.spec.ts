import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { of, throwError, lastValueFrom } from "rxjs";

import { CaoApiInterceptor } from "./api.interceptor";
import { LoadingService, ResponseTransformerService, HttpErrorHandlerService } from "../services";

describe("CaoApiInterceptor", () => {
  let interceptor: CaoApiInterceptor;
  const loadingMock = {
    start: vi.fn(),
    stop: vi.fn(),
  };
  const errorHandlerMock = {
    handleError: vi.fn(),
  };
  const transformerMock = {
    processHttpEvent: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingMock },
        { provide: HttpErrorHandlerService, useValue: errorHandlerMock },
        { provide: ResponseTransformerService, useValue: transformerMock },
      ],
    });

    interceptor = TestBed.inject(CaoApiInterceptor);
  });

  it("should be created", () => {
    expect(interceptor).toBeTruthy();
  });

  it("should start loading when not skipped", async () => {
    const req = new HttpRequest("GET", "/api/test");
    const response = new HttpResponse({ body: {} });
    transformerMock.processHttpEvent.mockReturnValue(response);

    const next = {
      handle: vi.fn(() => of(response)),
    };

    await lastValueFrom(interceptor.intercept(req, next as never));
    expect(loadingMock.start).toHaveBeenCalled();
    expect(loadingMock.stop).toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it("should skip loading when X-Skip-Loading header present", async () => {
    const req = new HttpRequest("GET", "/api/test", {
      headers: new HttpHeaders({ "X-Skip-Loading": "true" }),
    });
    const response = new HttpResponse({ body: {} });
    transformerMock.processHttpEvent.mockReturnValue(response);

    const next = {
      handle: () => of(response),
    };

    await lastValueFrom(interceptor.intercept(req, next as never));
    expect(loadingMock.start).not.toHaveBeenCalled();
    expect(loadingMock.stop).not.toHaveBeenCalled();
  });

  it("should skip loading when skipLoading param present", async () => {
    const req = new HttpRequest("GET", "/api/test", { params: new HttpParams({ fromObject: { skipLoading: "true" } }) });
    const response = new HttpResponse({ body: {} });
    transformerMock.processHttpEvent.mockReturnValue(response);

    const next = {
      handle: () => of(response),
    };

    await lastValueFrom(interceptor.intercept(req, next as never));
    expect(loadingMock.start).not.toHaveBeenCalled();
  });

  it("should request transform when X-Transform-Response header present", async () => {
    const req = new HttpRequest("GET", "/api/test", {
      headers: new HttpHeaders({ "X-Transform-Response": "true" }),
    });
    const response = new HttpResponse({ body: { success: true } });
    transformerMock.processHttpEvent.mockReturnValue(response);

    const next = {
      handle: () => of(response),
    };

    await lastValueFrom(interceptor.intercept(req, next as never));
    expect(transformerMock.processHttpEvent).toHaveBeenCalledWith(response, true, false);
  });

  it("should skip alert when X-Skip-Alert header present", async () => {
    const req = new HttpRequest("GET", "/api/test", {
      headers: new HttpHeaders({ "X-Skip-Alert": "true" }),
    });
    const response = new HttpResponse({ body: { success: true } });
    transformerMock.processHttpEvent.mockReturnValue(response);

    const next = {
      handle: () => of(response),
    };

    await lastValueFrom(interceptor.intercept(req, next as never));
    expect(transformerMock.processHttpEvent).toHaveBeenCalledWith(response, false, true);
  });

  it("should delegate errors to HttpErrorHandlerService", async () => {
    const req = new HttpRequest("GET", "/api/test");
    const httpError = new HttpErrorResponse({ status: 500, error: {} });
    errorHandlerMock.handleError.mockReturnValue(throwError(() => httpError));

    const next = {
      handle: () => throwError(() => httpError),
    };

    await expect(lastValueFrom(interceptor.intercept(req, next as never))).rejects.toBeDefined();
    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(httpError, false);
  });
});