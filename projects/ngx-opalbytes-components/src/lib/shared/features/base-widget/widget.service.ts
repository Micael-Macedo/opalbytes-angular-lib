import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal, ComponentType } from "@angular/cdk/portal";
import { Injectable, inject } from "@angular/core";

import { Subscription } from "rxjs";

import { CaoBaseWidgetComponent } from "./base-widget";
import { ICaoWidgetOptions } from "./base-widget.interface";


@Injectable({ providedIn: "root" })
export class CaoWidgetService {
  private readonly overlay = inject(Overlay);
  private overlayRef: ReturnType<Overlay["create"]> | null = null;

  open<TComponent>(component: ComponentType<TComponent>, options: ICaoWidgetOptions = {}): void {
    const substituindoWidget = !!this.overlayRef;
    if (this.overlayRef) {
      this.close();
    }

    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    this.overlayRef = overlayRef;

    const ref = overlayRef.attach(new ComponentPortal<TComponent>(component));
    const instance = ref.instance as CaoBaseWidgetComponent;

    for (const [key, value] of Object.entries(options.inputs ?? {})) {
      (ref.setInput as (inputName: string, value: unknown) => void)(key, value);
    }

    if (options.data !== undefined) {
      (ref.setInput as (inputName: string, value: unknown) => void)("widgetData", options.data);
    }

    const subscriptions = new Subscription();
    let disposed = false;

    if (!(substituindoWidget && history.state?.widget)) {
      history.pushState({ widget: true }, "");
    }

    const onPopState = () => {
      dispose();
      options.onClose?.();
    };
    window.addEventListener("popstate", onPopState);

    const dispose = () => {
      if (disposed) {return;}
      disposed = true;
      window.removeEventListener("popstate", onPopState);
      subscriptions.unsubscribe();
      overlayRef.dispose();
      if (this.overlayRef === overlayRef) {
        this.overlayRef = null;
      }
    };

    subscriptions.add(instance.save.subscribe(() => options.onSave?.()));
    subscriptions.add(instance.deleted.subscribe(() => options.onDelete?.()));
    subscriptions.add(
      instance.closeRequest.subscribe(() => {
        if (history.state?.widget) {
          history.back();
        } else {
          dispose();
        }
        options.onClose?.();
      })
    );

    overlayRef.detachments().subscribe(() => {
      disposed = true;
      window.removeEventListener("popstate", onPopState);
      subscriptions.unsubscribe();
      if (this.overlayRef === overlayRef) {
        this.overlayRef = null;
      }
    });

    ref.changeDetectorRef.detectChanges();
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}