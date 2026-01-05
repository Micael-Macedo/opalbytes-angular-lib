import { RnvSkeletonDirective } from './skeleton.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div caoSkeleton>
      <h1>Titulo</h1>
      <p>Paragrafo de teste</p>
      <button>Botao</button>
      <span>Texto span</span>
    </div>
  `,
  standalone: true,
  imports: [RnvSkeletonDirective]
})
class TestComponent {}

describe('RnvSkeletonDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;
  let directiveInstance: RnvSkeletonDirective;
  let hostElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, RnvSkeletonDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    directiveElement = fixture.debugElement.query(By.directive(RnvSkeletonDirective));

    if (!directiveElement) {
      throw new Error('Directive not found');
    }

    directiveInstance = directiveElement.injector.get(RnvSkeletonDirective);
    hostElement = directiveElement.nativeElement;
  });

  it('deve criar uma instancia da diretiva', () => {
    expect(directiveInstance).toBeTruthy();
  });

  it('deve aplicar classes skeleton aos elementos filhos', async () => {
    fixture.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 100));

    const h1 = hostElement.querySelector('h1');
    const p = hostElement.querySelector('p');
    const button = hostElement.querySelector('button');
    const span = hostElement.querySelector('span');

    expect(h1?.classList.contains('skeleton-heading')).toBe(true);
    expect(h1?.classList.contains('animate-pulse')).toBe(true);

    expect(p?.classList.contains('skeleton-text')).toBe(true);
    expect(p?.classList.contains('animate-pulse')).toBe(true);

    expect(button?.classList.contains('skeleton-button')).toBe(true);
    expect(button?.classList.contains('animate-pulse')).toBe(true);

    expect(span?.classList.contains('skeleton-text')).toBe(true);
    expect(span?.classList.contains('animate-pulse')).toBe(true);
  });

  it('deve aplicar estilos de skeleton aos elementos', async () => {
    fixture.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 100));

    const h1 = hostElement.querySelector('h1') as HTMLElement;

    expect(h1.style.color).toBe('transparent');
    expect(h1.style.userSelect).toBe('none');
    expect(h1.style.pointerEvents).toBe('none');
  });

  it('deve remover skeleton apos duracao configurada', async () => {
    fixture.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 100));

    const h1 = hostElement.querySelector('h1');
    expect(h1?.classList.contains('skeleton-heading')).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 2100));

    fixture.detectChanges();
    expect(h1?.classList.contains('skeleton-heading')).toBe(false);
    expect(h1?.classList.contains('animate-pulse')).toBe(false);
  }, 5000);

  it('deve restaurar estilos originais apos remover skeleton', async () => {
    fixture.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 100));

    const h1 = hostElement.querySelector('h1') as HTMLElement;
    expect(h1.style.color).toBe('transparent');

    await new Promise(resolve => setTimeout(resolve, 2100));

    fixture.detectChanges();
    expect(h1.style.color).toBe('');
    expect(h1.style.userSelect).toBe('');
    expect(h1.style.pointerEvents).toBe('');
  }, 5000);

  it('deve limpar timeout ao destruir', async () => {
    fixture.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 100));

    const h1 = hostElement.querySelector('h1');
    expect(h1?.classList.contains('skeleton-heading')).toBe(true);

    fixture.destroy();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(h1?.classList.contains('skeleton-heading')).toBe(false);
  });

  it('nao deve aplicar skeleton a elementos img, svg ou lucide-icon', async () => {
    TestBed.resetTestingModule();

    @Component({
      template: `
        <div caoSkeleton>
          <img src="test.jpg" alt="test">
          <svg></svg>
          <p>Texto</p>
        </div>
      `,
      standalone: true,
      imports: [RnvSkeletonDirective]
    })
    class TestSkipComponent {}

    TestBed.configureTestingModule({
      imports: [TestSkipComponent, RnvSkeletonDirective]
    });

    const skipFixture = TestBed.createComponent(TestSkipComponent);
    skipFixture.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 100));

    const container = skipFixture.debugElement.query(By.directive(RnvSkeletonDirective));
    const hostEl = container.nativeElement;

    const img = hostEl.querySelector('img');
    const svg = hostEl.querySelector('svg');
    const p = hostEl.querySelector('p');

    expect(img?.classList.contains('animate-pulse')).toBe(false);
    expect(svg?.classList.contains('animate-pulse')).toBe(false);
    expect(p?.classList.contains('animate-pulse')).toBe(true);
  });
});
