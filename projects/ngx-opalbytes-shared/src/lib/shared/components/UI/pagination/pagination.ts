import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
})
export class Pagination {
  // Inputs
  paginaAtual = input.required<number>();
  totalPages = input.required<number>();
  totalCount = input.required<number>();
  itensPorPagina = input.required<number>();

  // Outputs
  pageChange = output<number>();
  itemsPerPageChange = output<number>();

  // Computed values
  inicioItem = computed(() => {
    const total = this.totalCount();
    const current = this.paginaAtual();
    const pageSize = this.itensPorPagina();
    if (total === 0) return 0;
    return (current - 1) * pageSize + 1;
  });

  fimItem = computed(() => {
    const total = this.totalCount();
    const current = this.paginaAtual();
    const pageSize = this.itensPorPagina();
    const end = current * pageSize;
    return Math.min(end, total);
  });

  hasPrevious = computed(() => this.paginaAtual() > 1);
  hasNext = computed(() => this.paginaAtual() < this.totalPages());

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.paginaAtual();
    const pages: number[] = [];

    for (let i = Math.max(1, current - 1); i <= Math.min(total, current + 1); i++) {
      pages.push(i);
    }

    return pages;
  }

  setPaginaAtual(pagina: number) {
    this.pageChange.emit(pagina);
  }

  primeiraPagina() {
    if (this.paginaAtual() !== 1) {
      this.setPaginaAtual(1);
    }
  }

  ultimaPagina() {
    if (this.paginaAtual() !== this.totalPages()) {
      this.setPaginaAtual(this.totalPages());
    }
  }

  paginaAnterior() {
    if (this.hasPrevious()) {
      this.setPaginaAtual(this.paginaAtual() - 1);
    }
  }

  proximaPagina() {
    if (this.hasNext()) {
      this.setPaginaAtual(this.paginaAtual() + 1);
    }
  }

  setItensPorPagina(event: any) {
    const value = Number(event.target.value);
    this.itemsPerPageChange.emit(value);
  }
}
