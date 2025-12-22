import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  forwardRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

interface IDropDownOption {
  id?: string | number;
  nome: string;
  icon?: string;
  iconPosition?: string;
  dataCy?: string;
}

@Component({
  selector: "cao-drop-down",
  templateUrl: "./drop-down.html",
  styleUrl: "./drop-down.css",
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatIconModule,
    CommonModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownComponent),
      multi: true,
    },
  ],
})
export class DropDownComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() textHeader = "SELECIONE UM ITEM";
  @Input() options: IDropDownOption[] = [];
  @Input() dropDownClass = "";
  @Input() styleDropDown: { [klass: string]: unknown } = {};
  @Input() control?: AbstractControl | null;
  @Input() controlName = "";
  @Input() isDisabled = false;
  @Output() readonly itemSelected = new EventEmitter<IDropDownOption>();
  @Input() tooltip = "";
  @Input() dropDirectionInput: "up" | "down" = "down";
  @Input() dataCy?: string = "";

  @Input() trackByFn?: (index: number, item: IDropDownOption) => unknown;
  @Input() compareWith?: (option: unknown, value: unknown) => boolean;


  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() listAriaLabel?: string;


  isOpen = false;
  selectedItem?: IDropDownOption;
  filteredOptions: IDropDownOption[] = [];
  searchControl = new FormControl("");
  isTouched = false;
  isFocused = false;
  dropDirection: string | undefined;
  removeValidBorder = false;


  focusedIndex = -1;

  private _handleClickOutside = this.onClickOutside.bind(this);

  constructor(
    private _eref: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    document.addEventListener("click", this._handleClickOutside, true);
    this.filteredOptions = [...this.options];

    this.searchControl.valueChanges.subscribe((value) => {
      this.filterOptions(value || "");
      this.focusedIndex = -1
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener("click", this._handleClickOutside, true);
  }

  get activeDescendant(): string | null {
    if (this.isOpen && this.focusedIndex >= 0 && this.filteredOptions[this.focusedIndex]) {
      return `option-${this.dataCy}-${this.focusedIndex}`;
    }
    return null;
  }

  toggleDropdown(): void {
    if (this.isDisabled) { return };

    this.checkAvailableSpace();
    this.isOpen = !this.isOpen;
    this.isFocused = this.isOpen;
    this.markAsTouched();

    if (this.isOpen) {
      this.searchControl.setValue("");
      this.filteredOptions = [...this.options];
      this.removeValidBorder = false;
      this.focusedIndex = -1;


      setTimeout(() => {
        if (this.isOpen) {
          const searchInput = this._eref.nativeElement.querySelector('.dropdown-search input');
          if (searchInput) {
            searchInput.focus();
          }
        }
      });
    } else {
      this.focusedIndex = -1;
    }

    this.cdr.detectChanges();
  }

  selectItem(option: IDropDownOption): void {
    if (this.isDisabled) { return };

    this.selectedItem = option;
    this.isOpen = false;
    this.focusedIndex = -1;
    this.itemSelected.emit(option);
    this.onChange(option);
    this.markAsTouched();
    this.cdr.detectChanges();
  }

  clear(): void {
    this.selectedItem = undefined;
    this.onChange(null);
    this.cdr.detectChanges();
  }

  filterOptions(searchTerm: string) {
    if (!searchTerm) {
      this.filteredOptions = [...this.options];
      return;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.filteredOptions = this.options.filter(
      (option) =>
        option.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
        option.id?.toString().toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  trackBy(index: number, item: IDropDownOption): unknown {
    return this.trackByFn ? this.trackByFn(index, item) : item.id;
  }

  private onClickOutside(event: MouseEvent): void {
    if (!this._eref.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
      }
      if (this.isFocused) {
        this.isFocused = false;
      }
      this.focusedIndex = -1;
      this.markAsTouched();
      this.removeValidBorder = true;
      this.cdr.detectChanges();
    }
  }

  onArrowDown(event: Event): void {
    if (this.isDisabled) { return };

    event.preventDefault();
    event.stopPropagation();

    if (this.filteredOptions.length === 0) { return };

    if (this.focusedIndex === -1) {

      this.focusedIndex = 0;
    } else {

      this.focusedIndex = (this.focusedIndex + 1) % this.filteredOptions.length;
    }

    this.scrollIntoView();
    this.cdr.detectChanges();
  }

  onArrowUp(event: Event): void {
    if (this.isDisabled) { return };

    event.preventDefault();
    event.stopPropagation();

    if (this.filteredOptions.length === 0) { return };

    if (this.focusedIndex === -1) {

      this.focusedIndex = this.filteredOptions.length - 1;
    } else {

      this.focusedIndex = this.focusedIndex <= 0
        ? this.filteredOptions.length - 1
        : this.focusedIndex - 1;
    }

    this.scrollIntoView();
    this.cdr.detectChanges();
  }

  onSearchEnter(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.focusedIndex >= 0 && this.focusedIndex < this.filteredOptions.length) {
      this.selectItem(this.filteredOptions[this.focusedIndex]);
    } else if (this.filteredOptions.length > 0) {

      this.selectItem(this.filteredOptions[0]);
    }
  }

  closeDropdown(): void {
    if (this.isDisabled) { return };

    this.isOpen = false;
    this.focusedIndex = -1;
    this.isFocused = false;
    this.cdr.detectChanges();
  }

  private scrollIntoView(): void {
    if (!this.isOpen || this.focusedIndex === -1) { return };

    setTimeout(() => {
      const element = document.getElementById(`option-${this.dataCy}-${this.focusedIndex}`);
      if (element) {
        element.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }, 0);
  }

  checkAvailableSpace(): void {
    if (this.dropDirectionInput === "up") {
      this.dropDirection = "up";
      return;
    }

    const rect = this._eref.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const dropdownHeight = 200

    const spaceBelow = windowHeight - rect.bottom;
    this.dropDirection = spaceBelow < dropdownHeight ? "up" : "down";
  }


  writeValue(value: unknown): void {
    if (value !== null && value !== undefined) {
      const match = this.options.find((opt) =>
        this.compareWith
          ? this.compareWith(opt, value)
          : opt.id === (typeof value === "object" && value ? (value as any).id : value)
      );

      if (match) {
        this.selectedItem = match;
      } else {
        const matchByName = this.options.find((opt) => opt.nome === value);
        if (matchByName) {
          this.selectedItem = matchByName;
        }
      }
    } else {
      this.selectedItem = undefined;
    }
    this.cdr.detectChanges();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onChange: (value: unknown) => void = () => { };
  onTouched = () => { };

  get errorText(): string | null {
    if (!this.control) { return null; }
    if (this.control.hasError("required")) {
      return "*Campo obrigatório";
    }
    return null;
  }

  private markAsTouched() {
    if (!this.isTouched) {
      this.onTouched();
      this.isTouched = true;
      this.control?.markAsTouched();
    }
  }

  get controlNameValue(): string {
    return this.controlName;
  }
}