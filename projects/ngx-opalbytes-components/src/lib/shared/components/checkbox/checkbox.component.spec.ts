import { Component, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormsModule, Validators } from "@angular/forms";
import { LucideCheck, LucideMinus, LucideX, provideLucideIcons } from "@lucide/angular";

import { CaoCheckboxComponent } from "./checkbox.component";

@Component({
  standalone: true,
  imports: [FormsModule, CaoCheckboxComponent],
  template: `
    <cao-checkbox
      [(ngModel)]="checked"
      [isDisabled]="isDisabled"
      label="Aceito os termos"
      name="terms"
      dataCy="checkbox-terms"></cao-checkbox>
  `,
})
class CheckboxHostComponent {
  @Input() checked = false;
  @Input() isDisabled = false;
}

describe("CaoCheckboxComponent", () => {
  let component: CaoCheckboxComponent;
  let fixture: ComponentFixture<CaoCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoCheckboxComponent],
      providers: [provideLucideIcons(LucideCheck, LucideMinus, LucideX)],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector("input");
  }

  function toggleInput(checked = true): void {
    const input = getInput();
    input.checked = checked;
    input.dispatchEvent(new Event("change"));
    fixture.detectChanges();
  }

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle and emit changes", () => {
    const checkedChange = vi.fn();
    const change = vi.fn();

    component.checkedChange.subscribe(checkedChange);
    component.checkboxChange.subscribe(change);

    toggleInput(true);

    expect(component.checked).toBe(true);
    expect(checkedChange).toHaveBeenCalledWith(true);
    expect(change).toHaveBeenCalledWith({
      checked: true,
      source: component,
    });
  });

  it("should not toggle when disabled", () => {
    component.isDisabled = true;
    fixture.detectChanges();

    toggleInput(true);

    expect(component.checked).toBe(false);
    expect(getInput().disabled).toBe(true);
  });

  it("should support ControlValueAccessor", () => {
    const onChange = vi.fn();
    const onTouched = vi.fn();

    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    component.writeValue(true);

    expect(component.checked).toBe(true);

    component.onBlur();
    expect(onTouched).toHaveBeenCalled();

    component.toggle();
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("should write null values as unchecked", () => {
    component.writeValue(null);

    expect(component.checked).toBe(false);
  });

  it("should enable and disable programmatically", () => {
    component.disable();
    expect(component.isDisabled).toBe(true);

    component.enable();
    expect(component.isDisabled).toBe(false);
  });

  it("should disable through setDisabledState", () => {
    component.setDisabledState(true);
    expect(component.isDisabled).toBe(true);

    component.setDisabledState(false);
    expect(component.isDisabled).toBe(false);
  });

  it("should clear indeterminate and check when clicked", () => {
    const indeterminateChange = vi.fn();

    component.indeterminate = true;
    component.indeterminateChange.subscribe(indeterminateChange);
    fixture.detectChanges();

    toggleInput(true);

    expect(component.checked).toBe(true);
    expect(component.indeterminate).toBe(false);
    expect(indeterminateChange).toHaveBeenCalledWith(false);
  });

  it("should set indeterminate programmatically", () => {
    const indeterminateChange = vi.fn();

    component.indeterminateChange.subscribe(indeterminateChange);
    component.setIndeterminate(true);

    expect(component.indeterminate).toBe(true);
    expect(indeterminateChange).toHaveBeenCalledWith(true);
  });

  it("should render the default checked icon", () => {
    fixture.componentRef.setInput("checked", true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(".cao-checkbox__icon--default"),
    ).toBeTruthy();
  });

  it("should render the default indeterminate icon", () => {
    fixture.componentRef.setInput("indeterminate", true);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector(
      ".cao-checkbox__icon--default line",
    );

    expect(icon).toBeTruthy();
  });

  it("should render Lucide icons for every state", () => {
    fixture.componentRef.setInput("checkedIcon", "check");
    fixture.componentRef.setInput("uncheckedIcon", "x");
    fixture.componentRef.setInput("indeterminateIcon", "minus");
    fixture.componentRef.setInput("isLucideIcon", true);

    fixture.componentRef.setInput("checked", true);
    fixture.detectChanges();

    expect(component.checkedIcon).toBe("check");
    expect(
      fixture.nativeElement.querySelector("svg.cao-checkbox__icon"),
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(".cao-checkbox__icon--default"),
    ).toBeNull();

    fixture.componentRef.setInput("checked", false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector("svg.cao-checkbox__icon"),
    ).toBeTruthy();

    fixture.componentRef.setInput("indeterminate", true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector("svg.cao-checkbox__icon"),
    ).toBeTruthy();
  });

  it("should render an image when isLucideIcon is false", () => {
    fixture.componentRef.setInput("checkedIcon", "icon.svg");
    fixture.componentRef.setInput("checked", true);
    fixture.detectChanges();

    const image: HTMLImageElement = fixture.nativeElement.querySelector(
      "img.cao-checkbox__icon",
    );

    expect(image).toBeTruthy();
    expect(image.getAttribute("src")).toBe("icon.svg");
    expect(
      fixture.nativeElement.querySelector("svg.cao-checkbox__icon"),
    ).toBeNull();
  });

  it("should not render an icon when unchecked and no icon is provided", () => {
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(
        ".cao-checkbox__control svg, .cao-checkbox__control img",
      ),
    ).toBeNull();
  });

  it("should render the label and respect labelPosition", () => {
    fixture.componentRef.setInput("label", "Aceito os termos");
    fixture.detectChanges();

    expect(
      fixture.nativeElement
        .querySelector(".cao-checkbox__label")
        .textContent.trim(),
    ).toBe("Aceito os termos");

    fixture.componentRef.setInput("labelPosition", "before");
    fixture.detectChanges();

    expect(
      fixture.nativeElement
        .querySelector(".cao-checkbox")
        .classList.contains("cao-checkbox--label-before"),
    ).toBe(true);
  });

  it("should expose accessibility attributes", () => {
    fixture.componentRef.setInput("ariaLabel", "Aceitar termos");
    fixture.componentRef.setInput("required", true);
    fixture.componentRef.setInput("name", "terms");
    fixture.componentRef.setInput("dataCy", "checkbox-terms");
    fixture.detectChanges();

    const input = getInput();

    expect(input.getAttribute("aria-label")).toBe("Aceitar termos");
    expect(input.required).toBe(true);
    expect(input.getAttribute("name")).toBe("terms");
    expect(input.getAttribute("data-cy")).toBe("checkbox-terms");
  });

  it("should apply validation classes based on the form control", () => {
    const control = new FormControl(false, Validators.requiredTrue);

    fixture.componentRef.setInput("control", control);
    control.markAsTouched();
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector(".cao-checkbox");

    expect(label.classList.contains("cao-checkbox--invalid")).toBe(true);

    control.setValue(true);
    fixture.componentRef.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(label.classList.contains("cao-checkbox--valid")).toBe(true);
  });

  it("should expose custom colors, sizes and icon colors as CSS variables", () => {
    fixture.componentRef.setInput("color", "#16a34a");
    fixture.componentRef.setInput("uncheckedColor", "#94a3b8");
    fixture.componentRef.setInput("labelColor", "#166534");
    fixture.componentRef.setInput("focusRingColor", "rgba(22, 163, 74, 0.35)");
    fixture.componentRef.setInput("size", "24px");
    fixture.componentRef.setInput("borderRadius", "6px");
    fixture.componentRef.setInput("animationDuration", "300ms");
    fixture.componentRef.setInput("checkedIconColor", "#ffffff");
    fixture.componentRef.setInput("iconSize", 16);
    fixture.componentRef.setInput("checked", true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const styles = host.style;

    expect(styles.getPropertyValue("--cao-checkbox-color")).toBe("#16a34a");
    expect(styles.getPropertyValue("--cao-checkbox-unselected")).toBe("#94a3b8");
    expect(styles.getPropertyValue("--cao-checkbox-label")).toBe("#166534");
    expect(styles.getPropertyValue("--cao-checkbox-size")).toBe("24px");
    expect(styles.getPropertyValue("--cao-checkbox-radius")).toBe("6px");
    expect(styles.getPropertyValue("--cao-checkbox-duration")).toBe("300ms");
    expect(styles.getPropertyValue("--cao-checkbox-icon-size")).toBe("16px");
    expect(styles.getPropertyValue("--cao-checkbox-icon-color")).toBe("#ffffff");
  });
});

describe("CaoCheckboxComponent with ngModel", () => {
  let fixture: ComponentFixture<CheckboxHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxHostComponent);
    fixture.detectChanges();
  });

  function getInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector("input");
  }

  it("should render the initial form value", async () => {
    fixture.componentRef.setInput("checked", true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getInput().checked).toBe(true);
  });

  it("should update the model when the input changes", () => {
    const input = getInput();
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    fixture.detectChanges();

    expect(fixture.componentInstance.checked).toBe(true);
  });

  it("should respect the disabled state", () => {
    fixture.componentRef.setInput("isDisabled", true);
    fixture.detectChanges();

    expect(getInput().disabled).toBe(true);
  });
});

