import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCard } from './base-card';

describe('BaseCard', () => {
  let component: BaseCard;
  let fixture: ComponentFixture<BaseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
