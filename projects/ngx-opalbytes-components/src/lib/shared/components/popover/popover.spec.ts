import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoPopover } from './popover';

describe('CaoPopover', () => {
  let component: CaoPopover;
  let fixture: ComponentFixture<CaoPopover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoPopover],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoPopover);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
