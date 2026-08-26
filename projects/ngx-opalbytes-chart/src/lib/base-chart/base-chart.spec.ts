import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseChart } from './base-chart';

describe('BaseChart', () => {
  let component: BaseChart;
  let fixture: ComponentFixture<BaseChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseChart],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
