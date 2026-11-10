import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoPopoverTriggerDirective } from './popover-trigger.directive';
import { CaoPopoverComponent } from './popover';

@Component({
  imports: [CaoPopoverComponent],
  template: `
    <button id="trigger" type="button" (click)="op.toggle($event)">Abrir</button>
    <button id="other" type="button" (click)="op.toggle($event)">Outro</button>
    <cao-popover
      #op
      ariaLabel="Detalhes"
      dataCy="meu-popover"
      styleClass="minha-classe"
      [showCloseIcon]="showCloseIcon()"
      [dismissable]="dismissable()"
      [closeOnEscape]="closeOnEscape()"
      [showArrow]="showArrow()"
      [align]="align()"
      (shown)="shownCount = shownCount + 1"
      (hidden)="hiddenCount = hiddenCount + 1">
      <p class="body">Conteúdo do popover</p>
      <input class="field" type="text" />
    </cao-popover>
  `,
})
class HostComponent {
  readonly showCloseIcon = signal(false);
  readonly dismissable = signal(true);
  readonly closeOnEscape = signal(true);
  readonly showArrow = signal(true);
  readonly align = signal<'start' | 'center' | 'end'>('center');
  shownCount = 0;
  hiddenCount = 0;
}

@Component({
  imports: [CaoPopoverComponent, CaoPopoverTriggerDirective],
  template: `
    <button id="focus-trigger" type="button" [caoPopoverTrigger]="pop" caoPopoverTriggerOn="focus">Foco</button>
    <button id="disabled-trigger" type="button" [caoPopoverTrigger]="pop" [caoPopoverDisabled]="true">Desabilitado</button>
    <button id="click-trigger" type="button" [caoPopoverTrigger]="pop">Clique</button>
    <cao-popover #pop><p>Via diretiva</p></cao-popover>
  `,
})
class DirectiveHostComponent {}

const panel = () => document.querySelector<HTMLElement>('.cao-popover');

describe('CaoPopoverComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let trigger: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    trigger = fixture.nativeElement.querySelector('#trigger');
  });

  it('inicia fechado', () => {
    expect(panel()).toBeNull();
  });

  it('abre ao acionar toggle e exibe o conteúdo projetado', () => {
    trigger.click();
    fixture.detectChanges();
    expect(panel()).not.toBeNull();
    expect(panel()?.querySelector('.body')?.textContent).toContain('Conteúdo do popover');
    expect(host.shownCount).toBe(1);
  });

  it('aplica role, aria-label, data-cy e styleClass', () => {
    trigger.click();
    fixture.detectChanges();
    expect(panel()?.getAttribute('role')).toBe('dialog');
    expect(panel()?.getAttribute('aria-label')).toBe('Detalhes');
    expect(panel()?.getAttribute('data-cy')).toBe('meu-popover');
    expect(panel()?.classList).toContain('minha-classe');
  });

  it('atualiza atributos ARIA da origem', () => {
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-controls')).toBe(panel()?.id);

    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
  });

  it('fecha ao acionar toggle novamente na mesma origem', () => {
    trigger.click();
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();
    expect(panel()).toBeNull();
    expect(host.hiddenCount).toBe(1);
  });

  it('move o popover ao acionar de outra origem, sem duplicar o painel', () => {
    trigger.click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('#other').click();
    fixture.detectChanges();
    expect(document.querySelectorAll('.cao-popover').length).toBe(1);
    expect(host.shownCount).toBe(2);
  });

  it('fecha com Esc', () => {
    trigger.click();
    fixture.detectChanges();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });

  it('não fecha com Esc quando closeOnEscape é false', () => {
    host.closeOnEscape.set(false);
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(panel()).not.toBeNull();
  });

  it('fecha ao clicar fora', () => {
    trigger.click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });

  it('não fecha ao clicar fora quando dismissable é false', () => {
    host.dismissable.set(false);
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(panel()).not.toBeNull();
  });

  it('exibe e aciona o botão de fechar', () => {
    host.showCloseIcon.set(true);
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();
    const close = panel()?.querySelector<HTMLButtonElement>('.cao-popover__close');
    expect(close).not.toBeNull();
    close?.click();
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });

  it('oculta a seta com showArrow=false', () => {
    host.showArrow.set(false);
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();
    expect(panel()?.querySelector('.cao-popover__arrow')).toBeNull();
    expect(panel()?.classList).toContain('cao-popover--no-arrow');
  });

  it('aplica a classe de alinhamento', () => {
    host.align.set('start');
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();
    expect(panel()?.classList).toContain('cao-popover--align-start');
  });

  it('move o foco para o primeiro elemento focável ao abrir', () => {
    trigger.click();
    fixture.detectChanges();
    expect(document.activeElement?.classList).toContain('field');
  });
});

describe('CaoPopoverTriggerDirective', () => {
  let fixture: ComponentFixture<DirectiveHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DirectiveHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(DirectiveHostComponent);
    fixture.detectChanges();
  });

  it('abre ao clicar (gatilho padrão)', () => {
    fixture.nativeElement.querySelector('#click-trigger').click();
    fixture.detectChanges();
    expect(panel()).not.toBeNull();
  });

  it('abre e fecha com gatilho de foco', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('#focus-trigger');
    el.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    expect(panel()).not.toBeNull();

    el.dispatchEvent(new FocusEvent('focusout'));
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });

  it('não abre quando desabilitado', () => {
    fixture.nativeElement.querySelector('#disabled-trigger').click();
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });
});