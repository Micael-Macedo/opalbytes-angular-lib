import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { CaoFormField } from './form-field';

describe('CaoFormField', () => {
  let component: CaoFormField;
  let fixture: ComponentFixture<CaoFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoFormField],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoFormField);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir label fora do input por padrão', () => {
    fixture.componentRef.setInput('label', 'Nome');
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.cao-form-field__label');
    expect(label).toBeTruthy();
    expect(label.textContent.trim()).toBe('Nome');
    expect(component.labelInside).toBe(false);
  });

  it('deve usar label interna quando labelInside for true', () => {
    fixture.componentRef.setInput('label', 'Nome');
    fixture.componentRef.setInput('labelInside', true);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.cao-form-field__label--float');
    expect(label).toBeTruthy();
  });

  it('deve flutuar o label quando o controle possui valor', () => {
    const control = new FormControl('valor');
    fixture.componentRef.setInput('label', 'Nome');
    fixture.componentRef.setInput('labelInside', true);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.floating).toBe(true);
    const label = fixture.nativeElement.querySelector('.cao-form-field__label--floated');
    expect(label).toBeTruthy();
  });

  it('deve exibir hintLabel quando definido', () => {
    fixture.componentRef.setInput('hintLabel', 'Digite um CEP válido');
    fixture.detectChanges();
    const hint = fixture.nativeElement.querySelector('.cao-form-field__hint');
    expect(hint).toBeTruthy();
    expect(hint.textContent.trim()).toBe('Digite um CEP válido');
  });

  it('deve detectar estado de erro quando controle inválido e tocado', () => {
    const control = new FormControl('', [Validators.required]);
    control.markAsTouched();
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.errorStateActive).toBe(true);
  });

  it('nao deve ativar estado de erro quando controle não for tocado', () => {
    const control = new FormControl('', [Validators.required]);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.errorStateActive).toBe(false);
  });

  it('deve marcar como obrigatório quando o controle tem Validators.required', () => {
    const control = new FormControl('', [Validators.required]);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.required).toBe(true);
  });

  it('deve reutilizar o id do forId no atributo for do label', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('forId', 'campo-email');
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.cao-form-field__label');
    expect(label.getAttribute('for')).toBe('campo-email');
  });

  it('deve detectar o controle vindo de um AbstractControl', () => {
    const control = new FormControl('abc');
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.disabled).toBe(false);
  });

  it('deve aplicar as cores customizadas como custom props no host', () => {
    fixture.componentRef.setInput('inputBackground', '#f8fafc');
    fixture.componentRef.setInput('errorColor', '#e11d48');
    fixture.componentRef.setInput('borderRadius', '16px');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.getPropertyValue('--cao-form-field-bg-background')).toBe('#f8fafc');
    expect(host.style.getPropertyValue('--cao-form-field-color-error')).toBe('#e11d48');
    expect(host.style.getPropertyValue('--cao-form-field-border-radius')).toBe('16px');
  });

  it('nao deve aplicar custom props de cor quando o input tem undefined', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.getPropertyValue('--cao-form-field-bg-background')).toBe('');
  });
});