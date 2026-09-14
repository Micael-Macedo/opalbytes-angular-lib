import { CaoTooltipDirective } from './tooltip.directive';
import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [CaoTooltipDirective],
  template: `
    <button
      [caoTooltip]="tooltipText"
      [tooltipPosition]="position()"
      [tooltipBgColor]="bgColor"
      [tooltipTextColor]="textColor"
      [tooltipFontSize]="fontSize"
      [tooltipMaxWidth]="maxWidth"
      [tooltipArrow]="arrow()"
      [tooltipOffsetPx]="offsetPx()"
    >
      Hover me
    </button>
  `,
})
class TestHostComponent {
  tooltipText = 'Test tooltip <b>bold</b>';
  position = signal<'top' | 'bottom' | 'left' | 'right'>('top');
  bgColor = '#000000';
  textColor = '#ffffff';
  fontSize = '14px';
  maxWidth = '300px';
  arrow = signal(true);
  offsetPx = signal(8);
}

@Component({
  standalone: true,
  imports: [CaoTooltipDirective],
  template: `<button caoTooltip="Default tooltip">Hover</button>`,
})
class TestDefaultHostComponent {}

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

function mockRects(host: DOMRect, tooltip: DOMRect): void {
  Element.prototype.getBoundingClientRect = vi.fn(function (this: HTMLElement) {
    return this.tagName === 'CAO-TOOLTIP-CONTAINER' ? tooltip : host;
  });
}

function restoreRects(): void {
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
}

function hostRectMock(): DOMRect {
  return { top: 10, left: 20, right: 120, bottom: 60, width: 100, height: 50, x: 20, y: 10, toJSON: () => ({}) } as DOMRect;
}

