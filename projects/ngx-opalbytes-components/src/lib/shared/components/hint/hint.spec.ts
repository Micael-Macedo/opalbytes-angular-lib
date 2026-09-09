import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoHint } from './hint';

describe('CaoHint', () => {
  let component: CaoHint;
  let fixture: ComponentFixture<CaoHint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoHint],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoHint);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});