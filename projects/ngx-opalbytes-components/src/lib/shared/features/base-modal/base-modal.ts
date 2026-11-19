import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostListener, input, output, signal } from "@angular/core";

import { CaoModalPanelClass, CaoModalSize } from "./base-modal.interface";

@Component({
  selector: "cao-base-modal",
  imports: [CommonModule],
  templateUrl: "./base-modal.html",
  styleUrl: "./base-modal.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoBaseModalComponent<TData = unknown, TResult = unknown> {
  private static readonly CLOSE_ANIMATION_MS = 250;

  readonly title = input("");
  readonly data = input<TData | undefined>(undefined);
  readonly modalSize = input<CaoModalSize>("w-70");
  readonly modalClass = input("");
  readonly panelClass = input<CaoModalPanelClass>("default");
  readonly closeOnOverlayClick = input(false);

  readonly opened = output<void>();
  readonly closed = output<TResult | undefined>();
  readonly closeRequest = output<TResult | undefined>();

  readonly closing = signal(false);

  private mouseDownOnBackdrop = false;
  private closeStarted = false;
  private closeRequestEmitted = false;
  private pendingResult: TResult | undefined;
  isTop = false;

  requestClose(result?: TResult): void {
    this.startClose(result);
  }

  emitOpened(): void {
    this.opened.emit();
  }

  emitClosed(result?: TResult): void {
    this.closed.emit(result);
  }

  onBackdropMouseDown(event: MouseEvent): void {
    this.mouseDownOnBackdrop = event.target === event.currentTarget;
  }

  onBackdropMouseUp(event: MouseEvent): void {
    const shouldClose =
      this.mouseDownOnBackdrop &&
      event.target === event.currentTarget &&
      this.closeOnOverlayClick();
    this.mouseDownOnBackdrop = false;
    if (shouldClose) {
      this.requestClose();
    }
  }

  onAnimationEnd(event: AnimationEvent): void {
    if (!this.closing() || event.target !== event.currentTarget) {
      return;
    }
    this.emitCloseRequest();
  }

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    if (this.isTop) {
      this.requestClose();
    }
  }

  private startClose(result?: TResult): void {
    if (this.closeStarted) {
      return;
    }
    this.closeStarted = true;
    this.pendingResult = result;
    this.closing.set(true);
    setTimeout(() => this.emitCloseRequest(), CaoBaseModalComponent.CLOSE_ANIMATION_MS);
  }

  private emitCloseRequest(): void {
    if (this.closeRequestEmitted) {
      return;
    }
    this.closeRequestEmitted = true;
    this.closeRequest.emit(this.pendingResult);
  }
}
