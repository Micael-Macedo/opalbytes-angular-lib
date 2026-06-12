import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BaseButtonComponent } from "./base-button.component";

describe("BaseButtonComponent", () => {
  let component: BaseButtonComponent;
  let fixture: ComponentFixture<BaseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deveria criar", () => {
    expect(component).toBeTruthy();
  });

  it("deve emitir o evento buttonClick quando clicado", () => {
    spyOn(component.buttonClick, "emit");
    component.onClick();
    expect(component.buttonClick.emit).toHaveBeenCalledWith();
  });

  it("não deve emitir o evento buttonClick quando desabilitado", () => {
    component.isDisabled = true;
    spyOn(component.buttonClick, "emit");
    component.onClick();
    expect(component.buttonClick.emit).not.toHaveBeenCalled();
  });

  it("não deve emitir o evento buttonClick ao carregar", () => {
    component.isLoading = true;
    spyOn(component.buttonClick, "emit");
    component.onClick();
    expect(component.buttonClick.emit).not.toHaveBeenCalled();
  });

  it("deve aplicar a classe de modo escuro quando isDarkMode for verdadeiro", () => {
    component.isDarkMode = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    expect(button.classList.contains("dark-mode")).toBeTruthy();
  });

  it("deve aplicar a classe desabilitada quando isDisabled for verdadeiro", () => {
    component.isDisabled = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    expect(button.classList.contains("disabled")).toBeTruthy();
  });

  it("deve aplicar a classe de carregamento quando isLoading for verdadeiro", () => {
    component.isLoading = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    expect(button.classList.contains("loading")).toBeTruthy();
  });
});
