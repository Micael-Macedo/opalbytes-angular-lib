import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, map } from "rxjs";

import { ITableConfig, IColumnConfig } from "./base-table.interface";

@Injectable({
  providedIn: "root",
})
export class BaseTableService {
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
    if (value === null || value === undefined) { return "STRING"; }
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