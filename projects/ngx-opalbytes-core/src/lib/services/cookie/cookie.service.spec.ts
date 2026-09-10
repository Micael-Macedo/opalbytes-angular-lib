import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { DOCUMENT } from "@angular/common";
import { CookieService, ICaoCookieOptions } from "./cookie.service";


describe("CookieService", () => {
  let service: CookieService;
  let documentMock: Document;

  beforeEach(() => {
    documentMock = {
      cookie: "",
    } as unknown as Document;

    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: documentMock },
        { provide: "PLATFORM_ID", useValue: "browser" },
      ],
    });

    service = TestBed.inject(CookieService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set a cookie", () => {
    service.set("name", "Opalbytes");
    expect(documentMock.cookie).toContain("name=Opalbytes");
  });

  it("should encode special characters", () => {
    service.set("k", "valor com espaço");
    expect(documentMock.cookie).toContain("valor%20com%20espa%C3%A7o");
  });

  it("should get a cookie value", () => {
    documentMock.cookie = "foo=bar; baz=qux";
    expect(service.get("foo")).toBe("bar");
  });

  it("should return null for a missing cookie", () => {
    documentMock.cookie = "foo=bar";
    expect(service.get("missing")).toBeNull();
  });

  it("should remove a cookie by expiring it", () => {
    const setSpy = vi.spyOn(service, "set");
    service.remove("foo", { path: "/" });
    expect(setSpy).toHaveBeenCalledWith(
      "foo",
      "",
      expect.objectContaining({ path: "/", expires: expect.any(Date) })
    );
  });

  it("should report whether a cookie exists", () => {
    documentMock.cookie = "foo=bar";
    expect(service.has("foo")).toBe(true);
    expect(service.has("nope")).toBe(false);
  });

  it("should return all cookies", () => {
    documentMock.cookie = "a=1; b=2; c=3";
    expect(service.getAll()).toEqual({ a: "1", b: "2", c: "3" });
  });

  it("should clear all cookies", () => {
    documentMock.cookie = "a=1; b=2";
    const removeSpy = vi.spyOn(service, "remove");
    service.clear();
    expect(removeSpy).toHaveBeenCalled();
  });

  it("should apply expires as days (number)", () => {
    service.set("session", "active", { expires: 1 });
    expect(documentMock.cookie).toContain("session=active");
    expect(documentMock.cookie).toContain("expires=");
  });

  it("should apply path, domain, secure and sameSite options", () => {
    const options: ICaoCookieOptions = {
      path: "/app",
      domain: "example.com",
      secure: true,
      sameSite: "Lax",
    };
    service.set("opt", "value", options);

    const cookie = documentMock.cookie;
    expect(cookie).toContain("path=/app");
    expect(cookie).toContain("domain=example.com");
    expect(cookie).toContain("secure");
    expect(cookie).toContain("samesite=Lax");
  });

  it("should throw when the cookie exceeds 4KB", () => {
    const bigValue = "x".repeat(5000);
    expect(() => service.set("big", bigValue)).toThrow(/muito grande/);
  });
});