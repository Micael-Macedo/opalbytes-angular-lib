import { Directive, HostBinding } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Directive({
  selector: '[appControlState]',
  standalone: true,
})
export class FormControlStateDirective {
  constructor(private ngControl: NgControl) {}

  @HostBinding('attr.aria-invalid') get ariaInvalid(): string | null {
    const c = this.ngControl.control as any;
    if (!c) return null;
    return (!!c.invalid && (!!c.touched || !!c.dirty)).toString();
  }

  @HostBinding('class.border-destructive') get hasErrorBorder(): boolean {
    const c = this.ngControl.control as any;
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  @HostBinding('attr.aria-required') get ariaRequired(): string | null {
    const c = this.ngControl.control as any;
    if (!c) return null;
    const hasValidator =
      typeof c.hasValidator === 'function' ? c.hasValidator(Validators.required) : false;
    return hasValidator ? 'true' : null;
  }
}
