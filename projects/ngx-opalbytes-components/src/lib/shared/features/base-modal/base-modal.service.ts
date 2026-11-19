import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal, ComponentType } from "@angular/cdk/portal";
import { ComponentRef, Injectable, inject } from "@angular/core";

import { Subscription } from "rxjs";

import { CaoBaseModalComponent } from "./base-modal";
import { ICaoModalOptions, ICaoModalRef } from "./base-modal.interface";

interface IModalStackEntry {
  id: string;
  overlayRef: OverlayRef;
  componentRef: ComponentRef<CaoBaseModalComponent<any, any>>;
  subscriptions: Subscription;
  historyPushed: boolean;
  pendingResult?: unknown;
  closingViaHistory: boolean;
  finalized: boolean;
}

@Injectable({ providedIn: "root" })
export class CaoModalService {
  private readonly overlay = inject(Overlay);
  private readonly stack: IModalStackEntry[] = [];
  private idSeq = 0;
  private readonly onPopState = () => this.handlePopState();

  open<TComponent, TResult = unknown>(
    component: ComponentType<TComponent>,
    options: ICaoModalOptions = {}
  ): ICaoModalRef<TResult> {
    if (options.closeOthers) {
      this.closeAllImmediate();
    }

    const id = `cao-modal-${++this.idSeq}`;
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const componentRef = overlayRef.attach(
      new ComponentPortal(component)
    ) as ComponentRef<CaoBaseModalComponent<any, any>>;

    for (const [key, value] of Object.entries(options.inputs ?? {})) {
      componentRef.setInput(key, value);
    }
    if (options.data !== undefined) {
      componentRef.setInput("data", options.data);
    }
    if (options.closeOnOverlayClick !== undefined) {
      componentRef.setInput("closeOnOverlayClick", options.closeOnOverlayClick);
    }

    const entry: IModalStackEntry = {
      id,
      overlayRef,
      componentRef,
      subscriptions: new Subscription(),
      historyPushed: false,
      closingViaHistory: false,
      finalized: false,
    };

    if (!history.state?.caoModal) {
      history.pushState({ caoModal: id }, "");
      entry.historyPushed = true;
      if (this.stack.length === 0) {
        window.addEventListener("popstate", this.onPopState);
      }
    }

    this.stack.push(entry);
    this.updateTopState();

    entry.subscriptions.add(
      componentRef.instance.closeRequest.subscribe((result: unknown) => {
        this.handleCloseRequest(entry, result);
      })
    );

    overlayRef.detachments().subscribe(() => {
      if (!entry.finalized) {
        this.finalize(entry, entry.pendingResult);
      }
    });

    componentRef.changeDetectorRef.detectChanges();
    componentRef.instance.emitOpened();

    return {
      id,
      close: (result?: TResult) => this.requestClose(entry, result),
    };
  }

  close<TResult = unknown>(result?: TResult): void {
    const entry = this.stack[this.stack.length - 1];
    if (entry) {
      this.requestClose(entry, result);
    }
  }

  closeAll<TResult = unknown>(result?: TResult): void {
    const entries = [...this.stack].reverse();
    for (const entry of entries) {
      this.requestClose(entry, result);
    }
  }

  private requestClose(entry: IModalStackEntry, result?: unknown): void {
    if (entry.finalized) {
      return;
    }
    entry.pendingResult = result;
    entry.componentRef.instance.requestClose(result);
  }

  private handleCloseRequest(entry: IModalStackEntry, result?: unknown): void {
    if (entry.finalized) {
      return;
    }
    entry.pendingResult = result;
    const isTop = this.stack[this.stack.length - 1] === entry;
    if (isTop && entry.historyPushed && history.state?.caoModal === entry.id) {
      entry.closingViaHistory = true;
      history.back();
      return;
    }
    this.finalize(entry, result);
  }

  private handlePopState(): void {
    const entry = this.stack[this.stack.length - 1];
    if (!entry) {
      window.removeEventListener("popstate", this.onPopState);
      return;
    }
    if (entry.historyPushed) {
      this.finalize(entry, entry.pendingResult);
    }
  }

  private finalize(entry: IModalStackEntry, result?: unknown): void {
    if (entry.finalized) {
      return;
    }
    entry.finalized = true;
    entry.subscriptions.unsubscribe();
    try {
      entry.componentRef.instance.emitClosed(result);
    } catch {
      // ignore if instance unavailable
    }
    entry.overlayRef.dispose();
    const idx = this.stack.indexOf(entry);
    if (idx >= 0) {
      this.stack.splice(idx, 1);
    }
    this.updateTopState();
    if (this.stack.length === 0) {
      window.removeEventListener("popstate", this.onPopState);
    }
  }

  private closeAllImmediate(): void {
    const entries = [...this.stack].reverse();
    for (const entry of entries) {
      if (!entry.finalized) {
        entry.finalized = true;
        entry.subscriptions.unsubscribe();
        try {
          entry.componentRef.instance.emitClosed(entry.pendingResult);
        } catch {
          // ignore
        }
        entry.overlayRef.dispose();
      }
    }
    this.stack.length = 0;
    window.removeEventListener("popstate", this.onPopState);
  }

  private updateTopState(): void {
    this.stack.forEach((entry, index) => {
      entry.componentRef.instance.isTop = index === this.stack.length - 1;
    });
  }
}
