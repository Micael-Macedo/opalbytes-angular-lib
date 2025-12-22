import { provideNativeDateAdapter } from '@angular/material/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTimeRange } from './base-time-range';

describe('BaseTimeRange', () => {
  let component: BaseTimeRange;
  let fixture: ComponentFixture<BaseTimeRange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTimeRange],
      providers: [
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseTimeRange);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
