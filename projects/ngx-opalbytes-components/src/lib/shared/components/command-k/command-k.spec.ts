import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoCmdKComponent } from './command-k';
import { ICaoCmdKGroup, ICaoCmdKItem, ICaoCmdKSelectEvent } from './command-k.model';

@Component({
  imports: [CaoCmdKComponent],
  template: `
    <cao-cmd-k
      [(open)]="open"
      [items]="items"
      [groups]="groups"
      [enableShortcut]="enableShortcut()"
      [showTrigger]="showTrigger()"
      [localFilter]="localFilter()"
      (itemSelected)="selected.push($event)" />
  `,
})
class HostComponent {
  readonly open = signal(false);
  readonly enableShortcut = signal(true);
  readonly showTrigger = signal(true);
  readonly localFilter = signal(true);
  selected: ICaoCmdKSelectEvent[] = [];
  commandCalls = 0;

  items: ICaoCmdKItem[] = [
    { id: 'help', label: 'Ajuda' },
    { id: 'quick', label: 'Ação rápida', keywords: ['atalho'] },
  ];

  groups: ICaoCmdKGroup[] = [
    {
      heading: 'Sugestões',
      items: [
        { id: 'calendar', label: 'Calendário' },
        { id: 'calc', label: 'Calculadora', disabled: true },
        { id: 'emoji', label: 'Buscar emoji', description: 'Procure figurinhas' },
      ],
    },
    {
      heading: 'Configurações',
      items: [
        { id: 'profile', label: 'Perfil', shortcut: '⌘P' },
        { id: 'settings', label: 'Configurações', command: () => this.commandCalls++ },
      ],
    },
  ];
}

const dialog = () => document.querySelector<HTMLElement>('.cao-cmdk');
const input = () => document.querySelector<HTMLInputElement>('.cao-cmdk__input') as HTMLInputElement;
const options = () => Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));
const labels = () =>
  Array.from(document.querySelectorAll('.cao-cmdk__item-label')).map((element) => element.textContent?.trim());

const shortcut = (init: KeyboardEventInit) =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true, cancelable: true, ...init }));

const press = (key: string) =>
  input().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

describe('CaoCmdKComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const flush = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const type = async (text: string) => {
    input().value = text;
    input().dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
  };

  const openPalette = async () => {
    host.open.set(true);
    await flush();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await flush();
  });

  it('exibe o campo de abertura com placeholder e atalho, sem a paleta', () => {
    const trigger = fixture.nativeElement.querySelector('.cao-cmdk-trigger') as HTMLElement;
    expect(trigger.textContent).toContain('Buscar comandos...');
    expect(trigger.querySelectorAll('kbd').length).toBe(2);
    expect(dialog()).toBeNull();
  });

  it('abre ao clicar no campo e foca a busca', async () => {
    (fixture.nativeElement.querySelector('.cao-cmdk-trigger') as HTMLElement).click();
    await flush();
    expect(dialog()).not.toBeNull();
    expect(dialog()?.getAttribute('role')).toBe('dialog');
    expect(document.activeElement).toBe(input());
  });

  it('alterna com Ctrl+K e abre com Cmd+K', async () => {
    shortcut({ ctrlKey: true });
    await flush();
    expect(dialog()).not.toBeNull();

    shortcut({ ctrlKey: true });
    await flush();
    expect(dialog()).toBeNull();

    shortcut({ metaKey: true });
    await flush();
    expect(dialog()).not.toBeNull();
  });

  it('ignora "k" sem modificador ou com Shift', async () => {
    shortcut({});
    shortcut({ ctrlKey: true, shiftKey: true });
    await flush();
    expect(dialog()).toBeNull();
  });

  it('não reage ao atalho quando enableShortcut é false', async () => {
    host.enableShortcut.set(false);
    await flush();
    shortcut({ ctrlKey: true });
    await flush();
    expect(dialog()).toBeNull();
  });

  it('oculta o campo com showTrigger=false', async () => {
    host.showTrigger.set(false);
    await flush();
    expect(fixture.nativeElement.querySelector('.cao-cmdk-trigger')).toBeNull();
  });

  it('renderiza itens sem grupo e grupos com títulos', async () => {
    await openPalette();
    expect(options().length).toBe(7);
    expect(Array.from(document.querySelectorAll('.cao-cmdk__heading')).map((el) => el.textContent?.trim())).toEqual([
      'Sugestões',
      'Configurações',
    ]);
    expect(document.querySelector('.cao-cmdk__item-shortcut')?.textContent?.trim()).toBe('⌘P');
  });

  it('filtra ignorando acentos e caixa', async () => {
    await openPalette();
    await type('acao');
    expect(labels()).toEqual(['Ação rápida']);
  });

  it('filtra por palavras-chave e descrição', async () => {
    await openPalette();
    await type('atalho');
    expect(labels()).toEqual(['Ação rápida']);
    await type('figurinhas');
    expect(labels()).toEqual(['Buscar emoji']);
  });

  it('filtra por prefixo do título', async () => {
    await openPalette();
    await type('con');
    expect(labels()).toEqual(['Configurações']);
  });

  it('exibe o estado vazio', async () => {
    await openPalette();
    await type('zzzzzz');
    expect(options().length).toBe(0);
    expect(document.querySelector('.cao-cmdk__empty')?.textContent).toContain('Nenhum resultado encontrado.');
  });

  it('não filtra localmente com localFilter=false', async () => {
    host.localFilter.set(false);
    await openPalette();
    await type('zzzzzz');
    expect(options().length).toBe(7);
  });

  it('navega com as setas, pulando itens desabilitados', async () => {
    await openPalette();
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[0].id);

    press('ArrowDown');
    press('ArrowDown');
    await flush();
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[2].id); // Calendário

    press('ArrowDown');
    await flush();
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[4].id); // pula "Calculadora" (desabilitado)
    expect(options()[4].getAttribute('aria-selected')).toBe('true');
  });

  it('volta ao último item ao subir a partir do primeiro (loop)', async () => {
    await openPalette();
    press('ArrowUp');
    await flush();
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[6].id);
  });

  it('seleciona com Enter: emite evento, executa command e fecha', async () => {
    await openPalette();
    await type('configuracoes');
    press('Enter');
    await flush();

    expect(host.selected.length).toBe(1);
    expect(host.selected[0].item.id).toBe('settings');
    expect(host.selected[0].group).toBe('Configurações');
    expect(host.commandCalls).toBe(1);
    expect(host.open()).toBe(false);
    expect(dialog()).toBeNull();
  });

  it('seleciona ao clicar e ignora clique em item desabilitado', async () => {
    await openPalette();
    options()[3].click(); // Calculadora (desabilitada)
    await flush();
    expect(host.selected.length).toBe(0);
    expect(dialog()).not.toBeNull();

    options()[2].click(); // Calendário
    await flush();
    expect(host.selected[0].item.id).toBe('calendar');
    expect(dialog()).toBeNull();
  });

  it('fecha com Esc', async () => {
    await openPalette();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(host.open()).toBe(false);
    expect(dialog()).toBeNull();
  });

  it('limpa a busca ao fechar', async () => {
    await openPalette();
    await type('perfil');
    expect(options().length).toBe(1);

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();

    await openPalette();
    expect(input().value).toBe('');
    expect(options().length).toBe(7);
  });
});