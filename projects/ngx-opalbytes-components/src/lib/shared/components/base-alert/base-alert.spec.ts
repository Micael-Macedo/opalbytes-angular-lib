import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertType, BaseAlert } from './base-alert';

describe('BaseAlert', () => {
  let component: BaseAlert;
  let fixture: ComponentFixture<BaseAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

    it("deve retornar corretamente todos os icones", () => {
    const types: AlertType[] = ["success", "error", "info", "warning"];
    const expectedPaths: Record<AlertType, string> = {
      success: "assets/images/svg/success-alert-icon.svg",
      error: "assets/images/svg/error-alert-icon.svg",
      info: "assets/images/svg/info-alert-icon.svg",
      warning: "assets/images/svg/warning-alert-icon.svg",
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
