import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoBaseToggleComponent } from "./base-toggle.component";

describe("CaoBaseToggleComponent", () => {
  let component: CaoBaseToggleComponent;
  let fixture: ComponentFixture<CaoBaseToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoBaseToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoBaseToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