function tooltipRectMock(): DOMRect {
  return { top: 0, left: 0, right: 40, bottom: 20, width: 40, height: 20, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

afterEach(() => {
  restoreRects();
  document.querySelectorAll('cao-tooltip-container').forEach((el) => el.remove());
});

describe('CaoTooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  function buttonEl(): DebugElement {
    const el = fixture.debugElement.query(By.directive(CaoTooltipDirective));
    if (!el) throw new Error('Directive not found');
    return el;
  }

  function containerEl(): HTMLElement | null {
    return document.querySelector('cao-tooltip-container');
  }

  function tooltipEl(): HTMLElement | null {
    return document.querySelector('.cao-tooltip');
  }

  async function showTooltip(): Promise<void> {
    buttonEl().triggerEventHandler('mouseenter', null);
    await nextFrame();
    fixture.detectChanges();
  }

  it('should create the directive on the host element', () => {
    expect(buttonEl().injector.get(CaoTooltipDirective)).toBeTruthy();
  });

  it('should append tooltip container to body on mouseenter', async () => {
    await showTooltip();
    expect(containerEl()).toBeTruthy();
  });

  it('should remove tooltip container from body on mouseleave', async () => {
    await showTooltip();
    buttonEl().triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect(containerEl()).toBeNull();
  });

  it('should render innerHTML content inside tooltip', async () => {
    await showTooltip();
    const container = containerEl();
    expect(container?.innerHTML).toContain('<b>bold</b>');
  });

  it('should show tooltip on focus and hide on blur', async () => {
    buttonEl().triggerEventHandler('focus', null);
    await nextFrame();
    fixture.detectChanges();
    expect(containerEl()).toBeTruthy();

    buttonEl().triggerEventHandler('blur', null);
    fixture.detectChanges();
    expect(containerEl()).toBeNull();
  });

  it('should apply custom CSS variables to tooltip', async () => {
    await showTooltip();
    const tooltip = tooltipEl();
    expect(tooltip?.style.getPropertyValue('--cao-tooltip-bg')).toBe('#000000');
    expect(tooltip?.style.getPropertyValue('--cao-tooltip-text-color')).toBe('#ffffff');
    expect(tooltip?.style.getPropertyValue('--cao-tooltip-font-size')).toBe('14px');
    expect(tooltip?.style.getPropertyValue('--cao-tooltip-max-width')).toBe('300px');
  });

  it('should apply position class based on tooltipPosition input', async () => {
    fixture.componentInstance.position.set('bottom');
    fixture.detectChanges();
    await showTooltip();
    expect(tooltipEl()?.classList.contains('cao-tooltip--bottom')).toBe(true);
  });

  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'should apply the %s position class to the tooltip',
    async (position: 'top' | 'bottom' | 'left' | 'right') => {
      fixture.componentInstance.position.set(position);
      fixture.detectChanges();
      await showTooltip();
      expect(tooltipEl()?.classList.contains(`cao-tooltip--${position}`)).toBe(true);
    }
  );

  it('should render arrow element when tooltipArrow is true', async () => {
    await showTooltip();
    expect(document.querySelector('.cao-tooltip__arrow')).toBeTruthy();
  });

  it('should NOT render arrow element when tooltipArrow is false', async () => {
    fixture.componentInstance.arrow.set(false);
    fixture.detectChanges();
    await showTooltip();
    expect(document.querySelector('.cao-tooltip__arrow')).toBeNull();
  });

  it('should not duplicate tooltips on consecutive mouseenter events', async () => {
    await showTooltip();
    await showTooltip();
    expect(document.querySelectorAll('cao-tooltip-container').length).toBe(1);
  });

  it('should destroy tooltip on directive destroy', async () => {
    await showTooltip();
    fixture.destroy();
    expect(containerEl()).toBeNull();
  });

  describe('positioning', () => {
    beforeEach(() => {
      mockRects(hostRectMock(), tooltipRectMock());
    });

    it('should position tooltip above the host for top position', async () => {
      fixture.componentInstance.position.set('top');
      fixture.detectChanges();
      await showTooltip();
      const container = containerEl() as HTMLElement;
      expect(container.style.top).toBe('-18px');
      expect(container.style.left).toBe('50px');
    });

    it('should position tooltip below the host for bottom position', async () => {
      fixture.componentInstance.position.set('bottom');
      fixture.detectChanges();
      await showTooltip();
      const container = containerEl() as HTMLElement;
      expect(container.style.top).toBe('68px');
      expect(container.style.left).toBe('50px');
    });

    it('should position tooltip to the left of the host for left position', async () => {
      fixture.componentInstance.position.set('left');
      fixture.detectChanges();
      await showTooltip();
      const container = containerEl() as HTMLElement;
      expect(container.style.top).toBe('25px');
      expect(container.style.left).toBe('-28px');
    });

    it('should position tooltip to the right of the host for right position', async () => {
      fixture.componentInstance.position.set('right');
      fixture.detectChanges();
      await showTooltip();
      const container = containerEl() as HTMLElement;
      expect(container.style.top).toBe('25px');
      expect(container.style.left).toBe('128px');
    });

    it('should respect tooltipOffsetPx when positioning the tooltip', async () => {
      fixture.componentInstance.position.set('bottom');
      fixture.componentInstance.offsetPx.set(20);
      fixture.detectChanges();
      await showTooltip();
      const container = containerEl() as HTMLElement;
      expect(container.style.top).toBe('80px');
      expect(container.style.left).toBe('50px');
    });
  });
});

describe('CaoTooltipDirective default values', () => {
  let fixture: ComponentFixture<TestDefaultHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDefaultHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();
  });

  async function showTooltip(): Promise<void> {
    fixture.debugElement.query(By.directive(CaoTooltipDirective))!.triggerEventHandler('mouseenter', null);
    await nextFrame();
    fixture.detectChanges();
  }

  it('should default position to bottom', async () => {
    await showTooltip();
    const tooltip = document.querySelector('.cao-tooltip');
    expect(tooltip?.classList.contains('cao-tooltip--bottom')).toBe(true);
  });

  it('should render arrow by default', async () => {
    await showTooltip();
    expect(document.querySelector('.cao-tooltip__arrow')).toBeTruthy();
  });

  it('should apply the default CSS variables', async () => {
    await showTooltip();
    const tooltip = document.querySelector('.cao-tooltip') as HTMLElement;
    expect(tooltip.style.getPropertyValue('--cao-tooltip-bg')).toBe('#323232');
    expect(tooltip.style.getPropertyValue('--cao-tooltip-text-color')).toBe('#ffffff');
    expect(tooltip.style.getPropertyValue('--cao-tooltip-font-size')).toBe('13px');
    expect(tooltip.style.getPropertyValue('--cao-tooltip-max-width')).toBe('220px');
  });
});
