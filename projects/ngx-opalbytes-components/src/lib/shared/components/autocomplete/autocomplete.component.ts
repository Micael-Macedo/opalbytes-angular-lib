import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef, inject, OnChanges, SimpleChanges } from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { LucideDynamicIcon } from "@lucide/angular";
import { Observable, startWith, map, BehaviorSubject, combineLatest } from "rxjs";

export interface ICaoAutoCompleteOption {
  id?: string | number;
  nome: string;
  icon?: string;
  iconPosition?: string;
}

@Component({
  selector: "cao-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    LucideDynamicIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaoAutocompleteComponent),
      multi: true,
    },
  ],
})
export class CaoAutocompleteComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() label = "";
  @Input() placeholder = "";
  @Input() options: ICaoAutoCompleteOption[] = [];
  @Input() control: AbstractControl = new FormControl();
  @Input() dataCy = "";
  @Input() controlName = "";
  @Input() isLucideIcon = false;
  @Input() iconColor = "";
  @Input() _leadingIcon?: string;
  @Input() _trailingIcon?: string;
  @Input() optionIcon?: string;
  @Input() optionIConColor?: string;
  @Input() isLucideOptionIcon?: boolean;
  @Input() autocompleteBgColor = 'white';
  @Input() strokeWidthIcon = 1

  @Output() readonly itemSelected = new EventEmitter<ICaoAutoCompleteOption>();
  @Output() readonly blurEvent = new EventEmitter<void>();
  @Output() readonly focusEvent = new EventEmitter<void>();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  internalControl = new FormControl("");
  filteredOptions$!: Observable<ICaoAutoCompleteOption[]>;
  isFocused = false;
  icon = false;

  private selectedOption: ICaoAutoCompleteOption | null = null;

  private options$ = new BehaviorSubject<ICaoAutoCompleteOption[]>([]);

  private el = inject(ElementRef);

  private onChange: (value: ICaoAutoCompleteOption | string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.filteredOptions$ = combineLatest([
      this.internalControl.valueChanges.pipe(startWith("")),
      this.options$,
    ]).pipe(
      map(([value]) => this.filter(value || ""))
    );

    this.control.valueChanges.subscribe((value) => {
      const displayValue = value && typeof value === "object" ? this.displayFn(value) : value;
      this.internalControl.setValue(displayValue, { emitEvent: false });
      this.selectedOption = value && typeof value === "object" ? value : null;
    });

    this.setStyle()
  }

  private setStyle(){
     this.el.nativeElement.style.setProperty(
      '--autocomplete-bg-color', 
      this.autocompleteBgColor
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.options$.next(changes['options'].currentValue ?? []);
    }
  }

  onFocus(): void {
    this.isFocused = true;
    this.focusEvent.emit();
    this.onTouched();

    const currentDisplay = this.internalControl.value;

    this.internalControl.setValue("", { emitEvent: true });

    if (currentDisplay) {
      this.internalControl.setValue(currentDisplay, { emitEvent: false });
    }

    setTimeout(() => {
      this.autocompleteTrigger?.openPanel();
    }, 0);
  }

  onBlur(): void {
    this.isFocused = false;
    this.blurEvent.emit();
    this.onTouched();
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedOption = event.option.value;
    this.onChange(event.option.value);
    this.itemSelected.emit(event.option.value);
    this.onTouched();

    setTimeout(() => {
      this.autocompleteTrigger?.closePanel();
      this.el.nativeElement.querySelector('input')?.blur();
    }, 10);
  }

  private filter(value: string | ICaoAutoCompleteOption): ICaoAutoCompleteOption[] {
    const filterValue =
      (typeof value === "string" ? value : value?.nome)?.toLowerCase() || "";

    const currentOptions = this.options$.getValue();

    if (!currentOptions?.length) {
      return [];
    }

    const matched = currentOptions.filter((option) => {
      const nomeMatch = option.nome.toLowerCase().includes(filterValue);
      const idMatch = option.id?.toString().toLowerCase().includes(filterValue);
      return nomeMatch || idMatch;
    });

    if (!filterValue && this.selectedOption) {
      const selectedId = this.selectedOption.id;
      const selectedIndex = matched.findIndex((o) => o.id === selectedId);

      if (selectedIndex > 0) {
        const [selected] = matched.splice(selectedIndex, 1);
        matched.unshift(selected);
      }
    }

    return matched;
  }

  displayFn(option: ICaoAutoCompleteOption): string {
    return option && option.nome ? option.nome : "";
  }

  get errorText(): string | null {
    if (!this.control) { return null; }

    const isEmpty = this.control.value === null || this.control.value === "";

    if (this.control.hasError("required") && isEmpty) {
      return "*Campo obrigatório";
    }

    if (this.control.touched && this.control.invalid) {
      if (this.control.hasError("cpfInvalid")) { return "CPF inválido"; }
      if (this.control.hasError("cellPhoneInvalid")) { return "Número inválido"; }
      if (this.control.hasError("emailInvalid")) { return "Email inválido"; }
      if (this.control.hasError("cnpjInvalid")) { return "CNPJ inválido"; }
      if (this.control.hasError("rgInvalid")) { return "RG inválido"; }
      if (this.control.hasError("dateInvalid")) { return "Data inválida"; }
      if (this.control.hasError("dateStartInvalid")) { return "Data Inicial inválida"; }
      if (this.control.hasError("dateEndInvalid")) { return "Data Final inválida"; }
      return "Formato inválido";
    }

    return null;
  }

  get controlNameValue(): string {
    return this.controlName;
  }

  writeValue(value: ICaoAutoCompleteOption | string): void {
    const displayValue = value && typeof value === "object" ? this.displayFn(value) : value;
    this.internalControl.setValue(displayValue, { emitEvent: false });
    this.selectedOption = value && typeof value === "object" ? value : null;
  }

  registerOnChange(fn: (value: ICaoAutoCompleteOption | string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setInputHeight(height: string): void {
    this.el.nativeElement.style.setProperty("--form-field-height", height);
  }
}