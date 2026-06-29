import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoDatePicker } from './date-picker';

describe('CaoDatePicker', () => {
  let component: CaoDatePicker;
  let fixture: ComponentFixture<CaoDatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoDatePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaoDatePicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
