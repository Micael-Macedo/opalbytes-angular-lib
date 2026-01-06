import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StepperComponent } from "./stepper";
import { StepComponent } from "./step/step";
import { Component, QueryList, EventEmitter } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("StepperComponent", () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  @Component({
    selector: "cao-step",
    template: "<div></div>",
    standalone: true,
  })
  class MockStepComponent {
    isActive = false;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperComponent, MockStepComponent],
    })
      .overrideComponent(StepperComponent, {
        remove: { imports: [StepComponent] },
        add: { imports: [MockStepComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  describe("ngAfterContentInit", () => {
    it("deve ativar o primeiro passo e definir lengthStep quando há passos", () => {
      const step1 = new MockStepComponent();
      const step2 = new MockStepComponent();
      component.steps = new QueryList<StepComponent>();
      component.steps.reset([step1 as StepComponent, step2 as StepComponent]);

      component.ngAfterContentInit();

      expect(component.steps.toArray()[0].isActive).toBe(true);
      expect(component.lengthStep).toBe(2);
    });

    it("não deve fazer nada quando não há passos", () => {
      component.steps = new QueryList<StepComponent>();
      component.steps.reset([]);
      const originalLength = component.lengthStep;

      component.ngAfterContentInit();

      expect(component.lengthStep).toBe(originalLength);
    });
  });

  describe("nextStep", () => {
    it("deve avançar para o próximo passo quando não estiver no último", () => {
      const steps = [
        { isActive: true } as StepComponent,
        { isActive: false } as StepComponent,
        { isActive: false } as StepComponent,
      ];
      component.steps = new QueryList<StepComponent>();
      component.steps.reset(steps);
      component.activeStepIndex = 0;
      
      const emitSpy = vi.spyOn(component.maxReachedEvent as EventEmitter<null>, 'emit');

      component.nextStep();

      expect(component.activeStepIndex).toBe(1);
      expect(steps[1].isActive).toBe(true);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it("deve emitir maxReachedEvent quando estiver no último passo", () => {
      const steps = [
        { isActive: true } as StepComponent, 
        { isActive: true } as StepComponent
      ];
      component.steps = new QueryList<StepComponent>();
      component.steps.reset(steps);
      component.activeStepIndex = 1;
      
      const emitSpy = vi.spyOn(component.maxReachedEvent as EventEmitter<null>, 'emit');

      component.nextStep();

      expect(emitSpy).toHaveBeenCalledWith(null);
      expect(component.activeStepIndex).toBe(1);
    });

    it("não deve fazer nada quando não há passos", () => {
      component.steps = new QueryList<StepComponent>();
      component.steps.reset([]);
      const originalIndex = component.activeStepIndex;
      
      const emitSpy = vi.spyOn(component.maxReachedEvent as EventEmitter<null>, 'emit');

      component.nextStep();

      expect(component.activeStepIndex).toBe(originalIndex);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe("prevStep", () => {
    it("deve voltar para o passo anterior quando não estiver no primeiro", () => {
      const steps = [
        { isActive: true } as StepComponent,
        { isActive: true } as StepComponent,
        { isActive: false } as StepComponent,
      ];
      component.steps = new QueryList<StepComponent>();
      component.steps.reset(steps);
      component.activeStepIndex = 1;

      component.prevStep();

      expect(component.activeStepIndex).toBe(0);
      expect(steps[1].isActive).toBe(false);
      expect(steps[0].isActive).toBe(true);
    });

    it("não deve fazer nada quando estiver no primeiro passo", () => {
      const steps = [
        { isActive: true } as StepComponent, 
        { isActive: false } as StepComponent
      ];
      component.steps = new QueryList<StepComponent>();
      component.steps.reset(steps);
      component.activeStepIndex = 0;

      component.prevStep();

      expect(component.activeStepIndex).toBe(0);
      expect(steps[0].isActive).toBe(true);
    });

    it("não deve fazer nada quando não há passos", () => {
      component.steps = new QueryList<StepComponent>();
      component.steps.reset([]);
      const originalIndex = component.activeStepIndex;

      component.prevStep();

      expect(component.activeStepIndex).toBe(originalIndex);
    });
  });

  describe("resetStepper", () => {
    it("deve redefinir para o primeiro passo e desativar todos os outros", () => {
      const steps = [
        { isActive: false } as StepComponent,
        { isActive: true } as StepComponent,
        { isActive: true } as StepComponent,
      ];
      component.steps = new QueryList<StepComponent>();
      component.steps.reset(steps);
      component.activeStepIndex = 2;

      const forEachSpy = vi.spyOn(component.steps, "forEach");

      component.resetStepper();

      expect(component.activeStepIndex).toBe(0);
      expect(forEachSpy).toHaveBeenCalled();
      expect(steps[0].isActive).toBe(true);
      expect(steps[1].isActive).toBe(false);
      expect(steps[2].isActive).toBe(false);
    });

    it("não deve ativar nenhum passo quando não há passos", () => {
      component.steps = new QueryList<StepComponent>();
      component.steps.reset([]);
      component.activeStepIndex = 2;

      const forEachSpy = vi.spyOn(component.steps, "forEach");

      component.resetStepper();

      expect(component.activeStepIndex).toBe(0);
      expect(forEachSpy).toHaveBeenCalled();
    });
  });

  describe("Testes com Template", () => {
    it("deve exibir o título do stepper quando fornecido", () => {
      component.title = "Meu Stepper";
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css(".stepper-title"));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent).toContain("Meu Stepper");
    });
  });

  // Testes adicionais para melhor cobertura
  describe("Outros comportamentos", () => {
    it("deve permitir navegação entre múltiplos passos", async() => {
      const steps = [
        { isActive: false } as StepComponent,
        { isActive: false } as StepComponent,
        { isActive: false } as StepComponent,
      ];
      component.steps = new QueryList<StepComponent>();
      component.steps.reset(steps);

      component.ngAfterContentInit();
      expect(component.activeStepIndex).toBe(0);
      expect(steps[0].isActive).toBe(true);

      component.nextStep();

      expect(component.activeStepIndex).toBe(1);
      expect(component.steps.get(0)?.isActive).toBe(true);

      component.nextStep();
      expect(component.activeStepIndex).toBe(2);
      expect(component.steps.get(2)?.isActive).toBe(true);

      component.prevStep();
      expect(component.activeStepIndex).toBe(1);
      expect(component.steps.get(1)?.isActive).toBe(true);
    });
  });
});