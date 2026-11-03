import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LucideCheck, LucideX, provideLucideIcons } from "@lucide/angular";

import { CaoSlideToggleComponent } from "./slide-toggle.component";

describe("CaoSlideToggleComponent", () => {
  let component: CaoSlideToggleComponent;
  let fixture: ComponentFixture<CaoSlideToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaoSlideToggleComponent],
      providers: [provideLucideIcons(LucideCheck, LucideX)],
    }).compileComponents();

    fixture = TestBed.createComponent(CaoSlideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle and emit changes", () => {
    const checkedChange = vi.fn();
    const toggleChange = vi.fn();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector("input");

    component.checkedChange.subscribe(checkedChange);
    component.toggleChange.subscribe(toggleChange);

    input.checked = true;
    input.dispatchEvent(new Event("change"));
    fixture.detectChanges();

    expect(component.checked).toBe(true);
    expect(checkedChange).toHaveBeenCalledWith(true);
    expect(toggleChange).toHaveBeenCalledWith({
      checked: true,
      source: component,
    });
  });

  it("should not toggle when disabled", () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector("input");
    component.isDisabled = true;
    fixture.detectChanges();

    input.checked = true;
    input.dispatchEvent(new Event("change"));
    fixture.detectChanges();

    expect(component.checked).toBe(false);
    expect(input.disabled).toBe(true);
  });

  it("should support ControlValueAccessor", () => {
    const onChange = vi.fn();
    const onTouched = vi.fn();

    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    component.writeValue(true);
    component.onBlur();

    expect(component.checked).toBe(true);
    expect(onTouched).toHaveBeenCalled();

    component.toggle();
    expect(onChange).toHaveBeenCalledWith(false);
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
  });

  it("should render Lucide icons for both states", () => {
    fixture.componentRef.setInput("thumbIcon", "x");
    fixture.componentRef.setInput("thumbCheckedIcon", "check");
    fixture.componentRef.setInput("isLucideThumbIcon", true);
    fixture.componentRef.setInput("thumbIconColor", "#6b7280");
    fixture.componentRef.setInput("thumbCheckedIconColor", "#16a34a");
    fixture.componentRef.setInput("checked", true);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector(
      ".cao-slide-toggle__thumb svg",
    );

    expect(
      fixture.nativeElement.querySelector(".cao-slide-toggle__thumb img"),
    ).toBeNull();
    expect(icon).toBeTruthy();
    expect(component.resolvedThumbIcon).toBe("check");
    expect(component.resolvedThumbIconColor).toBe("#16a34a");

    fixture.componentRef.setInput("checked", false);
    fixture.detectChanges();

    expect(component.resolvedThumbIcon).toBe("x");
    expect(component.resolvedThumbIconColor).toBe("#6b7280");
    expect(
      fixture.nativeElement.querySelector(".cao-slide-toggle__thumb svg"),
    ).toBeTruthy();
  });

  it("should fall back to thumbIcon when thumbCheckedIcon is empty", () => {
    fixture.componentRef.setInput("thumbIcon", "check");
    fixture.componentRef.setInput("isLucideThumbIcon", true);
    fixture.componentRef.setInput("checked", true);
    fixture.detectChanges();

    expect(component.resolvedThumbIcon).toBe("check");
    expect(
      fixture.nativeElement.querySelector(".cao-slide-toggle__thumb svg"),
    ).toBeTruthy();
  });

  it("should render an image when isLucideThumbIcon is false", () => {
    fixture.componentRef.setInput("thumbIcon", "icon.svg");
    fixture.detectChanges();

    const image: HTMLImageElement = fixture.nativeElement.querySelector(
      ".cao-slide-toggle__thumb img",
    );

    expect(image).toBeTruthy();
    expect(image.getAttribute("src")).toBe("icon.svg");
    expect(
      fixture.nativeElement.querySelector(".cao-slide-toggle__thumb svg"),
    ).toBeNull();
  });

  it("should not render an icon when no thumb icon is provided", () => {
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(
        ".cao-slide-toggle__thumb svg, .cao-slide-toggle__thumb img",
      ),
    ).toBeNull();
  });
});
