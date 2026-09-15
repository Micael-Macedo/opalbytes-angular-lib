import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";

import { ToastService } from "./toast.service";
import { CaoBaseToast } from "./base-toast";

describe("ToastService", () => {
  let service: ToastService;
  let overlayRefMock: { attach: ReturnType<typeof vi.fn>; dispose: ReturnType<typeof vi.fn>; detachments: ReturnType<typeof vi.fn> };
  let overlayMock: {
    create: ReturnType<typeof vi.fn>;
    position: ReturnType<typeof vi.fn>;
    scrollStrategies: { reposition: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    const positionMock = { global: vi.fn(() => globalPositionMock) };
    const globalPositionMock = {
      top: vi.fn(() => globalPositionMock),
      end: vi.fn(() => globalPositionMock),
    };

    overlayRefMock = {
      attach: vi.fn(() => ({ instance: {} })),
      dispose: vi.fn(),
      detachments: vi.fn(() => ({ subscribe: vi.fn() })),
    };

    overlayMock = {
      create: vi.fn(() => overlayRefMock),
      position: vi.fn(() => positionMock),
      scrollStrategies: { reposition: vi.fn() },
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Overlay, useValue: overlayMock }],
    });

    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should open a toast with the generated component portal", () => {
    service.success("Mensagem de sucesso");

    expect(overlayMock.create).toHaveBeenCalled();

    const config = (overlayMock.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(config.hasBackdrop).toBe(false);
    expect(config.panelClass).toContain("cao-toast-panel");

    const portal = (overlayRefMock.attach as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(portal).toBeInstanceOf(ComponentPortal);
    expect(portal.component).toBe(CaoBaseToast);
  });

  it("should set data and closeToast on the toast instance", () => {
    service.success("Mensagem de sucesso", { duration: 2500 });

    const instance = (overlayRefMock.attach as ReturnType<typeof vi.fn>).mock.results[0].value.instance;
    expect(instance.data.type).toBe("success");
    expect(instance.data.message).toBe("Mensagem de sucesso");
    expect(instance.data.duration).toBe(2500);

    instance.closeToast();
    expect(overlayRefMock.dispose).toHaveBeenCalled();
  });

  it("should use the default duration when not provided", () => {
    service.error("Mensagem de erro");

    const instance = (overlayRefMock.attach as ReturnType<typeof vi.fn>).mock.results[0].value.instance;
    expect(instance.data.duration).toBe(4000);
  });

  it("should dispose the overlay after the configured duration", () => {
    vi.useFakeTimers();

    service.info("Mensagem de info", { duration: 3000 });

    expect(overlayRefMock.dispose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(overlayRefMock.dispose).toHaveBeenCalled();
  });

  it("should call custom with the given config", () => {
    service.custom({ type: "warning", message: "Mensagem de warning", duration: 1500 });

    const instance = (overlayRefMock.attach as ReturnType<typeof vi.fn>).mock.results[0].value.instance;
    expect(instance.data.type).toBe("warning");
    expect(instance.data.message).toBe("Mensagem de warning");
    expect(instance.data.duration).toBe(1500);
  });

  it("should dismiss all open overlays on dismissAll", () => {
    service.success("Um");
    service.error("Dois");

    const anotherOverlayRefMock = {
      attach: vi.fn(() => ({ instance: {} })),
      dispose: vi.fn(),
      detachments: vi.fn(() => ({ subscribe: vi.fn() })),
    };
    (overlayMock.create as ReturnType<typeof vi.fn>).mockReturnValue(anotherOverlayRefMock);

    service.dismissAll();

    expect(overlayMock.create).toHaveBeenCalledTimes(2);
  });
});