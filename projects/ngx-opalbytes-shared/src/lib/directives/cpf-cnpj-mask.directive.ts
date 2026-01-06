import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[caoCpfCnpjMask]',
  standalone: true,
})
export class CpfCnpjMaskDirective {
  private element: HTMLInputElement;
  private isUpdating = false;
  private readonly CPF_LENGTH = 11;
  private readonly CNPJ_LENGTH = 14;

  constructor(
    private el: ElementRef,
    @Optional() @Self() private ngControl?: NgControl,
  ) {
    this.element = this.el.nativeElement;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    if (this.isUpdating) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const value = target.value;
    const numbers = value.replace(/\D/g, '');

    // Determinar qual máscara aplicar baseado no tamanho
    let maskedValue: string;
    if (numbers.length <= this.CPF_LENGTH) {
      maskedValue = this.applyCpfMask(numbers);
    } else {
      maskedValue = this.applyCnpjMask(numbers);
    }

    if (maskedValue !== value) {
      this.isUpdating = true;
      target.value = maskedValue;
      this.isUpdating = false;
    }

    // Atualizar o ngModel com apenas os números (sem formatação)
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(numbers, { emitEvent: false });
    }

    // Restaurar o valor visual após o ngModel processar
    setTimeout(() => {
      if (target.value === numbers) {
        target.value = maskedValue;
      }
    }, 0);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Control',
      'Meta',
      'Alt',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  private applyCpfMask(value: string): string {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 0) {
      return '';
    }

    const cpfNumbers = numbers.slice(0, this.CPF_LENGTH);

    if (cpfNumbers.length <= 3) {
      return cpfNumbers;
    } else if (cpfNumbers.length <= 6) {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3)}`;
    } else if (cpfNumbers.length <= 9) {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6)}`;
    } else {
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
    }
  }

  private applyCnpjMask(value: string): string {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 0) {
      return '';
    }

    const cnpjNumbers = numbers.slice(0, this.CNPJ_LENGTH);

    if (cnpjNumbers.length <= 2) {
      return cnpjNumbers;
    } else if (cnpjNumbers.length <= 5) {
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2)}`;
    } else if (cnpjNumbers.length <= 8) {
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2, 5)}.${cnpjNumbers.slice(5)}`;
    } else if (cnpjNumbers.length <= 12) {
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2, 5)}.${cnpjNumbers.slice(5, 8)}/${cnpjNumbers.slice(8)}`;
    } else {
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2, 5)}.${cnpjNumbers.slice(5, 8)}/${cnpjNumbers.slice(8, 12)}-${cnpjNumbers.slice(12, 14)}`;
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const numbers = value.replace(/\D/g, '');

    let maskedValue: string;
    if (numbers.length <= this.CPF_LENGTH) {
      maskedValue = this.applyCpfMask(numbers);
    } else {
      maskedValue = this.applyCnpjMask(numbers);
    }

    if (maskedValue !== value) {
      this.isUpdating = true;
      target.value = maskedValue;
      this.isUpdating = false;
    }

    if (this.ngControl && this.ngControl.control && numbers !== this.ngControl.control.value) {
      this.ngControl.control.setValue(numbers, { emitEvent: true });
    }
  }
}
