import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoTabGroup } from "./tab-group";

describe("TabGroup", () => {
  let component: CaoTabGroup;
  let fixture: ComponentFixture<CaoTabGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoTabGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoTabGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
