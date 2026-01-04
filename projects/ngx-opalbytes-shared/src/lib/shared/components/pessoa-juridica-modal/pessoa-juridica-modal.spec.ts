import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoaJuridicaModal } from './pessoa-juridica-modal';

describe('PessoaJuridicaModal', () => {
  let component: PessoaJuridicaModal;
  let fixture: ComponentFixture<PessoaJuridicaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaJuridicaModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaJuridicaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
