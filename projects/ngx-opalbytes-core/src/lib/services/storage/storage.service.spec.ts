import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";

import { StorageService } from "./storage.service";
import { CookieService } from "../cookie/cookie.service";

describe("StorageService", () => {
  let service: StorageService;

  const cookieStore = new Map<string, string>();

  const cookieMock = {
    set: vi.fn((name: string, value: string) => {
      cookieStore.set(name, value);
    }),
    get: vi.fn((name: string) => cookieStore.get(name) ?? null),
    remove: vi.fn((name: string) => {
      cookieStore.delete(name);
    }),
    getAll: vi.fn(() => Object.fromEntries(cookieStore)),
  };

  beforeEach(() => {
    cookieStore.clear();
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: CookieService, useValue: cookieMock },
        { provide: "PLATFORM_ID", useValue: "browser" },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should store and retrieve an item", () => {
    service.setItem("usuario", { id: 1, nome: "João" });
    const value = service.getItem<{ id: number; nome: string }>("usuario");

    expect(value).toEqual({ id: 1, nome: "João" });
  });

  it("should normalize keys to uppercase", () => {
    service.setItem("tokenAuth", "abc123");
    expect(service.getItem("tokenauth")).toBe("abc123");
  });

  it("should return null for missing items", () => {
    expect(service.getItem("missing")).toBeNull();
  });

  it("should store encrypted values when encrypt option is used", () => {
    service.setItem("secret", { token: "xyz" }, { encrypt: true });
    const value = service.getItem<{ token: string }>("secret", { encrypt: true });
    expect(value).toEqual({ token: "xyz" });
  });

  it("should expire items after expiresIn", async () => {
    vi.useFakeTimers();
    service.setItem("temp", "value", { expiresIn: 1000 });

    vi.advanceTimersByTime(2000);
    expect(service.getItem("temp")).toBeNull();

    vi.useRealTimers();
  });

  it("should remove an item", () => {
    service.setItem("temp", "value");
    service.removeItem("temp");
    expect(service.getItem("temp")).toBeNull();
    expect(service.hasItem("temp")).toBe(false);
  });

  it("should clear all app items", () => {
    service.setItem("a", "1");
    service.setItem("b", "2");

    service.clear();

    expect(service.getItem("a")).toBeNull();
    expect(service.getItem("b")).toBeNull();
  });

  it("should report hasItem", () => {
    service.setItem("exists", "value");
    expect(service.hasItem("exists")).toBe(true);
    expect(service.hasItem("nope")).toBe(false);
  });

  it("should observe changes", async () => {
    const observable = service.observe<string>("obs");
    const values: Array<string | null> = [];

    const subscription = observable.subscribe((v) => values.push(v));
    service.setItem("obs", "novo valor");

    await new Promise((resolve) => setTimeout(resolve, 0));
    subscription.unsubscribe();

    expect(values[values.length - 1]).toBe("novo valor");
  });

  it("should return keys of stored items", () => {
    service.setItem("chaveum", "1");
    service.setItem("chavedois", "2");

    const keys = service.getKeys();
    expect(keys).toContain("CHAVEUM");
    expect(keys).toContain("CHAVEDOIS");
  });
});