import { Component, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { CaoRadioButtonComponent } from "./radio-button.component";
import { CaoRadioGroupComponent } from "./radio-group.component";

@Component({
  standalone: true,
  imports: [FormsModule, CaoRadioGroupComponent, CaoRadioButtonComponent],
  template: `
    <cao-radio-group
      [(ngModel)]="value"
      [isDisabled]="isDisabled"
      ariaLabel="Opções">
      <cao-radio-button value="option-1" label="Opção 1" />
      <cao-radio-button value="option-2" label="Opção 2" />
      <cao-radio-button
        value="option-3"
        label="Opção 3"
        [isDisabled]="isOptionDisabled" />
    </cao-radio-group>
  `,
})
class RadioHostComponent {
  @Input() value = "option-1";
  @Input() isDisabled = false;
  @Input() isOptionDisabled = false;
}

describe("CaoRadioGroupComponent", () => {
  let fixture: ComponentFixture<RadioHostComponent>;
  let host: RadioHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.changeDetectorRef.detectChanges();
  });

  function getInputs(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll("input"));
  }

  function select(input: HTMLInputElement): void {
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    fixture.detectChanges();
  }

  it("should create the group and radio buttons", () => {
    expect(fixture.nativeElement.querySelector("cao-radio-group")).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll("cao-radio-button").length).toBe(3);
  });

  it("should reflect the initial value", () => {
    const inputs = getInputs();

    expect(inputs[0].checked).toBe(true);
    expect(inputs[1].checked).toBe(false);
  });

  it("should select an option and emit the value", () => {
    const group = fixture.debugElement.query(
      (element) => element.componentInstance instanceof CaoRadioGroupComponent,
    ).componentInstance as CaoRadioGroupComponent;
    const valueChange = vi.fn();
    const selectionChange = vi.fn();

    group.valueChange.subscribe(valueChange);
    group.selectionChange.subscribe(selectionChange);

    select(getInputs()[1]);

    expect(host.value).toBe("option-2");
    expect(valueChange).toHaveBeenCalledWith("option-2");
    expect(selectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "option-2" }),
    );
  });

  it("should disable every option when the group is disabled", () => {
    fixture.componentRef.setInput("isDisabled", true);
    fixture.detectChanges();

    const inputs = getInputs();
    expect(inputs.every((input) => input.disabled)).toBe(true);

    select(inputs[1]);
    expect(host.value).toBe("option-1");
  });

  it("should not select an individually disabled option", () => {
    fixture.componentRef.setInput("isOptionDisabled", true);
    fixture.detectChanges();

    const inputs = getInputs();
    expect(inputs[2].disabled).toBe(true);

    select(inputs[2]);
    expect(host.value).toBe("option-1");
  });

  it("should expose radiogroup accessibility attributes", () => {
    const group: HTMLElement =
      fixture.nativeElement.querySelector("cao-radio-group");

    expect(group.getAttribute("role")).toBe("radiogroup");
    expect(group.getAttribute("aria-label")).toBe("Opções");
  });

  it("should support ControlValueAccessor on the group", () => {
    const group = fixture.debugElement.query(
      (element) => element.componentInstance instanceof CaoRadioGroupComponent,
    ).componentInstance as CaoRadioGroupComponent;

    group.writeValue("option-2");
    fixture.detectChanges();

    expect(getInputs()[1].checked).toBe(true);
  });
});
