import { LiveAnnouncer } from "@angular/cdk/a11y";
import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  inject,
  ViewChild,
} from "@angular/core";
import { MatPaginator, MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { Subscription } from "rxjs";

import { BaseFilterTablePaginatedService } from "./base-filter-table-paginated.service";
import { BasePaginationService } from "./base-pagination.service";
import { IColumnPaginatedConfig, ITablePaginatedConfig } from "./base-table-paginated.interface";
import { TablePaginatedService } from "./base-table-paginated.service";
import { MaterialModule } from "../../../material.module";

export function getPtBrPaginatorIntlBasePaginated(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = "Itens por página:";
  paginatorIntl.nextPageLabel = "Próxima página";
  paginatorIntl.previousPageLabel = "Página anterior";
  paginatorIntl.firstPageLabel = "Primeira página";
  paginatorIntl.lastPageLabel = "Última página";
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} de ${length}`;
  };
  return paginatorIntl;
}

@Component({
  selector: "cao-table-paginated",
  templateUrl: "./base-table-paginated.html",
  styleUrl: "./base-table-paginated.css",
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MaterialModule],
  providers: [{ provide: MatPaginatorIntl, useValue: getPtBrPaginatorIntlBasePaginated() }],
})
export class BaseTablePaginated implements OnInit, OnDestroy {
  private paginationSubscriptions: Subscription[] = [];
  @Input() getColumnCssClass?: (columnKey: string, value: any) => string | null;
  @Input() customClass = "";
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() showFirstLastButtons = true;

  @Output() readonly pageChanged = new EventEmitter<number>();
  @Output() readonly pageSizeChanged = new EventEmitter<number>();
  @Output() readonly firstPageClicked = new EventEmitter<void>();
  @Output() readonly lastPageClicked = new EventEmitter<void>();
  @Output() readonly selectionChanged = new EventEmitter<any[]>();
  @Output() readonly pageEvent = new EventEmitter<PageEvent>();
  @Output() readonly rowClicked = new EventEmitter<any>();


  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  allColumns: string[] = [];
  displayedColumns: string[] = [];
  filterValue = "";
  private configSubscription: Subscription | null = null;
  private visibleColumnsSubscription: Subscription | null = null;
  private dataSubscription: Subscription | null = null;
  private filterSubscription: Subscription | null = null;
  tableConfig: ITablePaginatedConfig | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  private previousPage = 1;


  protected paginationService = inject(BasePaginationService);
  protected tableService = inject(TablePaginatedService);
  protected liveAnnouncer = inject(LiveAnnouncer);
  protected filterTableService = inject(BaseFilterTablePaginatedService);


  constructor(
  ) {
    this.initializeSortingAccessor();
    this.initializeFilterPredicate();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.pageChanged.emit(page);

    if (this.paginator && this.paginator.pageIndex !== page - 1) {
      this.paginator.pageIndex = page - 1;
    }
  }

  ngOnInit(): void {
    this.configSubscription = this.tableService.tableConfig$.subscribe((config) => {
      if (config) {
        this.tableConfig = config;
        this.allColumns = config.columns;
      }
    });
    this.visibleColumnsSubscription = this.tableService.visibleColumns$.subscribe(
      (visibleColumns) => {
        this.displayedColumns = visibleColumns.filter((col) => col !== "select");
      }
    );
    this.dataSubscription = this.tableService.data$.subscribe((data) => {
      this.dataSource.data = data;
      this.updateTotalItems();
    });
    this.filterSubscription = this.filterTableService.filter$.subscribe((filterValue) => {
      this.filterValue = filterValue;
      this.applyFilter();
    });

    this.paginationSubscriptions.push(
      this.paginationService.currentPage$.subscribe((page) => {
        if (this.currentPage !== page) {
          this.onPageChanged(page);
        }
      }),

      this.paginationService.pageSize$.subscribe((size) => {
        if (this.pageSize !== size) {
          this.onPageSizeChanged(size);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
    this.visibleColumnsSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    this.filterSubscription?.unsubscribe();
    this.paginationSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  updateTotalItems(newTotalItens?: number): void {
    this.totalItems = newTotalItens ?? this.totalItems;
    this.paginationService.setTotalItems(this.totalItems);

    const lastPage = this.pageSize > 0 ? Math.ceil(this.totalItems / this.pageSize) : 1;
    const lastValidPage = lastPage > 0 ? lastPage : 1;

    if (this.currentPage > lastValidPage) {
      this.paginationService.setPage(1);
    }
  }

  onPageSizeChanged(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageSizeChanged.emit(pageSize);

    if (this.paginator && this.paginator.pageSize !== pageSize) {
      this.paginator.pageSize = pageSize;
    }
  }

  getColumnHeader(column: string): string {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return column;
    }
    return this.tableConfig.columnData[column].header || column;
  }

  getColumnElement(column: string): string {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return column;
    }
    return this.tableConfig.columnData[column].element || column;
  }

  getColumnType(column: string): IColumnPaginatedConfig["type"] {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return "STRING";
    }
    return this.tableConfig.columnData[column].type || "STRING";
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(
        `Ordenado ${sortState.direction === "asc" ? "ascendente" : "descendente"}`
      );
    } else {
      this.liveAnnouncer.announce("Ordenação removida");
    }
  }

  handlePageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.paginationService.setPageSize(event.pageSize);
    this.pageChanged.emit(event.pageIndex);
  }

  applyFilter(): void {
    const normalizedFilter = this.filterValue.trim().toLowerCase();
    this.dataSource.filter = normalizedFilter;
  }

  initializeSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      const value = item[property];
      if (typeof value === "string") {
        return value.toLowerCase();
      } else if (typeof value === "number") {
        return value;
      } else if (typeof value === "boolean") {
        return value ? 1 : 0;
      } else if (value instanceof Date) {
        return value.valueOf();
      } else if (value === null) {
        return "";
      } else if (value === undefined) {
        return undefined;
      } else if (typeof value === "object") {
        return value.toString();
      }
      return value;
    };
  }

  initializeFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchTerms = filter.trim().toLowerCase();
      if (!searchTerms) {
        return true;
      }
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        const value = data[key];
        return (
          currentTerm +
          (value !== null && value !== undefined ? value.toString().toLowerCase() : "")
        );
      }, "");
      return dataStr.indexOf(searchTerms) !== -1;
    };
  }

  onRowClick(row: any): void {
    this.rowClicked.emit(row);
  }

  onPageEvent(event: PageEvent): void {
    const newPage = event.pageIndex + 1;
    const isFirstPage = newPage === 1 && this.previousPage !== 1;
    const isLastPage =
      newPage === Math.ceil(this.totalItems / event.pageSize) && newPage !== this.previousPage;
    // Handle page size changes
    if (event.pageSize !== this.pageSize) {
      this.onPageSizeChanged(event.pageSize);
    }

    // Handle page changes
    if (newPage !== this.currentPage) {
      this.previousPage = this.currentPage; // Store previous page for first/last detection
      this.onPageChanged(newPage);

      // Emit specific events for first/last page navigation
      if (isFirstPage) {
        this.firstPageClicked.emit();
        this.liveAnnouncer.announce("Primeira página");
      } else if (isLastPage) {
        this.lastPageClicked.emit();
        this.liveAnnouncer.announce("Última página");
      }
    }

    this.pageEvent.emit(event)
  }

  getColumnButtons(column: string): any[] {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return [];
    }
    return this.tableConfig.columnData[column].buttons || [];
  }
}
