import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TabPanel } from "./tab-panel";

describe("TabPanel", () => {
  let component: TabPanel;
  let fixture: ComponentFixture<TabPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(TabPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
