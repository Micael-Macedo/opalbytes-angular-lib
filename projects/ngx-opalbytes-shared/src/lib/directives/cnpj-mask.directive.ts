import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[caoCnpjMask]',
  standalone: true,
})
export class CnpjMaskDirective {
  private element: HTMLInputElement;
  private isUpdating = false;

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
    const maskedValue = this.applyCnpjMask(numbers);

    // Atualizar o valor visual do input com a máscara
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
    // Permitir teclas de navegação e controle
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

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Permitir apenas números
    if (!/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  private applyCnpjMask(value: string): string {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 0) {
      return '';
    }

    // Limitar a 14 dígitos (tamanho máximo do CNPJ)
    const cnpjNumbers = numbers.slice(0, 14);

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
    // Reaplicar máscara ao sair do campo
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const numbers = value.replace(/\D/g, '');
    const maskedValue = this.applyCnpjMask(numbers);

    if (maskedValue !== value) {
      this.isUpdating = true;
      target.value = maskedValue;
      this.isUpdating = false;
    }

    // Garantir que o ngModel tenha apenas números (sem formatação)
    if (this.ngControl && this.ngControl.control && numbers !== this.ngControl.control.value) {
      this.ngControl.control.setValue(numbers, { emitEvent: true });
    }
  }
}
