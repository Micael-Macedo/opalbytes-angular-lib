import { Overlay, OverlayRef, OverlayModule } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  CommonModule
} from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
  inject,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Renderer2,
  ViewContainerRef,
  AfterViewInit,
  TemplateRef
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";

import { LucideDynamicIcon } from "@lucide/angular";
import {
  Observable,
  Subscription,
  startWith,
  map,
  BehaviorSubject,
  combineLatest
} from "rxjs";


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
    LucideDynamicIcon,
    OverlayModule,
    CdkScrollable
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
export class CaoAutocompleteComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, ControlValueAccessor {
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
  @Input() strokeWidthIcon = 1;
  @Input() isDisabled = false;
  @Input() inputHeigth = '50px';

  @Input() checkIcon = '✓';
  @Input() showCheckIcon = true;
  @Input() isLucideCheckIcon = false;

  @Output() readonly itemSelected = new EventEmitter<ICaoAutoCompleteOption>();
  @Output() readonly blurEvent = new EventEmitter<void>();
  @Output() readonly focusEvent = new EventEmitter<void>();

  @Output() readonly leadingIconClick = new EventEmitter<MouseEvent | Event>();
  @Output() readonly trailingIconClick = new EventEmitter<MouseEvent | Event>();

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;
  @ViewChild('wrapper', { static: true }) wrapperEl!: ElementRef<HTMLDivElement>;
  
  // CORREÇÃO: ViewChild para o ng-template
  @ViewChild('panel', { static: true }) panelTemplate!: TemplateRef<any>;

  /** controla apenas o texto digitado / exibido no input */
  internalControl = new FormControl<string>("");
  filteredOptions$!: Observable<ICaoAutoCompleteOption[]>;
  filteredOptionsList: ICaoAutoCompleteOption[] = [];

  isFocused = false;
  isPanelOpen = false;
  activeIndex = -1;

  private static uidSeq = 0;
  readonly listboxId = `cao-autocomplete-listbox-${CaoAutocompleteComponent.uidSeq++}`;

