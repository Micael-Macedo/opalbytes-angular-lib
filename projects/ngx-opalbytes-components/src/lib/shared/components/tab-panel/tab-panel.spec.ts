import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoTabPanel } from "./tab-panel";

describe("CaoTabPanel", () => {
  let component: CaoTabPanel;
  let fixture: ComponentFixture<CaoTabPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoTabPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoTabPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
