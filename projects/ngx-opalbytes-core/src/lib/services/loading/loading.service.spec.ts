import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { LoadingService } from "./loading.service";
import { LoadingType } from "../../utils/loading-type";

describe("LoadingService", () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should emit STOPPED by default", () => {
    const values: LoadingType[] = [];
    service.getLoading().subscribe((v) => values.push(v));

    expect(values[0]).toBe(LoadingType.STOPPED);
  });

  it("should emit LOADING when start is called", () => {
    const values: LoadingType[] = [];
    service.getLoading().subscribe((v) => values.push(v));

    service.start();

    expect(values).toContain(LoadingType.LOADING);
    expect(values[values.length - 1]).toBe(LoadingType.LOADING);
  });

  it("should emit STOPPED when stop is called after start", () => {
    const values: LoadingType[] = [];
    service.getLoading().subscribe((v) => values.push(v));

    service.start();
    service.stop();

    expect(values[values.length - 1]).toBe(LoadingType.STOPPED);
  });
});