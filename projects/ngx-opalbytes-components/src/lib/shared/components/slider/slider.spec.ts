import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CaoSliderComponent } from './slider';

@Component({
  imports: [CaoSliderComponent, ReactiveFormsModule],
  template: `
    <cao-slider id="single" [formControl]="single" />
    <cao-slider id="range" [range]="true" [formControl]="interval" />
  `,
})
class FormHostComponent {
  single = new FormControl(30, { nonNullable: true });
  interval = new FormControl<[number, number]>([20, 60], { nonNullable: true });
}

const key = (el: Element, name: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));

describe('CaoSliderComponent', () => {
  let fixture: ComponentFixture<CaoSliderComponent>;
  let el: HTMLElement;

  const thumbs = () => Array.from(el.querySelectorAll<HTMLElement>('.cao-slider__thumb'));
  const thumb = (id: 'start' | 'end' = 'start') => el.querySelector<HTMLElement>(`[data-thumb="${id}"]`) as HTMLElement;
  const set = (name: string, value: unknown) => {
    fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CaoSliderComponent] }).compileComponents();
    fixture = TestBed.createComponent(CaoSliderComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renderiza um thumb com atributos ARIA', () => {
    expect(thumbs().length).toBe(1);
    expect(thumb().getAttribute('role')).toBe('slider');
    expect(thumb().getAttribute('aria-valuemin')).toBe('0');
    expect(thumb().getAttribute('aria-valuemax')).toBe('100');
    expect(thumb().getAttribute('aria-valuenow')).toBe('0');
  });

  it('posiciona o thumb e o preenchimento conforme o valor', () => {
    set('value', 40);
    expect(thumb().style.left).toBe('40%');
    expect(el.querySelector<HTMLElement>('.cao-slider__fill')?.style.width).toBe('40%');
    expect(thumb().getAttribute('aria-valuenow')).toBe('40');
  });

  it('limita o valor entre min e max', () => {
    set('value', 500);
    expect(thumb().getAttribute('aria-valuenow')).toBe('100');
    set('value', -5);
    expect(thumb().getAttribute('aria-valuenow')).toBe('0');
  });

  it('altera o valor pelo teclado e emite valueChange', () => {
    const emitted: Array<number | null> = [];
    fixture.componentInstance.value.subscribe((v) => emitted.push(v));
    set('value', 10);

    key(thumb(), 'ArrowRight');
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('11');

    key(thumb(), 'ArrowLeft');
    key(thumb(), 'ArrowLeft');
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('9');
    expect(emitted).toEqual([11, 10, 9]);
  });

  it('suporta PageUp/PageDown, Home e End', () => {
    set('value', 50);
    key(thumb(), 'PageUp');
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('60');
    key(thumb(), 'PageDown');
    key(thumb(), 'PageDown');
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('40');
    key(thumb(), 'End');
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('100');
    key(thumb(), 'Home');
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('0');
  });

  it('respeita steps decimais sem erro de ponto flutuante', () => {
    set('step', 0.1);
    set('value', 0.2);
    key(thumb(), 'ArrowRight');
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('0.3');
  });

  it('não altera quando desabilitado', () => {
    set('isDisabled', true);
    set('value', 10);
    key(thumb(), 'ArrowRight');
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('10');
    expect(thumb().getAttribute('aria-disabled')).toBe('true');
    expect(thumb().getAttribute('tabindex')).toBe('-1');
  });

  it('define o valor ao clicar na trilha (ponteiro)', () => {
    const track = el.querySelector<HTMLElement>('.cao-slider__track') as HTMLElement;
    track.getBoundingClientRect = () => ({ left: 0, width: 200, top: 0, right: 200, bottom: 10, height: 10, x: 0, y: 0, toJSON: () => ({}) });

    track.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, bubbles: true }));
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('50');

    track.dispatchEvent(new MouseEvent('pointermove', { clientX: 150, bubbles: true }));
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('75');

    track.dispatchEvent(new MouseEvent('pointerup', { clientX: 150, bubbles: true }));
    track.dispatchEvent(new MouseEvent('pointermove', { clientX: 20, bubbles: true }));
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('75');
  });

  it('exibe o balão com displayWith no modo discrete', () => {
    set('discrete', true);
    set('displayWith', (v: number) => `${v}%`);
    set('value', 25);
    expect(el.querySelector('.cao-slider__label')?.textContent?.trim()).toBe('25%');
    expect(thumb().getAttribute('aria-valuetext')).toBe('25%');
  });

  it('renderiza marcas por passo', () => {
    set('max', 10);
    set('step', 2);
    set('showTickMarks', true);
    expect(el.querySelectorAll('.cao-slider__tick').length).toBe(6);
  });

  describe('modo range', () => {
    beforeEach(() => {
      set('range', true);
      set('value', 20);
      set('endValue', 60);
    });

    it('renderiza dois thumbs com limites coerentes', () => {
      expect(thumbs().length).toBe(2);
      expect(thumb('start').getAttribute('aria-valuenow')).toBe('20');
      expect(thumb('start').getAttribute('aria-valuemax')).toBe('60');
      expect(thumb('end').getAttribute('aria-valuenow')).toBe('60');
      expect(thumb('end').getAttribute('aria-valuemin')).toBe('20');
    });

    it('impede que os thumbs se cruzem', () => {
      key(thumb('start'), 'End');
      fixture.detectChanges();
      expect(thumb('start').getAttribute('aria-valuenow')).toBe('60');

      key(thumb('end'), 'Home');
      fixture.detectChanges();
      expect(thumb('end').getAttribute('aria-valuenow')).toBe('60');
    });

    it('move o thumb mais próximo ao clicar na trilha', () => {
      const track = el.querySelector<HTMLElement>('.cao-slider__track') as HTMLElement;
      track.getBoundingClientRect = () => ({ left: 0, width: 100, top: 0, right: 100, bottom: 10, height: 10, x: 0, y: 0, toJSON: () => ({}) });
      track.dispatchEvent(new MouseEvent('pointerdown', { clientX: 50, bubbles: true }));
      fixture.detectChanges();
      expect(thumb('end').getAttribute('aria-valuenow')).toBe('50');
      expect(thumb('start').getAttribute('aria-valuenow')).toBe('20');
    });
  });
});

describe('CaoSliderComponent com formulários', () => {
  let fixture: ComponentFixture<FormHostComponent>;
  let host: FormHostComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(FormHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('escreve o valor do FormControl no slider', () => {
    const thumb = el.querySelector('#single [data-thumb="start"]');
    expect(thumb?.getAttribute('aria-valuenow')).toBe('30');
  });

  it('atualiza o FormControl ao alterar pelo teclado', () => {
    const thumb = el.querySelector('#single [data-thumb="start"]') as HTMLElement;
    key(thumb, 'ArrowRight');
    fixture.detectChanges();
    expect(host.single.value).toBe(31);
  });

  it('usa [inicio, fim] no modo range', () => {
    expect(el.querySelector('#range [data-thumb="end"]')?.getAttribute('aria-valuenow')).toBe('60');
    key(el.querySelector('#range [data-thumb="end"]') as HTMLElement, 'ArrowRight');
    fixture.detectChanges();
    expect(host.interval.value).toEqual([20, 61]);
  });

  it('desabilita com FormControl.disable()', () => {
    host.single.disable();
    fixture.detectChanges();
    expect(el.querySelector('#single [data-thumb="start"]')?.getAttribute('aria-disabled')).toBe('true');
  });
});