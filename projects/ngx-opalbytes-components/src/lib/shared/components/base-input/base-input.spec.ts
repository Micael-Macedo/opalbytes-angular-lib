import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BaseInput } from "./base-input";
import { EventEmitter } from '@angular/core';

describe("BaseInputComponent", () => {
  let component: BaseInput;
  let fixture: ComponentFixture<BaseInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, BaseInput],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve ser criado", () => {
    expect(component).toBeTruthy();
  });

  it("deve ter type e placeholder padrão definidos como 'text' e ''", () => {
    expect(component.type).toBe("text");
    expect(component.placeholder).toBe("");
  });

  it("deve aplicar o placeholder corretamente", () => {
    component.placeholder = "Digite aqui";
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input");
    expect(input.placeholder).toBe("Digite aqui");
  });

  it("deve aplicar o tipo de input corretamente", () => {
    component.type = "password";
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input");
    expect(input.type).toBe("password");
  });

  it("deve aplicar o maxlength corretamente", () => {
    component.maxLength = 5;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input");
    expect(input.getAttribute("maxlength")).toBe("5");
  });

  it("deve escrever o valor corretamente", () => {
    component.writeValue("valor inicial");
    expect(component.value).toBe("valor inicial");
  });

  it("deve lidar com valores nulos ou indefinidos no writeValue", () => {
    component.writeValue(null);
    expect(component.value).toBe("");
    component.writeValue(undefined);
    expect(component.value).toBe("");
  });

  it("deve registrar função onChange corretamente", () => {
    const mockFn = vi.fn();
    component.registerOnChange(mockFn);
    component.onChange("teste");
    expect(mockFn).toHaveBeenCalledWith("teste");
  });

  it("deve registrar função onTouched corretamente", () => {
    const mockFn = vi.fn();
    component.registerOnTouched(mockFn);
    component.onTouched();
    expect(mockFn).toHaveBeenCalledWith();
  });

  it("deve desabilitar o input quando setDisabledState(true) é chamado", () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component.isDisabled).toBeTruthy();
  });

  it("deve atualizar o valor quando o input é alterado", () => {
    const input = fixture.nativeElement.querySelector("input");
    input.value = "novo valor";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.value).toBe("novo valor");
  });

  it("deve emitir o evento valueChange quando o valor é alterado", () => {
    const emitSpy = vi.spyOn(component.valueChange as EventEmitter<string>, 'emit');
    const input = fixture.nativeElement.querySelector("input");
    input.value = "valor teste";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalledWith("valor teste");
  });

  it("deve emitir evento searchClick ao chamar onSearchClick", () => {
    const emitSpy = vi.spyOn(component.searchClick as EventEmitter<void>, 'emit');
    component.onSearchClick();
    expect(emitSpy).toHaveBeenCalledWith();
  });

  it("deve chamar onTouched quando o input perde o foco", () => {
    const mockTouchedFn = vi.fn();
    component.registerOnTouched(mockTouchedFn);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector("input");
    input.dispatchEvent(new Event("blur"));

    expect(mockTouchedFn).toHaveBeenCalledWith();
  });

  it("deve ativar isFocused ao focar", () => {
    const input = fixture.nativeElement.querySelector("input");
    input.dispatchEvent(new Event("focus"));
    expect(component.isFocused).toBeTruthy();
  });

  it("deve desativar isFocused ao desfocar", () => {
    const input = fixture.nativeElement.querySelector("input");
    input.dispatchEvent(new Event("focus"));
    input.dispatchEvent(new Event("blur"));
    expect(component.isFocused).toBeFalsy();
  });

  it("deve retornar o valor de controlName via controlNameValue", () => {
    component.controlName = "cpf";
    expect(component.controlNameValue).toBe("cpf");
  });

  it("deve aplicar ícone do material se isLucideIcon for true", () => {
    component.isLucideIcon = true;
    component.leadingIcon = "home";
    expect(component._leadingIcon).toBe("home");
  });

  it("deve aplicar leadingIcon como caminho de imagem se não for Material", () => {
    component.isLucideIcon = false;
    component.leadingIcon = "calendar";
    expect(component._leadingIcon).toContain("calendar.svg");
  });

  it("deve aplicar trailingIcon corretamente se não for Material", () => {
    component.isLucideIcon = false;
    component.trailingIcon = "search";
    expect(component._trailingIcon).toContain("search-icon.svg");
  });

  it("deve manter a máscara definida corretamente", () => {
    component.mask = "000.000.000-00";
    fixture.detectChanges();
    expect(component.mask).toBe("000.000.000-00");
  });
});