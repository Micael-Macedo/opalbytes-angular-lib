import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoaFisicaModal } from './pessoa-fisica-modal';

describe('PessoaFisicaModal', () => {
  let component: PessoaFisicaModal;
  let fixture: ComponentFixture<PessoaFisicaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaFisicaModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaFisicaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
