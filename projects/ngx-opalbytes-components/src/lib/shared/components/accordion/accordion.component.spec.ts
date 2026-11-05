import { Component, input, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoAccordionComponent } from './accordion.component';
import { CaoAccordionItemComponent } from '../accordion-item/accordion-item.component';


@Component({
  imports: [CaoAccordionItemComponent, CaoAccordionComponent],
  template: `
    <cao-accordion dataCy="acc" headerBgColor="#111111" [multi]="multi()">
      <cao-accordion-item dataCy="one" label="Um">A</cao-accordion-item>
      <cao-accordion-item dataCy="two" label="Dois">B</cao-accordion-item>
      <cao-accordion-item dataCy="dis" label="Desabilitado" [isDisabled]="true">C</cao-accordion-item>
      <cao-accordion-item dataCy="hid" label="Oculto" [isVisible]="false">D</cao-accordion-item>
    </cao-accordion>
  `,
})
class HostComponent {
  readonly multi = input<boolean>(false);
  readonly accordion = viewChild.required(CaoAccordionComponent);
}

describe('CaoAccordion', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HTMLElement;

  const header = (cy: string): HTMLButtonElement =>
    host.querySelector<HTMLButtonElement>(`[data-cy="${cy}-header"]`) as HTMLButtonElement;

  const click = async (cy: string): Promise<void> => {
    header(cy).click();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('expõe data-cy no accordion, no item, no cabeçalho e no conteúdo', () => {
    expect(host.querySelector('[data-cy="acc"]')).not.toBeNull();
    expect(host.querySelector('[data-cy="one"]')).not.toBeNull();
    expect(host.querySelector('[data-cy="one-header"]')).not.toBeNull();
    expect(host.querySelector('[data-cy="one-content"]')).not.toBeNull();
  });

  it('expande e recolhe ao clicar no cabeçalho', async () => {
    expect(header('one').getAttribute('aria-expanded')).toBe('false');
    await click('one');
    expect(header('one').getAttribute('aria-expanded')).toBe('true');
    await click('one');
    expect(header('one').getAttribute('aria-expanded')).toBe('false');
  });

  it('no modo único, expandir um item recolhe os demais', async () => {
    await click('one');
    await click('two');
    expect(header('one').getAttribute('aria-expanded')).toBe('false');
    expect(header('two').getAttribute('aria-expanded')).toBe('true');
  });

  it('no modo multi, mantém vários itens expandidos', async () => {
    fixture.componentRef.setInput('multi', true);
    fixture.detectChanges();
    await fixture.whenStable();

    await click('one');
    await click('two');
    expect(header('one').getAttribute('aria-expanded')).toBe('true');
    expect(header('two').getAttribute('aria-expanded')).toBe('true');
  });

  it('não alterna item desabilitado', async () => {
    expect(header('dis').disabled).toBe(true);
    await click('dis');
    expect(header('dis').getAttribute('aria-expanded')).toBe('false');
  });

  it('oculta o item quando isVisible é false', () => {
    const item = host.querySelector('[data-cy="hid"]') as HTMLElement;
    expect(item.classList.contains('cao-accordion-item--hidden')).toBe(true);
  });

  it('openAll/closeAll funcionam apenas conforme o modo', async () => {
    const accordion = fixture.componentInstance.accordion();
    accordion.openAll();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(header('one').getAttribute('aria-expanded')).toBe('false');

    fixture.componentRef.setInput('multi', true);
    fixture.detectChanges();
    await fixture.whenStable();

    accordion.openAll();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(header('one').getAttribute('aria-expanded')).toBe('true');
    expect(header('two').getAttribute('aria-expanded')).toBe('true');

    accordion.closeAll();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(header('one').getAttribute('aria-expanded')).toBe('false');
  });

  it('aplica as cores como CSS custom properties', () => {
    const acc = host.querySelector('[data-cy="acc"]') as HTMLElement;
    expect(acc.style.getPropertyValue('--cao-accordion-header-bg')).toBe('#111111');
  });
});