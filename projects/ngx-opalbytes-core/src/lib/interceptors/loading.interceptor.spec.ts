import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { HttpRequest, HttpResponse, HttpParams } from "@angular/common/http";
import { of, lastValueFrom } from "rxjs";

import { CaoLoadingInterceptor } from "./loading.interceptor";
import { LoadingService } from "../services/loading/loading.service";

describe("CaoLoadingInterceptor", () => {
  let interceptor: CaoLoadingInterceptor;
  const loadingMock = {
    start: vi.fn(),
    stop: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [{ provide: LoadingService, useValue: loadingMock }],
    });

    interceptor = TestBed.inject(CaoLoadingInterceptor);
  });

  it("should be created", () => {
    expect(interceptor).toBeTruthy();
  });

  it("should start loading and stop after response", async () => {
    const req = new HttpRequest("GET", "/api/test");
    const next = {
      handle: (r: HttpRequest<unknown>) => {
        expect(r).toBe(req);
        return of(new HttpResponse({ body: {} }));
      },
    };

    await lastValueFrom(interceptor.intercept(req, next as never));
    expect(loadingMock.start).toHaveBeenCalled();
    expect(loadingMock.stop).toHaveBeenCalled();
  });

  it("should skip requests with noLoading param", async () => {
    const req = new HttpRequest("GET", "/api/test", { params: new HttpParams({ fromObject: { noLoading: "true" } }) });
    const next = {
      handle: vi.fn(() => of(new HttpResponse({ body: {} }))),
    };

    await lastValueFrom(interceptor.intercept(req, next as never));
    expect(loadingMock.start).not.toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalled();
  });

  it("should skip health check requests", async () => {
    const req = new HttpRequest("GET", "/health");
    const next = {
      handle: vi.fn(() => of(new HttpResponse({ body: {} }))),
    };

    await lastValueFrom(interceptor.intercept(req, next as never));
    expect(loadingMock.start).not.toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalled();
  });
});