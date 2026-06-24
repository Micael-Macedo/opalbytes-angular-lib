import { CaoSkeletonDirective } from './skeleton.directive';
import {
  Component,
  DebugElement,
  signal,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// ─── Mocks globais para dimensões ────────────────────────────────────────────

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

function setupDimensionMocks(): void {
  Element.prototype.getBoundingClientRect = vi.fn(function (this: HTMLElement) {
    const w = parseFloat(this.style.width) || 100;
    const h = parseFloat(this.style.height) || 100;
    return { top: 0, left: 0, right: w, bottom: h, width: w, height: h, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get: function (this: HTMLElement) { return parseFloat(this.style.width) || 100; },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get: function (this: HTMLElement) { return parseFloat(this.style.height) || 100; },
  });
}

function restoreDimensionMocks(): void {
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  if (originalOffsetWidth) {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  }
  if (originalOffsetHeight) {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function waitForSkeleton(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 50));
}

function getDirective<T>(fixture: ComponentFixture<T>): CaoSkeletonDirective {
  const el = fixture.debugElement.query(By.directive(CaoSkeletonDirective));
  if (!el) throw new Error('Directive not found');
  return el.injector.get(CaoSkeletonDirective);
}

function getHost<T>(fixture: ComponentFixture<T>): HTMLElement {
  const el = fixture.debugElement.query(By.directive(CaoSkeletonDirective));
  if (!el) throw new Error('Directive not found');
  return el.nativeElement;
}

// ─── Test Components ─────────────────────────────────────────────────────────

@Component({
  template: `
    <div [caoSkeleton]="true" style="width:400px;height:200px;position:relative;">
      <h1 style="width:200px;height:30px;">Titulo</h1>
      <p style="width:300px;height:20px;">Paragrafo</p>
      <button style="width:100px;height:40px;">Botao</button>
    </div>
  `,
  standalone: true,
  imports: [CaoSkeletonDirective],
})
class TestDefaultComponent {}

@Component({
  template: `
    <div [caoSkeleton]="isLoading()" style="width:400px;height:200px;position:relative;">
      <h1 style="width:200px;height:30px;">Titulo</h1>
    </div>
  `,
  standalone: true,
  imports: [CaoSkeletonDirective],
})
class TestToggleComponent {
  isLoading = signal(true);
}

@Component({
  template: `
    <div [caoSkeleton]="true" [caoSkeletonDeep]="true" style="width:400px;height:200px;position:relative;">
      <h1 style="width:200px;height:30px;">Titulo</h1>
      <p style="width:300px;height:20px;">Paragrafo</p>
    </div>
  `,
  standalone: true,
  imports: [CaoSkeletonDirective],
})
class TestDeepComponent {}

@Component({
  template: `
    <div [caoSkeleton]="true" caoSkeletonClass="my-custom-skel" style="width:400px;height:200px;position:relative;">
      <h1 style="width:200px;height:30px;">Titulo</h1>
    </div>
  `,
  standalone: true,
  imports: [CaoSkeletonDirective],
})
class TestCustomClassComponent {}

@Component({
  template: `
    <div [caoSkeleton]="true" [caoSkeletonStyle]="{ margin: '8px' }" style="width:400px;height:200px;position:relative;">
      <h1 style="width:200px;height:30px;">Titulo</h1>
    </div>
  `,
  standalone: true,
  imports: [CaoSkeletonDirective],
})
class TestCustomStyleComponent {}

@Component({
  template: `
    <div
      [caoSkeleton]="true"
      caoSkeletonColor="#ff0000"
      caoSkeletonShine="#ffffff"
      style="width:400px;height:200px;position:relative;">
      <h1 style="width:200px;height:30px;">Titulo</h1>
    </div>
  `,
  standalone: true,
  imports: [CaoSkeletonDirective],
})
class TestCustomColorsComponent {}

@Component({
  template: `
    <div [caoSkeleton]="true" caoSkeletonRadius="16px" style="width:400px;height:200px;position:relative;">
      <h1 style="width:200px;height:30px;">Titulo</h1>
    </div>
  `,
  standalone: true,
  imports: [CaoSkeletonDirective],
})
class TestCustomRadiusComponent {}

@Component({
  template: `
    <div [caoSkeleton]="true" [caoSkeletonDeep]="true" style="width:400px;height:200px;position:relative;">
      <img src="test.jpg" alt="test" style="width:50px;height:50px;">
      <br>
      <p style="width:200px;height:20px;">Texto visivel</p>
    </div>
  `,
  standalone: true,
  imports: [CaoSkeletonDirective],
})
class TestSkipComponent {}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('CaoSkeletonDirective', () => {
  beforeAll(() => {
    setupDimensionMocks();
  });

  afterAll(() => {
    restoreDimensionMocks();
  });

  // ── Modo padrão (deep=false) ─────────────────────────────────────────────

  describe('modo padrao (deep=false)', () => {
    let fixture: ComponentFixture<TestDefaultComponent>;
    let hostElement: HTMLElement;
    let directiveInstance: CaoSkeletonDirective;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [TestDefaultComponent] });
      fixture = TestBed.createComponent(TestDefaultComponent);
      directiveInstance = getDirective(fixture);
      hostElement = getHost(fixture);
    });

    it('deve criar uma instancia da diretiva', () => {
      expect(directiveInstance).toBeTruthy();
    });

    it('deve criar placeholder quando skeleton esta ativo por padrao', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      const placeholders = hostElement.querySelectorAll('.cao-skeleton-placeholder');
      expect(placeholders.length).toBeGreaterThan(0);
    });

    it('deve esconder o host (color transparent no elemento hospedeiro)', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.style.color).toBe('transparent');
      expect(hostElement.style.userSelect).toBe('none');
      expect(hostElement.style.pointerEvents).toBe('none');
    });

    it('deve posicionar o placeholder como absoluto', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      const placeholder = hostElement.querySelector('.cao-skeleton-placeholder') as HTMLElement;
      expect(placeholder.style.position).toBe('absolute');
    });

    it('deve definir largura e altura no placeholder', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      const placeholder = hostElement.querySelector('.cao-skeleton-placeholder') as HTMLElement;
      expect(parseFloat(placeholder.style.width)).toBeGreaterThan(0);
      expect(parseFloat(placeholder.style.height)).toBeGreaterThan(0);
    });
  });

  // ── Toggle on/off ────────────────────────────────────────────────────────

  describe('toggle do skeleton', () => {
    let fixture: ComponentFixture<TestToggleComponent>;
    let component: TestToggleComponent;
    let hostElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [TestToggleComponent] });
      fixture = TestBed.createComponent(TestToggleComponent);
      component = fixture.componentInstance;
      hostElement = getHost(fixture);
    });

    it('deve remover placeholders ao desativar', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.querySelectorAll('.cao-skeleton-placeholder').length).toBeGreaterThan(0);

      component.isLoading.set(false);
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.querySelectorAll('.cao-skeleton-placeholder').length).toBe(0);
    });

    it('deve restaurar estilos no host ao desativar', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.style.color).toBe('transparent');
      expect(hostElement.style.pointerEvents).toBe('none');
      expect(hostElement.style.userSelect).toBe('none');

      component.isLoading.set(false);
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.style.color).toBe('');
      expect(hostElement.style.pointerEvents).toBe('');
      expect(hostElement.style.userSelect).toBe('');
    });

    it('deve recriar placeholders ao reativar', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      component.isLoading.set(false);
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.querySelectorAll('.cao-skeleton-placeholder').length).toBe(0);

      component.isLoading.set(true);
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.querySelectorAll('.cao-skeleton-placeholder').length).toBeGreaterThan(0);
    });
  });

  // ── Modo deep ────────────────────────────────────────────────────────────

  describe('modo deep (caoSkeletonDeep=true)', () => {
    let fixture: ComponentFixture<TestDeepComponent>;
    let hostElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [TestDeepComponent] });
      fixture = TestBed.createComponent(TestDeepComponent);
      hostElement = getHost(fixture);
    });

    it('deve criar um placeholder para cada filho visivel', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      const placeholders = hostElement.querySelectorAll('.cao-skeleton-placeholder');
      expect(placeholders.length).toBe(2);
    });

    it('deve esconder cada filho individualmente (color transparent)', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      const h1 = hostElement.querySelector('h1') as HTMLElement;
      const p = hostElement.querySelector('p') as HTMLElement;
      expect(h1.style.color).toBe('transparent');
      expect(p.style.color).toBe('transparent');
    });
  });

  // ── Inputs customizados ──────────────────────────────────────────────────

  describe('inputs customizados', () => {
    describe('caoSkeletonClass', () => {
      let fixture: ComponentFixture<TestCustomClassComponent>;
      let hostElement: HTMLElement;

      beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TestCustomClassComponent] });
        fixture = TestBed.createComponent(TestCustomClassComponent);
        hostElement = getHost(fixture);
      });

      it('deve aplicar classe customizada ao placeholder', async () => {
        fixture.detectChanges();
        await waitForSkeleton();

        const placeholder = hostElement.querySelector('.cao-skeleton-placeholder') as HTMLElement;
        expect(placeholder.classList.contains('my-custom-skel')).toBe(true);
      });
    });

    describe('caoSkeletonStyle', () => {
      let fixture: ComponentFixture<TestCustomStyleComponent>;
      let hostElement: HTMLElement;

      beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TestCustomStyleComponent] });
        fixture = TestBed.createComponent(TestCustomStyleComponent);
        hostElement = getHost(fixture);
      });

      it('deve aplicar estilos customizados ao placeholder', async () => {
        fixture.detectChanges();
        await waitForSkeleton();

        const placeholder = hostElement.querySelector('.cao-skeleton-placeholder') as HTMLElement;
        expect(placeholder.style.margin).toBe('8px');
      });
    });

    describe('caoSkeletonColor e caoSkeletonShine', () => {
      let fixture: ComponentFixture<TestCustomColorsComponent>;
      let hostElement: HTMLElement;

      beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TestCustomColorsComponent] });
        fixture = TestBed.createComponent(TestCustomColorsComponent);
        hostElement = getHost(fixture);
      });

      it('deve aplicar cor de fundo customizada', async () => {
        fixture.detectChanges();
        await waitForSkeleton();

        const placeholder = hostElement.querySelector('.cao-skeleton-placeholder') as HTMLElement;
        expect(placeholder.style.backgroundColor).toBeTruthy();
      });

      it('deve aplicar cor de brilho customizada no background-image', async () => {
        fixture.detectChanges();
        await waitForSkeleton();

        const placeholder = hostElement.querySelector('.cao-skeleton-placeholder') as HTMLElement;
        expect(placeholder.style.backgroundImage).toContain('rgb(255, 255, 255)');
      });
    });

    describe('caoSkeletonRadius', () => {
      let fixture: ComponentFixture<TestCustomRadiusComponent>;
      let hostElement: HTMLElement;

      beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TestCustomRadiusComponent] });
        fixture = TestBed.createComponent(TestCustomRadiusComponent);
        hostElement = getHost(fixture);
      });

      it('deve aplicar raio de borda customizado', async () => {
        fixture.detectChanges();
        await waitForSkeleton();

        const placeholder = hostElement.querySelector('.cao-skeleton-placeholder') as HTMLElement;
        expect(placeholder.style.borderRadius).toBe('16px');
      });
    });
  });

  // ── Skip de elementos ────────────────────────────────────────────────────

  describe('skip de elementos', () => {
    let fixture: ComponentFixture<TestSkipComponent>;
    let hostElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [TestSkipComponent] });
      fixture = TestBed.createComponent(TestSkipComponent);
      hostElement = getHost(fixture);
    });

    it('nao deve criar placeholder para br (SKIP_TAGS)', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      const br = hostElement.querySelector('br');
      expect(br).toBeTruthy();
      expect(br!.style.color).toBe('');
      expect(br!.style.pointerEvents).toBe('');
    });

    it('deve criar placeholder para elementos visiveis como p', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      const placeholders = hostElement.querySelectorAll('.cao-skeleton-placeholder');
      expect(placeholders.length).toBeGreaterThan(0);
    });

    it('p deve estar oculto (color transparent)', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      const p = hostElement.querySelector('p') as HTMLElement;
      expect(p.style.color).toBe('transparent');
    });
  });

  // ── Cleanup no destroy ───────────────────────────────────────────────────

  describe('cleanup no destroy', () => {
    let fixture: ComponentFixture<TestDefaultComponent>;
    let hostElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [TestDefaultComponent] });
      fixture = TestBed.createComponent(TestDefaultComponent);
      hostElement = getHost(fixture);
    });

    it('deve remover placeholders ao destruir o componente', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.querySelectorAll('.cao-skeleton-placeholder').length).toBeGreaterThan(0);

      fixture.destroy();

      expect(hostElement.querySelectorAll('.cao-skeleton-placeholder').length).toBe(0);
    });

    it('deve restaurar estilos no host ao destruir o componente', async () => {
      fixture.detectChanges();
      await waitForSkeleton();

      expect(hostElement.style.color).toBe('transparent');
      expect(hostElement.style.pointerEvents).toBe('none');
      expect(hostElement.style.userSelect).toBe('none');

      fixture.destroy();

      expect(hostElement.style.color).toBe('');
      expect(hostElement.style.pointerEvents).toBe('');
      expect(hostElement.style.userSelect).toBe('');
    });
  });
});
