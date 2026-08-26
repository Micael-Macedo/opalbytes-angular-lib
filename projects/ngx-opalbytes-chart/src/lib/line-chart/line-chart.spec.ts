import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoLineChartComponent } from "./line-chart";

class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

describe("CaoLineChartComponent", () => {
  let component: CaoLineChartComponent;
  let fixture: ComponentFixture<CaoLineChartComponent>;

  beforeEach(async () => {
    if (typeof (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver === "undefined") {
      (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverMock;
    }

    await TestBed.configureTestingModule({
      imports: [CaoLineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoLineChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
