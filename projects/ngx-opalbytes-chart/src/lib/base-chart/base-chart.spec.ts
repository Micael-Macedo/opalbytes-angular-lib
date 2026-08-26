import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoBaseChart } from './base-chart';

describe('CaoBaseChart', () => {
  let component: CaoBaseChart;
  let fixture: ComponentFixture<CaoBaseChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoBaseChart],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoBaseChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
