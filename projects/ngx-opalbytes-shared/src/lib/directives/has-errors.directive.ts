import { Directive, HostBinding, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector: '[appHasErrors]',
  standalone: true,
})
export class FormHasErrorsDirective {
  @Input() requireTouched = true;

  constructor(private controlContainer: ControlContainer) {}

  @HostBinding('class.has-errors') get hasErrorsClass(): boolean {
    const groupAny = this.controlContainer.control as any;
    if (!groupAny) return false;
    const isInvalid = !!groupAny.invalid;
    if (!this.requireTouched) return isInvalid;
    const controls: any = groupAny.controls || {};
    const anyTouched = Object.values(controls).some((c: any) => c && (c.touched || c.dirty));
    return isInvalid && anyTouched;
  }

  @HostBinding('attr.aria-invalid') get ariaInvalid(): string | null {
    return this.hasErrorsClass ? 'true' : null;
  }
}
