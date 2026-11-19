import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";

import { CaoBaseModalComponent } from "./base-modal";

function backdropEvent(targetIsCurrent = true): MouseEvent {
  const target = {};
  return {
    target: targetIsCurrent ? target : {},
    currentTarget: target,
  } as unknown as MouseEvent;
}

describe("CaoBaseModalComponent", () => {
  let component: CaoBaseModalComponent;
  let fixture: ComponentFixture<CaoBaseModalComponent>;

  function getBackdrop(): HTMLElement {
    return fixture.nativeElement.querySelector(".cao-modal-backdrop") as HTMLElement;
  }

  function getPanel(): HTMLElement {
    return fixture.nativeElement.querySelector(".cao-modal-panel") as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoBaseModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoBaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("renders backdrop and panel", () => {
    expect(getBackdrop()).toBeTruthy();
    expect(getPanel()).toBeTruthy();
  });

  it("emits opened when emitOpened is called", () => {
    let opened = 0;
    component.opened.subscribe(() => opened++);
    component.emitOpened();
    expect(opened).toBe(1);
  });

  it("emits close request after animation delay on requestClose", () => {
    vi.useFakeTimers();
    const results: unknown[] = [];
    component.closeRequest.subscribe((r) => results.push(r));

    component.requestClose("ok");
    expect(results.length).toBe(0);
    vi.advanceTimersByTime(250);
    expect(results).toEqual(["ok"]);
  });

  it("emits close request only once", () => {
    vi.useFakeTimers();
    let count = 0;
    component.closeRequest.subscribe(() => count++);
    component.requestClose();
    component.requestClose();
    vi.advanceTimersByTime(250);
    expect(count).toBe(1);
  });

  it("emits closed when emitClosed is called", () => {
    const results: unknown[] = [];
    component.closed.subscribe((r) => results.push(r));
    component.emitClosed("done");
    expect(results).toEqual(["done"]);
  });

  it("closes on backdrop click when enabled", () => {
    vi.useFakeTimers();
    let count = 0;
    component.closeRequest.subscribe(() => count++);
    fixture.componentRef.setInput("closeOnOverlayClick", true);
    fixture.detectChanges();
    const ev = backdropEvent(true);
    component.onBackdropMouseDown(ev);
    component.onBackdropMouseUp(ev);
    vi.advanceTimersByTime(250);
    expect(count).toBe(1);
  });

  it("does not close on backdrop click when disabled", () => {
    vi.useFakeTimers();
    let count = 0;
    component.closeRequest.subscribe(() => count++);
    fixture.componentRef.setInput("closeOnOverlayClick", false);
    const ev = backdropEvent(true);
    component.onBackdropMouseDown(ev);
    component.onBackdropMouseUp(ev);
    vi.advanceTimersByTime(250);
    expect(count).toBe(0);
  });

  it("closes on escape when top", () => {
    vi.useFakeTimers();
    let count = 0;
    component.closeRequest.subscribe(() => count++);
    component.isTop = true;
    component.onEscapeKey();
    vi.advanceTimersByTime(250);
    expect(count).toBe(1);
  });

  it("does not close on escape when not top", () => {
    vi.useFakeTimers();
    let count = 0;
    component.closeRequest.subscribe(() => count++);
    component.isTop = false;
    component.onEscapeKey();
    vi.advanceTimersByTime(250);
    expect(count).toBe(0);
  });
});
