import { Component, DestroyRef, HostListener, inject, input, output, signal } from "@angular/core";

import { CaoWidgetService } from './widget.service';


@Component({
  selector: "cao-base-widget",
  imports: [],
  templateUrl: "./base-widget.html",
  styleUrl: "./base-widget.css",
})
export class CaoBaseWidgetComponent<TData = unknown> {
  private static readonly CLOSE_ANIMATION_MS = 250;

  title = input("Titulo")
  subtitle = input("")
  widgetIcon = input("")

  cancelTextButton = input("Cancelar")
  saveTextButton = input("Gerar")
  displayActionButton = input(true)
  displaySaveButton = input(true)
  displayCancelButton = input(true)
  shouldCloseWhenCancel = input(true)
  typeCancel = input<"cancel" | "back">("cancel")
  saveDisabled = input(false)
  saveIcon = input("arrow-right")
  saveIconPosition = input<"leading" | "trailing">("trailing")
  closeOnClickOutside = input(true)
  confirmOnClose = input(false)
  widgetData = input<TData | undefined>(undefined)

  readonly save = output<void>()
  readonly deleted = output<void>()
  readonly cancelEvent = output<void>()
  readonly closeRequest = output<void>()

  readonly closing = signal(false)
  private mouseDownOnBackdrop = false;
  private closeStarted = false;
  private closeEmitted = false;
  private closeConfirmationOpen = false;

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly widgetService = inject(CaoWidgetService)

  closeWidget(): void {
    if (this.closeStarted) {return;}
      
    this.startClose();
  }

  saveWidget(): void {
    this.save.emit();
  }

  cancelWidget(): void {
    this.cancelEvent.emit();
  }

  deletedWidget(): void {
    this.deleted.emit();
  }

  onAnimationEnd(event: AnimationEvent): void {
    if (!this.closing() || event.target !== event.currentTarget) {return;}
    this.emitCloseRequest();
  }


  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.closeConfirmationOpen) {
      this.closeConfirmationOpen = false;
      return;
    }
    this.closeWidget();
  }


  protected forwardCloseRequest(): void {
    this.closeRequest.emit();
  }

  onBackdropMouseDown(event: MouseEvent): void {
    this.mouseDownOnBackdrop = event.target === event.currentTarget;
  }

  onBackdropMouseUp(event: MouseEvent): void {
    const closeRequested =
      this.mouseDownOnBackdrop &&
      event.target === event.currentTarget &&
      this.closeOnClickOutside();
    this.mouseDownOnBackdrop = false;

    if (closeRequested) {
      this.closeWidget();
    }
  }

  private startClose(): void {
    if (this.closeStarted) {return;}
    this.closeStarted = true;
    this.closing.set(true);
    setTimeout(() => this.emitCloseRequest(), CaoBaseWidgetComponent.CLOSE_ANIMATION_MS);
  }


  private emitCloseRequest(): void {
    if (this.closeEmitted) {return;}
    this.closeEmitted = true;
    this.closeRequest.emit();
  }
}