  private selectedOption: ICaoAutoCompleteOption | null = null;
  private options$ = new BehaviorSubject<ICaoAutoCompleteOption[]>([]);
  /** indica se o valor atual do internalControl foi digitado pelo usuário (e não escrito programaticamente) */
  private isUserTyping = false;
  private el = inject(ElementRef<HTMLElement>);
  private cdr = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);
  
  // Injeções do CDK Overlay
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private scrollDispatcher = inject(ScrollDispatcher);

  private sub = new Subscription();
  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal<any> | null = null;

  private onChange: (value: ICaoAutoCompleteOption | string | null) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit(): void {
    this.setInputHeight();
    this.filteredOptions$ = combineLatest([
      this.internalControl.valueChanges.pipe(startWith("")),
      this.options$,
    ]).pipe(
      map(([value]) => this.filter(value || ""))
    );

    this.sub.add(
      this.filteredOptions$.subscribe((list) => {
        this.filteredOptionsList = list;
        this.activeIndex = list.length ? 0 : -1;
        // Atualiza o overlay se estiver aberto e anexado
        if (this.isPanelOpen && this.portal && this.overlayRef?.hasAttached()) {
          this.overlayRef?.updatePosition();
        }
      })
    );

    this.sub.add(
      this.control.valueChanges.subscribe((value) => {
        this.writeDisplayValue(value);
        this.selectedOption = value && typeof value === "object" ? value : null;
      })
    );

    this.setStyle();
    this.setupOverlay();
  }

  ngAfterViewInit(): void {
    // CORREÇÃO: Usando o TemplateRef obtido do ViewChild
    this.portal = new TemplatePortal(
      this.panelTemplate,
      this.viewContainerRef
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.options$.next(changes['options'].currentValue ?? []);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.closeOverlay();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private setupOverlay(): void {
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.wrapperEl)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 4,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -4,
          }
        ])
        .withDefaultOffsetX(0)
        .withFlexibleDimensions(false)
        .withViewportMargin(8),
      scrollStrategy: scrollStrategy,
      hasBackdrop: false,
      backdropClass: '',
      minWidth: 200,
      maxHeight: 260,
    });

    // Fecha o overlay quando houver scroll fora do elemento
    this.scrollDispatcher.scrolled().subscribe((scrollable) => {
      if (this.isPanelOpen) {
        const overlayEl = this.overlayRef?.overlayElement;
        if (scrollable instanceof CdkScrollable) {
          const scrollableEl = scrollable.getElementRef().nativeElement;
          if (overlayEl?.contains(scrollableEl)) {
            return;
          }
        }
        this.closePanel();
      }
    });
  }

  private closeOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isPanelOpen = false;
  }

  private openOverlay(): void {
    if (!this.overlayRef || !this.portal) {return;}

    this.overlayRef.updateSize({
      width: this.wrapperEl.nativeElement.offsetWidth,
    });

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
    }

    this.overlayRef.updatePosition();

    this.isPanelOpen = true;
    this.cdr.markForCheck();
  }

  private setStyle(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      '--autocomplete-bg-color',
      this.autocompleteBgColor
    );
  }

  // ---------- Painel ----------

  openPanel(): void {
    if (this.isDisabled || this.isPanelOpen) { return; }
    
    if (this.selectedOption && !this.isUserTyping) {
      // Ao reabrir com uma opção já selecionada (e sem edição manual do usuário),
      // exibe todas as opções, com a selecionada no topo.
      this.filteredOptionsList = this.filter("");
      const idx = this.filteredOptionsList.findIndex(o => o.id === this.selectedOption?.id);
      this.activeIndex = idx >= 0 ? idx : (this.filteredOptionsList.length ? 0 : -1);
    }

    this.openOverlay();
  }

  closePanel(): void {
    if (!this.isPanelOpen) { return; }
    this.closeOverlay();
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isPanelOpen) { return; }
    const target = event.target as Node;
    const clickedInsideHost = this.el.nativeElement.contains(target);
    const clickedInsideOverlay = this.overlayRef?.overlayElement?.contains(target);
    
    if (!clickedInsideHost && !clickedInsideOverlay) {
      this.closePanel();
    }
  }

  // ---------- Eventos do input ----------

  onFocus(): void {
    this.isFocused = true;
    this.focusEvent.emit();
    this.onTouched();
    this.openPanel();
  }

  onBlur(): void {
    this.isFocused = false;
    this.blurEvent.emit();
    this.onTouched();

    // Não fecha o overlay imediatamente no blur para permitir seleção
    setTimeout(() => {
      if (!this.isPanelOpen) {return;}
      const activeElement = document.activeElement;
      const isOverlayElement = this.overlayRef?.overlayElement?.contains(activeElement);
      const isInputElement = this.inputEl?.nativeElement === activeElement;
      
      if (!isOverlayElement && !isInputElement) {
        this.closePanel();
      }
    }, 150);
  }

  onInputKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isPanelOpen) { this.openPanel(); return; }
        this.moveActiveIndex(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isPanelOpen) { this.openPanel(); return; }
        this.moveActiveIndex(-1);
        break;
      case 'Enter':
        if (this.isPanelOpen && this.activeIndex >= 0) {
          event.preventDefault();
          const option = this.filteredOptionsList[this.activeIndex];
          if (option) { this.selectItem(option); }
        }
        break;
      case 'Escape':
        if (this.isPanelOpen) {
          event.preventDefault();
          this.closePanel();
        } else {
          this.clearSelection();
        }
        break;
      case 'Tab':
        this.closePanel();
        break;
    }
  }

  private moveActiveIndex(step: number): void {
    if (!this.filteredOptionsList.length) { return; }
    const total = this.filteredOptionsList.length;
    this.activeIndex = (this.activeIndex + step + total) % total;
    this.cdr.markForCheck();
  }

  // ---------- Seleção ----------

  selectItem(option: ICaoAutoCompleteOption): void {
    this.selectedOption = option;
    this.writeDisplayValue(option, { emitEvent: false });
    this.control.setValue(option, { emitEvent: false });
    this.onChange(option);
    this.itemSelected.emit(option);

    // Reordena a lista filtrada para que a opção selecionada fique no topo
    this.filteredOptionsList = this.moveSelectedToTop(this.filteredOptionsList, option);

    this.closePanel();

    // Remove o foco do input após a seleção
    this.inputEl?.nativeElement.blur();
    this.isFocused = false;

    this.cdr.markForCheck();
  }

  selectOption(option: ICaoAutoCompleteOption): void {
    this.selectItem(option);
  }

  clearSelection(): void {
    this.selectedOption = null;
    this.writeDisplayValue("", { emitEvent: false });
    this.control.setValue(null, { emitEvent: true });
    this.onChange(null);
    this.onTouched();
    this.closePanel();
  }

  onLeadingIconClick(event: MouseEvent | Event): void {
    event.stopPropagation();
    this.onFocus()
    this.leadingIconClick.emit(event);
  }

  onTrailingIconClick(event: MouseEvent | Event): void {
    event.stopPropagation();
    this.onFocus()
    this.trailingIconClick.emit(event);
  }

  // ---------- Filtro / display ----------

  private filter(value: string): ICaoAutoCompleteOption[] {
    const filterValue = (value || "").toLowerCase();
    const currentOptions = this.options$.getValue();

    if (!currentOptions?.length) {
      return [];
    }

    const matched = currentOptions.filter((option) => {
      const nomeMatch = option.nome.toLowerCase().includes(filterValue);
      const idMatch = option.id?.toString().toLowerCase().includes(filterValue);
      return nomeMatch || idMatch;
    });

    return this.selectedOption ? this.moveSelectedToTop(matched, this.selectedOption) : matched;
  }

  /** Move a opção selecionada para o início da lista, mantendo a ordem das demais */
  private moveSelectedToTop(
    list: ICaoAutoCompleteOption[],
    selected: ICaoAutoCompleteOption
  ): ICaoAutoCompleteOption[] {
    const selectedIndex = list.findIndex((o) => o.id === selected.id);

    if (selectedIndex <= 0) {
      return list;
    }

    const reordered = [...list];
    const [selectedItem] = reordered.splice(selectedIndex, 1);
    reordered.unshift(selectedItem);
    return reordered;
  }

  private writeDisplayValue(
    value: ICaoAutoCompleteOption | string | null | undefined,
    options: { emitEvent?: boolean } = { emitEvent: false }
  ): void {
    const text = value && typeof value === "object" ? this.displayFn(value) : (value ?? "");
    this.isUserTyping = false;
    this.internalControl.setValue(text, options);
  }

  /** Marca que o usuário está digitando manualmente no campo (ativa o filtro por texto) */
  onUserInput(): void {
    this.isUserTyping = true;
  }

  displayFn(option: ICaoAutoCompleteOption): string {
    return option && option.nome ? option.nome : "";
  }

  isOptionSelected(option: ICaoAutoCompleteOption): boolean {
    return this.selectedOption?.id !== undefined && this.selectedOption?.id === option.id;
  }
  
  trackByOptionId(_: number, option: ICaoAutoCompleteOption): string | number {
    return option.id ?? option.nome;
  }

  optionId(option: ICaoAutoCompleteOption): string {
    const key = (option.id ?? option.nome).toString().replace(/[^a-zA-Z0-9_-]/g, '-');
    return `${this.listboxId}-opt-${key}`;
  }

  get activeOptionId(): string | null {
    if (!this.isPanelOpen || this.activeIndex < 0) {
      return null;
    }
    const option = this.filteredOptionsList[this.activeIndex];
    return option ? this.optionId(option) : null;
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
    this.writeDisplayValue(value, { emitEvent: false });
    this.selectedOption = value && typeof value === "object" ? value : null;
  }

  registerOnChange(fn: (value: ICaoAutoCompleteOption | string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  setInputHeight(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      "--form-field-height",
      this.inputHeigth
    );
  }
}