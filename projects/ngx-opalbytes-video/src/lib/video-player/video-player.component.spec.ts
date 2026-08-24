import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CaoVideoPlayerComponent } from "./video-player.component";

describe("CaoVideoPlayerComponent", () => {
  let component: CaoVideoPlayerComponent;
  let fixture: ComponentFixture<CaoVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoVideoPlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoVideoPlayerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
