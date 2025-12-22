import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePicker } from './time-picker';

describe('TimePicker', () => {
  let component: TimePicker;
  let fixture: ComponentFixture<TimePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimePicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
