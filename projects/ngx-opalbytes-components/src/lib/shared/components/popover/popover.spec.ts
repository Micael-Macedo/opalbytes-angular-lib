import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoPopoverComponent } from './popover';

describe('CaoPopover', () => {
  let component: CaoPopoverComponent;
  let fixture: ComponentFixture<CaoPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoPopoverComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
