import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoLineChartComponent } from "./line-chart";

describe("CaoLineChartComponent", () => {
  let component: CaoLineChartComponent;
  let fixture: ComponentFixture<CaoLineChartComponent>;

  beforeEach(async () => {
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
