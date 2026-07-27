import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoBaseIcon } from './base-icon';

describe('CaoBaseIcon', () => {
  let component: CaoBaseIcon;
  let fixture: ComponentFixture<CaoBaseIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoBaseIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaoBaseIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
