import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoBadgeContent, CaoBadgePosition, CaoBadgeDirective } from './badge.directive';

@Component({
  standalone: true,
  imports: [CaoBadgeDirective],
  template: `
    <button
      [caoBadge]="content()"
      [caoBadgeColor]="color()"
      [caoBadgeTextColor]="textColor()"
      [caoBadgePosition]="position()"
      [caoBadgeOverlap]="overlap()"
      [caoBadgeHidden]="hidden()"
      [caoBadgeDot]="dot()"
      [caoBadgeMax]="max()"
      caoBadgeDescription="Novas mensagens"
    >
      Inbox
    </button>
  `,
})
class HostComponent {
  readonly content = signal<CaoBadgeContent>(5);
  readonly color = signal('primary');
  readonly textColor = signal('#ffffff');
  readonly position = signal<CaoBadgePosition>('above after');
  readonly overlap = signal(true);
  readonly hidden = signal(false);
  readonly dot = signal(false);
  readonly max = signal<number | undefined>(undefined);
}

describe('CaoBadgeDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const badge = (): HTMLElement =>
    (fixture.nativeElement as HTMLElement).querySelector('.cao-badge') as HTMLElement;

  const cssColor = (value: string): string => {
    const probe = document.createElement('span');
    probe.style.backgroundColor = value;
    return probe.style.backgroundColor;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renderiza o conteúdo informado', () => {
    expect(badge().textContent).toBe('5');
    expect(badge().style.transform).toBe('scale(1)');
  });

  it('atualiza o conteúdo reativamente', () => {
    host.content.set('novo');
    fixture.detectChanges();
    expect(badge().textContent).toBe('novo');
  });

  it('exibe 0 como conteúdo válido', () => {
    host.content.set(0);
    fixture.detectChanges();
    expect(badge().textContent).toBe('0');
    expect(badge().style.transform).toBe('scale(1)');
  });

  it('oculta o badge quando o conteúdo é vazio', () => {
    host.content.set('');
    fixture.detectChanges();
    expect(badge().style.transform).toBe('scale(0)');
    expect(badge().getAttribute('aria-hidden')).toBe('true');
  });

  it('oculta o badge quando caoBadgeHidden é true', () => {
    host.hidden.set(true);
    fixture.detectChanges();
    expect(badge().style.transform).toBe('scale(0)');
  });

  it('limita o valor numérico com caoBadgeMax', () => {
    host.content.set(150);
    host.max.set(99);
    fixture.detectChanges();
    expect(badge().textContent).toBe('99+');
  });

  it('aplica cor por preset e por valor CSS', () => {
    expect(badge().style.backgroundColor).toBe(cssColor('#1976d2'));

    host.color.set('warn');
    fixture.detectChanges();
    expect(badge().style.backgroundColor).toBe(cssColor('#d32f2f'));

    host.color.set('rgb(1, 2, 3)');
    fixture.detectChanges();
    expect(badge().style.backgroundColor).toBe('rgb(1, 2, 3)');
  });

  it('aplica a cor do texto', () => {
    host.textColor.set('rgb(10, 20, 30)');
    fixture.detectChanges();
    expect(badge().style.color).toBe('rgb(10, 20, 30)');
  });

  it('usa "above after" sobreposto por padrão', () => {
    expect(badge().style.top).toBe('-11px');
    expect(badge().style.right).toBe('-11px');
    expect(badge().style.bottom).toBe('auto');
    expect(badge().style.left).toBe('auto');
  });

  it('posiciona "below before" sem sobreposição', () => {
    host.position.set('below before');
    host.overlap.set(false);
    fixture.detectChanges();
    expect(badge().style.bottom).toBe('-11px');
    expect(badge().style.left).toBe('-22px');
    expect(badge().style.top).toBe('auto');
    expect(badge().style.right).toBe('auto');
  });

  it('completa posições parciais com os valores padrão', () => {
    host.position.set('below');
    fixture.detectChanges();
    expect(badge().style.bottom).toBe('-11px');
    expect(badge().style.right).toBe('-11px');
  });

  it('exibe apenas um ponto no modo dot', () => {
    host.dot.set(true);
    host.content.set(null);
    fixture.detectChanges();
    expect(badge().textContent).toBe('');
    expect(badge().style.minWidth).toBe('8px');
    expect(badge().style.transform).toBe('scale(1)');
  });

  it('expõe a descrição para acessibilidade quando visível', () => {
    expect(badge().getAttribute('role')).toBe('img');
    expect(badge().getAttribute('aria-label')).toBe('Novas mensagens');
  });

  it('remove o badge ao destruir a diretiva', () => {
    fixture.destroy();
    expect(document.querySelector('.cao-badge')).toBeNull();
  });
});