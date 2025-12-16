import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { AlertType, BaseAlert } from './base-alert';

describe('BaseAlert', () => {
  let component: BaseAlert;
  let fixture: ComponentFixture<BaseAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseAlert]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseAlert);
    component = fixture.componentInstance;
    
    component.data = {
      type: 'info',
      title: 'Test Title',
      message: 'Test Message',
      alertIcon: 'test-icon.svg'
    };
    
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it("deve retornar corretamente todos os icones", () => {
    const types: AlertType[] = ["success", "error", "info", "warning"];
    const expectedPaths: Record<AlertType, string> = {
      success: "https://placehold.co/600x400",
      error: "https://placehold.co/600x400",
      info: "https://placehold.co/600x400",
      warning: "https://placehold.co/600x400",
    };

    types.forEach((type) => {
      expect(component.getIconPath(type)).toBe(expectedPaths[type]);
    });
  });

  it("deve reconhecer cada tipo de classe de titulo corretamente por tipo de alerta", () => {
    const types: AlertType[] = ["success", "error", "info", "warning"];

    types.forEach((type) => {
      expect(component.getTitleClass(type)).toBe(`title-${type}`);
    });
  });
});