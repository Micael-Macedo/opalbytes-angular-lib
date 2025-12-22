import { LiveAnnouncer } from "@angular/cdk/a11y";
import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  ViewChild,
  Output,
  EventEmitter,
 Injectable } from "@angular/core";
import { MatPaginator, MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { Subscription , BehaviorSubject, Observable , Subject } from "rxjs";
import { map } from "rxjs/operators";

import { MaterialModule } from "../../../material.module";



export interface IColumnButton {
  icon: string;
  label: string;
  onClick: (data: any) => void;
  tooltip?: string;
}

export interface IColumnConfig {
  type:
    | "STRING"
    | "BOOLEAN"
    | "SINGLE_BUTTON"
    | "DATE"
    | "NUMBER"
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "actions";
  element?: string;
  key?: string;
  header: string;
  visible: boolean;
  sortable?: boolean;
  isDefaultSort?: boolean;
  defaultSortDirection?: "asc" | "desc";
  pipe?: any;
  buttons?: IColumnButton[];
}

export interface ITableConfig {
  columns: string[];
  subTitle?: string | null;
  result?: {
    noData: string;
    defaultMessage: string;
  };
  data: any[];
  columnData: Record<string, IColumnConfig>;
  paginated?: boolean;
}


@Injectable({
  providedIn: "root",
})
export class FilterTableService {
  private filterSubject = new Subject<string>();

  filter$ = this.filterSubject.asObservable();

  updateFilter(filterValue: string) {
    this.filterSubject.next(filterValue);
  }
}


@Injectable({
  providedIn: "root",
})
export class TableService {
  private tableConfigSubject = new BehaviorSubject<ITableConfig | null>(null);
  private dataSubject = new BehaviorSubject<any[]>([]);
  private columnsSubject = new BehaviorSubject<IColumnConfig[]>([]);

  tableConfig$: Observable<ITableConfig | null> = this.tableConfigSubject.asObservable();
  columns$: Observable<IColumnConfig[]> = this.columnsSubject.asObservable();
  data$: Observable<any[]> = this.dataSubject.asObservable();

  visibleColumns$: Observable<string[]> = this.columns$.pipe(
    map((columns) =>
      columns.filter((col) => col.visible).map((col) => col.key || col.element || "")
    )
  );

  createTable(data: any[], columns?: IColumnConfig[], customConfig?: Partial<ITableConfig>): void {
    const tableConfig: ITableConfig = {
      columns: columns ? columns.map((col) => col.key || col.element || "") : [],
      data,
      columnData: {},
      result: {
        noData: "Não há dados para o filtro selecionado.",
        defaultMessage: "Nenhum resultado encontrado.",
      },
      ...customConfig,
    };

    if (data.length > 0 && columns) {
      const columnData: Record<string, IColumnConfig> = {};
      columns.forEach((col) => {
        columnData[col.key || col.element || ""] = {
          ...col,
          type: col.type || this.inferColumnType(data[0][col.key || col.element || ""]),
          visible: col.visible !== undefined ? col.visible : true,
        };
      });
      tableConfig.columnData = columnData;
    } else if (data.length === 0 && columns) {
      const columnData: Record<string, IColumnConfig> = {};
      columns.forEach((col) => {
        columnData[col.key || col.element || ""] = {
          ...col,
          type: col.type || "STRING",
          visible: col.visible !== undefined ? col.visible : true,
        };
      });
      tableConfig.columnData = columnData;
    }

    this.tableConfigSubject.next(tableConfig);
    this.columnsSubject.next(columns || []);
    this.dataSubject.next(data);
  }

  private inferColumnType(value: any): IColumnConfig["type"] {
    if (value === null || value === undefined) {return "STRING";}
    switch (typeof value) {
      case "boolean":
        return "BOOLEAN";
      case "number":
        return "NUMBER";
      case "string":
        return this.isValidDate(value) ? "DATE" : "STRING";
      default:
        return "STRING";
    }
  }

  private isValidDate(value: string): boolean {
    return !isNaN(Date.parse(value));
  }

  toggleColumnVisibility(columnKey: string): void {
    const currentColumns = this.columnsSubject.value;
    const updatedColumns = currentColumns.map((col) =>
      col.key === columnKey || col.element === columnKey ? { ...col, visible: !col.visible } : col
    );

    const currentConfig = this.tableConfigSubject.value;
    if (currentConfig) {
      const updatedColumnData = { ...currentConfig.columnData };
      const columnToUpdate = Object.keys(updatedColumnData).find((key) => key === columnKey);

      if (columnToUpdate) {
        updatedColumnData[columnToUpdate].visible = !updatedColumnData[columnToUpdate].visible;

        this.tableConfigSubject.next({
          ...currentConfig,
          columnData: updatedColumnData,
        });
      }
    }

    this.columnsSubject.next(updatedColumns);
  }

  getVisibleColumns(): IColumnConfig[] {
    return this.columnsSubject.value.filter((col) => col.visible);
  }

  setColumns(columns: IColumnConfig[]): void {
    const currentConfig = this.tableConfigSubject.value;
    if (currentConfig) {
      const columnData: Record<string, IColumnConfig> = {};
      columns.forEach((col) => {
        columnData[col.key || col.element || ""] = col;
      });

      this.tableConfigSubject.next({
        ...currentConfig,
        columns: columns.map((col) => col.key || col.element || ""),
        columnData,
      });
    }
    this.columnsSubject.next(columns);
  }

  setData(data: any[]): void {
    this.dataSubject.next(data);

    const currentConfig = this.tableConfigSubject.value;
    if (currentConfig) {
      this.tableConfigSubject.next({
        ...currentConfig,
        data,
      });
    }
  }

  updateTableData(data: any[]): void {
    this.setData(data);
  }
}

export function getPtBrPaginatorIntl(): MatPaginatorIntl {
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
  selector: "cao-base-table",
  templateUrl: "./base-table.html",
  styleUrls: ["./base-table.css"],
  imports: [CommonModule, MaterialModule, NgOptimizedImage],
  providers: [{ provide: MatPaginatorIntl, useValue: getPtBrPaginatorIntl() }],
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() customClass = "";
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() showFirstLastButtons = true;
  @Input() isPaginatedByServer = false;

  @Output() readonly pageChanged = new EventEmitter<number>();
  @Output() readonly pageSizeChanged = new EventEmitter<number>();
  @Output() readonly firstPageClicked = new EventEmitter<void>();
  @Output() readonly lastPageClicked = new EventEmitter<void>();
  @Output() readonly selectionChanged = new EventEmitter<any[]>();
  @Output() readonly pageEvent = new EventEmitter<PageEvent>();

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  allColumns: string[] = [];
  displayedColumns: string[] = [];
  filterValue = "";
  private configSubscription: Subscription | null = null;
  private visibleColumnsSubscription: Subscription | null = null;
  private dataSubscription: Subscription | null = null;
  private filterSubscription: Subscription | null = null;
  tableConfig: ITableConfig | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  private previousPage = 1;

  getAllColumns(): string[] {
    return ["select", ...this.displayedColumns];
  }

  constructor(
    protected tableService: TableService,
    protected liveAnnouncer: LiveAnnouncer,
    protected filterTableService: FilterTableService
  ) {
    this.initializeSortingAccessor();
    this.initializeFilterPredicate();
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
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    // Connect paginator if available
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.pageIndex = this.currentPage - 1;
        this.paginator.pageSize = this.pageSize;
        this.paginator.showFirstLastButtons = this.showFirstLastButtons;
      }
    });
    this.selection.changed.subscribe(() => {
      this.selectionChanged.emit(this.selection.selected);
    });
  }

  ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
    this.visibleColumnsSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    this.filterSubscription?.unsubscribe();
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

  applyFilter(): void {
    const normalizedFilter = this.filterValue.trim().toLowerCase();
    this.dataSource.filter = normalizedFilter;
  }

  toggleColumnVisibility(columnKey: string): void {
    this.tableService.toggleColumnVisibility(columnKey);
  }

  isColumnVisible(column: string): boolean {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return true;
    }
    return this.tableConfig.columnData[column].visible !== false;
  }

  getColumnHeader(column: string): string {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return column;
    }
    return this.tableConfig.columnData[column].header || column;
  }

  getColumnType(column: string): IColumnConfig["type"] {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return "STRING";
    }
    return this.tableConfig.columnData[column].type || "STRING";
  }

  getColumnElement(column: string): string {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return column;
    }
    return this.tableConfig.columnData[column].element || column;
  }

  getColumnButtons(column: string): any[] {
    if (!this.tableConfig || !this.tableConfig.columnData || !this.tableConfig.columnData[column]) {
      return [];
    }
    return this.tableConfig.columnData[column].buttons || [];
  }

  isAllSelected(): boolean {
    if (
      !this.paginator ||
      !this.dataSource.filteredData ||
      this.dataSource.filteredData.length === 0
    ) {
      return false;
    }

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = Math.min(
      startIndex + this.paginator.pageSize,
      this.dataSource.filteredData.length
    );
    const currentPageData = this.dataSource.filteredData.slice(startIndex, endIndex);

    if (currentPageData.length === 0) {
      return false;
    }

    return currentPageData.every((row) => this.selection.isSelected(row));
  }

  toggleAllRows(): void {
    if (!this.paginator || !this.dataSource.filteredData) {
      return;
    }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = Math.min(
        startIndex + this.paginator.pageSize,
        this.dataSource.filteredData.length
      );
      const currentPageData = this.dataSource.filteredData.slice(startIndex, endIndex);

      currentPageData.forEach((row) => this.selection.select(row));
    }
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

  trackByFn(index: number, item: any): any {
    return item;
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.pageChanged.emit(page);

    if (this.paginator && this.paginator.pageIndex !== page - 1) {
      this.paginator.pageIndex = page - 1;
    }
  }

  onPageSizeChanged(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageSizeChanged.emit(pageSize);

    if (this.paginator && this.paginator.pageSize !== pageSize) {
      this.paginator.pageSize = pageSize;
    }
  }

  /**
   * Handle pagination events from Mat Paginator
   */
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

  /**
   * Navigate to first page programmatically
   */
  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.onPageChanged(1);
      this.firstPageClicked.emit();
      this.liveAnnouncer.announce("Primeira página");
    }
  }

  /**
   * Navigate to last page programmatically
   */
  goToLastPage(): void {
    const lastPage = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    if (this.currentPage !== lastPage) {
      this.onPageChanged(lastPage);
      this.lastPageClicked.emit();
      this.liveAnnouncer.announce("Última página");
    }
  }

  /**
   * Update total items when data changes
   */
  updateTotalItems(): void {
    if (this.isPaginatedByServer) {
      return;
    }

    this.totalItems = this.dataSource.data.length;
  }
}
