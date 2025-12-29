import { EventEmitter, Injectable, Output } from "@angular/core";

import { Subject, Observable } from "rxjs";

import { IModal, ModalType } from "./base-modal.interface";

@Injectable({
  providedIn: "root",
})
export class BaseModalService {
  constructor() { }
  @Output() readonly toggleModalEvent = new EventEmitter<IModal>();
  @Output() readonly closeAllModalsEvent = new EventEmitter<boolean>();
  @Output() readonly openModal = new EventEmitter<IModal>();

  private modalResultSubject = new Subject<any>();

  emitModalResult(result: any) {
    this.modalResultSubject.next(result);
  }

  onModalResult(): Observable<any> {
    return this.modalResultSubject.asObservable();
  }

  toggleModal(modalInfo: IModal) {
    this.toggleModalEvent.emit(modalInfo);
  }

  closeAllModals() {
    this.closeAllModalsEvent.emit(true);
  }

  showModal(_selectedModal: ModalType, data?: any) {
    this.closeAllModals();
    const modalInfo: IModal = {
      type: _selectedModal,
      data: data,
      status: true,
    };
    this.openModal.emit(modalInfo);
  }
}
