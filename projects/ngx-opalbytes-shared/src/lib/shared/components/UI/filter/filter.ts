import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  HostListener,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IFilterConfig } from '@shared/interfaces/filter-config.interface';
import {
  CpfMaskDirective,
  CpfCnpjMaskDirective,
  RgMaskDirective,
} from '@shared/directives/directives';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, CpfMaskDirective, CpfCnpjMaskDirective, RgMaskDirective],
  templateUrl: './filter.html',
})
export class Filter implements OnChanges, OnInit {
  @Input() filtersConfig: Record<string, IFilterConfig> = {};
  @Input() filterValues: Record<string, any> = {};
  @Input() activeFilters = new Set<string>();
  @Input() filtrosAplicados: string[] = [];
  @Input() showAddFiltersButton = true;

  @Output() filterValueChange = new EventEmitter<{ filterId: string; value: any }>();
  @Output() search = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
  @Output() removeFilter = new EventEmitter<number>();
  @Output() clearAllFilters = new EventEmitter<void>();
  @Output() addFilter = new EventEmitter<string>();

  mostrarSeletorFiltros = signal(false);
  activeFiltersSignal = signal<Set<string>>(new Set());

  activeFiltersArray = computed(() => Array.from(this.activeFiltersSignal()));

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeFilters']) {
      // Criar um novo Set para garantir que o signal detecte a mudança
      this.activeFiltersSignal.set(new Set(this.activeFilters));
    }
  }

  ngOnInit() {
    // Inicializar o signal com o valor inicial
    this.activeFiltersSignal.set(new Set(this.activeFilters));
  }

  // Filtros disponíveis para adicionar (não fixos e não ativos)
  filtrosDisponiveis = computed(() => {
    const allFilters = Object.keys(this.filtersConfig);
    return allFilters.filter(
      (filterId) =>
        !this.filtersConfig[filterId].fixed && !this.activeFiltersSignal().has(filterId),
    );
  });

  updateFilterValue(filterId: string, value: any) {
    this.filterValueChange.emit({ filterId, value });
  }

  handlePesquisar() {
    this.search.emit();
  }

  handleLimpar() {
    this.clear.emit();
  }

  handleRemoveFiltro(index: number) {
    this.removeFilter.emit(index);
  }

  handleLimparFiltros() {
    this.clearAllFilters.emit();
  }

  toggleSeletorFiltros() {
    this.mostrarSeletorFiltros.update((value) => !value);
  }

  handleAdicionarFiltro(filterId: string) {
    this.addFilter.emit(filterId);
    this.mostrarSeletorFiltros.set(false);
  }

  @HostListener('document:click', ['$event'])
  fecharSeletorFiltros(event: Event) {
    if (this.mostrarSeletorFiltros()) {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.mostrarSeletorFiltros.set(false);
      }
    }
  }

  getFilterConfig(filterId: string): IFilterConfig {
    return this.filtersConfig[filterId];
  }
}
