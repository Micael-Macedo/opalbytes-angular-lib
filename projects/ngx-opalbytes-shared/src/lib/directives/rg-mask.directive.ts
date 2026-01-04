import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRgMask]',
  standalone: true,
})
export class RgMaskDirective {
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
    const maskedValue = this.applyRgMask(numbers);

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

  private applyRgMask(value: string): string {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 0) {
      return '';
    }

    const rgNumbers = numbers.slice(0, 10);

    if (rgNumbers.length <= 2) {
      return rgNumbers;
    } else if (rgNumbers.length <= 5) {
      return `${rgNumbers.slice(0, 2)}.${rgNumbers.slice(2)}`;
    } else if (rgNumbers.length <= 8) {
      return `${rgNumbers.slice(0, 2)}.${rgNumbers.slice(2, 5)}.${rgNumbers.slice(5)}`;
    } else if (rgNumbers.length === 9) {
      return `${rgNumbers.slice(0, 2)}.${rgNumbers.slice(2, 5)}.${rgNumbers.slice(5, 8)}-${rgNumbers.slice(8, 9)}`;
    } else {
      return `${rgNumbers.slice(0, 2)}.${rgNumbers.slice(2, 5)}.${rgNumbers.slice(5, 8)}-${rgNumbers.slice(8, 10)}`;
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const numbers = value.replace(/\D/g, '');
    const maskedValue = this.applyRgMask(numbers);

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
