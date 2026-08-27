import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoKpi, ICaoKPI } from "./kpi";

const mockKpiData: ICaoKPI = {
  title: "Test",
  value: "42",
  textColor: "#000000",
  borderColor: "#ffffff",
  icon: { src: "icon.png", alt: "icon" },
};

describe("CaoKpi", () => {
  let component: CaoKpi;
  let fixture: ComponentFixture<CaoKpi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoKpi],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoKpi);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("kpiData", mockKpiData);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render the kpi data", () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("42");
    expect(el.textContent).toContain("Test");
  });
});
