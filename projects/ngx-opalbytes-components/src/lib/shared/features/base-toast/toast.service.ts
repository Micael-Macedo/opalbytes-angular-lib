import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";

import { CaoBaseToast } from "./base-toast";
import { IToastConfig } from "./base-toast.interface";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(private overlay: Overlay) {}

  protected defaultDuration = 4000;

  private overlayRefs: OverlayRef[] = [];

  private show(config: IToastConfig): void {
    const mergedConfig: IToastConfig = {
      ...config,
      duration: config.duration ?? this.defaultDuration,
    };

    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      panelClass: "cao-toast-panel",
      positionStrategy:
        mergedConfig.positionStrategy ??
        this.overlay
          .position()
          .global()
          .top("20px")
          .end("20px"),
      scrollStrategy: mergedConfig.scrollStrategy ?? this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRefs.push(overlayRef);
    overlayRef.detachments().subscribe(() => {
      const index = this.overlayRefs.indexOf(overlayRef);
      if (index !== -1) {
        this.overlayRefs.splice(index, 1);
      }
    });

    const toastPortal = new ComponentPortal(this.generateComponentPortal());
    const componentRef = overlayRef.attach(toastPortal);
    componentRef.instance.data = mergedConfig;
    componentRef.instance.closeToast = () => {
      overlayRef.dispose();
    };

    setTimeout(() => {
      overlayRef.dispose();
    }, mergedConfig.duration);
  }

  success(message: string, config?: Partial<IToastConfig>) {
    this.show({ type: "success", message, ...config });
  }

  error(message: string, config?: Partial<IToastConfig>) {
    this.show({ type: "error", message, ...config });
  }

  info(message: string, config?: Partial<IToastConfig>) {
    this.show({ type: "info", message, ...config });
  }

  warning(message: string, config?: Partial<IToastConfig>) {
    this.show({ type: "warning", message, ...config });
  }

  custom(config: IToastConfig) {
    this.show(config);
  }

  dismissAll() {
    const refs = [...this.overlayRefs];
    this.overlayRefs = [];
    refs.forEach((overlayRef) => overlayRef.dispose());
  }

  generateComponentPortal(): typeof CaoBaseToast {
    return CaoBaseToast;
  }
}