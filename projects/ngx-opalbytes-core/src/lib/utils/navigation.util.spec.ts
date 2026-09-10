import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { NavigationUtil, ICaoNavigationOptions } from "./navigation.util";

describe("NavigationUtil", () => {
  let service: NavigationUtil;
  let router: Router;

  const ROUTE = { path: "/home", title: "Home" };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(NavigationUtil);
    router = TestBed.inject(Router);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should navigate to the route path", async () => {
    const spy = vi.spyOn(router, "navigate").mockResolvedValue(true);
    const result = await service.navigateTo(ROUTE);
    expect(spy).toHaveBeenCalledWith(["/home"], {});
    expect(result).toBe(true);
  });

  it("should call onSuccess when navigation succeeds", async () => {
    vi.spyOn(router, "navigate").mockResolvedValue(true);
    const onSuccess = vi.fn();
    const options: ICaoNavigationOptions = { onSuccess };

    await service.navigateTo(ROUTE, options);
    expect(onSuccess).toHaveBeenCalled();
  });

  it("should call onError when navigation fails", async () => {
    vi.spyOn(router, "navigate").mockRejectedValue(new Error("boom"));
    const onError = vi.fn();

    const result = await service.navigateTo(ROUTE, { onError });
    expect(onError).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("should navigate with params replacement", async () => {
    const spy = vi.spyOn(router, "navigate").mockResolvedValue(true);
    const route = { path: "/catalogo/:slug", title: "Catálogo" };

    await service.navigateToWithParams(route, { slug: "abc-123" });
    expect(spy).toHaveBeenCalledWith(["/catalogo/abc-123"], {});
  });

  it("should navigate by url", async () => {
    const spy = vi.spyOn(router, "navigateByUrl").mockResolvedValue(true);
    const result = await service.navigateByUrl("/outra-rota");
    expect(spy).toHaveBeenCalledWith("/outra-rota", {});
    expect(result).toBe(true);
  });

  it("should navigate by UrlTree", async () => {
    const spy = vi.spyOn(router, "navigateByUrl").mockResolvedValue(true);
    const tree = router.createUrlTree(["/home"]);
    await service.navigateByUrl(tree);
    expect(spy).toHaveBeenCalledWith(tree, {});
  });

  it("should reload by going to / then back to current url", async () => {
    Object.defineProperty(router, "url", { get: () => "/atual" });
    vi.spyOn(router, "navigateByUrl").mockResolvedValue(true);

    await service.reload();
    expect(router.navigateByUrl).toHaveBeenCalledWith("/", { skipLocationChange: true });
    expect(router.navigateByUrl).toHaveBeenCalledWith("/atual", {});
  });

  it("should return current url", () => {
    Object.defineProperty(router, "url", { get: () => "/dashboard" });
    expect(service.getCurrentUrl()).toBe("/dashboard");
  });

  it("should check if on current route", () => {
    let currentUrl = "/home";
    Object.defineProperty(router, "url", { get: () => currentUrl, configurable: true });
    expect(service.isCurrentRoute(ROUTE)).toBe(true);

    currentUrl = "/outra";
    const other = { path: "/outra", title: "Outra" };
    expect(service.isCurrentRoute(other)).toBe(true);
    expect(service.isCurrentRoute(ROUTE)).toBe(false);
  });

  it("should navigate relative", async () => {
    const spy = vi.spyOn(router, "navigate").mockResolvedValue(true);
    const result = await service.navigateRelative(["detalhes"]);
    expect(spy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("should open in new tab", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    vi.spyOn(router, "serializeUrl").mockReturnValue("/serialized/home" as unknown as string);

    service.openInNewTab(ROUTE);
    expect(openSpy).toHaveBeenCalledWith("/serialized/home", "_blank");
  });
});