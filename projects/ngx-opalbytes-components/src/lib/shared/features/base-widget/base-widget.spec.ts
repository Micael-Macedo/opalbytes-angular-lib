import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";

import { CaoBaseWidgetComponent } from "./base-widget";

function backdropEvent(): MouseEvent {
  const target = {};
  return { target, currentTarget: target } as unknown as MouseEvent;
}

function dragEvent(start: MouseEvent): MouseEvent {
  return { target: {}, currentTarget: start.currentTarget } as unknown as MouseEvent;
}

describe("CaoBaseWidgetComponent", () => {
  let component: CaoBaseWidgetComponent;
  let fixture: ComponentFixture<CaoBaseWidgetComponent>;

  function getBackdrop(): HTMLElement {
    return fixture.nativeElement.querySelector(".widget-backdrop") as HTMLElement;
  }

  function getPanel(): HTMLElement {
    return fixture.nativeElement.querySelector(".widget-panel") as HTMLElement;
  }

  function dispatchAnimationEnd(): void {
    getBackdrop().dispatchEvent(new Event("animationend", { bubbles: true }));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoBaseWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoBaseWidgetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders the backdrop and panel with semantic classes", () => {
    expect(getBackdrop()).toBeTruthy();
    expect(getPanel()).toBeTruthy();
  });

  it("emits close after the close animation when closeWidget is called", () => {
    vi.useFakeTimers();
    let closed = 0;
    component.closeRequest.subscribe(() => closed++);

    component.closeWidget();

    expect(closed).toBe(0);
    vi.advanceTimersByTime(250);
    expect(closed).toBe(1);
  });

  it("ignores repeated closeWidget calls", () => {
    vi.useFakeTimers();
    let closed = 0;
    component.closeRequest.subscribe(() => closed++);

    component.closeWidget();
    component.closeWidget();

    vi.advanceTimersByTime(250);
    expect(closed).toBe(1);
  });

  it("emits save when saveWidget is called", () => {
    let saved = 0;
    component.save.subscribe(() => saved++);

    component.saveWidget();

    expect(saved).toBe(1);
  });

  it("closes on backdrop click when closeOnClickOutside is enabled", () => {
    vi.useFakeTimers();
    let closed = 0;
    component.closeRequest.subscribe(() => closed++);
    const event = backdropEvent();

    component.onBackdropMouseDown(event);
    component.onBackdropMouseUp(event);

    vi.advanceTimersByTime(250);
    expect(closed).toBe(1);
  });

  it("does not close on backdrop click when closeOnClickOutside is disabled", () => {
    let closed = 0;
    component.closeRequest.subscribe(() => closed++);
    fixture.componentRef.setInput("closeOnClickOutside", false);
    const event = backdropEvent();

    component.onBackdropMouseDown(event);
    component.onBackdropMouseUp(event);

    expect(closed).toBe(0);
  });

  it("does not close when the click starts on the backdrop and ends on the panel", () => {
    let closed = 0;
    component.closeRequest.subscribe(() => closed++);
    const start = backdropEvent();

    component.onBackdropMouseDown(start);
    component.onBackdropMouseUp(dragEvent(start));

    expect(closed).toBe(0);
  });

  it("emits close as soon as the exit animation ends", () => {
    vi.useFakeTimers();
    let closed = 0;
    component.closeRequest.subscribe(() => closed++);

    component.closeWidget();
    dispatchAnimationEnd();

    expect(closed).toBe(1);
    vi.advanceTimersByTime(250);
    expect(closed).toBe(1);
  });

  it("ignores the entrance animation", () => {
    let closed = 0;
    component.closeRequest.subscribe(() => closed++);

    dispatchAnimationEnd();

    expect(closed).toBe(0);
  });

  it("stops intercepting pointer events while closing", () => {
    component.closeWidget();
    fixture.detectChanges();

    expect(getBackdrop().classList.contains("widget-backdrop--closing")).toBe(true);
    expect(getPanel().classList.contains("widget-panel--closing")).toBe(true);
  });

  it("closes on escape key", () => {
    vi.useFakeTimers();
    let closed = 0;
    component.closeRequest.subscribe(() => closed++);

    component.onEscapeKey();
    vi.advanceTimersByTime(250);

    expect(closed).toBe(1);
  });
});
