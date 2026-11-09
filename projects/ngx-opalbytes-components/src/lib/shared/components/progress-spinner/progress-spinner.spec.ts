import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoProgressSpinnerComponent } from './progress-spinner';

describe('CaoProgressSpinnerComponent', () => {
  let fixture: ComponentFixture<CaoProgressSpinnerComponent>;
  let el: HTMLElement;

  const root = () => el.querySelector<HTMLElement>('[role="progressbar"]') as HTMLElement;
  const indicator = () => el.querySelector<SVGCircleElement>('.cao-progress-spinner__indicator') as SVGCircleElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CaoProgressSpinnerComponent] }).compileComponents();
    fixture = TestBed.createComponent(CaoProgressSpinnerComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('inicia no modo indeterminate, sem aria-valuenow', () => {
    expect(root().classList).toContain('cao-progress-spinner--indeterminate');
    expect(root().hasAttribute('aria-valuenow')).toBe(false);
    expect(indicator().hasAttribute('stroke-dashoffset')).toBe(false);
  });

  it('usa diâmetro padrão de 48px', () => {
    expect(root().style.width).toBe('48px');
    expect(el.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 48 48');
  });

  it('aplica diâmetro e espessura customizados', () => {
    fixture.componentRef.setInput('diameter', 100);
    fixture.componentRef.setInput('strokeWidth', 10);
    fixture.detectChanges();
    expect(root().style.width).toBe('100px');
    expect(indicator().getAttribute('r')).toBe('45');
    expect(indicator().getAttribute('stroke-width')).toBe('10');
  });

  it('calcula o stroke-dashoffset no modo determinate', () => {
    fixture.componentRef.setInput('mode', 'determinate');
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();

    const circumference = 2 * Math.PI * ((48 - 4.8) / 2);
    expect(Number(indicator().getAttribute('stroke-dasharray'))).toBeCloseTo(circumference, 2);
    expect(Number(indicator().getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference / 2, 2);
    expect(root().getAttribute('aria-valuenow')).toBe('50');
  });

  it('limita o valor entre 0 e 100', () => {
    fixture.componentRef.setInput('mode', 'determinate');
    fixture.componentRef.setInput('value', 250);
    fixture.detectChanges();
    expect(root().getAttribute('aria-valuenow')).toBe('100');
    expect(Number(indicator().getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 2);
  });

  it('aceita value como string (numberAttribute)', () => {
    fixture.componentRef.setInput('mode', 'determinate');
    fixture.componentRef.setInput('value', '25');
    fixture.detectChanges();
    expect(root().getAttribute('aria-valuenow')).toBe('25');
  });

  it('exibe o percentual apenas no modo determinate', () => {
    fixture.componentRef.setInput('showValue', true);
    fixture.detectChanges();
    expect(el.querySelector('.cao-progress-spinner__value')).toBeNull();

    fixture.componentRef.setInput('mode', 'determinate');
    fixture.componentRef.setInput('value', 75);
    fixture.detectChanges();
    expect(el.querySelector('.cao-progress-spinner__value')?.textContent?.trim()).toBe('75%');
  });

  it('aplica aria-label, data-cy e linecap', () => {
    fixture.componentRef.setInput('ariaLabel', 'Carregando dados');
    fixture.componentRef.setInput('dataCy', 'spinner');
    fixture.componentRef.setInput('strokeLinecap', 'butt');
    fixture.detectChanges();
    expect(root().getAttribute('aria-label')).toBe('Carregando dados');
    expect(root().getAttribute('data-cy')).toBe('spinner');
    expect(indicator().getAttribute('stroke-linecap')).toBe('butt');
  });
});