import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoVerticalBarChartComponent } from "./vertical-bar-chart";

describe("CaoVerticalBarChartComponent", () => {
  let component: CaoVerticalBarChartComponent;
  let fixture: ComponentFixture<CaoVerticalBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoVerticalBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoVerticalBarChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
