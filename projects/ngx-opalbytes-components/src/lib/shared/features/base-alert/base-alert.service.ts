import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";

import { BaseAlert } from "./base-alert";
import { IAlertConfig } from "./base-alert.interface";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  constructor(private overlay: Overlay) { }
  protected defaultTime = 3000

  show(config: IAlertConfig): void {
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global().centerHorizontally().top("10%"),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const alertPortal = new ComponentPortal(this.generateComponentPortal());
    const componentRef = overlayRef.attach(alertPortal);
    componentRef.instance.data = config;

    setTimeout(() => {
      overlayRef.dispose();
    }, this.defaultTime);
  }

  generateComponentPortal(): typeof BaseAlert{
    return BaseAlert;
  }
}
