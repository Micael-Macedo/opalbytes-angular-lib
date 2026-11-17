import { Overlay, PositionStrategy } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { inject, Injectable } from "@angular/core";

import { BaseAlert } from "./base-alert";
import { CaoAlertType, ICaoAlertConfig, ICaoAlertDTO } from "./base-alert.interface";

@Injectable({
  providedIn: "root",
})
export abstract class BaseAlertService {
  private readonly overlay = inject(Overlay);
  protected defaultTime = 3000

  protected abstract defaultPosition: PositionStrategy 

  protected show(config: ICaoAlertConfig, durationTime: number): void {
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.defaultPosition,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const alertPortal = new ComponentPortal(this.generateComponentPortal());
    const componentRef = overlayRef.attach(alertPortal);
    componentRef.instance.data = config;

    setTimeout(() => {
      overlayRef.dispose();
    }, durationTime);
  }

  info(dataAlert: ICaoAlertDTO, duration = this.defaultTime): void {
    const alertConfig = this.generateAlertConfig(dataAlert, "info")
    this.show(alertConfig, duration);
  }
  success(dataAlert: ICaoAlertDTO, duration = this.defaultTime): void {
    const alertConfig = this.generateAlertConfig(dataAlert, "success")
    this.show(alertConfig, duration);
  }

  error(dataAlert: ICaoAlertDTO, duration = this.defaultTime): void {
    const alertConfig = this.generateAlertConfig(dataAlert, "error")
    this.show(alertConfig, duration);
  }

  warning(dataAlert: ICaoAlertDTO, duration = this.defaultTime): void {
    const alertConfig = this.generateAlertConfig(dataAlert, "warning")
    this.show(alertConfig, duration);
  }

  protected generateAlertConfig(data: ICaoAlertDTO, type: CaoAlertType): ICaoAlertConfig{
    const alertConfig: ICaoAlertConfig = {
      message: data.message,
      type: type,
      title: data.title,
    }
    return alertConfig
  }

  generateComponentPortal(): typeof BaseAlert{
    return BaseAlert;
  }
}
