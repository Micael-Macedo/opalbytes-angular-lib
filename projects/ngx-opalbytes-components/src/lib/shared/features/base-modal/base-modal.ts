import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { ModalTypeClass, ModalTypeSize } from './base-modal.interface';
import { BaseModalService } from './base-modal.service';

@Component({
  selector: 'cao-base-modal',
  imports: [CommonModule],
  templateUrl: './base-modal.html',
  styleUrl: './base-modal.css',
})
export class BaseModal<T> {
  @Input() showModal = false;
  @Input() title = "";
  @Input() data!: T;
  @Input() modalTypeClass: ModalTypeClass = "default";
  @Input() modalClass = "modal-default";
  @Input() modalSize: ModalTypeSize = "w-70";
  @Input() closeOnOverlayClick = false;

  protected modalService = inject(BaseModalService);

  closeModals() { }

  closeModalsWithoutDialog() {
    this.modalService.closeAllModals();
  }

  onOverlayClick() {
    if (this.closeOnOverlayClick) {
      this.closeModals();
    }
  }
}
