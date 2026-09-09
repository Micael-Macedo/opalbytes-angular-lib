import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { CaoFormField } from '../form-field/form-field';
import { CaoError } from './error';

@Component({
  selector: 'cao-error-host',
  imports: [CaoFormField, CaoError, ReactiveFormsModule],
  template: `
    <cao-form-field label="Email" [control]="control">
      <input caoInput [formControl]="control" />
      <cao-error>E-mail obrigatório</cao-error>
    </cao-form-field>
  `,
})
class CaoErrorHostComponent {
  control = new FormControl('', [Validators.required]);
}

describe('CaoError', () => {
  let fixture: ComponentFixture<CaoError>;
  let component: CaoError;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoError],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('não deve exibir erro quando não há controle', () => {
    expect(component.hasErrorState).toBe(false);
  });
});

describe('CaoError (dentro de CaoFormField)', () => {
  let hostFixture: ComponentFixture<CaoErrorHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoErrorHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(CaoErrorHostComponent);
    hostFixture.detectChanges();
  });

  it('deve ocultar o erro quando o controle está válido', () => {
    hostFixture.componentInstance.control.setValue('teste@exemplo.com');
    hostFixture.detectChanges();
    const error = hostFixture.nativeElement.querySelector('cao-error .cao-error');
    expect(error).toBeFalsy();
  });

  it('deve exibir o erro quando o controle está inválido e tocado', () => {
    hostFixture.componentInstance.control.markAsTouched();
    hostFixture.detectChanges();
    const error = hostFixture.nativeElement.querySelector('cao-error .cao-error');
    expect(error).toBeTruthy();
    expect(error.textContent.trim()).toBe('E-mail obrigatório');
  });

  it('deve ocultar o erro quando está inválido mas não foi tocado', () => {
    const error = hostFixture.nativeElement.querySelector('cao-error .cao-error');
    expect(error).toBeFalsy();
  });
});