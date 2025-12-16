import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { BaseDialog, IDialogConfig } from './base-dialog';

describe('BaseDialog', () => {
  let component: BaseDialog;
  let fixture: ComponentFixture<BaseDialog>;
  let mockConfig: IDialogConfig;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseDialog);
    component = fixture.componentInstance;

    mockConfig = {
      title: "Test Title",
      message: "Test Message",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      type: "success",
      onConfirm: vi.fn(),
      onCancel: vi.fn(),
    };

    component.config = mockConfig;

    await fixture.whenStable();
  });

  it("deve criar o componente corretamente", () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar o ícone correto para "success"', () => {
    component.config.type = "success";
    expect(component.getIconPath()).toBe("assets/images/svg/success-alert-icon.svg");
  });

  it('deve retornar o ícone correto para "error"', () => {
    component.config.type = "error";
    expect(component.getIconPath()).toBe("assets/images/svg/error-alert-icon.svg");
  });

  it('deve retornar o ícone correto para "info"', () => {
    component.config.type = "info";
    expect(component.getIconPath()).toBe("assets/images/svg/info-alert-icon.svg");
  });

  it('deve retornar o ícone correto para "warning"', () => {
    component.config.type = "warning";
    expect(component.getIconPath()).toBe("assets/images/svg/warning-alert-icon.svg");
  });

  it("deve chamar onConfirm e closeDialog ao confirmar", () => {
    const closeSpy = vi.fn();
    component.closeDialog = closeSpy;

    component.handleConfirm();

    expect(mockConfig.onConfirm).toHaveBeenCalledWith();
    expect(closeSpy).toHaveBeenCalledWith();
  });

  it("deve chamar onCancel e closeDialog ao cancelar", () => {
    const closeSpy = vi.fn();
    component.closeDialog = closeSpy;

    component.handleCancel();

    expect(mockConfig.onCancel).toHaveBeenCalledWith();
    expect(closeSpy).toHaveBeenCalledWith();
  });

  it("deve executar handleConfirm mesmo com função vazia", () => {
    component.config = {
      ...mockConfig,
      onConfirm: vi.fn(),
    };
    const closeSpy = vi.fn();
    component.closeDialog = closeSpy;

    component.handleConfirm();

    expect(closeSpy).toHaveBeenCalledWith();
  });

  it("deve executar handleCancel mesmo com função vazia", () => {
    component.config = {
      ...mockConfig,
      onCancel: vi.fn(),
    };
    const closeSpy = vi.fn();
    component.closeDialog = closeSpy;

    component.handleCancel();

    expect(closeSpy).toHaveBeenCalledWith();
  });

  it("deve chamar a função padrão closeDialog sem lançar erro", () => {
    expect(() => component.closeDialog()).not.toThrow();
  });
});