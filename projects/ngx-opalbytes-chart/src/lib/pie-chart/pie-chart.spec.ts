import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoPieChartComponent } from "./pie-chart";

describe("CaoPieChartComponent", () => {
  let component: CaoPieChartComponent;
  let fixture: ComponentFixture<CaoPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoPieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoPieChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
