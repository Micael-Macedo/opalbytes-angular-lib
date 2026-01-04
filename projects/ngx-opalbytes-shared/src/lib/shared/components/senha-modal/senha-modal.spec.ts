import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenhaModal } from './senha-modal';

describe('SenhaModal', () => {
  let component: SenhaModal;
  let fixture: ComponentFixture<SenhaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenhaModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SenhaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
