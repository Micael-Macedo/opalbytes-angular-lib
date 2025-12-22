import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit, forwardRef } from "@angular/core";
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
} from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { Observable, startWith, map } from "rxjs";

interface IAutoCompleteOption {
  id?: string | number;
  nome: string;
  icon?: string;
  iconPosition?: string;
}

@Component({
  selector: "cao-autocomplete",
  templateUrl: "./autocomplete.html",
  styleUrls: ["./autocomplete.css"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RnvAutocompleteComponent),
      multi: true,
    },
  ],
})
export class RnvAutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input() label = "";
  @Input() placeholder = "";
  @Input() options: IAutoCompleteOption[] = [];
  @Input() control: AbstractControl = new FormControl();
  @Input() dataCy = "";
  @Input() controlName = "";

  internalControl = new FormControl("");
  filteredOptions$!: Observable<IAutoCompleteOption[]>;
  isFocused = false;

  private onChange: (value: IAutoCompleteOption | string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.filteredOptions$ = this.internalControl.valueChanges.pipe(
      startWith(""),
      map((value) => this.filter(value || ""))
    );

    this.control.valueChanges.subscribe((value) => {
      const displayValue = value && typeof value === "object" ? this.displayFn(value) : value;
      this.internalControl.setValue(displayValue, { emitEvent: false });
    });
  }

  onFocus() {
    this.isFocused = true;
    this.onTouched();
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  private filter(value: string | IAutoCompleteOption): IAutoCompleteOption[] {
    const filterValue = (typeof value === "string" ? value : value?.nome)?.toLowerCase() || "";
    if (!this.options) {
      return [];
    }
    return this.options.filter((option) => {
      const nomeMatch = option.nome.toLowerCase().includes(filterValue);
      const idMatch = option.id?.toString().toLowerCase().includes(filterValue);
      return nomeMatch || idMatch;
    });
  }

  displayFn(option: IAutoCompleteOption): string {
    return option && option.nome ? option.nome : "";
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.onChange(event.option.value);
    this.onTouched();
  }

  get errorText(): string | null {
    if (!this.control) {return null;}

    const isEmpty = this.control.value === null || this.control.value === "";

    if (this.control.hasError("required") && isEmpty) {
      return "*Campo obrigatório";
    }

    if (this.control.touched && this.control.invalid) {
      if (this.control.hasError("cpfInvalid")) {return "CPF inválido";}
      if (this.control.hasError("cellPhoneInvalid")) {return "Número inválido";}
      if (this.control.hasError("emailInvalid")) {return "Email inválido";}
      if (this.control.hasError("cnpjInvalid")) {return "CNPJ inválido";}
      if (this.control.hasError("rgInvalid")) {return "RG inválido";}
      if (this.control.hasError("dateInvalid")) {return "Data inválida";}
      if (this.control.hasError("dateStartInvalid")) {return "Data Inicial inválida";}
      if (this.control.hasError("dateEndInvalid")) {return "Data Final inválida";}
      return "Formato inválido";
    }

    return null;
  }

  get controlNameValue(): string {
    return this.controlName;
  }

  writeValue(value: IAutoCompleteOption | string): void {
    const displayValue = value && typeof value === "object" ? this.displayFn(value) : value;
    this.internalControl.setValue(displayValue, { emitEvent: false });
  }

  registerOnChange(fn: (value: IAutoCompleteOption | string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.internalControl.disable() : this.internalControl.enable();
  }
}
