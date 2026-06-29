import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDatePicker } from './base-date-picker';

describe('BaseDatePicker', () => {
  let component: BaseDatePicker;
  let fixture: ComponentFixture<BaseDatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDatePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseDatePicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
