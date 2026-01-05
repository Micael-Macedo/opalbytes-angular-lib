import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[caoCepMask]',
  standalone: true,
})
export class CepMaskDirective {
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
    const maskedValue = this.applyCepMask(numbers);

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

  private applyCepMask(value: string): string {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 0) {
      return '';
    }

    const cepNumbers = numbers.slice(0, 8);

    if (cepNumbers.length <= 5) {
      return cepNumbers;
    } else {
      return `${cepNumbers.slice(0, 5)}-${cepNumbers.slice(5)}`;
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const numbers = value.replace(/\D/g, '');
    const maskedValue = this.applyCepMask(numbers);

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
