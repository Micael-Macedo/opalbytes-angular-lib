import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";

import { BaseDialog } from "./base-dialog";
import { IDialogConfig } from "./base-dialog.interface";

@Injectable({
  providedIn: "root",
})
export class BaseDialogService {
  constructor(private overlay: Overlay) { }

  open(config: IDialogConfig): OverlayRef {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      backdropClass: "dialog-backdrop",
    });

    const dialogPortal = new ComponentPortal(this.generateComponentPortal());
    const componentRef = overlayRef.attach(dialogPortal);

    componentRef.instance.config = config;

    componentRef.instance.closeDialog = () => {
      overlayRef.dispose();
    };

    return overlayRef;
  }

  generateComponentPortal(): typeof BaseDialog{
    return BaseDialog;
  }
}
