import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { of, defer, firstValueFrom } from "rxjs";

import { HttpCacheService } from "./http-cache.service";

describe("HttpCacheService", () => {
  let service: HttpCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCacheService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch data on first call", async () => {
    const request = of({ id: 1 });
    const result = await firstValueFrom(service.get("key-1", request));
    expect(result).toEqual({ id: 1 });
  });

  it("should serve cached data on subsequent calls without executing request", async () => {
    let requestCount = 0;
    const request = defer(() => {
      requestCount++;
      return of({ id: requestCount });
    });

    const first = await firstValueFrom(service.get("key-2", request));
    const second = await firstValueFrom(service.get("key-2", request));

    expect(first).toEqual({ id: 1 });
    expect(second).toEqual({ id: 1 });
    expect(requestCount).toBe(1);
  });

  it("should invalidate a specific key", async () => {
    const request = of({ value: "A" });
    const first = await firstValueFrom(service.get("key-3", request));

    service.invalidate("key-3");

    const second = await firstValueFrom(service.get("key-3", of({ value: "B" })));
    expect(first).toEqual({ value: "A" });
    expect(second).toEqual({ value: "B" });
  });

  it("should clear all cache with invalidate()", async () => {
    await firstValueFrom(service.get("key-a", of({ value: 1 })));
    await firstValueFrom(service.get("key-b", of({ value: 2 })));

    service.invalidate();

    const resultA = await firstValueFrom(service.get("key-a", of({ value: 10 })));
    expect(resultA).toEqual({ value: 10 });
  });

  it("should use custom ttl when provided", async () => {
    const ttl = 1000;
    const first = await firstValueFrom(service.get("key-ttl", of({ value: "cached" }), ttl));
    expect(first).toEqual({ value: "cached" });
  });
});