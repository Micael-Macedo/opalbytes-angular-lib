import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
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
    const maskedValue = this.applyCpfMask(numbers);

    if (maskedValue !== value) {
      this.isUpdating = true;
      target.value = maskedValue;
      this.isUpdating = false;
    }

    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(numbers, { emitEvent: false });
    }

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

    const cpfNumbers = numbers.slice(0, 11);

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

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const numbers = value.replace(/\D/g, '');
    const maskedValue = this.applyCpfMask(numbers);

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
