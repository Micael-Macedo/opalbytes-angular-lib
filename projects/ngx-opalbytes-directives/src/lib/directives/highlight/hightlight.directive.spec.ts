import { HighlightDirective } from './highlight.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


// Componente de teste
@Component({
  template: `
    <div [caoHighlight]="color">
      Test Element
    </div>
  `,
  standalone: true,
  imports: [HighlightDirective] 
})
class TestComponent {
  color = 'yellow'
}

describe('HighlightDirective com inject()', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;
  let directiveInstance: HighlightDirective;
  let hostElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, HighlightDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    directiveElement = fixture.debugElement.query(By.directive(HighlightDirective));
    
    if (!directiveElement) {
      throw new Error('Directive not found');
    }
    
    directiveInstance = directiveElement.injector.get(HighlightDirective);
    hostElement = directiveElement.nativeElement;
    
    fixture.detectChanges();
  });

  it('deve criar uma instância usando inject()', () => {
    expect(directiveInstance).toBeTruthy();
    expect(directiveInstance.caoHighlight()).toBe('yellow');
  });

  it('deve ter ElementRef injetado corretamente', () => {
    // Verifica se a diretiva tem acesso ao elemento
    const mouseEnterEvent = new MouseEvent('mouseenter');
    hostElement.dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();
    
    expect(hostElement.style.backgroundColor).toBe('yellow');
  });

  it('deve responder ao mouseenter e mouseleave', () => {
    // Testa mouseenter
    const mouseEnterEvent = new MouseEvent('mouseenter');
    hostElement.dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();
    expect(hostElement.style.backgroundColor).toBe('yellow');
    
    // Testa mouseleave
    const mouseLeaveEvent = new MouseEvent('mouseleave');
    hostElement.dispatchEvent(mouseLeaveEvent);
    fixture.detectChanges();
    expect(hostElement.style.backgroundColor).toBe('');
  });
});