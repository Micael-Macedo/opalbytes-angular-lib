import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoAvatarComponent } from './avatar';

describe('CaoAvatarComponent', () => {
  let fixture: ComponentFixture<CaoAvatarComponent>;
  let el: HTMLElement;

  const avatar = () => el.querySelector<HTMLElement>('.cao-avatar') as HTMLElement;
  const image = () => el.querySelector<HTMLImageElement>('img');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CaoAvatarComponent] }).compileComponents();
    fixture = TestBed.createComponent(CaoAvatarComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('exibe a imagem padrão quando nada é informado', () => {
    expect(image()).not.toBeNull();
    expect(image()?.getAttribute('src')).toContain('data:image/svg+xml');
  });

  it('exibe a imagem informada em src', () => {
    fixture.componentRef.setInput('src', 'https://example.com/a.png');
    fixture.detectChanges();
    expect(image()?.getAttribute('src')).toBe('https://example.com/a.png');
  });

  it('exibe o label quando não há imagem', () => {
    fixture.componentRef.setInput('label', 'MB');
    fixture.detectChanges();
    expect(el.querySelector('.cao-avatar__label')?.textContent?.trim()).toBe('MB');
    expect(image()).toBeNull();
  });

  it('volta para a imagem padrão quando src falha e não há label/ícone', () => {
    fixture.componentRef.setInput('src', 'https://example.com/quebrada.png');
    fixture.detectChanges();
    image()?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(image()?.getAttribute('src')).toContain('data:image/svg+xml');
  });

  it('volta para o label quando src falha', () => {
    fixture.componentRef.setInput('src', 'https://example.com/quebrada.png');
    fixture.componentRef.setInput('label', 'AB');
    fixture.detectChanges();
    image()?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('.cao-avatar__label')?.textContent?.trim()).toBe('AB');
  });

  it('usa defaultSrc customizado', () => {
    fixture.componentRef.setInput('defaultSrc', 'https://example.com/padrao.png');
    fixture.detectChanges();
    expect(image()?.getAttribute('src')).toBe('https://example.com/padrao.png');
  });

  it('aplica tamanhos predefinidos, numéricos e em rem', () => {
    fixture.componentRef.setInput('size', 'xlarge');
    fixture.detectChanges();
    expect(avatar().style.width).toBe('64px');

    fixture.componentRef.setInput('size', 100);
    fixture.detectChanges();
    expect(avatar().style.width).toBe('100px');

    fixture.componentRef.setInput('size', '3rem');
    fixture.detectChanges();
    expect(avatar().style.width).toBe('48px');
  });

  it('aplica o formato', () => {
    expect(avatar().classList).toContain('cao-avatar--circle');
    fixture.componentRef.setInput('shape', 'square');
    fixture.detectChanges();
    expect(avatar().classList).toContain('cao-avatar--square');
  });

  it('aplica o stroke', () => {
    fixture.componentRef.setInput('strokeWidth', 3);
    fixture.componentRef.setInput('strokeColor', '#4f46e5');
    fixture.detectChanges();
    expect(avatar().style.borderWidth).toBe('3px');
    expect(avatar().style.borderStyle).toBe('solid');
  });
});