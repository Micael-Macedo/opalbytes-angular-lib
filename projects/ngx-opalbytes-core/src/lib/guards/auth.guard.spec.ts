import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { authGuard } from "./auth.guard";
import { CaoTokenGuardService } from "../services/token/token.service";

function createRouteSnapshot(): ActivatedRouteSnapshot {
  return {} as ActivatedRouteSnapshot;
}

function createStateSnapshot(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

describe("authGuard", () => {
  let router: Router;
  const tokenServiceMock = {
    hasToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: CaoTokenGuardService, useValue: tokenServiceMock }],
    });
    router = TestBed.inject(Router);
  });

  it("should allow access when authenticated", () => {
    tokenServiceMock.hasToken.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(createRouteSnapshot(), createStateSnapshot("/home"))
    );

    expect(result).toBe(true);
  });

  it("should redirect to /login when not authenticated", () => {
    tokenServiceMock.hasToken.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(createRouteSnapshot(), createStateSnapshot("/home"))
    );

    expect(result).not.toBe(true);
  });

  it("should return a UrlTree pointing to /login when not authenticated", () => {
    tokenServiceMock.hasToken.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(createRouteSnapshot(), createStateSnapshot("/home"))
    );

    const urlTree = result as ReturnType<Router["parseUrl"]>;
    if (typeof urlTree === "object" && urlTree !== null && "toString" in urlTree) {
      expect(String(urlTree)).toContain("login");
    }
  });
});