import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoProgressBarComponent } from './progress-bar';

describe('CaoProgressBarComponent', () => {
  let fixture: ComponentFixture<CaoProgressBarComponent>;
  let el: HTMLElement;

  const track = () => el.querySelector<HTMLElement>('[role="progressbar"]') as HTMLElement;
  const fill = () => el.querySelector<HTMLElement>('.cao-progress-bar__fill') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CaoProgressBarComponent] }).compileComponents();
    fixture = TestBed.createComponent(CaoProgressBarComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('inicia no modo determinate com valor 0', () => {
    expect(track().getAttribute('aria-valuenow')).toBe('0');
    expect(fill().style.width).toBe('0%');
  });

  it('aplica o valor e os atributos ARIA', () => {
    fixture.componentRef.setInput('value', 40);
    fixture.detectChanges();
    expect(fill().style.width).toBe('40%');
    expect(track().getAttribute('aria-valuenow')).toBe('40');
    expect(track().getAttribute('aria-valuemin')).toBe('0');
    expect(track().getAttribute('aria-valuemax')).toBe('100');
  });

  it('limita o valor entre 0 e 100', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    expect(fill().style.width).toBe('100%');

    fixture.componentRef.setInput('value', -10);
    fixture.detectChanges();
    expect(fill().style.width).toBe('0%');
  });

  it('aceita valor como string (numberAttribute)', () => {
    fixture.componentRef.setInput('value', '25');
    fixture.detectChanges();
    expect(fill().style.width).toBe('25%');
  });

  it('modo indeterminate não define aria-valuenow e renderiza as duas barras', () => {
    fixture.componentRef.setInput('mode', 'indeterminate');
    fixture.detectChanges();
    expect(track().hasAttribute('aria-valuenow')).toBe(false);
    expect(el.querySelectorAll('.cao-progress-bar__bar').length).toBe(2);
    expect(fill()).toBeNull();
  });

  it('modo query inverte a animação', () => {
    fixture.componentRef.setInput('mode', 'query');
    fixture.detectChanges();
    expect(el.querySelector('.cao-progress-bar__inner--query')).not.toBeNull();
  });

  it('modo buffer renderiza buffer, pontos e progresso', () => {
    fixture.componentRef.setInput('mode', 'buffer');
    fixture.componentRef.setInput('value', 30);
    fixture.componentRef.setInput('bufferValue', 60);
    fixture.detectChanges();
    expect(fill().style.width).toBe('30%');
    expect(el.querySelector<HTMLElement>('.cao-progress-bar__buffer')?.style.width).toBe('60%');
    expect(el.querySelector('.cao-progress-bar__dots')).not.toBeNull();
    expect(track().getAttribute('aria-valuenow')).toBe('30');
  });

  it('exibe o percentual somente em modos com valor', () => {
    fixture.componentRef.setInput('value', 60);
    fixture.componentRef.setInput('showValue', true);
    fixture.detectChanges();
    expect(el.querySelector('.cao-progress-bar__value')?.textContent?.trim()).toBe('60%');

    fixture.componentRef.setInput('mode', 'indeterminate');
    fixture.detectChanges();
    expect(el.querySelector('.cao-progress-bar__value')).toBeNull();
  });

  it('aplica aria-label, data-cy e altura', () => {
    fixture.componentRef.setInput('ariaLabel', 'Carregando arquivo');
    fixture.componentRef.setInput('dataCy', 'upload-progress');
    fixture.componentRef.setInput('height', '10px');
    fixture.detectChanges();
    expect(track().getAttribute('aria-label')).toBe('Carregando arquivo');
    expect(track().getAttribute('data-cy')).toBe('upload-progress');
    expect(track().style.height).toBe('10px');
  });
});