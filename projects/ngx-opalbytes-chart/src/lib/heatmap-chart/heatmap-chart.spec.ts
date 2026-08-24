import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoHeatmapComponent } from "./heatmap-chart";

describe("CaoHeatmapComponent", () => {
  let component: CaoHeatmapComponent;
  let fixture: ComponentFixture<CaoHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoHeatmapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoHeatmapComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
