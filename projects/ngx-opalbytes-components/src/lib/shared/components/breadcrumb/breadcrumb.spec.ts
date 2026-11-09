import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CaoBreadcrumbComponent } from './breadcrumb';
import { ICaoBreadcrumbItem } from './breadcrumb.model';

describe('CaoBreadcrumbComponent', () => {
  let fixture: ComponentFixture<CaoBreadcrumbComponent>;
  let el: HTMLElement;

  const items: ICaoBreadcrumbItem[] = [
    { label: 'Início', link: '/' },
    { label: 'Clientes', href: 'https://example.com' },
    { label: 'Detalhe', badge: 3 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoBreadcrumbComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoBreadcrumbComponent);
    el = fixture.nativeElement;
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  it('renderiza um item por entrada', () => {
    expect(el.querySelectorAll('.cao-breadcrumb__item').length).toBe(3);
  });

  it('usa "/" como divisor padrão (n - 1 divisores)', () => {
    const seps = el.querySelectorAll('.cao-breadcrumb__separator');
    expect(seps.length).toBe(2);
    expect(seps[0].textContent?.trim()).toBe('/');
  });

  it('aceita divisor de texto customizado', () => {
    fixture.componentRef.setInput('separator', '>');
    fixture.detectChanges();
    expect(el.querySelector('.cao-breadcrumb__separator')?.textContent?.trim()).toBe('>');
  });

  it('marca o último item como página atual e sem link', () => {
    const current = el.querySelector('.cao-breadcrumb__item--current .cao-breadcrumb__text');
    expect(current?.getAttribute('aria-current')).toBe('page');
    expect(el.querySelector('.cao-breadcrumb__item--current a')).toBeNull();
  });

  it('renderiza badge', () => {
    expect(el.querySelector('.cao-breadcrumb__badge')?.textContent?.trim()).toBe('3');
  });

  it('inclui o item home como primeiro', () => {
    fixture.componentRef.setInput('home', { label: 'Home', link: '/' });
    fixture.detectChanges();
    const first = el.querySelector('.cao-breadcrumb__item');
    expect(first?.textContent).toContain('Home');
    expect(el.querySelectorAll('.cao-breadcrumb__item').length).toBe(4);
  });

  it('emite itemClick e executa command', () => {
    let commandCalled = false;
    const emitted: unknown[] = [];
    fixture.componentRef.setInput('items', [
      { label: 'Ação', command: () => (commandCalled = true) },
      { label: 'Atual' },
    ]);
    fixture.componentInstance.itemClick.subscribe((e) => emitted.push(e));
    fixture.detectChanges();

    el.querySelector<HTMLButtonElement>('button.cao-breadcrumb__action')?.click();

    expect(commandCalled).toBe(true);
    expect(emitted.length).toBe(1);
  });

  it('não torna interativo um item desabilitado', () => {
    fixture.componentRef.setInput('items', [
      { label: 'Bloqueado', link: '/x', disabled: true },
      { label: 'Atual' },
    ]);
    fixture.detectChanges();
    expect(el.querySelector('a, button')).toBeNull();
  });

  it('não renderiza nada sem itens', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(el.querySelector('nav')).toBeNull();
  });
});